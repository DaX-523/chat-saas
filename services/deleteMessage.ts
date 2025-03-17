import { supabase } from "@/lib/supabase";

export const deleteMessage = async (messageId: string) => {
  console.log(messageId);
  const { error } = await supabase
    .from("messages")
    .update({ isDeleted: true })
    .eq("id", messageId);
  if (error) {
    console.error("Error updating message:", error);
    return false;
  }
  return true;
};
