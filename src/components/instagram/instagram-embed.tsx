"use client";

import { useEffect } from "react";
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
          strategy="afterInteractive"
          onLoad={() => window.instgrm?.Embeds?.process()}
        />
      ) : null}
      <div
        className={
          isVideoPost
            ? "relative mx-auto aspect-[9/16] w-[min(100%,36vh,18rem)] overflow-hidden rounded-[1.35rem] bg-white/80 p-1.5 shadow-inner ring-1 ring-emerald-900/10"
            : "relative min-h-[540px] overflow-hidden rounded-[1.75rem] bg-white/80 p-2 shadow-inner"
        }
      >
        {isVideoPost && post.videoSrc ? (
          <InteractiveSiteVideo
            className="block h-full w-full rounded-[1.05rem] object-cover"
            src={post.videoSrc}
            title={post.title}
            shouldPlay={shouldPlay}
            onEnded={onEnded}
          />
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
