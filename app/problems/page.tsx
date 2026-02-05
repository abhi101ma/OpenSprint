import { prisma } from "@/lib/prisma";
import { PublicHeader } from "@/components/public/header";

export default async function ProblemsPage() {
  const problems = await prisma.problem.findMany({ where: { status: "published" }, orderBy: { createdAt: "desc" } });
  return (
    <main>
      <PublicHeader />
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-3xl font-bold">Published Problems</h1>
        <div className="mt-6 space-y-4">{problems.map((p) => <article key={p.id} className="rounded-lg border p-4"><h2 className="font-semibold">{p.title}</h2><p className="mt-1 text-sm text-muted-foreground">{p.description}</p></article>)}</div>
      </div>
    </main>
  );
}
