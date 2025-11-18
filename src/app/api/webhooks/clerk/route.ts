import { NextResponse } from "next/server";
import {prisma} from "../../../../lib/prisma";

import { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const payload: WebhookEvent = await req.json();

  if (payload.type === "user.created") {
    const { id, email_addresses, username } = payload.data;
    await prisma.user.create({
    data: {
      clerkId: id, 
      email: email_addresses[0]?.email_address,
      username: username || `user_${id.slice(0, 6)}`,
    },
  });
  }

  return NextResponse.json({ status: "ok" });
}