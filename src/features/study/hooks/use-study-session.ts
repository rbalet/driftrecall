import { useEffect, useMemo, useRef, useState } from "react";

import type { StudyCardModel } from "#/types/study";

interface UseStudySessionOptions {
  cards: StudyCardModel[];
  revealDelaySeconds: number;
  autoNextDelaySeconds: number;
  autoplay: boolean;
}

export function useStudySession({
  cards,
  revealDelaySeconds,
  autoNextDelaySeconds,
  autoplay,
}: UseStudySessionOptions) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [revealDeadline, setRevealDeadline] = useState<number | null>(null);
  const [nextDeadline, setNextDeadline] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cardsLength = cards.length;

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 200);

    return () => clearInterval(timer);
  }, []);

  const clearTimers = () => {
    if (revealTimerRef.current) {
      clearTimeout(revealTimerRef.current);
      revealTimerRef.current = null;
    }

    if (nextTimerRef.current) {
      clearTimeout(nextTimerRef.current);
      nextTimerRef.current = null;
    }
  };

  const scheduleReveal = () => {
    if (!cardsLength || !autoplay || paused) return;

    const delayMs = revealDelaySeconds * 1000;
    const deadline = Date.now() + delayMs;
    setRevealDeadline(deadline);

    revealTimerRef.current = setTimeout(() => {
      setRevealed(true);
      setRevealDeadline(null);
    }, delayMs);
  };

  const scheduleNext = () => {
    if (!cardsLength || !autoplay || paused) return;

    const delayMs = autoNextDelaySeconds * 1000;
    const deadline = Date.now() + delayMs;
    setNextDeadline(deadline);

    nextTimerRef.current = setTimeout(() => {
      setIndex((current) => (current + 1) % cardsLength);
      setRevealed(false);
      setNextDeadline(null);
    }, delayMs);
  };

  useEffect(() => {
    clearTimers();
    setRevealDeadline(null);
    setNextDeadline(null);

    if (!cardsLength) return;

    if (revealed) {
      scheduleNext();
    } else {
      scheduleReveal();
    }

    return clearTimers;
  }, [autoNextDelaySeconds, autoplay, cardsLength, index, paused, revealDelaySeconds, revealed]);

  useEffect(() => {
    if (!cardsLength) {
      setIndex(0);
      setRevealed(false);
      setPaused(false);
      return;
    }

    if (index > cardsLength - 1) {
      setIndex(0);
      setRevealed(false);
    }
  }, [cardsLength, index]);

  const revealNow = () => {
    if (revealed) return;
    clearTimers();
    setRevealDeadline(null);
    setRevealed(true);
  };

  const next = () => {
    if (!cardsLength) return;
    clearTimers();
    setRevealDeadline(null);
    setNextDeadline(null);
    setIndex((current) => (current + 1) % cardsLength);
    setRevealed(false);
  };

  const previous = () => {
    if (!cardsLength) return;
    clearTimers();
    setRevealDeadline(null);
    setNextDeadline(null);
    setIndex((current) => (current - 1 + cardsLength) % cardsLength);
    setRevealed(false);
  };

  const restart = () => {
    clearTimers();
    setRevealDeadline(null);
    setNextDeadline(null);
    setRevealed(false);
  };

  const revealRemainingMs = Math.max(0, (revealDeadline ?? now) - now);
  const nextRemainingMs = Math.max(0, (nextDeadline ?? now) - now);

  return {
    currentCard: cards[index] ?? null,
    index,
    total: cardsLength,
    revealed,
    paused,
    setPaused,
    revealNow,
    next,
    previous,
    restart,
    revealRemainingMs,
    nextRemainingMs,
    progress: useMemo(
      () => (cardsLength ? ((index + (revealed ? 1 : 0)) / cardsLength) * 100 : 0),
      [cardsLength, index, revealed],
    ),
  };
}
