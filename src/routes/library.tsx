import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { HomeIcon, UploadIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { FullscreenContainer } from "#/components/driftrecall/fullscreen-container";
import { SetCard } from "#/components/driftrecall/set-card";
import { Button } from "#/components/ui/button";
import {
  createEmptyStudySet,
  deleteStudySet,
  duplicateStudySet,
  exportStudySetAsJson,
  listStudySets,
  parseImportedStudySet,
  saveStudySet,
} from "#/features/study/study-repository";
import { cn } from "#/lib/utils";
import type { StudySet } from "#/types/study";

export const Route = createFileRoute("/library")({
  component: LibraryRoute,
});

function LibraryRoute() {
  const [studySets, setStudySets] = useState<StudySet[]>([]);
  const [busySetId, setBusySetId] = useState<string | null>(null);
  const [showStickyBackground, setShowStickyBackground] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const refresh = async () => setStudySets(await listStudySets());

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    const syncStickyBackground = () => {
      setShowStickyBackground(window.scrollY > 0);
    };

    syncStickyBackground();
    window.addEventListener("scroll", syncStickyBackground, { passive: true });

    return () => {
      window.removeEventListener("scroll", syncStickyBackground);
    };
  }, []);

  const handleNewSet = async () => {
    const draft = createEmptyStudySet();
    await saveStudySet(draft);
    await navigate({ to: "/sets/$setId/edit", params: { setId: draft.id } });
  };

  const handleExport = (studySet: StudySet) => {
    const blob = new Blob([exportStudySetAsJson(studySet)], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = `${studySet.title.replace(/\s+/g, "-").toLowerCase()}.json`;
    anchor.click();
    URL.revokeObjectURL(href);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];

    if (!file) return;

    const parsed = parseImportedStudySet(await file.text());

    if (!parsed) {
      alert("Invalid study set JSON format.");
      event.currentTarget.value = "";
      return;
    }

    await saveStudySet(parsed);
    await refresh();
    event.currentTarget.value = "";
  };

  return (
    <FullscreenContainer className="items-start justify-start overflow-x-hidden overflow-y-auto">
      <div className="fixed inset-x-0 top-0 z-30 px-3 py-3 sm:px-4">
        <header
          className={cn(
            "mx-auto flex w-full max-w-6xl flex-col gap-3 rounded-3xl px-4 py-3 transition-all sm:flex-row sm:items-center sm:justify-between",
            showStickyBackground
              ? "bg-black/55 shadow-lg shadow-black/20 backdrop-blur-xl"
              : "bg-transparent shadow-none backdrop-blur-none",
          )}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Go to home page"
                onClick={() => navigate({ to: "/" })}
              >
                <HomeIcon />
              </Button>
              <h1 className="text-2xl font-semibold text-white sm:text-3xl">Study Set Library</h1>
            </div>
            <p className="mt-1 max-w-2xl text-sm text-white/65">
              Locally stored with IndexedDB. Offline-ready by design.
            </p>
          </div>

          <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:justify-end">
            <Button className="flex-1 sm:flex-none" onClick={handleNewSet}>
              Create study set
            </Button>
            <Button
              variant="outline"
              className="flex-1 sm:flex-none"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadIcon /> Import JSON
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              aria-label="Import study set JSON"
              className="hidden"
              onChange={handleImport}
            />
          </div>
        </header>
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 pt-40 sm:pt-32">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {studySets.map((studySet) => (
            <SetCard
              key={studySet.id}
              set={studySet}
              onStudy={() => navigate({ to: "/study/$setId", params: { setId: studySet.id } })}
              onEdit={() => navigate({ to: "/sets/$setId/edit", params: { setId: studySet.id } })}
              onDuplicate={async () => {
                setBusySetId(studySet.id);
                await duplicateStudySet(studySet.id);
                await refresh();
                setBusySetId(null);
              }}
              onDelete={async () => {
                const confirmed = window.confirm(`Delete "${studySet.title}"?`);
                if (!confirmed) return;

                setBusySetId(studySet.id);
                await deleteStudySet(studySet.id);
                await refresh();
                setBusySetId(null);
              }}
              onExport={() => handleExport(studySet)}
            />
          ))}
        </section>

        {!studySets.length ? <p className="text-sm text-white/60">No study sets found.</p> : null}

        {busySetId ? <p className="text-xs text-white/50">Updating {busySetId}…</p> : null}
      </div>
    </FullscreenContainer>
  );
}
