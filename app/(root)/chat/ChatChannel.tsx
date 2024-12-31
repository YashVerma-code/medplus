import {
  Channel,
  MessageInput,
  MessageList,
  Window,
} from "stream-chat-react";
import CustomChannelHeader from "./CustomChannelHeader";
  
  interface ChatChannelProps {
    show: boolean;
  }
  
  export default function ChatChannel({
    show,
  }: ChatChannelProps) {
    return (
      <div className={`h-full w-full ${show ? "block" : "hidden"}`}>
        <Channel>
          <Window>
            <CustomChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
        </Channel>
      </div>
    );
  }
  