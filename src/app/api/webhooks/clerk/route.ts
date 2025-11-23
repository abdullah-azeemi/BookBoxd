import { NextResponse } from "next/server";
import {prisma} from "../../../../lib/prisma";

import { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const payload: WebhookEvent = await req.json();

  if (payload.type === "user.created") {
    const { id, email_addresses, primary_email_address_id, username, first_name, last_name } = payload.data;
    const preferredName = `${first_name || ""} ${last_name || ""}`.trim();
    const primaryEmail = email_addresses.find(e => e.id === primary_email_address_id)?.email_address || email_addresses[0]?.email_address || null;
    const preferredUsername = preferredName || username || `user_${id.slice(0, 6)}`;

    try {
      await prisma.user.upsert({
        where: { clerkId: id },
        update: {
          email: primaryEmail || undefined,
          username: preferredUsername,
        },
        create: {
          id,
          clerkId: id,
          email: primaryEmail || undefined,
          username: preferredUsername,
        },
      });
    } catch {
      const altUsername = username || `user_${id.slice(0, 6)}`;
      await prisma.user.upsert({
        where: { clerkId: id },
        update: {
          email: primaryEmail || undefined,
          username: altUsername,
        },
        create: {
          id,
          clerkId: id,
          email: primaryEmail || undefined,
          username: altUsername,
        },
      });
    }
  }

  if (payload.type === "user.updated") {
    const { id, email_addresses, primary_email_address_id, username, first_name, last_name } = payload.data;
    const preferredName = `${first_name || ""} ${last_name || ""}`.trim();
    const primaryEmail = email_addresses.find(e => e.id === primary_email_address_id)?.email_address || email_addresses[0]?.email_address || null;
    const preferredUsername = preferredName || username || undefined;
    try {
      await prisma.user.update({
        where: { clerkId: id },
        data: {
          email: primaryEmail || undefined,
          username: preferredUsername,
        },
      });
    } catch {
      await prisma.user.update({
        where: { clerkId: id },
        data: {
          email: primaryEmail || undefined,
          username: username || `user_${id.slice(0, 6)}`,
        },
      });
    }
  }

  if (payload.type === "user.deleted") {
    const { id } = payload.data;
    await prisma.user.delete({ where: { clerkId: id } }).catch(() => {});
  }

  return NextResponse.json({ status: "ok" });
}
