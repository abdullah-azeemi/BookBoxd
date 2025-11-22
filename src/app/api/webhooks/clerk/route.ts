import { NextResponse } from "next/server";
import {prisma} from "../../../../lib/prisma";

import { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const payload: WebhookEvent = await req.json();

  if (payload.type === "user.created") {
    const { id, email_addresses, username } = payload.data;
    await prisma.user.upsert({
      where: { clerkId: id },
      update: {
        email: email_addresses[0]?.email_address,
        username: username || `user_${id.slice(0, 6)}`,
      },
      create: {
        id,
        clerkId: id,
        email: email_addresses[0]?.email_address,
        username: username || `user_${id.slice(0, 6)}`,
      },
    });
  }

  if (payload.type === "user.updated") {
    const { id, email_addresses, username } = payload.data;
    await prisma.user.update({
      where: { clerkId: id },
      data: {
        email: email_addresses[0]?.email_address,
        username: username || undefined,
      },
    });
  }

  if (payload.type === "user.deleted") {
    const { id } = payload.data;
    await prisma.user.delete({ where: { clerkId: id } }).catch(() => {});
  }

  return NextResponse.json({ status: "ok" });
}