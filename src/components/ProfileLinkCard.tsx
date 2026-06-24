// components/ProfileLinkCard.tsx
import { useState } from "react";
import { Copy, Check, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProfileLinkCardProps {
  username: string;
}

export default function ProfileLinkCard({ username }: ProfileLinkCardProps) {
  const [copied, setCopied] = useState(false);
  const profileUrl = `${window.location.origin}/${username}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      toast.success("Profile link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
        <LinkIcon className="w-4 h-4 text-gray-400 shrink-0" />
        <p className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">
          {profileUrl}
        </p>
        <Button
          onClick={handleCopy}
          variant="ghost"
          size="sm"
          className="shrink-0"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Share this link with others to receive messages
      </p>
    </div>
  );
}