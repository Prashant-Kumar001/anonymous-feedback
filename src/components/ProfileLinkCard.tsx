"use client";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface ProfileLinkCardProps {
  username: string;
}

export default function ProfileLinkCard({ username }: ProfileLinkCardProps) {
  const copyToClipboard = () => {
    const url = `${window.location.origin}/u/${username}/`;
    navigator.clipboard.writeText(url);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Your Profile Link</h3>
      </div>
      <div className="card-content flex items-center gap-2">
        <input
          type="text"
          value={`${window.location.origin}/u/${username}/`}
          disabled
          className="flex-1 border rounded-lg px-3 py-2 text-sm text-gray-600 bg-gray-50"
        />
        <Button onClick={copyToClipboard} variant="outline" size="icon">
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
