import { CopyPlusIcon, DownloadIcon, PencilIcon, PlayIcon, Trash2Icon } from "lucide-react";

import { Button } from "#/components/ui/button";
import type { StudySet } from "#/types/study";

export function SetCard({
  set,
  onStudy,
  onEdit,
  onDuplicate,
  onDelete,
  onExport,
}: {
  set: StudySet;
  onStudy: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onExport: () => void;
}) {
  return (
    <article className="rounded-3xl border border-white/10 bg-black/30 p-5 shadow-lg backdrop-blur-lg">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-white">{set.title}</h2>
        <p className="text-sm text-white/70">{set.description || "No description yet."}</p>
        {set.labels.length ? (
          <div className="flex flex-wrap gap-2">
            {set.labels.map((label) => (
              <span
                key={label}
                className="rounded-full border border-white/10 bg-white/8 px-2 py-1 text-xs text-white/75"
              >
                {label}
              </span>
            ))}
          </div>
        ) : null}
        <p className="text-xs text-white/50">{set.cards.length} cards</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" onClick={onStudy}>
          <PlayIcon /> Study
        </Button>
        <Button variant="outline" size="sm" onClick={onEdit}>
          <PencilIcon /> Edit
        </Button>
        <Button variant="outline" size="sm" onClick={onDuplicate}>
          <CopyPlusIcon /> Duplicate
        </Button>
        <Button variant="outline" size="sm" onClick={onExport}>
          <DownloadIcon /> Export
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2Icon /> Delete
        </Button>
      </div>
    </article>
  );
}
