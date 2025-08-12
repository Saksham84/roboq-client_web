"use client";

import { useEffect, useState } from "react";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { Edit } from "lucide-react";
import api from "@/utils/api";

interface UserType {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string;
}

export default function EditProfilePage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/status");
        setUser(res.data.user);
      } catch (err) {
        console.error("Failed to load user", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (!user) {
    return <p className="text-red-500">User not found or not authenticated.</p>;
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold font-headline flex items-center gap-3">
          <Edit className="w-8 h-8 text-primary" />
          Edit Profile
        </h1>
        <p className="text-muted-foreground mt-2">
          Update your personal information below.
        </p>
      </header>
      <ProfileForm initialData={user} />
    </div>
  );
}
