import { PlusIcon, Trash2Icon } from "lucide-react";

import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import type { StudyCardModel } from "#/types/study";

export function CardEditor({
  cards,
  onChange,
}: {
  cards: StudyCardModel[];
  onChange: (cards: StudyCardModel[]) => void;
}) {
  const updateCard = (index: number, patch: Partial<StudyCardModel>) => {
    onChange(cards.map((card, cardIndex) => (cardIndex === index ? { ...card, ...patch } : card)));
  };

  const removeCard = (index: number) => {
    if (cards.length <= 1) return;
    onChange(cards.filter((_, cardIndex) => cardIndex !== index));
  };

  const addCard = () => {
    onChange([...cards, { id: `card-${crypto.randomUUID()}`, front: "", back: "" }]);
  };

  return (
    <div className="space-y-4">
      {cards.map((card, index) => (
        <div key={card.id} className="space-y-3 rounded-3xl border border-white/10 bg-black/30 p-4">
          <p className="text-xs text-white/60">Card {index + 1}</p>
          <Input
            value={card.front}
            onChange={(event) => updateCard(index, { front: event.currentTarget.value })}
            placeholder="Front (question, concept, prompt)"
            className="bg-white/10 text-white placeholder:text-white/40"
          />
          <textarea
            value={card.back}
            onChange={(event) => updateCard(index, { back: event.currentTarget.value })}
            placeholder="Back (answer, explanation)"
            aria-label={`Card ${index + 1} answer`}
            className="min-h-24 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-ring/40"
          />
          <Button
            variant="destructive"
            size="sm"
            onClick={() => removeCard(index)}
            disabled={cards.length <= 1}
          >
            <Trash2Icon /> Remove card
          </Button>
        </div>
      ))}

      <Button variant="outline" onClick={addCard}>
        <PlusIcon /> Add card
      </Button>
    </div>
  );
}
