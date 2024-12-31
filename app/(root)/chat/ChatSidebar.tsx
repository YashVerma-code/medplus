import { UserResource } from "@clerk/types";
import { useCallback, useEffect, useState } from "react";
import {
  ChannelList,
  ChannelPreviewMessenger,
  ChannelPreviewUIComponentProps,
} from "stream-chat-react";
import MenuBar from "./MenuBar";
import UsersMenu from "./UsersMenu";
import useGlobalStore from "@/zustand/useProps";

interface ChatSidebarProps {
  user: UserResource;
  show: boolean;
  onClose: () => void;
  customActiveChannel?: string;
}

export default function ChatSidebar({
  user,
  show,
  onClose,
  customActiveChannel,
}: ChatSidebarProps) {
  const { role } = useGlobalStore();

  const [usersMenuOpen, setUsersMenuOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!show) setUsersMenuOpen(false);
  }, [show]);

  useEffect(() => {
    setRefreshKey((prevKey) => prevKey + 1);
  }, [user.id]);

  const ChannelPreviewCustom = useCallback(
    (props: ChannelPreviewUIComponentProps) => (
      <ChannelPreviewMessenger
        {...props}
        onSelect={() => {
          props.setActiveChannel?.(props.channel, props.watchers);
          onClose();
        }}
      />
    ),
    [onClose]
  );

  return (
    <div
      className={`relative h-full w-full flex-col md:max-w-[360px] border-1.5 border-l-gray-300 ${
        show ? "flex" : "hidden"
      }`}
    >
      {usersMenuOpen && (
        <UsersMenu
          loggedInUser={user}
          onClose={() => setUsersMenuOpen(false)}
          onChannelSelected={() => {
            setUsersMenuOpen(false);
            onClose();
          }}
        />
      )}
      <MenuBar onUserMenuClick={() => setUsersMenuOpen(true)} />
      <span className="absolute top-3 left-14 text-xl font-Poppins text-gray-800 dark:text-white">
        Find {role === "doctor" ? "Patients" : "Doctors"}
      </span>
      <ChannelList
        key={refreshKey}
        filters={{
          type: "messaging",
          members: { $in: [user.id] },
        }}
        sort={{ last_message_at: -1 }}
        options={{ state: true, presence: true, limit: 10 }}
        customActiveChannel={customActiveChannel}
        showChannelSearch
        additionalChannelSearchProps={{
          searchForChannels: true,
          searchQueryParams: {
            channelFilters: {
              filters: { members: { $in: [user.id] } },
            },
          },
        }}
        Preview={ChannelPreviewCustom}
      />
    </div>
  );
}