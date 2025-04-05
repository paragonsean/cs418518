"use client";
import { useState } from "react";
import { Menu, LogOut, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import useProfile from "@/hooks/use_profile";
import { useRouter } from "next/navigation";

export default function UserProfileButton() {
  const { user, loading } = useProfile();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Handle Logout
  const handleLogout = () => {
    document.cookie =
      "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 px-3 py-2 rounded-full"
        >
          <User size={20} />
          {!loading && user ? (
            <span className="text-sm font-medium">{user.u_first_name}</span>
          ) : (
            "..."
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 bg-white shadow-md rounded-md p-2">
        <p className="text-sm font-semibold text-gray-900">
          {user?.u_first_name} {user?.u_last_name}
        </p>
        <p className="text-xs text-gray-500">{user?.u_email}</p>
        <div className="border-t my-2"></div>
        <Button
          variant="ghost"
          className="w-full flex items-center gap-2"
          onClick={() => router.push("/user/profile")}
        >
          <Settings size={16} /> Profile Settings
        </Button>
        <Button
          variant="ghost"
          className="w-full flex items-center gap-2 text-red-500"
          onClick={handleLogout}
        >
          <LogOut size={16} /> Logout
        </Button>
      </PopoverContent>
    </Popover>
  );
}
