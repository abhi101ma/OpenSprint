"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import { requireAuth } from "@/lib/guards";
import { revalidatePath } from "next/cache";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function registerAction(formData: FormData) {
  const parsed = registerSchema.parse(Object.fromEntries(formData));
  const exists = await prisma.user.findUnique({ where: { email: parsed.email } });
  if (exists) throw new Error("Email already exists");
  const passwordHash = await bcrypt.hash(parsed.password, 10);
  await prisma.user.create({ data: { name: parsed.name, email: parsed.email, passwordHash } });
  await signIn("credentials", { email: parsed.email, password: parsed.password, redirectTo: "/dashboard" });
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  await signIn("credentials", { email, password, redirectTo: "/dashboard" });
}

export async function createProblemAction(formData: FormData) {
  const session = await requireAuth();
  const title = String(formData.get("title") ?? "");
  const description = String(formData.get("description") ?? "");
  const domainTags = String(formData.get("domainTags") ?? "").split(",").map((x) => x.trim()).filter(Boolean);
  const difficulty = z.enum(["low", "mid", "high"]).parse(formData.get("difficulty"));
  await prisma.problem.create({
    data: { title, description, difficulty, domainTags, createdById: session.user.id },
  });
  revalidatePath("/dashboard/problems");
}

export async function saveSolverProfileAction(formData: FormData) {
  const session = await requireAuth();
  const skills = String(formData.get("skills") ?? "").split(",").map((x) => x.trim()).filter(Boolean);
  await prisma.solverProfile.upsert({
    where: { userId: session.user.id },
    update: {
      headline: String(formData.get("headline") ?? ""),
      skills,
      availability: Number(formData.get("availability") ?? 0),
      location: String(formData.get("location") ?? ""),
      links: { github: String(formData.get("github") ?? "") },
    },
    create: {
      userId: session.user.id,
      headline: String(formData.get("headline") ?? ""),
      skills,
      availability: Number(formData.get("availability") ?? 0),
      location: String(formData.get("location") ?? ""),
      links: { github: String(formData.get("github") ?? "") },
    },
  });
  revalidatePath("/dashboard/solver");
}

export async function createSprintAction(formData: FormData) {
  const session = await requireAuth();
  const problemId = String(formData.get("problemId"));
  const problem = await prisma.problem.findUnique({ where: { id: problemId } });
  if (!problem || problem.createdById !== session.user.id) throw new Error("Unauthorized");
  const sprint = await prisma.sprint.create({
    data: {
      problemId,
      name: String(formData.get("name") ?? "Sprint 1"),
      goal: String(formData.get("goal") ?? "Validate solution"),
      status: "active",
      board: {
        create: {
          name: "Main Board",
          columns: {
            create: [
              { name: "Backlog", order: 0 },
              { name: "In Progress", order: 1 },
              { name: "Review", order: 2 },
              { name: "Done", order: 3 },
            ],
          },
        },
      },
    },
  });
  await prisma.problemMember.upsert({ where: { problemId_userId: { problemId, userId: session.user.id } }, update: { role: "owner" }, create: { problemId, userId: session.user.id, role: "owner" } });
  revalidatePath("/dashboard/board");
  return sprint.id;
}
