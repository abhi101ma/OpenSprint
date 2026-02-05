"use client";

import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState, useTransition } from "react";
import { createCardAction, moveCardAction } from "@/lib/board-actions";
import { toast } from "sonner";

type CardItem = { id: string; title: string; order: number; assignee?: string | null; priority: string; labels: string[] };
type ColumnItem = { id: string; name: string; wipLimit: number | null; cards: CardItem[] };

function SortableCard({ card }: { card: CardItem }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: card.id, data: { type: "card", columnId: (card as any).columnId } });
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} {...attributes} {...listeners} className="rounded border bg-white p-2 text-sm">
      <p className="font-medium">{card.title}</p>
      <p className="text-xs text-muted-foreground">{card.priority}</p>
    </div>
  );
}

export function BoardClient({ boardId, initialColumns }: { boardId: string; initialColumns: ColumnItem[] }) {
  const [columns, setColumns] = useState(initialColumns);
  const [pending, startTransition] = useTransition();

  const cardToColumn = useMemo(() => {
    const map = new Map<string, string>();
    columns.forEach((col) => col.cards.forEach((c) => map.set(c.id, col.id)));
    return map;
  }, [columns]);

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const sourceColumn = cardToColumn.get(String(active.id));
    let destColumn = cardToColumn.get(String(over.id));
    if (!destColumn) destColumn = String(over.id);
    if (!sourceColumn || !destColumn) return;

    setColumns((prev) => {
      const next = structuredClone(prev) as ColumnItem[];
      const from = next.find((c) => c.id === sourceColumn)!;
      const to = next.find((c) => c.id === destColumn)!;
      const idx = from.cards.findIndex((c) => c.id === active.id);
      const [moved] = from.cards.splice(idx, 1);
      const toIndex = to.cards.findIndex((c) => c.id === over.id);
      to.cards.splice(toIndex < 0 ? to.cards.length : toIndex, 0, moved);
      return next;
    });

    startTransition(async () => {
      try {
        const col = columns.find((c) => c.id === destColumn);
        const toOrder = Math.max(0, col?.cards.findIndex((c) => c.id === active.id) ?? 0);
        await moveCardAction({ cardId: String(active.id), toColumnId: destColumn!, toOrder });
      } catch {
        toast.error("Could not move card");
      }
    });
  };

  return (
    <DndContext onDragEnd={onDragEnd}>
      <div className="grid gap-4 md:grid-cols-4">
        {columns.map((column) => (
          <div key={column.id} className="rounded-lg border bg-muted/40 p-3">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold">{column.name}</h3>
              {column.wipLimit && column.cards.length > column.wipLimit ? <span className="text-xs text-red-600">WIP exceeded</span> : null}
            </div>
            <SortableContext items={column.cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {column.cards.map((card) => <SortableCard key={card.id} card={{ ...card, columnId: column.id } as any} />)}
              </div>
            </SortableContext>
            <button
              disabled={pending}
              onClick={() => startTransition(async () => {
                const title = prompt("Card title");
                if (!title) return;
                await createCardAction({ boardId, columnId: column.id, title });
                toast.success("Card created");
              })}
              className="mt-3 w-full rounded border px-2 py-1 text-xs"
            >
              + Add card
            </button>
          </div>
        ))}
      </div>
    </DndContext>
  );
}
