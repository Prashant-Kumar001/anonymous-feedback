"use client";
import { Message } from "@/models/User";
import MessageCard from "@/components/cards";
import { Loader2 } from "lucide-react";

interface MessageListProps {
  messages: Message[];
  onDelete: (id: unknown) => void;
  loading: boolean;
}

export default function MessageList({ messages, onDelete, loading }: MessageListProps) {

  if (loading) {
    return (
      <div className="col-span-2 text-center py-6 text-muted-foreground flex justify-center ">
        <Loader2 size={24} className="ml-2 animate-spin" />
      </div>
    );
  }


  if (messages.length === 0) {
    return (
      <div className="col-span-2 text-center py-6 text-muted-foreground">
        <p className="mb-2">No messages yet 📨</p>
        <p className="text-sm">
          Share your profile link to start receiving messages
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {messages.map((message, index) => (
        <MessageCard key={index} message={message} onDelete={onDelete} />
      ))}
    </div>
  );
}
