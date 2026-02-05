import Link from "next/link";
import { signOut } from "@/lib/auth";

export function DashboardSidebar() {
  return (
    <aside className="w-64 border-r p-4">
      <h2 className="text-lg font-semibold">Dashboard</h2>
      <nav className="mt-4 flex flex-col gap-2 text-sm">
        <Link href="/dashboard">Overview</Link>
        <Link href="/dashboard/problems">My Problems</Link>
        <Link href="/dashboard/board">Sprint Board</Link>
        <Link href="/dashboard/solver">Solver Profile</Link>
        <Link href="/dashboard/settings">Settings</Link>
        <Link href="/admin">Admin</Link>
      </nav>
      <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }} className="mt-6">
        <button className="rounded-md border px-3 py-1 text-sm" type="submit">Sign out</button>
      </form>
    </aside>
  );
}
