import type { StudySet } from "#/types/study";

const now = new Date().toISOString();

export const defaultStudySets: StudySet[] = [
  {
    id: "capitals-of-the-world",
    title: "Capitals of the World",
    description: "Practice country-capital recall with globally distributed examples.",
    labels: ["Geography"],
    createdAt: now,
    updatedAt: now,
    cards: [
      { id: "france", front: "France", back: "Paris" },
      { id: "japan", front: "Japan", back: "Tokyo" },
      { id: "canada", front: "Canada", back: "Ottawa" },
      { id: "brazil", front: "Brazil", back: "Brasília" },
      { id: "kenya", front: "Kenya", back: "Nairobi" },
      { id: "australia", front: "Australia", back: "Canberra" },
    ],
  },
  {
    id: "basic-japanese-vocabulary",
    title: "Basic Japanese Vocabulary",
    description: "Foundational Japanese terms for everyday context.",
    labels: ["Japanese", "Lang"],
    createdAt: now,
    updatedAt: now,
    cards: [
      { id: "konnichiwa", front: "こんにちは (Konnichiwa)", back: "Hello" },
      { id: "arigatou", front: "ありがとう (Arigatō)", back: "Thank you" },
      { id: "sumimasen", front: "すみません (Sumimasen)", back: "Excuse me / Sorry" },
      { id: "mizu", front: "水 (Mizu)", back: "Water" },
      { id: "tomodachi", front: "友達 (Tomodachi)", back: "Friend" },
      { id: "gakkou", front: "学校 (Gakkō)", back: "School" },
    ],
  },
  {
    id: "famous-historical-dates",
    title: "Famous Historical Dates",
    description: "Anchor major historical events with timeline memory cues.",
    labels: ["History"],
    createdAt: now,
    updatedAt: now,
    cards: [
      { id: "moon", front: "First Moon landing", back: "1969" },
      { id: "berlin", front: "Fall of the Berlin Wall", back: "1989" },
      { id: "magna-carta", front: "Magna Carta signed", back: "1215" },
      { id: "printing", front: "Gutenberg printing press", back: "c. 1440" },
      { id: "declaration", front: "US Declaration of Independence", back: "1776" },
      { id: "web", front: "World Wide Web proposed", back: "1989" },
    ],
  },
  {
    id: "programming-concepts",
    title: "Programming Concepts",
    description: "Core software engineering concepts to keep top-of-mind.",
    labels: ["Programming"],
    createdAt: now,
    updatedAt: now,
    cards: [
      {
        id: "big-o",
        front: "What does Big-O notation describe?",
        back: "How algorithm runtime or space grows with input size.",
      },
      {
        id: "idempotent",
        front: "What is an idempotent operation?",
        back: "An operation that has the same effect when applied multiple times.",
      },
      {
        id: "pure-function",
        front: "Pure function",
        back: "A function with no side effects and deterministic output.",
      },
      {
        id: "normalization",
        front: "Why normalize a relational database?",
        back: "To reduce redundancy and improve data integrity.",
      },
      {
        id: "event-loop",
        front: "Event loop",
        back: "A concurrency mechanism that processes queued tasks sequentially.",
      },
      {
        id: "memoization",
        front: "Memoization",
        back: "Caching function results by input to avoid recomputation.",
      },
    ],
  },
];
