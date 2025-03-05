"use client";

import { useState, useEffect } from "react";
import ChatList from "./chat-list";
import ChatWindow from "./chat-window";
import GroupInfo from "./group-info";
import ResponsiveLayout from "./responsive-layout";
import LabelFilter from "./label-filter";
import type { Chat, Message, Label } from "@/lib/types";
import { initialChats, allLabels } from "@/lib/data";
import { currentUser } from "@/lib/data";
import { supabase } from "@/lib/supabase";

export default function ChatInterface() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLabels, setSelectedLabels] = useState<Label[]>([]);
  const [showLabelFilter, setShowLabelFilter] = useState(false);

  // Filter chats based on search query and selected labels
  useEffect(() => {
    let result = chats;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((chat) => chat.name.toLowerCase().includes(query));
    }

    // Filter by selected labels
    if (selectedLabels.length > 0) {
      result = result.filter(
        (chat) =>
          chat.labels &&
          selectedLabels.every((label) =>
            chat.labels?.some((chatLabel) => chatLabel.id === label.id)
          )
      );
    }

    setFilteredChats(result);
  }, [chats, searchQuery, selectedLabels]);

  const fetchChats = async () => {
    // First fetch chats with basic info
    const chatsResponse = await supabase.from("chats").select();

    if (chatsResponse.error) {
      console.error("Error fetching chats:", chatsResponse.error);
      return;
    }

    if (chatsResponse.data) {
      // Fetch messages for all chats in a single query using a join
      const messagesResponse = await supabase
        .from("messages")
        .select("*")
        .in(
          "chatid",
          chatsResponse.data.map((chat) => chat.id)
        );

      if (messagesResponse.error) {
        console.error("Error fetching messages:", messagesResponse.error);
        return;
      }

      // Combine chats with their messages
      const populatedChats = chatsResponse.data.map((chat) => ({
        ...chat,
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
        messages:
          messagesResponse.data?.filter((msg) => msg.chatid === chat.id) || [],
      }));

      setChats(populatedChats);
      setFilteredChats(populatedChats);
      setActiveChat(populatedChats[0]);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !activeChat) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: currentUser,
      timestamp: new Date()
        .toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
        .replace(",", ""),
      chatid: activeChat.id,
    };

    const response = await supabase
      .from("messages")
      .insert(newMessage)
      .select();

    if (response.error) {
      console.error("Error sending message:", response.error);
      return;
    }
    if (response.status === 201) {
      const updatedChats = chats.map((chat) => {
        if (chat.id === activeChat.id) {
          return {
            ...chat,
            messages: [...chat.messages, response.data[0]],
            lastMessage: content,
            lastMessageTime: new Date().toISOString(),
          };
        }
        return chat;
      });

      setChats(updatedChats);
      setActiveChat(
        updatedChats.find((chat) => chat.id === activeChat.id) || null
      );
      setInputMessage("");
    }
  };

  const toggleGroupInfo = () => {
    setShowGroupInfo(!showGroupInfo);
  };

  const toggleLabelFilter = () => {
    setShowLabelFilter(!showLabelFilter);
  };

  const handleLabelSelect = (label: Label) => {
    if (selectedLabels.some((l) => l.id === label.id)) {
      setSelectedLabels(selectedLabels.filter((l) => l.id !== label.id));
    } else {
      setSelectedLabels([...selectedLabels, label]);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedLabels([]);
  };

  const addLabelToChat = (chat: Chat, label: Label) => {
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

    setChats(updatedChats);
  };

  const removeLabelFromChat = (chat: Chat, labelId: string) => {
    const updatedChats = chats.map((c) => {
      if (c.id === chat.id && c.labels) {
        return {
          ...c,
          labels: c.labels.filter((l) => l.id !== labelId),
        };
      }
      return c;
    });

    setChats(updatedChats);
  };

  const sidebarContent = (
    <>
      <header className="h-16 bg-[#f0f2f5] flex items-center px-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
            <img
              src={currentUser.avatar || "/placeholder.svg"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-lg font-semibold">Chats</h1>
        </div>
        <div className="ml-auto flex space-x-4">
          <button
            className="text-[#54656f]"
            onClick={toggleLabelFilter}
            aria-label="Filter by labels"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-tag"
            >
              <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
              <path d="M7 7h.01" />
            </svg>
          </button>
          <button className="text-[#54656f]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-refresh-cw"
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M3 21v-5h5" />
            </svg>
          </button>
          <button className="text-[#54656f]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-message-square"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>
          <button className="text-[#54656f]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-more-vertical"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button>
        </div>
      </header>

      {showLabelFilter && (
        <LabelFilter
          labels={allLabels}
          selectedLabels={selectedLabels}
          onSelectLabel={handleLabelSelect}
          onClose={() => setShowLabelFilter(false)}
        />
      )}

      <div className="p-2">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-search text-gray-500"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search or start new chat"
            className="pl-10 pr-4 py-2 w-full rounded-lg bg-[#f0f2f5] focus:outline-none"
            aria-label="Search chats"
          />
          {(searchQuery || selectedLabels.length > 0) && (
            <button
              onClick={clearFilters}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              aria-label="Clear filters"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-x"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
      </div>

      {selectedLabels.length > 0 && (
        <div className="px-2 pb-2 flex flex-wrap gap-1">
          {selectedLabels.map((label) => (
            <span
              key={label.id}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${label.color}20`,
                color: label.color,
              }}
            >
              {label.name}
              <button
                onClick={() => handleLabelSelect(label)}
                className="ml-1 focus:outline-none"
                aria-label={`Remove ${label.name} filter`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-x"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      <ChatList
        chats={filteredChats}
        activeChat={activeChat}
        onSelectChat={(chat) => {
          setActiveChat(chat);
          setShowGroupInfo(false);
        }}
        onAddLabel={addLabelToChat}
        onRemoveLabel={removeLabelFromChat}
        allLabels={allLabels}
      />
    </>
  );

  const mainContent = activeChat ? (
    <ChatWindow
      chat={activeChat}
      inputMessage={inputMessage}
      setInputMessage={setInputMessage}
      onSendMessage={handleSendMessage}
      onToggleGroupInfo={toggleGroupInfo}
      currentUser={currentUser}
    />
  ) : (
    <section className="flex-1 flex items-center justify-center bg-[#f0f2f5]">
      <div className="text-center">
        <h2 className="text-2xl font-light text-gray-600 mb-2">
          Select a chat to start messaging
        </h2>
        <p className="text-gray-500">Or start a new conversation</p>
      </div>
    </section>
  );

  const infoContent =
    activeChat && activeChat.isGroup ? (
      <GroupInfo chat={activeChat} onClose={() => setShowGroupInfo(false)} />
    ) : null;

  return (
    <ResponsiveLayout
      sidebarContent={sidebarContent}
      mainContent={mainContent}
      infoContent={infoContent}
      activeChat={activeChat}
      showInfo={showGroupInfo}
    />
  );
}
