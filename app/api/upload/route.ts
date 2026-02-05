import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/guards";
import { saveLocalFile } from "@/lib/storage";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await requireAuth();
  const form = await req.formData();
  const file = form.get("file");
  const cardId = String(form.get("cardId"));
  if (!(file instanceof File)) return NextResponse.json({ error: "No file" }, { status: 400 });
  const saved = await saveLocalFile(file);
  const attachment = await prisma.attachment.create({
    data: { ...saved, cardId, uploaderId: session.user.id },
  });
  return NextResponse.json(attachment);
}
