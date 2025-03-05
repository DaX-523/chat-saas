import type { Chat } from "@/lib/types";

interface GroupInfoProps {
  chat: Chat;
  onClose: () => void;
}

export default function GroupInfo({ chat, onClose }: GroupInfoProps) {
  return (
    <section className="h-full flex flex-col">
      <header className="h-16 bg-[#f0f2f5] flex items-center px-4 border-b border-gray-200">
        <button
          onClick={onClose}
          className="text-[#54656f] mr-4"
          aria-label="Close group info"
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
            className="lucide lucide-x"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <h2 className="font-medium">Group Info</h2>
      </header>

      <div className="p-4 flex flex-col items-center border-b border-gray-200">
        <div className="w-24 h-24 rounded-full bg-gray-300 overflow-hidden mb-4">
          <img
            src={"/default-group.png"}
            alt={chat.name}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-xl font-medium">{chat.name}</h3>
        <p className="text-sm text-gray-500 mt-1">
          Group · {chat.participants.length} participants
        </p>

        {chat.labels && chat.labels.length > 0 && (
          <div className="flex flex-wrap mt-2 gap-1 justify-center">
            {chat.labels.map((label) => (
              <span
                key={label.id}
                className="inline-block px-2 py-1 rounded-full text-xs font-medium"
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

      <div className="p-4 border-b border-gray-200">
        <h4 className="text-sm font-medium text-[#128C7E] mb-2">Description</h4>
        <p className="text-sm text-gray-700">
          {chat.description || "No description provided for this group."}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h4 className="text-sm font-medium text-[#128C7E] mb-2">
            {chat.participants.length} participants
          </h4>
          <ul className="divide-y divide-gray-100">
            {chat.participants.map((participant) => (
              <li key={participant.id} className="flex items-center py-2">
                <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden mr-3">
                  <img
                    src={"/user-img.png"}
                    alt={participant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">{participant.name}</p>
                  <p className="text-xs text-gray-500">
                    {participant.isOnline ? "Online" : "Last seen recently"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
