import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { HomeIcon } from "lucide-react";

import { FullscreenContainer } from "#/components/driftrecall/fullscreen-container";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Switch } from "#/components/ui/switch";
import { useStudySettingsStore } from "#/stores/study-settings-store";

export const Route = createFileRoute("/settings")({
  component: SettingsRoute,
});

function SettingsRoute() {
  const navigate = useNavigate();
  const {
    revealDelaySeconds,
    autoNextDelaySeconds,
    autoplay,
    setRevealDelaySeconds,
    setAutoNextDelaySeconds,
    setAutoplay,
  } = useStudySettingsStore();

  return (
    <FullscreenContainer>
      <section className="w-full max-w-2xl rounded-[2rem] border border-white/15 bg-black/35 p-6 backdrop-blur-2xl sm:p-8">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            aria-label="Go to home page"
            onClick={() => navigate({ to: "/" })}
          >
            <HomeIcon />
          </Button>
          <h1 className="text-3xl font-semibold text-white">Study Settings</h1>
        </div>
        <p className="mt-2 text-sm text-white/65">Tune cadence for ambient recall sessions.</p>

        <div className="mt-6 space-y-4">
          <label htmlFor="reveal-delay" className="block space-y-2">
            <span className="text-sm text-white/75">Reveal timer (seconds)</span>
            <Input
              id="reveal-delay"
              type="number"
              min={1}
              value={revealDelaySeconds}
              onChange={(event) => setRevealDelaySeconds(Number(event.currentTarget.value || 10))}
              className="bg-white/10 text-white"
            />
          </label>

          <label htmlFor="auto-next-delay" className="block space-y-2">
            <span className="text-sm text-white/75">Auto-next timer (seconds)</span>
            <Input
              id="auto-next-delay"
              type="number"
              min={1}
              value={autoNextDelaySeconds}
              onChange={(event) => setAutoNextDelaySeconds(Number(event.currentTarget.value || 20))}
              className="bg-white/10 text-white"
            />
          </label>

          <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div>
              <p className="text-sm text-white">Autoplay</p>
              <p className="text-sm text-white/65">
                {autoplay
                  ? "Automatically advance to the next card."
                  : "Stay on the current card until you advance."}
              </p>
            </div>
            <Switch checked={autoplay} onCheckedChange={setAutoplay} aria-label="Toggle autoplay" />
          </div>
        </div>
      </section>
    </FullscreenContainer>
  );
}
