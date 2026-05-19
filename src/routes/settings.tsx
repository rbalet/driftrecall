import { createFileRoute } from "@tanstack/react-router";

import { FullscreenContainer } from "#/components/driftrecall/fullscreen-container";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { useStudySettingsStore } from "#/stores/study-settings-store";

export const Route = createFileRoute("/settings")({
  component: SettingsRoute,
});

function SettingsRoute() {
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
        <h1 className="text-3xl font-semibold text-white">Study Settings</h1>
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

          <Button variant={autoplay ? "default" : "outline"} onClick={() => setAutoplay(!autoplay)}>
            {autoplay ? "Autoplay enabled" : "Autoplay disabled"}
          </Button>
        </div>
      </section>
    </FullscreenContainer>
  );
}
