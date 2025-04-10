"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WashingMachine } from "lucide-react";

const InfoPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    router.push("/signin");
    return null;
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <WashingMachine className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">SRM AP Laundry Service</CardTitle>
            <CardDescription>
              Information about your laundry allocation
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-6">
              <div className="mx-auto max-w-md">
                <p className="text-lg text-gray-700 mb-6">
                  As an SRM AP student, you are automatically allocated <span className="font-bold">40 washes per session</span>. There is no need to subscribe to any additional plans.
                </p>
                
                <div className="rounded-lg border p-4 bg-blue-50 my-6">
                  <h3 className="font-medium text-blue-800 mb-2">Your Current Status</h3>
                  <p className="text-gray-700">
                    Washes Remaining: <span className="font-bold">{session.user.washes || 40}</span> of 40
                  </p>
                </div>
                
                <div className="space-y-4 text-left">
                  <h3 className="font-medium text-lg">How it works:</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Each wash corresponds roughly to 1kg of laundry</li>
                    <li>Your allocation is automatically reset at the beginning of each semester</li>
                    <li>You can view your wash history and remaining washes on your dashboard</li>
                    <li>The laundry service operates 7 days a week from 8am - 8pm</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/user")}
            >
              View Dashboard
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

export default InfoPage; 