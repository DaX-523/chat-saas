import type { Chat, User, Label } from "./types";

// Sample labels
export const allLabels: Label[] = [
  {
    id: "1",
    name: "Work",
    color: "#FF5722",
  },
  {
    id: "2",
    name: "Family",
    color: "#4CAF50",
  },
  {
    id: "3",
    name: "Friends",
    color: "#2196F3",
  },
  {
    id: "4",
    name: "Important",
    color: "#F44336",
  },
  {
    id: "5",
    name: "Personal",
    color: "#9C27B0",
  },
];

// Sample users
export const users: User[] = [
  {
    id: "1",
    name: "Alice",
    avatar: "/placeholder.svg?height=48&width=48",
    isOnline: true,
  },
  {
    id: "2",
    name: "John Doe",
    avatar: "/placeholder.svg?height=48&width=48",
    isOnline: true,
  },
  {
    id: "3",
    name: "Jane Smith",
    avatar: "/placeholder.svg?height=48&width=48",
    isOnline: false,
  },
  {
    id: "4",
    name: "Alex Johnson",
    avatar: "/placeholder.svg?height=48&width=48",
    isOnline: true,
  },
  {
    id: "5",
    name: "Sarah Williams",
    avatar: "/placeholder.svg?height=48&width=48",
    isOnline: false,
  },
];

// Current user
export const currentUser = users[0];

