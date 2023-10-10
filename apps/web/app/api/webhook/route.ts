import { cookies, headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { PrismaClient } from "database";
import { NextRequest } from "next/server";
import { redirect } from "next/dist/server/api-utils";

export const POST = async (request: NextRequest) => {
  // Webhook secrets
  const WEBHOOK_SECRET = process.env.NEXT_PUBLIC_CLERK_WEBHOOK;

  const prisma = new PrismaClient();

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Header
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await request.json();
  const body = JSON.stringify(payload);

  // Create a new SVIX instance with your secret.
  const webhook = new Webhook(WEBHOOK_SECRET);

  // instance of event
  let event: WebhookEvent;

  // Verify the payload with the headers
  try {
    event = webhook.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response(JSON.stringify(err), {
      status: 400,
    });
  }

  // Get the ID and type
  const { id } = event.data;
  const eventType = event.type;

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);

  if (eventType === "user.created") {
    try {
      const user = await prisma.user.create({
        data: {
          id: event.data.id,
          email: event.data.email_addresses[0].email_address,
          firstName: event.data.first_name,
          lastName: event.data.last_name,
          created_at: new Date(event.data.created_at),
          ...(event.data.has_image && { avatar: event.data.image_url }),
        },
      });
      console.log(`user with and ID of ${id} is saved in database.`);
    } catch (error) {
      error instanceof Error && console.error(error.message);
    }
  } else if (eventType === "user.deleted") {
    try {
      const user = await prisma.user.delete({
        where: {
          id: event.data.id,
        },
      });
      console.log(`user with and ID of ${id} is deleted from the database.`);
    } catch (error) {
      error instanceof Error && console.error(error.message);
    }
  } else if (eventType === "session.ended") {
    console.log("cookie is deleted:", request.cookies.get("webAuthn"));
    request.cookies.delete("webAuthn");
  }

  prisma.$disconnect();

  return new Response(JSON.stringify({ id: id }), { status: 201 });
};
