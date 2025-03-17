export interface User {
  id: string;
  name: string;
  avatar?: string;
  isOnline?: boolean;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Message {
  id: string;
  chatid: string;
  content: string;
  sender: User;
  timestamp: string;
  message_status?: MessageStatus[];
  replyId: string | undefined;
}

export interface MessageStatus {
  messageid: string;
  userid: string;
  chatid: string;
  status: "delivered" | "read";
  timestamp: string;
}

export interface Chat {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  isGroup: boolean;
  participants: User[];
  messages: Message[];
  description?: string;
  labels?: Label[];
  unreadCount?: number;
}
