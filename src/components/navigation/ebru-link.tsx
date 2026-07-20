'use client';

import NextLink from 'next/link';
import React, { useRef } from 'react';
import { waitForRoute } from '@/lib/route-ready';

interface EbruLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  replace?: boolean;
  scroll?: boolean;
}

type Action = { type: number; geom: number[]; color: number[]; timing: number[] };

/** Upper bound while holding the filled ebru frame until the new route commits. */
const MAX_ROUTE_WAIT_MS = 2500;

function isSameRoute(href: string): boolean {
  try {
    const target = new URL(href, window.location.origin);
    return (
      window.location.pathname === target.pathname &&
      window.location.search === target.search &&
      window.location.hash === target.hash
    );
  } catch {
    return false;
  }
}

function resolvePathname(href: string): string {
  try {
    return new URL(href, window.location.origin).pathname;
  } catch {
    return href;
  }
}

function waitTwoFrames(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

function uploadActions(
  gl: WebGLRenderingContext,
  actions: Action[],
  locActionCount: WebGLUniformLocation | null,
  locActionGeom: WebGLUniformLocation | null,
  locActionColor: WebGLUniformLocation | null,
  locActionTiming: WebGLUniformLocation | null,
) {
  const totalActions = Math.min(actions.length, 250);
  const geomArray = new Float32Array(250 * 4);
  const colorArray = new Float32Array(250 * 4);
  const timingArray = new Float32Array(250 * 4);

  for (let i = 0; i < totalActions; i++) {
    geomArray.set(actions[i].geom, i * 4);
    colorArray.set(actions[i].color, i * 4);
    timingArray.set(actions[i].timing, i * 4);
  }

  gl.uniform1i(locActionCount, totalActions);
  gl.uniform4fv(locActionGeom, geomArray);
  gl.uniform4fv(locActionColor, colorArray);
  gl.uniform4fv(locActionTiming, timingArray);

  return totalActions;
}

export function EbruLink({
  href,
  children,
  className,
  onClick,
  replace,
  scroll,
  ...props
}: EbruLinkProps) {
  const isTransitioning = useRef(false);
  const navLinkRef = useRef<HTMLAnchorElement>(null);

  const navigate = () => {
    const navEl = navLinkRef.current;
    if (navEl) {
      navEl.click();
      return;
    }
    window.location.assign(href);
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;

    e.preventDefault();

    if (isTransitioning.current) return;
    if (isSameRoute(href)) return;

    isTransitioning.current = true;

    // Kick off navigation as early as possible so the RSC payload can load
    // while the ebru fill phase plays (and while WebGL is being set up).
    const targetPathname = resolvePathname(href);
    navigate();
    const routeReadyPromise = waitForRoute(targetPathname, MAX_ROUTE_WAIT_MS);

    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '99999';
    canvas.style.opacity = '0';
    canvas.style.transition = 'opacity 0.8s ease-in-out';
    document.body.appendChild(canvas);

    void canvas.offsetWidth;
    canvas.style.opacity = '1';

    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const finishTransition = () => {
      canvas.remove();
      isTransitioning.current = false;
    };

    const gl = canvas.getContext('webgl', { premultipliedAlpha: false, alpha: true });
    if (!gl) {
      finishTransition();
      return;
    }

    const vsSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      #define MAX_ACTIONS 250

      uniform float u_time;
      uniform float u_dpr;
      uniform vec2 u_resolution;
      uniform int u_actionCount;

      uniform vec4 u_actionGeom[MAX_ACTIONS];
      uniform vec4 u_actionColor[MAX_ACTIONS];
      uniform vec4 u_actionTiming[MAX_ACTIONS];

      uniform vec4 u_bgColor;

      float distToSegment(vec2 p, vec2 a, vec2 b) {
          vec2 pa = p - a, ba = b - a;
          float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
          return length( pa - ba*h );
      }

      void main() {
          vec2 p = gl_FragCoord.xy / u_dpr;
          p.y = u_resolution.y - p.y;
          
          vec4 finalColor = u_bgColor;
          bool colorSet = false;

          for (int i = MAX_ACTIONS - 1; i >= 0; i--) {
              if (i >= u_actionCount) continue;
              if (colorSet) break;
              
              float startTime = u_actionTiming[i].x;
              float duration = u_actionTiming[i].y;
              
              if (u_time < startTime) continue;
              
              float progress = clamp((u_time - startTime) / duration, 0.0, 1.0);
              float type = u_actionColor[i].w;
              
              if (type < 0.5 || type > 1.5) {
                  vec2 center = u_actionGeom[i].xy;
                  float targetRadius = u_actionGeom[i].z;
                  float r = targetRadius * sqrt(progress);
                  
                  if (r <= 0.01) continue;
                  
                  vec2 v = p - center;
                  float dist2 = dot(v, v);
                  float r2 = r * r;
                  
                  if (dist2 <= r2) {
                      if (type > 1.5) {
                          finalColor = vec4(0.0);
                      } else {
                          finalColor = vec4(u_actionColor[i].rgb, 1.0);
                      }
                      colorSet = true;
                  } else {
                      p = center + v * sqrt(1.0 - r2 / dist2);
                  }
              } else {
                  vec2 start = u_actionGeom[i].xy;
                  vec2 targetEnd = u_actionGeom[i].zw;
                  vec2 end = mix(start, targetEnd, progress);
                  
                  if (length(end - start) < 0.01) continue;
                  
                  float thickness = u_actionColor[i].x;
                  vec2 dir = end - start;
                  float d = distToSegment(p, start, end);
                  p = p - dir * exp(-(d * d) / (thickness * thickness));
              }
          }
          
          gl_FragColor = finalColor;
      }
    `;

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const vertShader = compileShader(gl.VERTEX_SHADER, vsSource);
    const fragShader = compileShader(gl.FRAGMENT_SHADER, fsSource);
    const program = gl.createProgram();
    if (!program || !vertShader || !fragShader) {
      finishTransition();
      return;
    }

    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const posAttr = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    const locTime = gl.getUniformLocation(program, 'u_time');
    const locDpr = gl.getUniformLocation(program, 'u_dpr');
    const locRes = gl.getUniformLocation(program, 'u_resolution');
    const locActionCount = gl.getUniformLocation(program, 'u_actionCount');
    const locBgColor = gl.getUniformLocation(program, 'u_bgColor');
    const locActionGeom = gl.getUniformLocation(program, 'u_actionGeom');
    const locActionColor = gl.getUniformLocation(program, 'u_actionColor');
    const locActionTiming = gl.getUniformLocation(program, 'u_actionTiming');

    gl.uniform1f(locDpr, dpr);
    gl.uniform2f(locRes, width, height);
    // Soft honey-tint background (brand #fff085 eased toward white)
    gl.uniform4f(locBgColor, 1.0, 0.98, 0.92, 1.0);

    const actions: Action[] = [];

    const addDrop = (
      x: number,
      y: number,
      radius: number,
      hex: string,
      delayMs: number,
      durationMs: number,
    ) => {
      hex = hex.replace('#', '');
      if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      const r = parseInt(hex.slice(0, 2), 16) / 255;
      const g = parseInt(hex.slice(2, 4), 16) / 255;
      const b = parseInt(hex.slice(4, 6), 16) / 255;
      actions.push({
        type: 0,
        geom: [x, y, radius, 0],
        color: [r, g, b, 0],
        timing: [delayMs / 1000, durationMs / 1000],
      });
    };

    const addEraser = (
      x: number,
      y: number,
      radius: number,
      delayMs: number,
      durationMs: number,
    ) => {
      actions.push({
        type: 2,
        geom: [x, y, radius, 0],
        color: [0, 0, 0, 2],
        timing: [delayMs / 1000, durationMs / 1000],
      });
    };

    let t = 0;
    // Brand palette ink drops: green #4cff00, honey #fff085, soft blue #A4D7E4, white
    const baseColors = ['#4cff00', '#A4D7E4', '#4cff00'];
    const accentColors = ['#fff085', '#A4D7E4', '#4cff00'];
    const whiteColors = ['#FFFFFF', '#fff085'];
    const maxDrop = Math.max(width, height) / 4;

    for (let i = 0; i < 30; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const c = baseColors[Math.floor(Math.random() * baseColors.length)];
      addDrop(x, y, maxDrop * 0.7 + Math.random() * (maxDrop * 0.5), c, t, 800);
      t += 15 + Math.random() * 10;
    }

    t += 100;

    for (let i = 0; i < 25; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const c = accentColors[Math.floor(Math.random() * accentColors.length)];
      addDrop(x, y, 60 + Math.random() * 80, c, t, 600);
      t += 10 + Math.random() * 10;
    }

    t += 50;

    for (let i = 0; i < 20; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const c = whiteColors[Math.floor(Math.random() * whiteColors.length)];
      addDrop(x, y, 20 + Math.random() * 40, c, t, 400);
      t += 10 + Math.random() * 10;
    }

    t += 100;

    t += 200;

    // End of ink-fill phase — hold here until the new route has committed so
    // the eraser phase never reveals the previous page.
    const fillEndMs = t;

    for (let i = 0; i < 60; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      addEraser(x, y, maxDrop * 1.5 + Math.random() * maxDrop * 1.0, t, 700 + Math.random() * 300);
      t += 10 + Math.random() * 15;
    }

    t += 500;
    const totalMs = t;

    uploadActions(gl, actions, locActionCount, locActionGeom, locActionColor, locActionTiming);

    let routeReady = false;
    void routeReadyPromise.then(async () => {
      await waitTwoFrames();
      routeReady = true;
    });

    const startTime = performance.now();
    let canvasFadeOutStarted = false;
    let holdStart: number | null = null;
    let holdDurationMs = 0;
    let wasHolding = false;

    const render = (now: number) => {
      const realElapsedMs = now - startTime;

      if (realElapsedMs >= fillEndMs && !routeReady) {
        if (holdStart === null) holdStart = now;
        wasHolding = true;
      } else if (wasHolding && holdStart !== null) {
        holdDurationMs += now - holdStart;
        holdStart = null;
        wasHolding = false;
      }

      const effectMs =
        realElapsedMs >= fillEndMs && !routeReady
          ? fillEndMs
          : realElapsedMs - holdDurationMs;

      gl.uniform1f(locTime, effectMs / 1000);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (effectMs > totalMs + 200 && !canvasFadeOutStarted) {
        canvasFadeOutStarted = true;
        canvas.style.transition = 'opacity 0.6s ease-out';
        canvas.style.opacity = '0';
        setTimeout(finishTransition, 600);
      }

      if (effectMs < totalMs + 1000 || !routeReady) {
        requestAnimationFrame(render);
      }
    };

    requestAnimationFrame(render);
  };

  return (
    <>
      <a href={href} className={className} onClick={handleClick} {...props}>
        {children}
      </a>
      <NextLink
        href={href}
        ref={navLinkRef}
        replace={replace}
        scroll={scroll}
        prefetch
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
      />
    </>
  );
}
