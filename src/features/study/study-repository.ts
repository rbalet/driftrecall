import { driftRecallDb } from "#/db/study-db";
import type { StudyCardModel, StudySet } from "#/types/study";

import { defaultStudySets } from "./default-study-sets";

function isBrowser() {
  return typeof window !== "undefined";
}

function newId(prefix = "set") {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function createEmptyStudySet(): StudySet {
  const now = new Date().toISOString();

  return {
    id: newId(),
    title: "Untitled Study Set",
    description: "",
    labels: [],
    createdAt: now,
    updatedAt: now,
    cards: [
      {
        id: newId("card"),
        front: "",
        back: "",
      },
    ],
  };
}

export async function ensureSeedStudySets() {
  if (!isBrowser()) return;

  const hasRows = (await driftRecallDb.studySets.count()) > 0;

  if (!hasRows) {
    await driftRecallDb.studySets.bulkAdd(defaultStudySets);
    return;
  }

  const studySets = await driftRecallDb.studySets.toArray();
  const updates = studySets
    .filter((studySet) => !Array.isArray((studySet as Partial<StudySet>).labels))
    .map((studySet) => {
      const defaults = defaultStudySets.find(
        (defaultStudySet) => defaultStudySet.id === studySet.id,
      );

      return normalizeStudySet(studySet, defaults?.labels ?? []);
    });

  if (updates.length) {
    await driftRecallDb.studySets.bulkPut(updates);
  }
}

export async function listStudySets() {
  if (!isBrowser()) return [];

  await ensureSeedStudySets();

  const studySets = await driftRecallDb.studySets.toArray();

  return studySets
    .map((studySet) => normalizeStudySet(studySet))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getStudySet(setId: string) {
  if (!isBrowser()) return null;

  await ensureSeedStudySets();

  const studySet = await driftRecallDb.studySets.get(setId);

  return studySet ? normalizeStudySet(studySet) : null;
}

export async function saveStudySet(studySet: StudySet) {
  if (!isBrowser()) return;

  const next: StudySet = {
    ...normalizeStudySet(studySet),
    updatedAt: new Date().toISOString(),
  };

  await driftRecallDb.studySets.put(next);

  return next;
}

export async function deleteStudySet(setId: string) {
  if (!isBrowser()) return;

  await driftRecallDb.studySets.delete(setId);
}

export async function duplicateStudySet(setId: string) {
  const studySet = await getStudySet(setId);

  if (!studySet) return null;

  const now = new Date().toISOString();
  const duplicate: StudySet = {
    ...studySet,
    id: newId(),
    title: `${studySet.title} (Copy)`,
    labels: [...studySet.labels],
    createdAt: now,
    updatedAt: now,
    cards: studySet.cards.map((card) => ({
      ...card,
      id: newId("card"),
    })),
  };

  await saveStudySet(duplicate);

  return duplicate;
}

export function exportStudySetAsJson(studySet: StudySet) {
  return JSON.stringify(studySet, null, 2);
}

function normalizeCards(cards: unknown): StudyCardModel[] {
  if (!Array.isArray(cards)) return [];

  return cards
    .map((card) => {
      if (typeof card !== "object" || card === null) return null;

      const typed = card as Record<string, unknown>;
      const front = typeof typed.front === "string" ? typed.front : "";
      const back = typeof typed.back === "string" ? typed.back : "";

      if (!front.trim() || !back.trim()) return null;

      return {
        id: typeof typed.id === "string" ? typed.id : newId("card"),
        front,
        back,
      };
    })
    .filter((card): card is StudyCardModel => Boolean(card));
}

function normalizeLabels(labels: unknown, fallback: string[] = []) {
  const source = Array.isArray(labels) ? labels : fallback;
  const seen = new Set<string>();

  return source.flatMap((label) => {
    if (typeof label !== "string") return [];

    const normalized = label.trim();

    if (!normalized) return [];

    const key = normalized.toLocaleLowerCase();

    if (seen.has(key)) return [];

    seen.add(key);

    return [normalized];
  });
}

function normalizeStudySet(studySet: StudySet, fallbackLabels: string[] = []): StudySet {
  return {
    ...studySet,
    labels: normalizeLabels((studySet as Partial<StudySet>).labels, fallbackLabels),
  };
}

export function parseImportedStudySet(rawText: string): StudySet | null {
  let parsed: unknown;

  try {
    parsed = JSON.parse(rawText);
  } catch {
    return null;
  }

  if (typeof parsed !== "object" || parsed === null) return null;

  const maybeSet = parsed as Record<string, unknown>;

  const title = typeof maybeSet.title === "string" ? maybeSet.title.trim() : "";

  if (!title) return null;

  const cards = normalizeCards(maybeSet.cards);

  if (!cards.length) return null;

  const now = new Date().toISOString();

  return {
    id: newId(),
    title,
    description: typeof maybeSet.description === "string" ? maybeSet.description : "",
    labels: normalizeLabels(maybeSet.labels),
    createdAt: now,
    updatedAt: now,
    cards,
  };
}
