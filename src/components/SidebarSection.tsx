import ProfileLinkCard from "@/components/ProfileLinkCard";
import MessageSettingsCard from "@/components/messageSettingsCard";

interface SidebarSectionProps {
  username: string;
  isExcepting: boolean;
  isSwitchLoading: boolean;
  onToggle: () => void;
}

export default function SidebarSection({
  username,
  isExcepting,
  isSwitchLoading,
  onToggle,
}: SidebarSectionProps) {
  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
          Profile Settings
        </h3>
        <ProfileLinkCard username={username} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
          Message Preferences
        </h3>
        <MessageSettingsCard
          isExcepting={isExcepting}
          isLoading={isSwitchLoading}
          onToggle={onToggle}
        />
      </div>
    </div>
  );
}