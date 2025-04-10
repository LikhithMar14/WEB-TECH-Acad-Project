"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      // Check if user is an admin
      const adminIds = ["AP23110010483", "AP23110010448", "AP23110010401"];
      const isAdmin = adminIds.includes(session.user.admissionNo);
      
      // Redirect to appropriate dashboard
      if (isAdmin) {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/user");
      }
    } else if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-gray-600">Redirecting to appropriate dashboard...</p>
    </div>
  );
};

export default Dashboard;