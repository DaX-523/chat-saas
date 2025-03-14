"use client";

import { useState, useEffect, useMemo } from "react";
import ChatList from "./chat-list";
import ChatWindow from "./chat-window";
import GroupInfo from "./group-info";
import ResponsiveLayout from "./responsive-layout";
import LabelFilter from "./label-filter";
import type { Chat, Label, User } from "@/lib/types";
import { allLabels } from "@/lib/data";
import { useRealtimeMessages } from "@/hooks/useRealtimeMessages";
import UserProfileDropdown from "./user-profile-dropdown";
import { useAuth } from "@/context/auth-context";
import { useRealtimeReadReceipts } from "@/hooks/useRealtimeReadReceipts";
import NewChatModal from "./new-chat-modal";
import Image from "next/image";
import fetchChats from "@/hooks/useFetchChats";
import { createNewChat } from "@/services/newChat";
import { sendMessage } from "@/services/sendMessage";
import { addLabel } from "@/services/addLabel";
import { removeLabel } from "@/services/removeLabel";

export default function ChatInterface() {
  const { authState } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLabels, setSelectedLabels] = useState<Label[]>([]);
  const [showLabelFilter, setShowLabelFilter] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);

  // to stop unneccasry rerender on useeffect
  const currentUser = useMemo(
    () =>
      authState.user || {
        id: "user1",
        name: "You",
        avatar: "/placeholder.svg?height=48&width=48",
        isOnline: true,
        auth_id: "101",
      },
    [authState.user]
  );
  // Bonus implementations for the assignment (search and label filters)
  useEffect(() => {
    let result = chats;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((chat) => chat.name.toLowerCase().includes(query));
    }

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

  // realtime feature of supabase
  useRealtimeMessages(
    currentUser,
    chats,
    setChats,
    setFilteredChats,
    activeChat,
    setActiveChat
  );

  useRealtimeReadReceipts(
    chats,
    setChats,
    setFilteredChats,
    activeChat,
    setActiveChat
  );
  // fetch all chats of an user
  useEffect(() => {
    const fetchData = async () => {
      try {
        const populatedChats = await fetchChats(currentUser);
        if (populatedChats) {
          setChats(populatedChats);
          setFilteredChats(populatedChats);
          setActiveChat(populatedChats[0]);
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchData();
  }, [shouldRefetch, currentUser]);

  const handleNewChat = async (user: User) => {
    const response = await createNewChat(chats, user, currentUser);
    if (response) {
      const { updatedChats, newChat } = response;

      setShouldRefetch((prev) => !prev); // UI update

      setChats(updatedChats);
      setFilteredChats(updatedChats);
      setActiveChat({ ...newChat, messages: [] }); //populated array of msgs
      setIsModalOpen(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !activeChat) return;
    await sendMessage(content, currentUser, activeChat);
    setInputMessage("");
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

  const addLabelToChat = async (chat: Chat, label: Label) => {
    const response = await addLabel(chat, chats, label);
    if (response) {
      //success
      const updatedChats = response;
      setChats(updatedChats);
    }
  };

  const removeLabelFromChat = async (chat: Chat, labelId: string) => {
    const response = await removeLabel(chat, chats, labelId);
    if (response) {
      //success
      const updatedChats = response;
      setChats(updatedChats);
    }
  };

  const sidebarContent = (
    <>
      <header className="h-16 bg-[#f0f2f5] flex items-center px-4 border-b border-gray-200">
        {/* Modal */}
        {isModalOpen && (
          <NewChatModal
            setIsModalOpen={setIsModalOpen}
            currentUser={currentUser}
            onSelectUser={handleNewChat}
          />
        )}
        <div className="flex items-center space-x-4">
          <div className="relative w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
            <Image
              width={500}
              height={500}
              src={"/user-img.png"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h1 className="text-lg font-semibold">{currentUser.name}</h1>
          </div>
        </div>
        <div className="ml-auto items-center flex space-x-4">
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

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-1 py-0.5 md:px-2 md:py-2  bg-[#128C7E] text-white text-sm rounded-lg hover:bg-[#0e6d62] transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            New Chat
          </button>
          <UserProfileDropdown />
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
        setChats={setChats}
        setFilteredChats={setFilteredChats}
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
