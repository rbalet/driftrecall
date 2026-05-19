import type { ComponentPropsWithoutRef, PropsWithChildren } from "react";

import { cn } from "#/lib/utils";

export function FullscreenContainer({
  children,
  className,
  ...props
}: PropsWithChildren<ComponentPropsWithoutRef<"main">>) {
  return (
    <main
      {...props}
      className={cn(
        "relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-radial from-indigo-500/15 via-background to-background px-4 py-6",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.14)_0,_transparent_42%)]" />
      {children}
    </main>
  );
}
