"use client";

import type React from "react";

import type { Chat, User } from "@/lib/types";
import { formatTime } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

interface ChatWindowProps {
  chat: Chat;
  inputMessage: string;
  setInputMessage: (message: string) => void;
  onSendMessage: (content: string) => void;
  onToggleGroupInfo: () => void;
  currentUser: User;
}

export default function ChatWindow({
  chat,
  inputMessage,
  setInputMessage,
  onSendMessage,
  onToggleGroupInfo,
  currentUser,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage(inputMessage);
    }
  };

  // Group consecutive messages from the same sender
  const groupedMessages = chat.messages.reduce((acc, message, index, array) => {
    if (index === 0 || message.sender.id !== array[index - 1].sender.id) {
      acc.push([message]);
    } else {
      acc[acc.length - 1].push(message);
    }
    return acc;
  }, [] as (typeof chat.messages)[]);

  return (
    <>
      <header className="h-16 bg-[#f0f2f5] flex items-center px-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden mr-3">
            <img
              src={chat.isGroup ? "/default-group.png" : "/user-img.png"}
              alt={chat.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="font-medium">{chat.name}</h2>
            <p className="text-xs text-gray-500">
              {chat.isGroup
                ? `${chat.participants.length} participants`
                : chat.participants.find((p) => p.id !== currentUser.id)
                    ?.isOnline
                ? "Online"
                : "Last seen recently"}
            </p>
          </div>
        </div>
        <div className="ml-auto flex space-x-4">
          <button
            className="text-[#54656f]"
            aria-label="Search in conversation"
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
              className="lucide lucide-search"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
          {chat.isGroup && (
            <button
              className="text-[#54656f]"
              onClick={onToggleGroupInfo}
              aria-label="View group info"
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
                className="lucide lucide-users"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </button>
          )}
          <button className="text-[#54656f]" aria-label="More options">
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
              className="lucide lucide-more-vertical"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button>
        </div>
      </header>

      <section
        className="flex-1 overflow-y-auto p-4 bg-[#efeae2]"
        aria-label="Chat messages"
      >
        {groupedMessages.map((group, groupIndex) => (
          <article key={groupIndex} className="mb-4">
            <div
              className={`flex ${
                group[0].sender.id === currentUser.id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {group[0].sender.id !== currentUser.id && (
                <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden mr-2 flex-shrink-0">
                  <img
                    src={"/user-img.png"}
                    alt={group[0].sender.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="max-w-[70%]">
                {chat.isGroup && group[0].sender.id !== currentUser.id && (
                  <div
                    className="text-xs font-medium ml-1 mb-1"
                    style={{ color: "#128C7E" }}
                  >
                    {group[0].sender.name}
                  </div>
                )}
                {group.map((message, messageIndex) => (
                  <div
                    key={message.id}
                    className={`rounded-lg px-3 py-2 mb-1 ${
                      message.sender.id === currentUser.id
                        ? "bg-[#d9fdd3] text-black"
                        : "bg-white text-black"
                    } ${
                      messageIndex === 0
                        ? message.sender.id === currentUser.id
                          ? "rounded-tr-none"
                          : "rounded-tl-none"
                        : ""
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <time
                        className="text-[10px] text-gray-500"
                        dateTime={message.timestamp}
                      >
                        {formatTime(message.timestamp)}
                      </time>
                      {message.sender.id === currentUser.id && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`${
                            message.message_status?.some(
                              (status) =>
                                status.userid !== currentUser.id &&
                                status.status === "read"
                            )
                              ? "stroke-[#53bdeb]" // Blue ticks for read
                              : "stroke-gray-500" // Gray ticks for delivered
                          }`}
                        >
                          <path d="m1 13 4 4L15 7" />
                          <path d="m8 13 4 4L22 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
        <div ref={messagesEndRef} />
      </section>

      <footer className="h-16 bg-[#f0f2f5] flex items-center px-4 py-2">
        <button className="text-[#54656f] mx-2" aria-label="Insert emoji">
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
            className="lucide lucide-smile"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" x2="9.01" y1="9" y2="9" />
            <line x1="15" x2="15.01" y1="9" y2="9" />
          </svg>
        </button>
        <button className="text-[#54656f] mx-2" aria-label="Attach file">
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
            className="lucide lucide-paperclip"
          >
            <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
        </button>
        <div className="flex-1 mx-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message"
            className="w-full px-4 py-2 rounded-full focus:outline-none"
            aria-label="Message input"
          />
        </div>
        <button
          className="text-[#54656f] mx-2"
          onClick={() => onSendMessage(inputMessage)}
          aria-label="Send message"
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
            className="lucide lucide-send"
          >
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
          </svg>
        </button>
      </footer>
    </>
  );
}
