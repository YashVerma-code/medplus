"use client";

import useWindowSize from "@/hooks/useWindowSize";
import {
  getCurrentPushSubscription,
  sendPushSubscriptionToServer,
} from "@/notifications/pushService";
import { registerServiceWorker } from "@/utils/serviceWorker";
import { mdBreakpoint } from "@/utils/tailwind";
import { useUser } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Chat, LoadingIndicator, Streami18n } from "stream-chat-react";
import ChatChannel from "./ChatChannel";
import ChatSidebar from "./ChatSidebar";
import PushMessageListener from "./PushMessageListener";
import useInitializeChatClient from "./useInitializeChatClient";

interface ChatPageProps {
  searchParams: { channelId?: string };
}

const i18Instance = new Streami18n({ language: "en" });

export default function ChatPage({
  searchParams: { channelId },
}: ChatPageProps) {
  const chatClient = useInitializeChatClient();
  const { user } = useUser();
  console.log("user", user);
  const [chatSidebarOpen, setChatSidebarOpen] = useState(false);

  const windowSize = useWindowSize();
  const isLargeScreen = windowSize.width >= mdBreakpoint;

  useEffect(() => {
    if (windowSize.width >= mdBreakpoint) setChatSidebarOpen(false);
  }, [windowSize.width]);

  useEffect(() => {
    async function setUpServiceWorker() {
      try {
        await registerServiceWorker();
      } catch (error) {
        console.error(error);
      }
    }
    setUpServiceWorker();
  }, []);

  useEffect(() => {
    async function syncPushSubscription() {
      try {
        const subscription = await getCurrentPushSubscription();
        if (subscription) {
          await sendPushSubscriptionToServer(subscription);
        }
      } catch (error) {
        console.error(error);
      }
    }
    syncPushSubscription();
  }, []);

  useEffect(() => {
    if (channelId) {
      window.location.reload();
    }
  }, [channelId]);

  useEffect(() => {
    return () => {
      if (chatClient) {
        chatClient.disconnectUser().catch((error) => console.error("Failed to disconnect user", error));
      }
    };
  }, [chatClient]);

  const handleSidebarOnClose = useCallback(() => {
    setChatSidebarOpen(false);
  }, []);

  if (!chatClient || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100 ">
        <LoadingIndicator size={40} />
      </div>
    );
  }

  return (
    <div className="lg:static absolute lg:h-screen h-[calc(100vh-64px)] w-full top-16 bg-gray-100 text-black">
      <div className="m-auto flex h-full min-w-[350px] max-w-[1600px] flex-col shadow-sm">
        <Chat
          client={chatClient}
          i18nInstance={i18Instance}
        >
          <div className="relative md:flex h-full md:flex-row overflow-y-auto border-l-2">
          <span className="absolute z-10 right-12 top-0.5 border-b border-b-[#DBDDE1] p-3 md:hidden">
            <button onClick={() => setChatSidebarOpen(!chatSidebarOpen)}>
              {!chatSidebarOpen ? (
                <Menu />
              ) : (
                <X className="-translate-x-16 -translate-y-1 bg-cyan-400 bg-opacity-65 hover:bg-lblue transition-all rounded-full p-1 w-8 h-8" />
              )}
            </button>
          </span>
            <ChatSidebar
              user={user}
              show={isLargeScreen || chatSidebarOpen}
              onClose={handleSidebarOnClose}
              customActiveChannel={channelId}
            />
            <ChatChannel
              show={isLargeScreen || !chatSidebarOpen}
            />
          </div>
          <PushMessageListener />
        </Chat>
      </div>
    </div>
  );
}