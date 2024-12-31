import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { StreamChat } from "stream-chat";
import webPush, { WebPushError } from "web-push";
import { StreamPushEvent } from "./StreamPushEvent";

export async function POST(req: Request) {
  try {
    const streamClient = StreamChat.getInstance(
      'tyaxvrk499mf',
      'wddzfefzcrds7ww35bt8u556fdkzhx682z34eevhq4v96jcd2n4z5s4jspqq6p37'
    );

    const rawBody = await req.text();

    const validRequest = streamClient.verifyWebhook(
      rawBody,
      req.headers.get("x-signature") || ""
    );

    if (!validRequest) {
      return NextResponse.json(
        { error: "Webhook signature invalid" },
        { status: 401 }
      );
    }

    const event: StreamPushEvent = JSON.parse(rawBody);

    console.log("Push web hook body: ", JSON.stringify(event));

    const sender = event.user;
    const recipientIds = event.channel.members
      .map((member) => member.user_id)
      .filter((id) => id !== sender.id);
    const channelId = event.channel.id;

    const recipientsResponse = await clerkClient.users.getUserList({
      userId: recipientIds,
    });

    const recipients = recipientsResponse.data.filter(
      (user) => !user.unsafeMetadata.mutedChannels?.includes(channelId)
    );

    const pushPromises = recipients
      .map((recipient) => {
        const subscriptions = recipient.privateMetadata.subscriptions || [];
        return subscriptions.map((subscription) =>
          webPush
            .sendNotification(
              subscription,
              JSON.stringify({
                title: sender.name,
                body: event.message.text,
                icon: sender.image,
                image:
                  event.message.attachments[0]?.image_url ||
                  event.message.attachments[0]?.thumb_url,
                channelId,
              }),
              {
                vapidDetails: {
                  subject: "mailto:varun.singh10011@gmail.com",
                  publicKey: 'BA_0tQ-TNw4TwMJ95U68ay8TiZNo5mR5AZMbAPJWMOin_rdkvoJ4xfxiruwkDCaitetpuXnqwld-z9pD0AEL3j8',
                  privateKey: 'weX9OcQBp59bzUcuqBxZ7qCnU3tTDRU-PS8umFQH42M',
                },
              }
            )
            .catch((error) => {
              console.error("Error sending push notification: ", error);
              if (error instanceof WebPushError && error.statusCode === 410) {
                console.log("Push subscription expired, deleting...");

                clerkClient.users.updateUser(recipient.id, {
                  privateMetadata: {
                    subscriptions:
                      recipient.privateMetadata.subscriptions?.filter(
                        (s) => s.endpoint !== subscription.endpoint
                      ),
                  },
                });
              }
            })
        );
      })
      .flat();

    await Promise.all(pushPromises);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}