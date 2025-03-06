import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Chat, Message } from "@/lib/types";
import { currentUser } from "@/lib/data";

export const useRealtimeMessages = (
  chats: Chat[],
  setChats: (chats: Chat[]) => void,
  setFilteredChats: (chats: Chat[]) => void,
  activeChat: Chat | null,
  setActiveChat: (chats: Chat | null) => void
) => {
  useEffect(() => {
    const channel = supabase
      .channel("realtime:messages")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        async (payload) => {
          const newMessage = payload.new as Message;
          // console.log(payload);
          // Find the chat this message belongs to
          const updatedChats = chats.map((chat) => {
            if (chat.id === newMessage.chatid) {
              // Increment unread count if message is from someone else
              const unreadCount =
                newMessage.sender.id !== currentUser.id
                  ? (chat.unreadCount || 0) + 1
                  : chat.unreadCount;

              return {
                ...chat,
                messages: [...chat.messages, newMessage],
                lastMessage: newMessage.content,
                lastMessageTime: newMessage.timestamp,
                unreadCount,
              };
            }
            return chat;
          });

          setChats(updatedChats);
          setFilteredChats(updatedChats);

          if (activeChat && activeChat.id === newMessage.chatid) {
            setActiveChat(
              updatedChats.find((chat) => chat.id === activeChat.id) || null
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chats, setChats, setFilteredChats]);
};
