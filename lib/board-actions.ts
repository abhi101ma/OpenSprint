"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/guards";
import { revalidatePath } from "next/cache";

async function ensureMember(userId: string, problemId: string) {
  const problem = await prisma.problem.findUnique({ where: { id: problemId }, select: { createdById: true } });
  if (!problem) throw new Error("Problem not found");
  if (problem.createdById === userId) return;
  const member = await prisma.problemMember.findUnique({ where: { problemId_userId: { problemId, userId } } });
  if (!member) throw new Error("Unauthorized");
}

export async function createCardAction(data: { boardId: string; columnId: string; title: string }) {
  const session = await requireAuth();
  const board = await prisma.board.findUnique({ where: { id: data.boardId }, include: { sprint: true } });
  if (!board) throw new Error("Board not found");
  await ensureMember(session.user.id, board.sprint.problemId);
  const maxOrder = await prisma.card.aggregate({ where: { columnId: data.columnId }, _max: { order: true } });
  await prisma.card.create({
    data: {
      boardId: data.boardId,
      columnId: data.columnId,
      title: data.title,
      order: (maxOrder._max.order ?? -1) + 1,
      createdById: session.user.id,
      labels: [],
    },
  });
  revalidatePath("/dashboard/board");
}

export async function moveCardAction(data: { cardId: string; toColumnId: string; toOrder: number }) {
  const session = await requireAuth();
  const card = await prisma.card.findUnique({ where: { id: data.cardId }, include: { board: { include: { sprint: true } } } });
  if (!card) throw new Error("Card not found");
  await ensureMember(session.user.id, card.board.sprint.problemId);

  await prisma.$transaction(async (tx) => {
    const sameColumn = card.columnId === data.toColumnId;
    if (sameColumn) {
      const cards = await tx.card.findMany({ where: { columnId: card.columnId }, orderBy: { order: "asc" } });
      const filtered = cards.filter((c) => c.id !== card.id);
      filtered.splice(data.toOrder, 0, card);
      for (const [idx, c] of filtered.entries()) {
        await tx.card.update({ where: { id: c.id }, data: { order: idx, columnId: data.toColumnId } });
      }
    } else {
      const fromCards = await tx.card.findMany({ where: { columnId: card.columnId, NOT: { id: card.id } }, orderBy: { order: "asc" } });
      for (const [idx, c] of fromCards.entries()) await tx.card.update({ where: { id: c.id }, data: { order: idx } });
      const toCards = await tx.card.findMany({ where: { columnId: data.toColumnId }, orderBy: { order: "asc" } });
      toCards.splice(data.toOrder, 0, card);
      for (const [idx, c] of toCards.entries()) {
        await tx.card.update({ where: { id: c.id }, data: { order: idx, columnId: data.toColumnId } });
      }
    }
  });
  revalidatePath("/dashboard/board");
}

export async function addCommentAction(formData: FormData) {
  const session = await requireAuth();
  const cardId = String(formData.get("cardId"));
  const body = String(formData.get("body"));
  await prisma.comment.create({ data: { cardId, body, authorId: session.user.id } });
  revalidatePath("/dashboard/board");
}
