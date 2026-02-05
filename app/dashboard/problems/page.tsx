import { createProblemAction, createSprintAction } from "@/lib/actions";
import { requireAuth } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";

async function submitProblemAction(formData: FormData) {
  "use server";
  const session = await requireAuth();
  const id = String(formData.get("id"));
  await prisma.problem.update({ where: { id, createdById: session.user.id }, data: { status: "submitted" } });
  revalidatePath("/dashboard/problems");
}

export default async function DashboardProblemsPage() {
  const session = await requireAuth();
  const problems = await prisma.problem.findMany({ where: { createdById: session.user.id }, include: { sprint: true }, orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold">My Problems</h1>
        <form action={createProblemAction} className="mt-4 grid gap-3 rounded-lg border p-4 md:grid-cols-2">
          <Input className="md:col-span-2" name="title" placeholder="Problem title" required />
          <Textarea className="md:col-span-2" name="description" placeholder="Describe the business problem" required />
          <Input name="domainTags" placeholder="domain tags (comma separated)" />
          <select name="difficulty" className="rounded-md border px-3 py-2 text-sm"><option value="low">Low</option><option value="mid">Mid</option><option value="high">High</option></select>
          <Button className="md:col-span-2" type="submit">Save Draft</Button>
        </form>
      </section>
      <section className="space-y-3">
        {problems.map((p) => <article key={p.id} className="rounded-lg border p-4"><h2 className="font-semibold">{p.title}</h2><p className="text-sm text-muted-foreground">Status: {p.status}</p><div className="mt-3 flex flex-wrap gap-2">{p.status === "draft" ? <form action={submitProblemAction}><input type="hidden" name="id" value={p.id} /><button className="rounded border px-3 py-1 text-sm">Submit for approval</button></form> : null}{!p.sprint ? <form action={createSprintAction} className="flex gap-2"><input type="hidden" name="problemId" value={p.id} /><input name="name" defaultValue="Sprint 1" className="rounded border px-2 py-1 text-sm" /><button className="rounded border px-3 py-1 text-sm">Create Sprint</button></form> : <span className="text-xs text-green-700">Sprint active</span>}</div></article>)}
      </section>
    </div>
  );
}
