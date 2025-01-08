import DisappearingMessage from "@/components/shared/DisappearingMessage";
import {
  getCurrentPushSubscription,
  registerPushNotifications,
  unregisterPushNotifications,
} from "@/notifications/pushService";
import { UserButton } from "@clerk/nextjs";
import { BellOff, BellRing, UserSearch } from "lucide-react";
import { useEffect, useState } from "react";
import { LoadingIndicator } from "stream-chat-react";

interface MenuBarProps {
  onUserMenuClick: () => void;
}

export default function MenuBar({ onUserMenuClick }: MenuBarProps) {

  return (
    <div className="flex items-center justify-between gap-3 border-e border-e-[#DBDDE1] bg-white p-3.5 -translate-y-1 dark:border-e-gray-800 dark:bg-[#17191c]">
      <UserButton
        afterSignOutUrl="/"
      />
      <div className="flex gap-6">
        <PushSubscriptionToggleButton  />
        <span title="Show users">
          <UserSearch className="cursor-pointer rounded-full bg-cyan-400 bg-opacity-70 w-8 h-8 p-1 hover:bg-lblue transition-all" onClick={onUserMenuClick} />
        </span>
      </div>
    </div>
  );
}

function PushSubscriptionToggleButton() {
  const [hasActivePushSubscription, setHasActivePushSubscription] =
    useState<boolean>();

  const [loading, setLoading] = useState(false);

  const [confirmationMessage, setConfirmationMessage] = useState<string>();

  useEffect(() => {
    async function getActivePushSubscription() {
      const subscription = await getCurrentPushSubscription();
      setHasActivePushSubscription(!!subscription);
    }
    getActivePushSubscription();
  }, []);

  async function setPushNotificationsEnabled(enabled: boolean) {
    if (loading) return;
    setLoading(true);
    setConfirmationMessage(undefined);

    try {
      if (enabled) {
        await registerPushNotifications();
      } else {
        await unregisterPushNotifications();
      }
      setConfirmationMessage(
        "Push notifications " + (enabled ? "enabled" : "disabled")
      );
      setHasActivePushSubscription(enabled);
    } catch (error) {
      console.error(error);
      if (enabled && Notification.permission === "denied") {
        alert("Please enable push notifications in your browser settings");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (hasActivePushSubscription === undefined) return null;

  return (
    <div className="relative">
      {loading && (
        <span className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <LoadingIndicator />
        </span>
      )}
      {confirmationMessage && (
        <DisappearingMessage className="absolute left-1/2 top-8 z-10 -translate-x-1/2 rounded-lg bg-white px-2 py-1 shadow-md dark:bg-black">
          {confirmationMessage}
        </DisappearingMessage>
      )}
      {hasActivePushSubscription ? (
        <span title="Disable push notifications on this device">
          <BellRing
            onClick={() => setPushNotificationsEnabled(false)}
            className={`cursor-pointer ${loading ? "opacity-10" : ""} rounded-full bg-cyan-400 bg-opacity-70 w-8 h-8 p-1 hover:bg-lblue transition-all`}
          />
        </span>
      ) : (
        <span title="Enable push notifications on this device">
          <BellOff
            onClick={() => setPushNotificationsEnabled(true)}
            className={`cursor-pointer ${loading ? "opacity-10" : ""} rounded-full bg-cyan-400 bg-opacity-70 w-8 h-8 p-1 hover:bg-lblue transition-all`}
          />
        </span>
      )}
    </div>
  );
}