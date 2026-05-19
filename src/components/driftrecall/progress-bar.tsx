export function ProgressBar({ value }: { value: number }) {
  return (
    <div aria-label="Progress" className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full bg-white/60 transition-[width] duration-500"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
