import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Chat, MessageStatus } from "@/lib/types";

export const useRealtimeReadReceipts = (
  chats: Chat[],
  setChats: (chats: Chat[]) => void,
  setFilteredChats: (chats: Chat[]) => void,
  activeChat: Chat | null,
  setActiveChat: (chats: Chat | null) => void
) => {
  useEffect(() => {
    const channel = supabase
      .channel("realtime:message_status")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "message_status" },
        async (payload) => {
          const updatedStatus = payload.new as MessageStatus;

          // if this is unreadable
          // here chats have populated messages array and inside the messages array
          // there is another array for messages_status thats why nested mapping (unoptimized)
          // TODO: better optimal approach for handling this scenario
          const updatedChats = chats.map((chat) => {
            const updatedMessages = chat.messages.map((message) => {
              if (message.id === updatedStatus.messageid) {
                // Update or add the new status
                const existingStatuses = message.message_status || [];
                const statusIndex = existingStatuses.findIndex(
                  (status) => status.userid === updatedStatus.userid
                );

                const newMessageStatuses =
                  statusIndex >= 0
                    ? existingStatuses.map((status, index) =>
                        index === statusIndex ? updatedStatus : status
                      )
                    : [...existingStatuses, updatedStatus];

                return {
                  ...message,
                  message_status: newMessageStatuses,
                };
              }
              return message;
            });

            return {
              ...chat,
              messages: updatedMessages,
            };
          });

          setChats(updatedChats);
          setFilteredChats(updatedChats);
          if (activeChat && activeChat.id === updatedStatus.chatid) {
            setActiveChat(
              updatedChats.find((chat) => chat.id === activeChat?.id) || null
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chats, setChats, setFilteredChats, setActiveChat]);
};
