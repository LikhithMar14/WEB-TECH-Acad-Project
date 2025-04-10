"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getUserById } from "@/actions/user";

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.id) {
        try {
          setLoading(true);
          const userData = await getUserById(session.user.id);
          setUser(userData);
        } catch (err) {
          setError("Failed to load user data");
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    if (status === "authenticated") {
      fetchUserData();
    } else if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [session, status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-24">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-600">
          <p>{error}</p>
          <Button onClick={() => router.refresh()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">User not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-400 to-blue-600"></div>
          <div className="relative px-6">
            <div className="absolute -top-16 flex items-center justify-center">
              <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-white">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-blue-100 text-2xl font-bold text-blue-600">
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <CardHeader className="pt-20">
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium text-gray-500">Admission No</p>
                <p className="text-lg font-semibold">{user.admissionNo}</p>
              </div>
              
              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium text-gray-500">Washes Remaining</p>
                <p className="text-lg font-semibold">{user.washes} / 40</p>
              </div>
              
              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium text-gray-500">College</p>
                <p className="text-lg font-semibold">SRM University AP</p>
              </div>
              
              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <p className="text-lg font-semibold">{user.orders.length}</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="mb-4 text-lg font-medium">Recent Orders</h3>
              {user.orders.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No orders yet</p>
              ) : (
                <div className="space-y-3">
                  {user.orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="rounded-lg border p-4">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">Order #{order.id}</p>
                          <p className="text-sm text-gray-500">
                            Location: {order.laundryName.replace(/_/g, ' ')}
                          </p>
                        </div>
                        <Badge
                          className={
                            order.orderStatus === "OrderDelivered"
                              ? "bg-green-500"
                              : order.orderStatus === "OrderPlaced"
                              ? "bg-blue-500"
                              : "bg-amber-500"
                          }
                        >
                          {order.orderStatus.replace("Order", "")}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  {user.orders.length > 3 && (
                    <div className="text-center">
                      <Link href="/dashboard/user">
                        <Button variant="link">View all orders</Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t bg-gray-50 px-6 py-4">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/user")}
            >
              Dashboard
            </Button>
            
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => router.push("/create-order")}
            >
              Create Order
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProfilePage; 