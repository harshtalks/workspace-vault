import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import db, { eq, users } from "database";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  // Webhook secrets
  // const WEBHOOK_SECRET = process.env.NEXT_PUBLIC_CLERK_WEBHOOK;

  // if (!WEBHOOK_SECRET) {
  //   throw new Error(
  //     "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
  //   );
  // }

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
  const webhook = new Webhook("whsec_ehjAZ18zoh2wgDWsv94WqkpkIab4Zu+c");

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
      const insertedUser = await db
        .insert(users)
        .values({
          id,
          email: event.data.email_addresses[0].email_address,
          firstName: event.data.first_name,
          lastName: event.data.last_name,
          username: event.data.username,
        })
        .onConflictDoNothing()
        .returning();

      console.log(
        `user with and ID of ${insertedUser[0].id} is saved in database.`
      );
    } catch (error) {
      error instanceof Error && console.error(error.message);
    }
  } else if (eventType === "user.deleted") {
    try {
      const user = await db
        .delete(users)
        .where(eq(users.id, event.data.id))
        .returning();
    } catch (error) {
      error instanceof Error && console.error(error.message);
    }
  } else if (eventType === "session.ended") {
    request.cookies.delete("webAuthn");
  }

  return new NextResponse(JSON.stringify({ id: id }), { status: 201 });
};
