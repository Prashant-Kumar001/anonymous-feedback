import { formatDistanceToNow } from "date-fns";
import { Trash2, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Message } from "@/types/res.API";
import MessageCard from "./cards";

interface MessageListProps {
  messages: Message[];
  onDelete: (id: unknown) => void;
  loading: boolean;
}

export default function MessageList({
  messages,
  onDelete,
  loading,
}: MessageListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse space-y-4 w-full">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 dark:bg-gray-700 h-20 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
       <MessageCard key={message._id} message={message} onDelete={onDelete} />
      ))}
    </div>
  );
}