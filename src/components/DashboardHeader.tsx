import { useSession } from "next-auth/react";
import { UserCircle } from "lucide-react";

export default function DashboardHeader() {
  const { data: session } = useSession();
  const user = session?.user as { name?: string; email?: string };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name || "User"}! 👋
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your messages and profile settings
        </p>
      </div>
      <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-full">
        <UserCircle className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {user?.email || "user@example.com"}
        </span>
      </div>
    </div>
  );
}