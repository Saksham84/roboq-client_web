"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Award, Edit } from "lucide-react";
import api from "@/utils/api";

interface UserType {
  name: string;
  email: string;
  avatarUrl?: string;
}

interface Certificate {
  id: string;
  courseTitle: string;
  dateIssued: string;
  courseCertificate: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [userRes, certRes] = await Promise.all([
          api.get("/auth/status"),
          api.get("/certificates/user"),
        ]);

        setUser(userRes.data.user);
        setCertificates(certRes.data);
      } catch (error) {
        console.error("Failed to load profile data", error);
      }
    };

    fetchProfileData();
  }, []);

  // const BASE_URL = "http://localhost:5000";

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-headline flex items-center gap-3">
            <User className="w-8 h-8 text-primary" />
            My Profile
          </h1>
          <p className="text-muted-foreground mt-2">
            View and manage your personal information and achievements.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/profile/edit">
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Link>
        </Button>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        {/* User Info Card */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <Image
                // src={
                //   user?.avatarUrl ||
                //   "https://placehold.co/128x128?text=User"
                // }
                src={
                    user?.avatarUrl?.startsWith("/assets")
                        ? `${process.env.NEXT_PUBLIC_BASE_URL}${user?.avatarUrl}`
                        : user?.avatarUrl || "https://placehold.co/128x128?text=User"
                    }
                alt={user?.name || "User Avatar"}
                width={128}
                height={128}
                unoptimized 
                className="rounded-full mb-4 border-4 border-primary/20"
              />
              <h2 className="text-2xl font-bold font-headline">{user?.name}</h2>
              <p className="text-muted-foreground flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {user?.email}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Certificate Section */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <Award className="text-primary" />
                My Certificates
              </CardTitle>
            </CardHeader>
            <CardContent>
              {certificates.length > 0 ? (
                <div className="space-y-4">
                  {certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="p-4 rounded-md border bg-muted/20 flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-semibold">{cert.courseTitle}</h3>
                        <p className="text-sm text-muted-foreground">
                          Issued: {cert.dateIssued}
                        </p>
                      </div>
                      <Button variant="secondary" size="sm" asChild>
                        <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}${cert.courseCertificate}`} target="_blank">
                          View Certificate
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">
                    You haven't earned any certificates yet.
                  </p>
                </div>
              )}
            </CardContent>
            <div className="text-sm text-muted-foreground px-6 pb-4">
                <p>
                <strong>Note:</strong> If any of your certificates are missing from your profile, please contact our support team.
                </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
