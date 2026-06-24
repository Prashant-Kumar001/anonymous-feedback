import { Pagination } from "@/types/pagination";
import { Loader2, RefreshCcw, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import MessageList from "@/components/MessageList";
import PaginationControls from "@/components/PaginationControls";
import { Message } from "@/types/res.API";

interface MessageSectionProps {
  messages: Message[];
  isLoading: boolean;
  pagination: Pagination | null;
  onDelete: (id: unknown) => void;
  onRefresh: (page: number, limit: number, refresh: boolean) => void;
  onPageChange: (page: number) => void;
}

export default function MessageSection({
  messages,
  isLoading,
  pagination,
  onDelete,
  onRefresh,
  onPageChange,
}: MessageSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Messages
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {pagination?.totalMessages || 0} total messages
          </p>
        </div>
        <Button
          onClick={() =>
            onRefresh(pagination?.currentPage || 1, pagination?.limit || 10, true)
          }
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      <div className="p-4 md:p-6 max-h-150 overflow-y-auto">
        {messages.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-4 mb-4">
              <Inbox className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              No messages yet
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Share your profile link to start receiving messages
            </p>
          </div>
        ) : (
          <>
            <MessageList
              messages={messages}
              onDelete={onDelete}
              loading={isLoading}
            />
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-6">
                <PaginationControls
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  isLoading={isLoading}
                  onPageChange={onPageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}