"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2, Send, CheckCircle2, LogIn, Sparkles, Shield, Lock } from "lucide-react";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function PublicSendMessagePage() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  const { username } = useParams();
  const MAX_CHARS = 500;

  useEffect(() => {
    setCharCount(message.length);
  }, [message]);

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error("Message cannot be empty", {
        duration: 3000,
        style: { background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' }
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(`/api/send`, {
        content: message,
        username,
      });
      toast.success(res.data.message || "Message sent successfully 🎉", {
        duration: 3000,
        style: { background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' }
      });
      setMessage("");
      setCharCount(0);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      toast.error(error.response?.data?.error || "Failed to send message", {
        duration: 4000,
        style: { background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10  relative overflow-hidden">
      
      <div className="absolute top-6 right-6 z-20">
        <Link
          href="/auth/signin"
          className="flex items-center gap-2 bg-white/70 backdrop-blur-md border border-white/30 shadow-lg px-5 py-2.5 rounded-full hover:bg-white/90 transition-all duration-300 hover:shadow-xl hover:scale-105 group"
        >
          <LogIn className="h-4 w-4 text-indigo-600 group-hover:rotate-12 transition-transform" />
          <span className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors">
            Login
          </span>
        </Link>
      </div>

      {success && (
        <div className="fixed top-20 inset-x-0 flex justify-center z-50 animate-fade-in-up">
          <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md shadow-2xl border border-green-200/50 px-6 py-3 rounded-full">
            <CheckCircle2 className="text-green-500 h-5 w-5 animate-bounce" />
            <span className="text-sm font-medium text-gray-700">
              Message sent successfully! ✨
            </span>
          </div>
        </div>
      )}

      <main className="w-full max-w-2xl z-10 relative">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 md:p-10 hover:shadow-3xl transition-shadow duration-500">
          
          <div className="flex justify-center mb-4">
            <div className="bg-linear-to-r from-indigo-500 to-purple-500 p-3 rounded-full shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>

          <h2 className="mb-2 text-center text-3xl md:text-4xl font-extrabold bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Send Anonymous Message
          </h2>
          
          <p className="mb-2 text-center text-sm text-gray-600">
            to <span className="font-semibold text-indigo-600">@{username}</span>
          </p>
          
          <p className="mb-8 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
            <Lock className="h-3 w-3" />
            Your identity will remain hidden. Share your thoughts freely ✨
          </p>

          <div className="relative mb-6 group">
            <div className={`absolute -inset-0.5 bg-linear-to-r from-indigo-500 to-purple-500 rounded-2xl transition-opacity duration-500 ${isFocused ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}></div>
            <div className="relative">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isLoading}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                rows={8}
                maxLength={MAX_CHARS}
                placeholder="Write your anonymous message here..."
                className="resize-none bg-white/90 backdrop-blur-sm border-2 border-gray-200/50 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 rounded-2xl p-4 text-gray-700 placeholder:text-gray-400 transition-all duration-300"
              />
              
              <div className={`absolute bottom-4 right-4 text-xs font-medium transition-colors duration-300 ${
                charCount > MAX_CHARS * 0.8 ? 'text-amber-500' : 
                charCount > MAX_CHARS * 0.9 ? 'text-red-500' : 
                'text-gray-400'
              }`}>
                {charCount}/{MAX_CHARS}
              </div>
            </div>
          </div>

          <Button
            onClick={handleSend}
            disabled={isLoading || !message.trim()}
            className="w-full  text-white font-semibold py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                Send Message
              </>
            )}
          </Button>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
              <Sparkles className="h-3 w-3" />
              Your privacy is protected
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}