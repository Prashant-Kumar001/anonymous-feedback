"use client";

import { useSession } from "next-auth/react";
import { Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Message } from "@/models/User";

import ProfileLinkCard from "@/components/ProfileLinkCard";
import MessageSettingsCard from "@/components/messageSettingsCard";
import MessageList from "@/components/MessageList";
import PaginationControls from "@/components/PaginationControls";
import { resAPI } from "@/types/res.API";

interface Pagination {
  totalMessages: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
  limit: number;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const username = (session?.user as { username?: string })?.username ?? "";

  const [messages, setMessages] = useState<Message[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [isExcepting, setIsExcepting] = useState(false);

  const handleDeleteMessage = useCallback((id: unknown) => {
    setMessages((prev) => prev.filter((msg) => msg._id !== id));
  }, []);

  const fetchMessages = useCallback(
    async (page: number = 1, limit: number = 10, refresh = false) => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `/api/messages?page=${page}&limit=${limit}`
        );
        setMessages(res.data.messages);
        setPagination(res.data.pagination);
        if (refresh) toast.success("Messages refreshed");
      } catch (err) {
        const error = err as AxiosError<resAPI>;
        toast.error(error.response?.data?.message || "Failed to load messages");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const fetchToggle = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const res = await axios.get("/api/except");
      setIsExcepting(res.data.isExcepting);
    } catch (err) {
      const error = err as AxiosError<resAPI>;
      const message = error.response?.data?.message || "Failed to fetch toggle";
      toast.error(message);
    } finally {
      setIsSwitchLoading(false);
    }
  }, []);

  const handleSwitch = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const res = await axios.post("/api/except", {
        isExcepting: !isExcepting,
      });
      setIsExcepting(!isExcepting);
      toast.success(res.data.message || "Toggled successfully");
    } catch (err) {
      const error = err as AxiosError<resAPI>;
      const message = error.response?.data?.message || "Failed to toggle";
      toast.error(  message || "Failed to toggle");
    } finally {
      setIsSwitchLoading(false);
    }
  }, [isExcepting]);

  const handlePageChange = (newPage: number) => {
    if (pagination) fetchMessages(newPage, pagination.limit);
  };

  useEffect(() => {
    if (!session?.user) return;
    fetchMessages();
    fetchToggle();
  }, [session, fetchMessages, fetchToggle]);

  if (!session?.user)
    return <p className="text-center text-gray-500 mt-10">Please sign in</p>;

  return (
    <div className="w-full h-[80vh] overflow-y-scroll  max-w-7xl mx-auto p-2">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 ">
          <div className="card mb-4">
            <div className="card-header flex justify-between items-center">
              <h3 className="card-title">Messages</h3>
              <Button
                onClick={() =>
                  fetchMessages(
                    pagination?.currentPage,
                    pagination?.limit,
                    true
                  )
                }
                variant="outline"
                size="sm"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCcw className="mr-2 h-4 w-4" />
                )}
                Refresh
              </Button>
            </div>
            <div className="card-content h-[70vh] overflow-y-scroll p-8">
              <MessageList
                messages={messages}
                onDelete={handleDeleteMessage}
                loading={isLoading}
              />
              {pagination && (
                <PaginationControls
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  isLoading={isLoading}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </div>
        </div>

        <div className=" w-full md:w-sm flex flex-col gap-4">
          <ProfileLinkCard username={username} />
          <MessageSettingsCard
            isExcepting={isExcepting}
            isLoading={isSwitchLoading}
            onToggle={handleSwitch}
          />
        </div>
      </div>
    </div>
  );
}
