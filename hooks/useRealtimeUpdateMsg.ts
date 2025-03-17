import { supabase } from "@/lib/supabase";
import { Chat, Message } from "@/lib/types";
import { useEffect } from "react";

export const useRealtimeUpdatedMessages = (
  chats: Chat[],
  setChats: (chats: Chat[]) => void,
  setFilteredChats: (chats: Chat[]) => void,
  setActiveChat: (chat: Chat | null) => void,
  activeChat: Chat | null
) => {
  useEffect(() => {
    const channel = supabase
      .channel("realtime:messages-update")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) => {
          const updatedMessage = payload.new as Message;

          const updatedChats = chats.map((chat) => {
            if (chat.id === updatedMessage.chatid) {
              const updatedMessages = chat.messages.map((msg) => {
                if (msg.id === updatedMessage.id) {
                  if (updatedMessage.isDeleted) {
                    return {
                      ...msg,
                      content: "This message was deleted",
                      isDeleted: true,
                    };
                  }
                  return {
                    ...msg,
                    content: updatedMessage.content,
                    isEdited: true,
                  };
                }
                return msg;
              });
              const isLastMessage =
                chat.messages.length > 0 &&
                chat.messages[chat.messages.length - 1].id ===
                  updatedMessage.id;
              if (updatedMessage.isDeleted) {
                return {
                  ...chat,
                  messages: updatedMessages,
                  lastMessage: isLastMessage
                    ? "This message was deleted"
                    : chat.lastMessage,
                };
              }
              return {
                ...chat,
                messages: updatedMessages,
                lastMessage: isLastMessage
                  ? updatedMessage.content
                  : chat.lastMessage,
              };
            }
            return chat;
          });
          setChats(updatedChats);
          setFilteredChats(updatedChats);

          if (activeChat && activeChat.id === updatedMessage.chatid) {
            setActiveChat(
              updatedChats.find((chat) => chat.id === activeChat.id) || null
            );
          }
        }
      )
      //not needed as we are not actually deleting but updating it with value isDeleted = true in db
      // .on(
      //   "postgres_changes",
      //   { event: "DELETE", schema: "public", table: "messages" },
      //   (payload) => {
      //     const deletedMessage = payload.old as Message;
      //     console.log(payload);
      //     const updatedChats = chats.map((chat) => {
      //       if (chat.id === deletedMessage.chatid) {
      //         const updatedMessages = chat.messages.map((msg) => {
      //           if (msg.id === deletedMessage.id) {
      //             return {
      //               ...msg,
      //               content: "This message was deleted",
      //               isDeleted: true,
      //             };
      //           }
      //           return msg;
      //         });
      //         const isLastMessage =
      //           chat.messages.length > 0 &&
      //           chat.messages[chat.messages.length - 1].id ===
      //             deletedMessage.id;
      //         return {
      //           ...chat,
      //           messages: updatedMessages,
      //           lastMessage: isLastMessage
      //             ? "This message was deleted"
      //             : chat.lastMessage,
      //         };
      //       }
      //       return chat;
      //     });
      //     setChats(updatedChats);
      //     setFilteredChats(updatedChats);
      //     if (activeChat && activeChat.id === deletedMessage.chatid) {
      //       setActiveChat(
      //         updatedChats.find((chat) => chat.id === activeChat.id) || null
      //       );
      //     }
      //   }
      // )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [chats, setChats, setFilteredChats, setActiveChat]);
};
