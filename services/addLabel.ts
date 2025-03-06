import { supabase } from "@/lib/supabase";
import { Chat, Label } from "@/lib/types";

export const addLabel = async (
  chat: Chat,
  chats: Chat[],
  label: Label
): Promise<Chat[] | void> => {
  chat.labels?.push(label);
  const updatedLabels = chat?.labels?.map((label) => label.name);
  const response = await supabase
    .from("chats")
    .update({
      labels: updatedLabels,
    })
    .eq("id", chat.id);
  if (response.error) {
    console.error("Error adding label");
    return;
  }
  if (response.status === 204) {
    const updatedChats = chats.map((c) => {
      if (c.id === chat.id) {
        const existingLabels = c.labels || [];
        if (!existingLabels.some((l) => l.id === label.id)) {
          return {
            ...c,
            labels: [...existingLabels, label],
          };
        }
      }
      return c;
    });
    return updatedChats;
  }
};
