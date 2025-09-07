"use client";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

interface MessageSettingsCardProps {
  isExcepting: boolean;
  isLoading: boolean;
  onToggle: () => void;
}

export default function MessageSettingsCard({
  isExcepting,
  isLoading,
  onToggle,
}: MessageSettingsCardProps) {
  return (
    <div className="card">
      <div className="card-header flex justify-between items-center">
        <h3 className="card-title">Message Settings</h3>
      </div>
      <div className="card-content flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Accept Messages</p>
          <p className="text-xs text-muted-foreground">
            Toggle whether others can send you messages
          </p>
        </div>
        <div className="flex items-center">
          <Switch
            checked={isExcepting}
            onCheckedChange={onToggle}
            disabled={isLoading}
          />
          {isLoading && <Loader2 size={16} className="ml-2 animate-spin" />}
        </div>
      </div>
    </div>
  );
}
