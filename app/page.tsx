import ChatInterface from "@/components/chat-interface";

export default function Home() {
  return (
    <main className="h-screen bg-gray-100">
      <div className="h-full max-w-7xl mx-auto">
        <ChatInterface />
      </div>
    </main>
  );
}
