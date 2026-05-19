import { AnimatePresence, motion } from "motion/react";

import type { StudyCardModel } from "#/types/study";

export function StudyCard({
  card,
  revealed,
  onReveal,
}: {
  card: StudyCardModel;
  revealed: boolean;
  onReveal: () => void;
}) {
  return (
    <motion.button
      key={card.id}
      type="button"
      onClick={onReveal}
      className="group relative flex w-full max-w-4xl flex-col justify-center overflow-hidden rounded-[2rem] border border-white/15 bg-black/40 p-8 text-left shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-12"
      initial={{ opacity: 0, y: 16, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.985 }}
      transition={{ duration: 0.45, ease: "easeInOut" }}
      aria-label="Study card"
    >
      <p className="mb-3 text-xs tracking-[0.2em] text-white/55 uppercase">Prompt</p>
      <h1 className="text-3xl leading-tight font-semibold text-balance text-white sm:text-5xl">
        {card.front}
      </h1>

      <AnimatePresence mode="wait" initial={false}>
        {revealed ? (
          <motion.div
            key={`${card.id}-answer`}
            className="mt-8 border-t border-white/10 pt-6"
            initial={{ opacity: 0, filter: "blur(8px)", y: 8 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <p className="mb-3 text-xs tracking-[0.2em] text-white/55 uppercase">Answer</p>
            <p className="text-xl text-white/92 sm:text-3xl">{card.back}</p>
          </motion.div>
        ) : (
          <motion.div
            key={`${card.id}-hidden`}
            className="mt-8 rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 py-6 text-sm text-white/60"
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.3 }}
          >
            Tap / Space / swipe up to reveal.
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
