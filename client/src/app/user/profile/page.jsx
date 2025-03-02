"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import useProfile from "@/hooks/useProfile";
import { Badge } from "@/components/ui/badge"; // ShadCN badge
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // ShadCN card
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // ShadCN avatar

const Profile = () => {
  const { getProfile } = useProfile();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const profileData = await getProfile();

      if (profileData.status === "error") {
        setErrorMessage(profileData.message || "Unable to load profile.");
        Cookies.remove("jwt-token");
        Cookies.remove("email");
        setTimeout(() => router.push("/account/login"), 1500);
      } else {
        setUser(profileData.user);
      }

      setLoading(false);
    };

    fetchProfile();
  }, [getProfile, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <CardHeader className="text-center">
          <Avatar className="mx-auto w-16 h-16">
            <AvatarImage src={`https://api.dicebear.com/6.x/identicon/svg?seed=${user?.u_email}`} />
            <AvatarFallback>{user?.u_first_name[0]}{user?.u_last_name[0]}</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold mt-4">{user?.u_first_name} {user?.u_last_name}</h2>
          <p className="text-gray-500">{user?.u_email}</p>
        </CardHeader>
        <CardContent>
          {errorMessage ? (
            <div className="text-red-500 text-sm text-center">{errorMessage}</div>
          ) : (
            <div className="text-center mt-4">
              <Badge className={user?.is_verified ? "bg-green-500" : "bg-yellow-500"}>
                {user?.is_verified ? "Verified" : "Not Verified"}
              </Badge>
              <Badge className={`ml-2 ${user?.is_approved ? "bg-blue-500" : "bg-red-500"}`}>
                {user?.is_approved ? "Approved" : "Pending Approval"}
              </Badge>
              <Badge className={`ml-2 ${user?.is_admin ? "bg-purple-500" : "bg-gray-500"}`}>
                {user?.is_admin ? "Admin" : "User"}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