export const initialChats: Chat[] = [
  {
    id: "1",
    name: "Test El Centro",
    avatar: "/placeholder.svg?height=48&width=48",
    lastMessage: "Hello, Livnot!",
    lastMessageTime: "2023-05-03T10:30:00",
    isGroup: false,
    participants: [users[0], users[1]],
    labels: [allLabels[2], allLabels[4]],
    messages: [
      {
        id: "101",
        content: "Hello, South Euna!",
        sender: users[1],
        chatid: "2",
        timestamp: "2023-05-03T10:25:00",
      },
      {
        id: "102",
        content: "Hello, Livnot!",
        sender: users[1],
        chatid: "2",
        timestamp: "2023-05-03T10:30:00",
      },
    ],
  },
  {
    id: "2",
    name: "Periskope Team Chat",
    avatar: "/placeholder.svg?height=48&width=48",
    lastMessage: "Great! I'll prepare the presentation for tomorrow's meeting.",
    lastMessageTime: "2023-05-02T15:45:00",
    isGroup: true,
    description:
      "Official team chat for the Periskope project. Share updates, ask questions, and collaborate with the team.",
    participants: [users[0], users[1], users[2], users[3]],
    labels: [allLabels[0]],
    messages: [
      {
        id: "201",
        content: "Hi team, how's the project going?",
        sender: users[1],
        chatid: "2",
        timestamp: "2023-05-02T15:40:00",
      },
      {
        id: "202",
        content:
          "We're making good progress. The design phase is almost complete.",
        sender: users[2],
        chatid: "2",
        timestamp: "2023-05-02T15:42:00",
      },
      {
        id: "203",
        content: "Great! I'll prepare the presentation for tomorrow's meeting.",
        sender: users[3],
        chatid: "2",
        timestamp: "2023-05-02T15:45:00",
      },
    ],
  },
  {
    id: "3",
    name: "Test Skype Final 5",
    avatar: "/placeholder.svg?height=48&width=48",
    lastMessage: "This doesn't go on Tuesday...",
    lastMessageTime: "2023-05-01T09:15:00",
    isGroup: false,
    participants: [users[0], users[4]],
    labels: [allLabels[3]],
    messages: [
      {
        id: "301",
        content: "This doesn't go on Tuesday...",
        sender: users[4],
        chatid: "2",
        timestamp: "2023-05-01T09:15:00",
      },
    ],
  },
  {
    id: "4",
    name: "Testing group",
    avatar: "/placeholder.svg?height=48&width=48",
    lastMessage: "Testing 12345",
    lastMessageTime: "2023-04-29T11:10:00",
    isGroup: true,
    description:
      "A group for testing new features and functionality. Feel free to experiment here.",
    participants: [users[0], users[1], users[2], users[3], users[4], users[5]],
    labels: [allLabels[0], allLabels[3]],
    messages: [
      {
        id: "501",
        content: "Welcome to the testing group!",
        sender: users[1],
        chatid: "2",
        timestamp: "2023-04-29T11:05:00",
      },
      {
        id: "502",
        content: "Thanks for adding me!",
        sender: users[2],
        chatid: "2",
        timestamp: "2023-04-29T11:07:00",
      },
      {
        id: "503",
        content: "Hello everyone!",
        sender: users[3],
        chatid: "2",
        timestamp: "2023-04-29T11:08:00",
      },
      {
        id: "504",
        content: "Testing 12345",
        sender: users[4],
        chatid: "2",
        timestamp: "2023-04-29T11:10:00",
      },
    ],
  },
  {
    id: "5",
    name: "Project Brainstorming",
    avatar: "/placeholder.svg?height=48&width=48",
    lastMessage: "Let's schedule a call to discuss this further",
    lastMessageTime: "2023-04-28T16:30:00",
    isGroup: true,
    description:
      "A space for brainstorming ideas for our upcoming projects. Share your thoughts and inspirations.",
    participants: [users[0], users[2], users[5]],
    labels: [allLabels[0], allLabels[1]],
    messages: [
      {
        id: "601",
        content: "I have some ideas for the new project",
        sender: users[2],
        chatid: "2",
        timestamp: "2023-04-28T16:25:00",
      },
      {
        id: "602",
        content: "That sounds interesting. Can you share more details?",
        sender: users[5],
        chatid: "2",
        timestamp: "2023-04-28T16:28:00",
      },
      {
        id: "603",
        content: "Let's schedule a call to discuss this further",
        sender: users[2],
        chatid: "2",
        timestamp: "2023-04-28T16:30:00",
      },
    ],
  },
  {
    id: "6",
    name: "Project Brainstorming34",
    avatar: "/placeholder.svg?height=48&width=48",
    lastMessage: "Let's schedule a call to discuss this further",
    lastMessageTime: "2023-04-28T16:30:00",
    isGroup: true,
    description:
      "A space for brainstorming ideas for our upcoming projects. Share your thoughts and inspirations.",
    participants: [users[0], users[2], users[5]],
    labels: [allLabels[0], allLabels[1]],
    messages: [
      {
        id: "601",
        content: "I have some ideas for the new project",
        sender: users[2],
        chatid: "2",
        timestamp: "2023-04-28T16:25:00",
      },
      {
        id: "602",
        content: "That sounds interesting. Can you share more details?",
        sender: users[5],
        chatid: "2",
        timestamp: "2023-04-28T16:28:00",
      },
      {
        id: "603",
        content: "Let's schedule a call to discuss this further",
        sender: users[2],
        chatid: "2",
        timestamp: "2023-04-28T16:30:00",
      },
    ],
  },
  {
    id: "7",
    name: "Project Brainstorming122345",
    avatar: "/placeholder.svg?height=48&width=48",
    lastMessage: "Let's schedule a call to discuss this further",
    lastMessageTime: "2023-04-28T16:30:00",
    isGroup: true,
    description:
      "A space for brainstorming ideas for our upcoming projects. Share your thoughts and inspirations.",
    participants: [users[0], users[2], users[5]],
    labels: [allLabels[0], allLabels[1]],
    messages: [
      {
        id: "601",
        content: "I have some ideas for the new project",
        sender: users[2],
        chatid: "2",
        timestamp: "2023-04-28T16:25:00",
      },
      {
        id: "602",
        content: "That sounds interesting. Can you share more details?",
        sender: users[5],
        chatid: "2",
        timestamp: "2023-04-28T16:28:00",
      },
      {
        id: "603",
        content: "Let's schedule a call to discuss this further",
        sender: users[2],
        chatid: "2",
        timestamp: "2023-04-28T16:30:00",
      },
    ],
  },
];
