"use client";

import type React from "react";

import { useState } from "react";
import type { Chat, Label } from "@/lib/types";
import { formatTime } from "@/lib/utils";

interface ChatListProps {
  chats: Chat[];
  activeChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
  onAddLabel: (chat: Chat, label: Label) => void;
  onRemoveLabel: (chat: Chat, labelId: string) => void;
  allLabels: Label[];
}

export default function ChatList({
  chats,
  activeChat,
  onSelectChat,
  onAddLabel,
  onRemoveLabel,
  allLabels,
}: ChatListProps) {
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    chatId: string;
  }>({
    visible: false,
    x: 0,
    y: 0,
    chatId: "",
  });

  const handleContextMenu = (e: React.MouseEvent, chat: Chat) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      chatId: chat.id,
    });
  };

  const closeContextMenu = () => {
    setContextMenu({
      ...contextMenu,
      visible: false,
    });
  };

  const handleAddLabel = (chat: Chat, label: Label) => {
    onAddLabel(chat, label);
    closeContextMenu();
  };

  const handleRemoveLabel = (chat: Chat, labelId: string) => {
    onRemoveLabel(chat, labelId);
    closeContextMenu();
  };

  // Close context menu when clicking outside
  const handleOutsideClick = () => {
    if (contextMenu.visible) {
      closeContextMenu();
    }
  };

  return (
    <section
      className="overflow-y-auto relative h-[calc(100%-120px)]"
      onClick={handleOutsideClick}
      aria-label="Chat list"
    >
      {chats.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          No chats match your filters
        </div>
      ) : (
        chats.map((chat) => (
          <article
            key={chat.id}
            className={`flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
              activeChat?.id === chat.id ? "bg-[#f0f2f5]" : ""
            }`}
            onClick={() => onSelectChat(chat)}
            onContextMenu={(e) => handleContextMenu(e, chat)}
            aria-selected={activeChat?.id === chat.id}
          >
            <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden mr-3 flex-shrink-0">
              <img
                src={chat.avatar || `/placeholder.svg?height=48&width=48`}
                alt={chat.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h3 className="text-base font-medium text-gray-900 truncate">
                  {chat.name}
                  {chat.isGroup && (
                    <span className="ml-2 text-xs bg-[#25D366] text-white px-1.5 py-0.5 rounded-full">
                      Group
                    </span>
                  )}
                </h3>
                <span className="text-xs text-gray-500">
                  {chat.lastMessageTime ? formatTime(chat.lastMessageTime) : ""}
                </span>
              </div>
              <div className="flex items-center">
                <p className="text-sm text-gray-500 truncate">
                  {chat.isGroup && chat.lastMessage && chat.messages.length > 0
                    ? `${
                        chat.messages[
                          chat.messages.length - 1
                        ].sender.name.split(" ")[0]
                      }: ${chat.lastMessage}`
                    : chat.lastMessage || "Start a conversation"}
                </p>
              </div>
              {chat.labels && chat.labels.length > 0 && (
                <div className="flex flex-wrap mt-1 gap-1">
                  {chat.labels.map((label) => (
                    <span
                      key={label.id}
                      className="inline-block px-1.5 py-0.5 rounded-full text-[10px] font-medium"
                      style={{
                        backgroundColor: `${label.color}20`,
                        color: label.color,
                      }}
                    >
                      {label.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))
      )}

      {contextMenu.visible && (
        <div
          className="fixed bg-white rounded-lg shadow-lg z-50 w-48 py-1"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-b">
            Manage Labels
          </div>

          {allLabels.map((label) => {
            const chat = chats.find((c) => c.id === contextMenu.chatId);
            const hasLabel = chat?.labels?.some((l) => l.id === label.id);

            return (
              <button
                key={label.id}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                onClick={() => {
                  if (chat) {
                    if (hasLabel) {
                      handleRemoveLabel(chat, label.id);
                    } else {
                      handleAddLabel(chat, label);
                    }
                  }
                }}
              >
                <span
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: label.color }}
                ></span>
                {label.name}
                {hasLabel && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-check ml-auto"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
      {/* new chat button */}
      {/* <button
        className="sticky bottom-6 right-6 bg-[#25D366] text-white rounded-full p-3 shadow-lg hover:bg-[#128C7E] transition-colors z-50"
        aria-label="Start new chat"
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
          className="lucide lucide-message-square-plus"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <line x1="9" x2="15" y1="10" y2="10" />
          <line x1="12" x2="12" y1="7" y2="13" />
        </svg>
      </button> */}
    </section>
  );
}
