"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Chat } from "@/lib/types"

interface ResponsiveLayoutProps {
  sidebarContent: React.ReactNode
  mainContent: React.ReactNode
  infoContent?: React.ReactNode
  activeChat: Chat | null
  showInfo: boolean
}

export default function ResponsiveLayout({
  sidebarContent,
  mainContent,
  infoContent,
  activeChat,
  showInfo,
}: ResponsiveLayoutProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  useEffect(() => {
    if (isMobile && activeChat) {
      setShowSidebar(false)
    } else if (!isMobile) {
      setShowSidebar(true)
    }
  }, [isMobile, activeChat])

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <nav
        className={`${isMobile ? (showSidebar ? "w-full" : "hidden") : "w-1/3"} border-r border-gray-200 bg-white`}
        aria-label="Chat navigation"
      >
        {sidebarContent}
      </nav>

      {/* Main Content */}
      <main
        className={`${
          isMobile ? (!showSidebar ? "w-full" : "hidden") : showInfo ? "w-1/3" : "w-2/3"
        } flex flex-col relative`}
      >
        {isMobile && !showSidebar && (
          <button
            className="absolute top-4 left-4 z-10 text-[#54656f]"
            onClick={() => setShowSidebar(true)}
            aria-label="Back to chat list"
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
              className="lucide lucide-arrow-left"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
          </button>
        )}
        {mainContent}
      </main>

      {/* Info Panel */}
      {showInfo && infoContent && (
        <aside
          className={`${isMobile ? "w-full absolute inset-0 z-20" : "w-1/3"} border-l border-gray-200 bg-white`}
          aria-label="Group information"
        >
          {infoContent}
        </aside>
      )}
    </div>
  )
}

