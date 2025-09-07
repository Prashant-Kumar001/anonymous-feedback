"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";
import { Message } from "@/models/User";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { resAPI } from "@/types/res.API";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const MessageCard = ({
  message,
  onDelete,
}: {
  message: Message;
  onDelete: (id: string) => void;
}) => {
  const onMessageDeleteConfirm = async () => {
    try {
      const res = await axios.delete(`/api/messages/${message._id}`);
      toast.success(res.data.message ?? "Message deleted successfully");
      onDelete(message._id as string); 
    } catch (error) {
      const err = error as AxiosError<resAPI>;
      toast.error(err.response?.data?.error ?? "Failed to delete message");
    }
  };

  return (
    <Card className="relative shadow-md hover:shadow-lg transition-shadow duration-200 rounded-2xl border border-gray-200">
      <div className="absolute top-3 right-3">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="p-1 rounded-full hover:bg-red-50 text-red-500 transition-colors">
              <X size={18} />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this message?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The message will be removed
                permanently.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onMessageDeleteConfirm}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <CardContent>
        <CardTitle className="text-sm mt-3  leading-snug">
          {message.content}
        </CardTitle>
        <p className="text-sm text-gray-500">
          Sent on {formatDate(message.createAt.toString())}
        </p>
      </CardContent>

      <CardFooter>
        <span className="text-xs text-gray-400">Anonymous</span>
      </CardFooter>
    </Card>
  );
};

export default MessageCard;
