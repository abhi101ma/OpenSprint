import { saveSolverProfileAction } from "@/lib/actions";
import { requireAuth } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function SolverProfilePage() {
  const session = await requireAuth();
  const profile = await prisma.solverProfile.findUnique({ where: { userId: session.user.id } });
  return (
    <div>
      <h1 className="text-2xl font-bold">Solver Profile</h1>
      <form action={saveSolverProfileAction} className="mt-4 grid gap-3 rounded-lg border p-4 md:grid-cols-2">
        <Input name="headline" defaultValue={profile?.headline ?? ""} placeholder="Headline" className="md:col-span-2" />
        <Input name="skills" defaultValue={profile?.skills.join(",") ?? ""} placeholder="Skills comma separated" className="md:col-span-2" />
        <Input name="location" defaultValue={profile?.location ?? ""} placeholder="Location" />
        <Input name="availability" type="number" defaultValue={profile?.availability ?? 8} placeholder="Hours/week" />
        <Input name="github" defaultValue={((profile?.links as { github?: string } | null)?.github) ?? ""} placeholder="GitHub URL" className="md:col-span-2" />
        <Button type="submit" className="md:col-span-2">Save profile</Button>
      </form>
    </div>
  );
}
