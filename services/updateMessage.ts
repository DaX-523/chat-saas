import { supabase } from "@/lib/supabase";
import { Chat, User } from "@/lib/types";

export const updateMessage = async (
  content: string,
  activeChat: Chat,
  messageId: string
) => {
  console.log(content, activeChat, messageId);
  const { data, error } = await supabase
    .from("messages")
    .update({ content, isEdited: true, lastStatus: "delivered" })
    .eq("id", messageId)
    .eq("chatid", activeChat.id)
    .select()
    .single();
  if (error) {
    console.error("Error updating message:", error);
    return false;
  }
  console.log("Message updated:", data);
  return data;
};
