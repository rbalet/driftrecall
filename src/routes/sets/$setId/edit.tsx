import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeftIcon, SaveIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { CardEditor } from "#/components/driftrecall/card-editor";
import { FullscreenContainer } from "#/components/driftrecall/fullscreen-container";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { createEmptyStudySet, getStudySet, saveStudySet } from "#/features/study/study-repository";
import { cn } from "#/lib/utils";
import type { StudySet } from "#/types/study";

export const Route = createFileRoute("/sets/$setId/edit")({
  component: EditStudySetRoute,
});

function EditStudySetRoute() {
  const { setId } = Route.useParams();
  const [draft, setDraft] = useState<StudySet | null>(null);
  const [showStickyBackground, setShowStickyBackground] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const studySet = await getStudySet(setId);

      if (studySet) {
        setDraft(studySet);
        return;
      }

      const emptySet = createEmptyStudySet();
      await saveStudySet(emptySet);
      setDraft(emptySet);
      await navigate({ to: "/sets/$setId/edit", params: { setId: emptySet.id } });
    };

    load();
  }, [navigate, setId]);

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

  const validCards = useMemo(
    () =>
      (draft?.cards ?? []).filter(
        (card) => card.front.trim().length > 0 && card.back.trim().length > 0,
      ),
    [draft?.cards],
  );

  if (!draft) {
    return (
      <FullscreenContainer>
        <p className="text-sm text-white/70">Loading editor…</p>
      </FullscreenContainer>
    );
  }

  const onSave = async () => {
    const payload: StudySet = {
      ...draft,
      title: draft.title.trim() || "Untitled Study Set",
      description: draft.description.trim(),
      cards: validCards,
    };

    if (!payload.cards.length) {
      alert("Please add at least one complete card.");
      return;
    }

    await saveStudySet(payload);
    await navigate({ to: "/library" });
  };

  return (
    <FullscreenContainer className="items-start justify-start overflow-x-hidden overflow-y-auto">
      <header className="fixed inset-x-0 top-0 z-30 px-4 py-3">
        <div
          className={cn(
            "mx-auto flex w-full max-w-3xl items-center justify-between rounded-3xl px-4 py-3 transition-all",
            showStickyBackground
              ? "bg-black/55 shadow-lg shadow-black/20 backdrop-blur-xl"
              : "bg-transparent shadow-none backdrop-blur-none",
          )}
        >
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              render={<Link to="/library" />}
              nativeButton={false}
              aria-label="Back to study sets"
            >
              <ArrowLeftIcon />
            </Button>
            <div>
              <p className="text-xs tracking-[0.2em] text-white/45 uppercase">Editor</p>
              <h1 className="text-lg font-semibold text-white sm:text-xl">Edit Study Set</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 pt-20">
        <div className="space-y-4 rounded-3xl border border-white/10 bg-black/30 p-5">
          <Input
            aria-label="Study set title"
            value={draft.title}
            onChange={(event) => setDraft({ ...draft, title: event.currentTarget.value })}
            placeholder="Set title"
            className="bg-white/10 text-white placeholder:text-white/40"
          />
          <textarea
            aria-label="Study set description"
            value={draft.description}
            onChange={(event) => setDraft({ ...draft, description: event.currentTarget.value })}
            placeholder="Description"
            className="min-h-28 w-full rounded-3xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-ring/40"
          />
          <CardEditor
            cards={draft.cards}
            onChange={(cards) => setDraft({ ...draft, cards })}
            footerAction={
              <Button onClick={onSave}>
                <SaveIcon /> Save study set
              </Button>
            }
          />
        </div>
      </div>
    </FullscreenContainer>
  );
}
