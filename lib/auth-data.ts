import type { AuthUser } from "./auth-types";
//dummy testing data
// Sample authenticated users
export const authUsers: AuthUser[] = [
  {
    id: "user1",
    name: "John Doe",
    avatar: "/placeholder.svg?height=48&width=48",
    isOnline: true,
    created_at: "2023-02-20T14:30:00.000Z",
  },
  {
    id: "user2",
    name: "Jane Smith",
    avatar: "/placeholder.svg?height=48&width=48",
    isOnline: false,
    created_at: "2023-02-20T14:30:00.000Z",
  },
];
