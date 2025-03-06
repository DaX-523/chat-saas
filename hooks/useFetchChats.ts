import { supabase } from "@/lib/supabase";
import { User } from "@/lib/types";

const useFetchChats = async (currentUser: User) => {
  // First fetch chats with basic info
  const chatsResponse = await supabase.from("chats").select();

  if (chatsResponse.error) {
    console.error("Error fetching chats:", chatsResponse.error);
    return;
  }

  if (chatsResponse.data) {
    const userChats = chatsResponse.data.filter((chat) =>
      chat.participants.some(
        (participant: User) => participant.id === currentUser.id
      )
    );
    console.log(userChats);
    // Fetch messages for all chats in a single query using a join
    const messagesResponse = await supabase
      .from("messages")
      .select(
        `*, message_status!inner (
          messageid,
          userid,
          status
        )`
      )
      .in(
        "chatid",
        userChats.map((chat) => chat.id)
      );

    if (messagesResponse.error) {
      console.error("Error fetching messages:", messagesResponse.error);
      return;
    }
    console.log(messagesResponse.data);

    // Combine chats with their messages
    const populatedChats = userChats.map((chat) => {
      const chatMessages =
        messagesResponse.data?.filter((msg) => msg.chatid === chat.id) || [];
      const unreadCount = chatMessages.filter(
        (msg) =>
          msg.sender.id !== currentUser.id &&
          msg.message_status.some(
            (status: any) =>
              status.userid === currentUser.id && status.status === "delivered"
          )
      ).length;

      return {
        ...chat,
        messages: chatMessages,
        unreadCount,
        labels: chat.labels.map((label: string) => {
          switch (label) {
            case "Work":
              return { id: "1", name: "Work", color: "#FF5722" };
            case "Family":
              return { id: "2", name: "Family", color: "#4CAF50" };
            case "Friends":
              return { id: "3", name: "Friends", color: "#2196F3" };
            case "Important":
              return { id: "4", name: "Important", color: "#F44336" };
            case "Personal":
              return { id: "5", name: "Personal", color: "#9C27B0" };
          }
        }),
      };
    });

    return populatedChats;
  }
};

export default useFetchChats;
