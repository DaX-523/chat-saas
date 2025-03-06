import { supabase } from "@/lib/supabase";
import { Chat, User } from "@/lib/types";

interface CreateNewChatResponse {
  updatedChats: Chat[];
  newChat: {
    id: string;
    name: string;
    isGroup: boolean;
    participants: User[];
    lastMessage: string;
    lastMessageTime: string;
  };
}

export const createNewChat = async (
  chats: Chat[],
  user: User,
  currentUser: User
): Promise<CreateNewChatResponse | void> => {
  const newChat = {
    id: Date.now().toString(),
    name: user.name,
    isGroup: false,
    participants: [currentUser, user],
    lastMessage: "",
    lastMessageTime: new Date().toISOString(),
  };

  const response = await supabase
    .from("chats")
    .insert({
      ...newChat,
      participants: [currentUser, user], // JSONB column
    })
    .select();

  if (response.error) {
    console.error("Error creating chat:", response.error);
    return;
  }

  // Update local state
  const updatedChats = chats.map((chat) => ({
    ...chat,
    messages: [],
  }));
  return { updatedChats, newChat };
};
