import { ProgressBar } from "./progress-bar";

export function RevealTimer({
  label,
  remainingMs,
  totalMs,
}: {
  label: string;
  remainingMs: number;
  totalMs: number;
}) {
  const progress = totalMs > 0 ? ((totalMs - remainingMs) / totalMs) * 100 : 0;

  return (
    <div className="space-y-2 rounded-3xl border border-white/10 bg-black/30 px-4 py-3 backdrop-blur">
      <div className="flex items-center justify-between gap-3 text-xs text-white/70">
        <span>{label}</span>
        <span>{Math.ceil(remainingMs / 1000)}s</span>
      </div>
      <ProgressBar value={progress} />
    </div>
  );
}
