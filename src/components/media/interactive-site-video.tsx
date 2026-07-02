"use client";

import { useEffect, useRef, type RefObject } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import {
  Controls,
  MediaPlayer,
  MediaProvider,
  MuteButton,
  PlayButton,
  TimeSlider,
  useMediaRemote,
  type MediaPlayerInstance,
} from "@vidstack/react";
import { cn } from "@/lib/cn";

export type InteractiveSiteVideoProps = {
  src: string;
  title: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  shouldPlay?: boolean;
  onEnded?: () => void;
};

function InteractiveVideoControls() {
  return (
    <Controls.Root className="site-vidstack-controls" hideDelay={2000}>
      <Controls.Group className="site-vidstack-controls__group">
        <PlayButton className="site-vidstack-controls__button" aria-label="Oynat veya duraklat">
          <Play className="site-vidstack-controls__icon-play size-4" aria-hidden />
          <Pause className="site-vidstack-controls__icon-pause size-4" aria-hidden />
        </PlayButton>

        <TimeSlider.Root className="site-vidstack-controls__slider">
          <TimeSlider.Track>
            <TimeSlider.TrackFill />
            <TimeSlider.Progress />
          </TimeSlider.Track>
          <TimeSlider.Thumb />
        </TimeSlider.Root>

        <MuteButton className="site-vidstack-controls__button" aria-label="Sesi aç veya kapat">
          <Volume2 className="site-vidstack-controls__icon-unmuted size-4" aria-hidden />
          <VolumeX className="site-vidstack-controls__icon-muted size-4" aria-hidden />
        </MuteButton>
      </Controls.Group>
    </Controls.Root>
  );
}

function InteractiveVideoEffects({
  playerRef,
  shouldPlay,
  muted = true,
  onEnded,
}: {
  playerRef: RefObject<MediaPlayerInstance | null>;
  shouldPlay?: boolean;
  muted?: boolean;
  onEnded?: () => void;
}) {
  const remote = useMediaRemote();

  useEffect(() => {
    if (shouldPlay === undefined) return;

    if (!shouldPlay) {
      remote.pause();
      return;
    }

    const player = playerRef.current;
    if (!player) return;

    const startPlayback = () => {
      remote.seek(0);
      if (muted) {
        remote.mute();
      } else {
        remote.unmute();
      }
      remote.play();
    };

    if (player.state.canPlay) {
      startPlayback();
      return;
    }

    player.addEventListener("can-play", startPlayback, { once: true });
    return () => player.removeEventListener("can-play", startPlayback);
  }, [muted, playerRef, remote, shouldPlay]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player || !onEnded) return;

    const handleEnded = () => onEnded();
    player.addEventListener("ended", handleEnded);
    return () => player.removeEventListener("ended", handleEnded);
  }, [playerRef, onEnded]);

  return null;
}

export function InteractiveSiteVideo({
  src,
  title,
  poster,
  className,
  autoPlay = false,
  loop = false,
  muted = true,
  shouldPlay,
  onEnded,
}: InteractiveSiteVideoProps) {
  const playerRef = useRef<MediaPlayerInstance>(null);

  return (
    <MediaPlayer
      ref={playerRef}
      className={cn("site-vidstack-interactive", className)}
      src={src}
      title={title}
      poster={poster}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline
      load="visible"
    >
      <MediaProvider mediaProps={{ "aria-label": title }} />
      <InteractiveVideoControls />
      <InteractiveVideoEffects
        playerRef={playerRef}
        shouldPlay={shouldPlay}
        muted={muted}
        onEnded={onEnded}
      />
    </MediaPlayer>
  );
}
