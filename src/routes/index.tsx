import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRightIcon, LibraryIcon, SettingsIcon, SparklesIcon } from "lucide-react";

import { Button } from "#/components/ui/button";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-radial from-indigo-500/15 via-background to-background px-6 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.2)_0,_transparent_42%)]" />
      <section className="relative mx-auto flex w-full max-w-4xl flex-col items-center gap-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs tracking-[0.18em] text-white/70 uppercase backdrop-blur">
          <SparklesIcon className="size-3.5" /> DriftRecall
        </span>
        <h1 className="text-4xl leading-tight font-semibold text-balance text-white sm:text-6xl">
          Calm ambient learning for your second screen.
        </h1>
        <p className="max-w-2xl text-base text-white/70 sm:text-lg">
          DriftRecall reveals knowledge cards with quiet motion and automatic cadence, so you can
          retain more while coding, working, or gaming.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button render={<Link to="/library" />} size="lg" nativeButton={false}>
            Open Library <ArrowRightIcon />
          </Button>
          <Button
            render={<Link to="/study/$setId" params={{ setId: "capitals-of-the-world" }} />}
            variant="outline"
            size="lg"
            nativeButton={false}
          >
            Quick Study <LibraryIcon />
          </Button>
          <Button render={<Link to="/settings" />} variant="outline" size="lg" nativeButton={false}>
            Settings <SettingsIcon />
          </Button>
        </div>
      </section>
    </main>
  );
}
