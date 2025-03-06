import { supabase } from "@/lib/supabase";
import { Chat, Message, User } from "@/lib/types";

export const sendMessage = async (
  content: string,
  currentUser: User,
  activeChat: Chat
) => {
  const msgTime = new Date()
    .toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .replace(",", "");
  const newMessage: Message = {
    id: Date.now().toString(),
    content,
    sender: currentUser,
    timestamp: msgTime,
    chatid: activeChat.id,
  };

  const response = await supabase.from("messages").insert(newMessage).select();

  if (response.error) {
    console.error("Error sending message:", response.error);
    return;
  }
  if (response.status === 201) {
    const recipients = activeChat.participants.filter(
      (p) => p.id !== currentUser.id
    );

    const messageStatusEntries = recipients.map((recipient) => ({
      id: Date.now().toString() + recipient.id,

      messageid: newMessage.id,
      userid: recipient.id,
      chatid: activeChat.id,
      status: "delivered",
      updated_at: msgTime,
    }));

    // Insert message status entries for both sender and the receiver user for read receipts
    const statusResponse = await supabase
      .from("message_status")
      .insert(messageStatusEntries);

    if (statusResponse.error) {
      console.error("Error creating message status:", statusResponse.error);
      return;
    }

    const chatUpdateResponse = await supabase
      .from("chats")
      .update({ lastMessage: content, lastMessageTime: msgTime })
      .eq("id", activeChat.id);
    console.log(chatUpdateResponse);
    if (chatUpdateResponse.error) {
      console.error("Error updating chat:", chatUpdateResponse.error);
    }
  }
};
