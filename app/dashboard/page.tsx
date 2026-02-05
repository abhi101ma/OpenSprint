import { requireAuth } from "@/lib/guards";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await requireAuth();
  const [problemCount, cardCount] = await Promise.all([
    prisma.problem.count({ where: { createdById: session.user.id } }),
    prisma.card.count({ where: { createdById: session.user.id } }),
  ]);
  return <div><h1 className="text-2xl font-bold">Welcome back</h1><p className="mt-2 text-muted-foreground">Problems created: {problemCount} · Cards created: {cardCount}</p></div>;
}
