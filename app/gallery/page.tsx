import { prisma } from "@/lib/prisma";
import { PublicHeader } from "@/components/public/header";

export default async function GalleryPage() {
  const solutions = await prisma.solution.findMany({ where: { status: "published" }, include: { problem: true }, orderBy: { createdAt: "desc" } });
  return (
    <main>
      <PublicHeader />
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-3xl font-bold">Solution Gallery</h1>
        <div className="mt-6 space-y-4">{solutions.map((s) => <article key={s.id} className="rounded-lg border p-4"><h2 className="font-semibold">{s.title}</h2><p className="text-sm text-muted-foreground">For: {s.problem.title}</p><p className="mt-2">{s.summary}</p></article>)}</div>
      </div>
    </main>
  );
}
