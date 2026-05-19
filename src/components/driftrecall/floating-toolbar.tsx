import type { PropsWithChildren } from "react";

import { cn } from "#/lib/utils";

export function FloatingToolbar({ show, children }: PropsWithChildren<{ show: boolean }>) {
  return (
    <div
      className={cn(
        "fixed right-4 bottom-4 left-4 z-40 mx-auto w-full max-w-4xl transition-all duration-300",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-8 opacity-0",
      )}
    >
      <div className="rounded-3xl border border-white/10 bg-black/45 p-3 shadow-xl backdrop-blur-xl">
        {children}
      </div>
    </div>
  );
}
