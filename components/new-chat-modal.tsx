"use client";
import { supabase } from "@/lib/supabase";
import { User } from "@/lib/types";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

interface NewChatModalProps {
  setIsModalOpen: (value: boolean) => void;
  currentUser: User;
  onSelectUser: (user: User) => void;
}

const NewChatModal = ({
  setIsModalOpen,
  currentUser,
  onSelectUser,
}: NewChatModalProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select()
        .neq("id", currentUser.id);
      if (error) {
        console.error("Error fetching users:", error);
        return;
      }
      setUsers(data);
    };
    fetchUsers();
  }, [currentUser.id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsModalOpen]);
  return (
    // fixed positioning (covers whole screen in DOM) thats why cant be used as ref for handle click outside
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-lg w-96 max-h-[80vh] overflow-hidden"
        ref={dropdownRef}
      >
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-[#128C7E]">
            Start New Chat
          </h2>
        </div>
        <div className="overflow-y-auto max-h-[60vh]">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => {
                onSelectUser(user);
                setIsModalOpen(false);
              }}
              className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="relative">
                <Image
                  width={500}
                  height={500}
                  src={"/user-img.png"}
                  alt={user.name}
                  className="w-12 h-12 rounded-full"
                />
                {user.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div>
                <h3 className="font-medium">{user.name}</h3>
                <p className="text-sm text-gray-500">
                  {user.isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setIsModalOpen(false)}
            className="w-full px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;
