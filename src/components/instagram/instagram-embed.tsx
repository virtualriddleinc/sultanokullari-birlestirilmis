"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { InteractiveSiteVideo } from "@/components/media/interactive-site-video";
import type { InstagramPost } from "@/content/instagram";

declare global {
  interface Window {
    instgrm?: {
      Embeds?: {
        process: () => void;
      };
    };
  }
}

type InstagramEmbedProps = {
  post: InstagramPost;
  shouldPlay?: boolean;
  onEnded?: () => void;
};

export function InstagramEmbed({
  post,
  shouldPlay = false,
  onEnded,
}: InstagramEmbedProps) {
  const isVideoPost = Boolean(post.videoSrc);
  // MP4 yalnızca oynatma istendiğinde mount — Lighthouse payload'unu düşürür
  const [mediaUnlocked, setMediaUnlocked] = useState(shouldPlay);

  useEffect(() => {
    if (shouldPlay) setMediaUnlocked(true);
  }, [shouldPlay]);

  useEffect(() => {
    if (isVideoPost) return;
    window.instgrm?.Embeds?.process();
  }, [isVideoPost, post.url]);

  return (
    <>
      {!isVideoPost ? (
        <Script
          id="instagram-embed-script"
          src="https://www.instagram.com/embed.js"
          strategy="lazyOnload"
          onLoad={() => window.instgrm?.Embeds?.process()}
        />
      ) : null}
      <div
        className={
          isVideoPost
            ? "relative mx-auto aspect-[9/16] w-full overflow-hidden rounded-[1.35rem] shadow-[0_24px_70px_rgba(26,28,24,0.16)]"
            : "relative min-h-[540px] overflow-hidden rounded-[1.75rem] bg-white/80 p-2 shadow-inner"
        }
      >
        {isVideoPost && post.videoSrc ? (
          mediaUnlocked ? (
            <InteractiveSiteVideo
              className="block h-full w-full object-cover"
              src={post.videoSrc}
              title={post.title}
              shouldPlay={shouldPlay}
              onEnded={onEnded}
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center bg-[#0a0d12] text-white/70"
              aria-hidden
            >
              <span className="text-sm font-medium tracking-wide">Reel</span>
            </div>
          )
        ) : (
          <blockquote
            className="instagram-media mx-auto !max-w-full !min-w-0"
            data-instgrm-captioned
            data-instgrm-permalink={post.url}
            data-instgrm-version="14"
          >
            <a href={post.url} rel="noreferrer" target="_blank">
              {post.title}
            </a>
          </blockquote>
        )}
      </div>
    </>
  );
}
