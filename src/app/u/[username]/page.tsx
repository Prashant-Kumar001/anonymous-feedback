"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Send, CheckCircle2, LogIn } from "lucide-react";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function PublicSendMessagePage() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { username } = useParams();
 const handleSend = async () => {
   if (!message.trim()) {
     toast.error("Message cannot be empty");
     return;
   }

   setIsLoading(true);
   try {
     const res = await axios.post(`/api/send`, {
       content: message,
       username,
     });
     toast.success(res.data.message || "Message sent successfully 🎉");
     setMessage("");
     setSuccess(true);
     setTimeout(() => {
       setSuccess(false);
     }, 2000)
   } catch (err) {
     const error = err as AxiosError<{ error: string }>;
     toast.error(error.response?.data?.error || "Failed to send message");
   } finally {
     setIsLoading(false);
   }
 };
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10  relative overflow-hidden">
    

      <div className="absolute top-6 right-6">
        <Link
          href="/auth/signin"
          className="flex items-center gap-2  backdrop-blur px-4 py-2 rounded-full "
        >
          <LogIn className="h-4 w-4" />
          Login
        </Link>
      </div>

      {success && (
        <div className="fixed top-12 inset-x-0 flex justify-center z-50">
          <div className="flex items-center gap-2 bg-white shadow-lg border px-4 py-2 rounded-full animate-fade-in-up transition">
            <CheckCircle2 className="text-green-600 h-5 w-5" />
            <span className="text-sm font-medium text-gray-700">
              Message sent!
            </span>
          </div>
        </div>
      )}

      <main className="w-full max-w-4xl z-10">
        <div className="rounded-3xl shadow-2xl border p-6">
          <h2 className="mb-6 text-center text-3xl md:text-4xl font-extrabold  tracking-tight  drop-shadow">
            Send an Anonymous Message
          </h2>
          <p className="mb-6 text-center  text-sm">
            Your identity will remain hidden. Share your thoughts freely ✨
          </p>

          <div className="relative mb-6">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isLoading}
              rows={10}
              maxLength={100}
            />
           
          </div>

          <Button
            onClick={handleSend}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Send Message
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}
