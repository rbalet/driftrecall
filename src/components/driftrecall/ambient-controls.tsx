import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PauseIcon,
  PlayIcon,
  Redo2Icon,
  SparklesIcon,
} from "lucide-react";

import { Button } from "#/components/ui/button";

export function AmbientControls({
  revealed,
  paused,
  onReveal,
  onPrevious,
  onNext,
  onPause,
  onRestart,
  onFullscreen,
}: {
  revealed: boolean;
  paused: boolean;
  onReveal: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onPause: () => void;
  onRestart: () => void;
  onFullscreen: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button variant="outline" size="sm" onClick={onPrevious}>
        <ArrowLeftIcon /> Prev
      </Button>
      <Button variant="outline" size="sm" onClick={onNext}>
        Next <ArrowRightIcon />
      </Button>
      <Button variant="outline" size="sm" onClick={onReveal} disabled={revealed}>
        <SparklesIcon /> Reveal
      </Button>
      <Button variant="outline" size="sm" onClick={onPause}>
        {paused ? <PlayIcon /> : <PauseIcon />} {paused ? "Resume" : "Pause"}
      </Button>
      <Button variant="outline" size="sm" onClick={onRestart}>
        <Redo2Icon /> Restart
      </Button>
      <Button variant="outline" size="sm" onClick={onFullscreen}>
        Fullscreen
      </Button>
    </div>
  );
}
