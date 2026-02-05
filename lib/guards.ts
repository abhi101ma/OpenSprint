import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session;
}

export async function requireRole(role: "admin") {
  const session = await requireAuth();
  if (session.user.role !== role) redirect("/dashboard");
  return session;
}
