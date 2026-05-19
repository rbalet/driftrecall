import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { AmbientControls } from "#/components/driftrecall/ambient-controls";
import { FloatingToolbar } from "#/components/driftrecall/floating-toolbar";
import { FullscreenContainer } from "#/components/driftrecall/fullscreen-container";
import { ProgressBar } from "#/components/driftrecall/progress-bar";
import { RevealTimer } from "#/components/driftrecall/reveal-timer";
import { StudyCard } from "#/components/driftrecall/study-card";
import { Button } from "#/components/ui/button";
import { useStudySession } from "#/features/study/hooks/use-study-session";
import { getStudySet } from "#/features/study/study-repository";
import { useStudySettingsStore } from "#/stores/study-settings-store";
import type { StudySet } from "#/types/study";

export const Route = createFileRoute("/study/$setId")({
  component: StudyModeRoute,
});

function StudyModeRoute() {
  const { setId } = Route.useParams();
  const [studySet, setStudySet] = useState<StudySet | null>(null);
  const [controlsVisible, setControlsVisible] = useState(true);
  const gestureStartRef = useRef<{ x: number; y: number } | null>(null);
  const hideToolbarTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { revealDelaySeconds, autoNextDelaySeconds, autoplay } = useStudySettingsStore();

  useEffect(() => {
    const load = async () => {
      setStudySet(await getStudySet(setId));
    };

    load();
  }, [setId]);

  const session = useStudySession({
    cards: studySet?.cards ?? [],
    revealDelaySeconds,
    autoNextDelaySeconds,
    autoplay,
  });

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    await document.documentElement.requestFullscreen();
  };

  const showControls = () => {
    setControlsVisible(true);

    if (hideToolbarTimerRef.current) {
      clearTimeout(hideToolbarTimerRef.current);
    }

    hideToolbarTimerRef.current = setTimeout(() => setControlsVisible(false), 2500);
  };

  useEffect(() => {
    showControls();

    const onActivity = () => showControls();
    window.addEventListener("mousemove", onActivity);
    window.addEventListener("touchstart", onActivity);
    window.addEventListener("keydown", onActivity);

    return () => {
      window.removeEventListener("mousemove", onActivity);
      window.removeEventListener("touchstart", onActivity);
      window.removeEventListener("keydown", onActivity);

      if (hideToolbarTimerRef.current) {
        clearTimeout(hideToolbarTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === " ") {
        event.preventDefault();
        session.revealNow();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        session.previous();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        session.next();
      }

      if (event.key.toLowerCase() === "p") {
        event.preventDefault();
        session.setPaused(!session.paused);
      }

      if (event.key.toLowerCase() === "r") {
        event.preventDefault();
        session.restart();
      }

      if (event.key.toLowerCase() === "f") {
        event.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [session]);

  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    gestureStartRef.current = { x: event.clientX, y: event.clientY };
  };

  const onPointerUp = (event: React.PointerEvent<HTMLElement>) => {
    const start = gestureStartRef.current;

    if (!start) return;

    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;

    if (Math.abs(dy) > Math.abs(dx) && dy < -60) {
      session.revealNow();
    } else if (dx < -60) {
      session.next();
    } else if (dx > 60) {
      session.previous();
    }

    gestureStartRef.current = null;
  };

  if (!studySet || !session.currentCard) {
    return (
      <FullscreenContainer>
        <div className="space-y-4 text-center">
          <p className="text-sm text-white/70">Study set unavailable.</p>
          <Button render={<Link to="/library" />} nativeButton={false}>
            Back to library
          </Button>
        </div>
      </FullscreenContainer>
    );
  }

  return (
    <FullscreenContainer className="select-none" onPointerMove={showControls}>
      <div className="relative z-10 flex w-full max-w-4xl flex-col gap-4">
        <div className="flex items-center justify-between gap-3 text-xs text-white/65">
          <span>{studySet.title}</span>
          <span>
            {session.index + 1}/{session.total}
          </span>
        </div>
        <ProgressBar value={session.progress} />
      </div>

      <section
        className="relative z-10 mt-6 flex w-full max-w-4xl flex-col gap-4"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <StudyCard
          card={session.currentCard}
          revealed={session.revealed}
          onReveal={session.revealNow}
        />
        {!session.revealed ? (
          <RevealTimer
            label="Auto reveal"
            remainingMs={session.revealRemainingMs}
            totalMs={revealDelaySeconds * 1000}
          />
        ) : (
          <RevealTimer
            label="Next card"
            remainingMs={session.nextRemainingMs}
            totalMs={autoNextDelaySeconds * 1000}
          />
        )}
      </section>

      <FloatingToolbar show={controlsVisible}>
        <AmbientControls
          revealed={session.revealed}
          paused={session.paused}
          onReveal={session.revealNow}
          onPrevious={session.previous}
          onNext={session.next}
          onPause={() => session.setPaused(!session.paused)}
          onRestart={session.restart}
          onFullscreen={toggleFullscreen}
        />
      </FloatingToolbar>
    </FullscreenContainer>
  );
}
