import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@opensprint.dev" },
    update: {},
    create: { email: "admin@opensprint.dev", name: "Admin", role: "admin", passwordHash },
  });
  const owner = await prisma.user.upsert({
    where: { email: "owner@opensprint.dev" },
    update: {},
    create: { email: "owner@opensprint.dev", name: "Problem Owner", role: "user", passwordHash },
  });
  const solver = await prisma.user.upsert({
    where: { email: "solver@opensprint.dev" },
    update: {},
    create: { email: "solver@opensprint.dev", name: "Solver", role: "user", passwordHash },
  });

  const problem1 = await prisma.problem.create({
    data: {
      title: "Reduce onboarding support tickets",
      description: "Build workflows and tooling to reduce repetitive onboarding support requests.",
      domainTags: ["operations", "automation"],
      difficulty: "mid",
      status: "published",
      createdById: owner.id,
    },
  });

  await prisma.problem.create({
    data: {
      title: "Improve sales lead scoring",
      description: "Develop a reliable lead scoring model from CRM touchpoints.",
      domainTags: ["sales", "analytics"],
      difficulty: "high",
      status: "published",
      createdById: owner.id,
    },
  });

  const sprint = await prisma.sprint.create({
    data: {
      problemId: problem1.id,
      name: "Onboarding Sprint",
      goal: "Deliver reduced response burden",
      status: "active",
      board: {
        create: {
          name: "Onboarding Board",
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
    include: { board: { include: { columns: true } } },
  });

  await prisma.problemMember.createMany({ data: [{ problemId: problem1.id, userId: owner.id, role: "owner" }, { problemId: problem1.id, userId: solver.id, role: "solver" }], skipDuplicates: true });

  const backlog = sprint.board!.columns.find((c) => c.name === "Backlog")!;
  const inProgress = sprint.board!.columns.find((c) => c.name === "In Progress")!;

  await prisma.card.createMany({
    data: [
      { boardId: sprint.board!.id, columnId: backlog.id, title: "Audit current ticket categories", order: 0, createdById: owner.id, labels: ["research"], priority: "med" },
      { boardId: sprint.board!.id, columnId: inProgress.id, title: "Prototype self-serve flow", order: 0, createdById: solver.id, labels: ["mvp"], priority: "high" },
    ],
  });

  await prisma.solution.create({
    data: {
      problemId: problem1.id,
      title: "Ticket triage automation stack",
      summary: "A low-code + API automation pipeline reducing repetitive onboarding tickets by 35%.",
      repoUrl: "https://github.com/example/solution",
      demoUrl: "https://demo.example.com",
      status: "published",
      createdById: solver.id,
    },
  });

  await prisma.user.update({ where: { id: solver.id }, data: { solverProfile: { upsert: { update: { headline: "Automation-first full stack solver", skills: ["nextjs", "prisma", "workflow"], availability: 12, location: "Remote" }, create: { headline: "Automation-first full stack solver", skills: ["nextjs", "prisma", "workflow"], availability: 12, location: "Remote" } } } } });

  console.log("Seed complete", { admin: admin.email, owner: owner.email, solver: solver.email });
}

main().finally(() => prisma.$disconnect());
