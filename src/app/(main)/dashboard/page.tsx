"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState, useRef } from "react";
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
  
  // Track if initial fetch has been done
  const initialFetchDone = useRef(false);
  // Track if component is mounted to prevent state updates after unmount
  const isMounted = useRef(true);

  const handleDeleteMessage = useCallback((id: unknown) => {
    setMessages((prev) => prev.filter((msg) => msg._id !== id));
  }, []);

  const fetchMessages = useCallback(
    async (page: number = 1, limit: number = 10, refresh = false) => {
      // Prevent multiple simultaneous requests
      if (isLoading) return;
      
      setIsLoading(true);
      try {
        const res = await axios.get(
          `/api/messages?page=${page}&limit=${limit}`
        );
        // Only update state if component is still mounted
        if (isMounted.current) {
          setMessages(res.data.messages);
          setPagination(res.data.pagination);
          if (refresh) toast.success("Messages refreshed");
        }
      } catch (err) {
        if (isMounted.current) {
          const error = err as AxiosError<resAPI>;
          toast.error(error.response?.data?.message || "Failed to load messages");
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    },
    [isLoading] // Add isLoading to dependencies
  );

  const fetchToggle = useCallback(async () => {
    // Prevent multiple simultaneous requests
    if (isSwitchLoading) return;
    
    setIsSwitchLoading(true);
    try {
      const res = await axios.get("/api/except");
      if (isMounted.current) {
        setIsExcepting(res.data?.data.isExcepting);
      }
    } catch (err) {
      if (isMounted.current) {
        const error = err as AxiosError<resAPI>;
        toast.error(error.response?.data?.message || "Failed to fetch toggle");
      }
    } finally {
      if (isMounted.current) {
        setIsSwitchLoading(false);
      }
    }
  }, [isSwitchLoading]); // Add isSwitchLoading to dependencies

  const handleSwitch = useCallback(async () => {
    // Prevent multiple toggles while one is in progress
    if (isSwitchLoading) return;
    
    setIsSwitchLoading(true);
    try {
      const res = await axios.post("/api/except", {
        isExcepting: !isExcepting,
      });
      if (isMounted.current) {
        setIsExcepting(!isExcepting);
        toast.success(res.data.message || "Toggled successfully");
      }
    } catch (err) {
      if (isMounted.current) {
        const error = err as AxiosError<resAPI>;
        toast.error(error.response?.data?.message || "Failed to toggle");
      }
    } finally {
      if (isMounted.current) {
        setIsSwitchLoading(false);
      }
    }
  }, [isExcepting, isSwitchLoading]);

  const handlePageChange = (newPage: number) => {
    if (pagination && !isLoading) {
      fetchMessages(newPage, pagination.limit);
    }
  };

  useEffect(() => {
    // Set mounted flag
    isMounted.current = true;
    
    // Only fetch if user is authenticated and we haven't fetched yet
    if (status === "authenticated" && session?.user && !initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchMessages();
      fetchToggle();
    }
    
    // Cleanup
    return () => {
      isMounted.current = false;
    };
  }, [status, session?.user, fetchMessages, fetchToggle]);

  // Separate effect to handle status changes
  useEffect(() => {
    // Reset initial fetch flag when user logs out
    if (status === "unauthenticated") {
      initialFetchDone.current = false;
      setMessages([]);
      setPagination(null);
    }
  }, [status]);

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

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