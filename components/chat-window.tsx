"use client";

import type React from "react";

import type { Chat, User, Message } from "@/lib/types";
import { formatTime } from "@/lib/utils";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import EditMessageModal from "./edit-message-modal";
import DeleteMessageModal from "./delete-message-modal";

interface ChatWindowProps {
  chat: Chat;
  inputMessage: string;
  setInputMessage: (message: string) => void;
  onSendMessage: ({
    content,
    replyId,
  }: {
    content: string;
    replyId: string | undefined;
  }) => void;
  // onSendMessage: (content: string) => void;
  onEditMessage: (content: string, messageId: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onToggleGroupInfo: () => void;
  currentUser: User;
  editMessage: string;
  setEditMessage: (messageId: string) => void;
}

export default function ChatWindow({
  chat,
  inputMessage,
  setInputMessage,
  onSendMessage,
  onEditMessage,
  onToggleGroupInfo,
  onDeleteMessage,
  currentUser,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [replyingTo, setReplyingTo] = useState<{
    id: string;
    content: string;
    sender: User;
  } | null>(null);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [messageToEdit, setMessageToEdit] = useState({ id: "", content: "" });
  const [messageToDelete, setMessageToDelete] = useState("");
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setInputMessage("");

      onSendMessage({ content: inputMessage, replyId: replyingTo?.id });
      setReplyingTo(null);
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
        {isEditing && (
          <EditMessageModal
            isOpen={isEditing}
            onSave={(newUpdatedMessage) =>
              onEditMessage(newUpdatedMessage, messageToEdit.id)
            }
            onClose={() => setIsEditing(false)}
            initialMessage={messageToEdit.content}
          />
        )}
        {isDeleting && (
          <DeleteMessageModal
            isOpen={isDeleting}
            onClose={() => setIsDeleting(false)}
            onDelete={() => onDeleteMessage(messageToDelete)}
          />
        )}
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden mr-3">
            <Image
              width={500}
              height={500}
              src={chat.isGroup ? "/default-group.png" : "/user-img.png"}
              alt={chat.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="font-medium">
              {chat.participants.find((p) => p.id !== currentUser.id)?.name}
            </h2>
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
        <div className="ml-auto items-center flex space-x-4">
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
                  <Image
                    width={500}
                    height={500}
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
                    className={`flex gap-2 w-full ${
                      message.sender.id !== currentUser.id
                        ? "flex-row-reverse"
                        : "flex-row"
                    }`}
                  >
                    {!message.isDeleted ? (
                      <div className="flex items-center flex-row-reverse">
                        <span
                          className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 mr-2"
                          onClick={() =>
                            setReplyingTo({
                              id: message.id,
                              content: message.content,
                              sender: message.sender,
                            })
                          }
                        >
                          reply
                        </span>
                        <div className="flex items-center justify-center gap-2 flex-col">
                          {message.sender.id === currentUser.id && (
                            <button
                              className="cursor-pointer p-1 rounded-full hover:bg-gray-200 transition-colors"
                              onClick={() => {
                                setIsEditing(true);
                                setMessageToEdit({
                                  id: message.id,
                                  content: message.content,
                                });
                              }}
                              aria-label="Edit message"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-gray-500"
                              >
                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                <path d="m15 5 4 4" />
                              </svg>
                            </button>
                          )}
                          <button
                            className="cursor-pointer p-1 rounded-full hover:bg-gray-200 transition-colors"
                            onClick={() => {
                              setIsDeleting(true);
                              setMessageToDelete(message.id);
                            }}
                            aria-label="Delete message"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-gray-500"
                            >
                              <path d="M3 6h18" />
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                        <div
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
                          {/* Show the replied message if this message is a reply */}
                          {message.replyId && (
                            <div className="mb-1 p-1 bg-gray-100 rounded border-l-2 border-[#128C7E] text-xs">
                              <div className="font-medium text-[#128C7E]">
                                {chat.messages.find(
                                  (msg) => msg.id === message.replyId
                                )?.sender.name || "Unknown"}
                              </div>
                              <div className="text-gray-600 truncate">
                                {chat.messages.find(
                                  (msg) => msg.id === message.replyId
                                )?.content || "Message not found"}
                              </div>
                            </div>
                          )}
                          <p className="text-sm">{message.content}</p>
                          <div className="flex items-center justify-end gap-1 mt-1">
                            {message.isEdited && (
                              <span className="text-[8px] text-gray-400">
                                edited
                              </span>
                            )}
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
                      </div>
                    ) : (
                      <div
                        className={`rounded-lg px-3 py-2 mb-1 ${
                          message.sender.id !== currentUser.id
                            ? "bg-gray-100"
                            : "bg-[#d9fdd3]"
                        } text-gray-500 italic text-sm`}
                      >
                        This message was deleted
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
        <div ref={messagesEndRef} />
      </section>

      <footer className="bg-[#f0f2f5]">
        {replyingTo && (
          <div className="px-4 py-2 bg-white border-t border-l border-r border-gray-200 rounded-t-lg mx-2 mt-2 flex items-start">
            <div className="flex-1">
              <div className="flex items-center">
                <span className="text-xs font-medium text-[#128C7E]">
                  Replying to {replyingTo.sender.name}
                </span>
              </div>
              <p className="text-sm text-gray-600 truncate">
                {replyingTo.content}
              </p>
            </div>
            <button
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setReplyingTo(null)}
              aria-label="Cancel reply"
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
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}
        <div className="h-16 flex items-center px-4 py-2">
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
              placeholder={replyingTo ? "Type your reply..." : "Type a message"}
              className="w-full px-4 py-2 rounded-full focus:outline-none"
              aria-label="Message input"
            />
          </div>
          <button
            className="text-[#54656f] mx-2"
            onClick={handleSendMessage}
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
        </div>
      </footer>
    </>
  );
}
