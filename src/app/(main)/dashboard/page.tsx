"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { Message, resAPI } from "@/types/res.API";
import { Pagination } from "@/types/pagination";
import DashboardHeader from "@/components/DashboardHeader";
import MessageSection from "@/components/MessageSection";
import SidebarSection from "@/components/SidebarSection";


export default function DashboardPage() {
  const { data: session, status } = useSession();
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
      setIsExcepting(res.data?.data.isExcepting);
    } catch (err) {
      const error = err as AxiosError<resAPI>;
      toast.error(error.response?.data?.message || "Failed to fetch toggle");
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
      toast.error(error.response?.data?.message || "Failed to toggle");
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

  if (!session?.user || status !== "authenticated") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-600">
            You are not signed in
          </h2>
          <p className="text-gray-400 mt-2">
            Sign in to view your dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <MessageSection
              messages={messages}
              isLoading={isLoading}
              pagination={pagination}
              onDelete={handleDeleteMessage}
              onRefresh={fetchMessages}
              onPageChange={handlePageChange}
            />
          </div>

          <div className="lg:col-span-1">
            <SidebarSection
              username={username}
              isExcepting={isExcepting}
              isSwitchLoading={isSwitchLoading}
              onToggle={handleSwitch}
            />
          </div>
        </div>
      </div>
    </div>
  );
}