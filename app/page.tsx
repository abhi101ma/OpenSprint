import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PublicHeader } from "@/components/public/header";
import { Card } from "@/components/ui/card";

export default async function HomePage() {
  const featuredProblems = await prisma.problem.findMany({ where: { status: "published" }, take: 3, orderBy: { createdAt: "desc" } });
  const featuredSolutions = await prisma.solution.findMany({ where: { status: "published" }, take: 3, orderBy: { createdAt: "desc" } });

  return (
    <main>
      <PublicHeader />
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-5xl font-bold">Build real solutions in focused community sprints.</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">OpenSprint matches problem-submitters with hands-on solvers. Run transparent sprints, track progress, and publish outcomes.</p>
        <div className="mt-8 flex gap-3">
          <Link className="rounded-md bg-primary px-4 py-2 text-white" href="/register">Get Started</Link>
          <Link className="rounded-md border px-4 py-2" href="/how-it-works">Learn More</Link>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-12 md:grid-cols-2">
        <Card><h2 className="font-semibold">Featured Problems</h2>{featuredProblems.map((p) => <p key={p.id} className="mt-2 text-sm">{p.title}</p>)}</Card>
        <Card><h2 className="font-semibold">Featured Solutions</h2>{featuredSolutions.map((s) => <p key={s.id} className="mt-2 text-sm">{s.title}</p>)}</Card>
      </section>
    </main>
  );
}
