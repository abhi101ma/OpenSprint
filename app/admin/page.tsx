import { requireRole } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function updateProblemStatus(formData: FormData) {
  "use server";
  await requireRole("admin");
  const id = String(formData.get("id"));
  const status = formData.get("status") as any;
  await prisma.problem.update({ where: { id }, data: { status } });
  revalidatePath("/admin");
  revalidatePath("/problems");
}

async function publishSolution(formData: FormData) {
  "use server";
  await requireRole("admin");
  const id = String(formData.get("id"));
  await prisma.solution.update({ where: { id }, data: { status: "published" } });
  revalidatePath("/admin");
  revalidatePath("/gallery");
}

export default async function AdminPage() {
  await requireRole("admin");
  const [problems, solutions] = await Promise.all([
    prisma.problem.findMany({ orderBy: { createdAt: "desc" }, include: { createdBy: true } }),
    prisma.solution.findMany({ where: { status: "draft" }, include: { problem: true } }),
  ]);

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      <h1 className="text-3xl font-bold">Admin Console</h1>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Moderate Problems</h2>
        {problems.map((p) => (
          <article key={p.id} className="rounded border p-3">
            <p className="font-medium">{p.title} <span className="text-xs text-muted-foreground">by {p.createdBy.email}</span></p>
            <form action={updateProblemStatus} className="mt-2 flex gap-2">
              <input type="hidden" name="id" value={p.id} />
              <select name="status" defaultValue={p.status} className="rounded border px-2 py-1 text-sm">
                {['draft','submitted','approved','published','archived'].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button className="rounded border px-3 py-1 text-sm">Update</button>
            </form>
          </article>
        ))}
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Publish Solutions</h2>
        {solutions.map((s) => (
          <article key={s.id} className="rounded border p-3">
            <p>{s.title} <span className="text-xs text-muted-foreground">for {s.problem.title}</span></p>
            <form action={publishSolution}><input type="hidden" name="id" value={s.id} /><button className="mt-2 rounded border px-3 py-1 text-sm">Publish</button></form>
          </article>
        ))}
      </section>
    </main>
  );
}
