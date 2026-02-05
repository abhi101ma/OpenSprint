import { BoardClient } from "@/components/board/board-client";
import { addCommentAction } from "@/lib/board-actions";
import { requireAuth } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function BoardPage({ searchParams }: { searchParams: { q?: string; assignee?: string; priority?: string } }) {
  const session = await requireAuth();

  const memberProblems = await prisma.problemMember.findMany({ where: { userId: session.user.id }, select: { problemId: true } });
  const board = await prisma.board.findFirst({
    where: {
      sprint: {
        problem: {
          OR: [{ createdById: session.user.id }, { id: { in: memberProblems.map((m) => m.problemId) } }],
        },
      },
    },
    include: {
      columns: { orderBy: { order: "asc" } },
      cards: { include: { comments: { include: { author: true }, orderBy: { createdAt: "desc" }, take: 2 } }, orderBy: { order: "asc" } },
    },
  });

  if (!board) return <div className="rounded-lg border p-6">No active board found. Create a sprint first.</div>;

  const filteredCards = board.cards.filter((card) => {
    if (searchParams.q && !card.title.toLowerCase().includes(searchParams.q.toLowerCase()) && !card.labels.join(",").toLowerCase().includes(searchParams.q.toLowerCase())) return false;
    if (searchParams.priority && card.priority !== searchParams.priority) return false;
    if (searchParams.assignee && card.assigneeId !== searchParams.assignee) return false;
    return true;
  });

  const columns = board.columns.map((col) => ({ ...col, cards: filteredCards.filter((card) => card.columnId === col.id) }));
  const firstCard = filteredCards[0];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Sprint Board</h1>
      <form className="grid gap-2 md:grid-cols-3">
        <Input name="q" placeholder="Search title or labels" defaultValue={searchParams.q} />
        <Input name="assignee" placeholder="Filter assignee id" defaultValue={searchParams.assignee} />
        <Input name="priority" placeholder="Priority: low|med|high" defaultValue={searchParams.priority} />
      </form>
      <BoardClient boardId={board.id} initialColumns={columns} />
      {firstCard ? (
        <section className="rounded-lg border p-4">
          <h2 className="font-semibold">Card Activity: {firstCard.title}</h2>
          <p className="text-sm text-muted-foreground">Created {firstCard.createdAt.toLocaleString()} · Updated {firstCard.updatedAt.toLocaleString()}</p>
          <div className="mt-3 space-y-2 text-sm">{firstCard.comments.map((c) => <p key={c.id}><span className="font-medium">{c.author.name ?? c.author.email}</span>: {c.body}</p>)}</div>
          <form action={addCommentAction} className="mt-3 flex gap-2">
            <input type="hidden" name="cardId" value={firstCard.id} />
            <Input name="body" placeholder="Add comment" required />
            <Button type="submit">Post</Button>
          </form>
        </section>
      ) : null}
    </div>
  );
}
