import Dexie, { type EntityTable } from "dexie";

import type { StudySet } from "#/types/study";

class DriftRecallDB extends Dexie {
  studySets!: EntityTable<StudySet, "id">;

  constructor() {
    super("driftrecall");
    this.version(1).stores({
      studySets: "id, title, updatedAt",
    });
  }
}

export const driftRecallDb = new DriftRecallDB();
