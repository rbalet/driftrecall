import { createFileRoute, redirect } from "@tanstack/react-router";

import { createEmptyStudySet, saveStudySet } from "#/features/study/study-repository";

export const Route = createFileRoute("/sets/new")({
  beforeLoad: async () => {
    const draft = createEmptyStudySet();
    await saveStudySet(draft);

    throw redirect({ to: "/sets/$setId/edit", params: { setId: draft.id } });
  },
});
