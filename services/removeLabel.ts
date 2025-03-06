import { allLabels } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { Chat } from "@/lib/types";

export const removeLabel = async (
  chat: Chat,
  chats: Chat[],
  labelId: string
): Promise<Chat[] | void> => {
  const labelToRemove = allLabels.find((l) => l.id === labelId)?.name;
  if (!labelToRemove) return;

  const updatedLabels = (chat.labels?.map((l) => l.name) || []).filter(
    (name) => name !== labelToRemove
  );

  const response = await supabase
    .from("chats")
    .update({
      labels: updatedLabels,
    })
    .eq("id", chat.id);

  if (response.error) {
    console.error("Error removing label:", response.error);
    return;
  }
  if (response.status === 204) {
    const updatedChats = chats.map((c) => {
      if (c.id === chat.id && c.labels) {
        return {
          ...c,
          labels: c.labels.filter((l) => l.id !== labelId),
        };
      }
      return c;
    });
    return updatedChats;
  }
};
