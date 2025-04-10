"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import Navbar from "@/components/custom/navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CirclePlus,
  ArrowRight,
  Tally4,
  Truck,
  DropletIcon,
  LucideShirt,
  CalendarClock,
  ClipboardCheck,
  AlertTriangle,
  Star,
  BarChart,
  RefreshCw,
  CheckCircle,
} from "lucide-react";
import { getOrders } from "@/actions/order";
import { useRouter } from "next/navigation";

const UserDashboard = () => {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeOrders, setActiveOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [washesTrend, setWashesTrend] = useState([]);
  const [weightData, setWeightData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // Format name correctly (extract first and last name)
      const fullName = session.user.name?.split("|")[0]?.trim() || "";
      const admissionNo =
        session.user.admissionNo ||
        session.user.name?.split("|")[1]?.trim() ||
        "";

      // Set user data based on session data
      setUserData({
        name: fullName,
        admissionNo: admissionNo,
        email: session.user.email,
        year: determineYear(admissionNo),
        washes: session.user.washes || 40,
        image: session.user.image,
        college: "SRM University AP",
        hostelBlock: determineHostelBlock(admissionNo),
      });

      // Fetch real order data using server actions
      const fetchOrders = async () => {
        try {
          const orders = await getOrders(session.user.id);
          
          // Separate active and completed orders
          const active = orders.filter(order => 
            order.orderStatus === "OrderPlaced" || 
            order.orderStatus === "OrderNotInitiated"
          );
          
          const history = orders.filter(order => 
            order.orderStatus === "OrderDelivered"
          );
          
          setActiveOrders(active);
          setOrderHistory(history);
          
          // Calculate wash usage from order history
          if (orders.length > 0) {
            // Process order data to generate usage trends
            processOrderData(orders);
          }
          
          setLoading(false);
        } catch (error) {
          console.error("Error fetching orders:", error);
          setLoading(false);
        }
      };
      
      fetchOrders();
    }
  }, [status, session]);

  // Function to process order data for charts and trends
  const processOrderData = (orders) => {
    // Create monthly data for wash usage chart
    const last6Months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = month.toLocaleString('default', { month: 'short' });
      last6Months.push({ month: monthName, washes: 0 });
    }
    
    // Calculate weight data categories
    const weightCategories = {
      Tshirt: 0,
      Jeans: 0,
      BedSheet: 0,
      Towel: 0,
      Other: 0,
    };
    
    // Process each order
    orders.forEach(order => {
      const orderDate = new Date(order.createdAt || Date.now());
      const orderMonth = orderDate.toLocaleString('default', { month: 'short' });
      
      // Find corresponding month in our array
      const monthData = last6Months.find(m => m.month === orderMonth);
      if (monthData) {
        // Calculate total weight/washes for this order
        const totalWeight = order.cart?.items?.reduce((sum, item) => {
          const itemWeight = parseFloat(item.weight.toString()) * item.quantity;
          
          // Add to weight categories
          if (weightCategories.hasOwnProperty(item.item)) {
            weightCategories[item.item] += itemWeight;
          } else {
            weightCategories.Other += itemWeight;
          }
          
          return sum + itemWeight;
        }, 0) || 0;
        
        monthData.washes += Math.ceil(totalWeight);
      }
    });
    
    setWashesTrend(last6Months);
    
    // Convert weight categories to chart format
    const weightDataArray = Object.entries(weightCategories)
      .filter(([_, weight]) => weight > 0)
      .map(([category, weight]) => ({ category, weight }));
    
    setWeightData(weightDataArray);
  };

  // Function to determine hostel block based on admission number
  const determineHostelBlock = (admissionNo) => {
    if (!admissionNo) return "Unknown";
    
    // This is a simplified example - adjust based on your actual logic
    const lastDigit = admissionNo.slice(-1);
    const digit = parseInt(lastDigit);
    
    if (digit >= 0 && digit <= 4) {
      return "Krishna Tower";
    } else {
      return "Vedhavathi Tower";
    }
  };

  // Function to determine year from admission number
  const determineYear = (admissionNo) => {
    if (!admissionNo) return 1;

    // Extract year from AP{year}XXXXXXXXX format
    const match = admissionNo.match(/AP(\d{2})/);
    if (match && match[1]) {
      const yearAdmitted = parseInt("20" + match[1]);
      const currentYear = new Date().getFullYear();
      return Math.min(4, Math.max(1, currentYear - yearAdmitted + 1));
    }
    return 1;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "OrderNotInitiated":
        return "bg-gray-400";
      case "OrderPlaced":
        return "bg-blue-500";
      case "OrderProcessing":
        return "bg-amber-500";
      case "OrderReady":
        return "bg-purple-500";
      case "OrderDelivered":
        return "bg-green-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "OrderNotInitiated":
        return <RefreshCw size={16} />;
      case "OrderPlaced":
        return <ClipboardCheck size={16} />;
      case "OrderProcessing":
        return <RefreshCw size={16} className="animate-spin" />;
      case "OrderReady":
        return <AlertTriangle size={16} />;
      case "OrderDelivered":
        return <CheckCircle size={16} />;
      default:
        return <RefreshCw size={16} />;
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  // Generate loading skeleton UI
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Skeleton */}
            <div className="md:col-span-1">
              <Card className="shadow-lg border-t-4 border-t-blue-500">
                <CardHeader className="flex flex-col items-center text-center pb-2">
                  <Skeleton className="w-24 h-24 rounded-full" />
                  <Skeleton className="h-6 w-36 mt-4" />
                  <Skeleton className="h-4 w-28 mt-2" />
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            </div>

            {/* Content Skeleton */}
            <div className="md:col-span-2">
              <Skeleton className="h-10 w-full mb-6" />
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-64 mt-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={`skeleton-${i}`} className="h-24 w-full" />
                    ))}
                  </div>
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <main className="container mx-auto px-4 py-8">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* User Profile Card */}
          <motion.div variants={item} className="md:col-span-1">
            <Card className="shadow-lg border-t-4 border-t-blue-500 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -translate-y-16 translate-x-16 opacity-20"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-200 rounded-full translate-y-10 -translate-x-10 opacity-20"></div>

              <CardHeader className="flex flex-col items-center text-center pb-2 relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md mb-4 bg-white">
                  <img
                    src={userData.image}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  {userData.name}
                </CardTitle>
                <CardDescription className="text-gray-600 font-medium">
                  {userData.admissionNo}
                </CardDescription>
                <div className="flex gap-2 mt-2">
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                    Year {userData.year}
                  </Badge>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                    Active
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Washes Remaining</span>
                      <span className="font-medium text-gray-700">
                        {userData.washes} / 40
                      </span>
                    </div>
                    <div className="relative">
                      <Progress
                        value={(userData.washes / 40) * 100}
                        className="h-2 bg-blue-100"
                      />
                      {userData.washes < 10 && (
                        <div className="absolute top-0 right-0 transform translate-x-full -translate-y-1/2">
                          <Badge
                            variant="outline"
                            className="text-red-500 border-red-200 text-xs animate-pulse"
                          >
                            Low
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-blue-800 font-medium text-sm">
                          Subscription Status
                        </p>
                        <p className="text-blue-600 text-xs">
                          Valid until {userData.subscriptionEndDate}
                        </p>
                      </div>
                      <Badge
                        className={
                          userData.isSubscribed ? "bg-green-500" : "bg-red-500"
                        }
                      >
                        {userData.isSubscribed ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-gray-500">College</p>
                      <p className="font-medium text-gray-700">
                        {userData.college}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-gray-500">Hostel Block</p>
                      <p className="font-medium text-gray-700">
                        {userData.hostelBlock}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-2">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2" onClick={() => {
                  console.log("Create Order button clicked");
                  router.push("/create-order");
                }}>
                  <CirclePlus size={16} />
                  Create New Order
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 text-sm"
                >
                  View Account Settings
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Dashboard Content */}
          <motion.div variants={item} className="md:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6 bg-blue-50 p-1 rounded-lg">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="active"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md"
                >
                  Active Orders
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md"
                >
                  Order History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Weight Distribution Chart component */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6"
                >
                  <Card className="shadow-md border-none bg-white">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg font-medium text-gray-800">
                          Laundry Distribution
                        </CardTitle>
                        <Badge variant="outline" className="text-blue-500">
                          By Category
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col space-y-4">
                        {weightData.map((item, index) => {
                          // Calculate the percentage of total weight
                          const totalWeight = weightData.reduce(
                            (sum, i) => sum + i.weight,
                            0
                          );
                          const percentage = (
                            (item.weight / totalWeight) *
                            100
                          ).toFixed(1);

                          // Determine bar color based on index
                          const colors = [
                            "bg-blue-500",
                            "bg-indigo-500",
                            "bg-purple-500",
                            "bg-pink-500",
                            "bg-amber-500",
                          ];
                          const color = colors[index % colors.length];

                          return (
                            <div key={`weight-${index}`} className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="font-medium text-gray-700">
                                  {item.category}
                                </span>
                                <span className="text-gray-500">
                                  {item.weight} kg ({percentage}%)
                                </span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-2">
                                <div
                                  className={`${color} h-2 rounded-full`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}

                        <div className="pt-3 mt-2 border-t border-gray-100 text-center">
                          <div className="text-xs text-gray-500">
                            Total weight processed:{" "}
                            {weightData
                              .reduce((sum, item) => sum + item.weight, 0)
                              .toFixed(1)}{" "}
                            kg
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6"
                >
                  <Card className="shadow-md border-none bg-white">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg font-medium text-gray-800">
                          Monthly Usage Trend
                        </CardTitle>
                        <Badge variant="outline" className="text-blue-500">
                          Last 6 Months
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-end justify-between gap-2 pt-4 px-2">
                        {washesTrend.map((item, index) => {
                          // Calculate the percentage height based on maximum value
                          const maxWashes = Math.max(
                            ...washesTrend.map((d) => d.washes)
                          );
                          const barHeight = (item.washes / maxWashes) * 100;

                          // Determine bar color - highlight current month
                          const isCurrentMonth =
                            index === washesTrend.length - 1;
                          const barColor = isCurrentMonth
                            ? "bg-blue-600"
                            : "bg-blue-400";
                          const textColor = isCurrentMonth
                            ? "text-blue-700 font-medium"
                            : "text-gray-600";

                          return (
                            <div
                              key={`month-${index}`}
                              className="flex flex-col items-center flex-1"
                            >
                              <div className="flex-1 w-full flex items-end justify-center">
                                <div
                                  className={`${barColor} rounded-t-md w-12 transition-all hover:opacity-80`}
                                  style={{ height: `${barHeight}%` }}
                                >
                                  <div className="text-white text-center font-medium pt-1">
                                    {item.washes}
                                  </div>
                                </div>
                              </div>
                              <div className={`mt-2 text-sm ${textColor}`}>
                                {item.month}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="pt-4 mt-4 border-t border-gray-100 text-center">
                        <div className="text-xs text-gray-500">
                          Total washes:{" "}
                          {washesTrend.reduce(
                            (sum, item) => sum + item.washes,
                            0
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6"
                >
                  <Card className="shadow-md border-none bg-white">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium text-gray-800">
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white h-auto py-4 shadow-md hover:shadow-lg transition-all flex flex-col gap-1">
                          <Truck className="mb-1" size={18} />
                          <span>Track Current Order</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="border-blue-200 text-blue-600 hover:bg-blue-50 h-auto py-4 flex flex-col gap-1"
                        >
                          <CalendarClock className="mb-1" size={18} />
                          <span>Extend Subscription</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="border-blue-200 text-blue-600 hover:bg-blue-50 h-auto py-4 flex flex-col gap-1"
                        >
                          <Star className="mb-1" size={18} />
                          <span>View Pricing</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="border-blue-200 text-blue-600 hover:bg-blue-50 h-auto py-4 flex flex-col gap-1"
                        >
                          <AlertTriangle className="mb-1" size={18} />
                          <span>Contact Support</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="active">
                <Card className="shadow-md border-none bg-white">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-lg font-medium text-gray-800">
                          Active Orders
                        </CardTitle>
                        <CardDescription>
                          Track your current laundry orders
                        </CardDescription>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        {activeOrders.length} Active
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {activeOrders.length > 0 ? (
                      <div className="space-y-4">
                        {activeOrders.map((order) => (
                          <Card
                            key={`active-order-${order.id}`}
                            className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-all"
                          >
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-center">
                                <div>
                                  <CardTitle className="text-base font-medium">
                                    Order #{order.id}
                                  </CardTitle>
                                  <CardDescription className="flex items-center gap-1">
                                    <CalendarClock size={14} />
                                    {order.date}
                                  </CardDescription>
                                </div>
                                <Badge
                                  className={`${getStatusColor(
                                    order.status
                                  )} text-white flex gap-1 items-center`}
                                >
                                  {getStatusIcon(order.status)}
                                  {order.status
                                    .replace(/([A-Z])/g, " $1")
                                    .trim()}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-2">
                              <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-2">
                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                  <Truck size={14} className="text-blue-500" />
                                  Laundry:{" "}
                                  {order.laundryName.replace(/_/g, " ")}
                                </p>
                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                  <CalendarClock
                                    size={14}
                                    className="text-blue-500"
                                  />
                                  Est. Delivery: {order.estimatedDelivery}
                                </p>
                              </div>
                              <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead className="text-xs font-semibold text-blue-700">
                                        Item
                                      </TableHead>
                                      <TableHead className="text-xs font-semibold text-blue-700 text-right">
                                        Qty
                                      </TableHead>
                                      <TableHead className="text-xs font-semibold text-blue-700 text-right">
                                        Weight
                                      </TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {order.items.map((item, idx) => (
                                      <TableRow
                                        key={`active-item-${order.id}-${idx}`}
                                        className="border-b border-blue-100"
                                      >
                                        <TableCell className="text-xs font-medium text-gray-700">
                                          {item.item
                                            .replace(/([A-Z])/g, " $1")
                                            .trim()}
                                        </TableCell>
                                        <TableCell className="text-xs text-right text-gray-700">
                                          {item.quantity}
                                        </TableCell>
                                        <TableCell className="text-xs text-right text-gray-700">
                                          {item.weight} kg
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                    <TableRow>
                                      <TableCell className="text-xs font-semibold text-gray-700">
                                        Total
                                      </TableCell>
                                      <TableCell className="text-xs text-right font-semibold text-gray-700">
                                        {order.items.reduce(
                                          (sum, item) => sum + item.quantity,
                                          0
                                        )}
                                      </TableCell>
                                      <TableCell className="text-xs text-right font-semibold text-gray-700">
                                        {order.items
                                          .reduce(
                                            (sum, item) => sum + item.weight,
                                            0
                                          )
                                          .toFixed(1)}{" "}
                                        kg
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </div>
                            </CardContent>
                            <CardFooter className="flex justify-between items-center pt-2">
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <RefreshCw size={12} />
                                Updated 2 hours ago
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                              >
                                Track Order
                                <ArrowRight size={16} className="ml-2" />
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-blue-50 rounded-lg">
                        <div className="bg-white p-4 rounded-full inline-flex items-center justify-center mb-4 shadow-sm">
                          <Truck size={32} className="text-blue-400" />
                        </div>
                        <p className="text-gray-600 font-medium">
                          You have no active orders
                        </p>
                        <p className="text-gray-500 text-sm mb-4">
                          Create a new order to get your laundry done
                        </p>
                        <Button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                          <CirclePlus size={16} className="mr-2" />
                          Create New Order
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card className="shadow-md border-none bg-white">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-lg font-medium text-gray-800">
                          Order History
                        </CardTitle>
                        <CardDescription>
                          Your previous laundry orders
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="text-gray-600">
                        Total: {orderHistory.length}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orderHistory.map((order) => (
                        <Card
                          key={order.id}
                          className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-all"
                        >
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <div>
                                <CardTitle className="text-base font-medium">
                                  Order #{order.id}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-1">
                                  <CalendarClock size={14} />
                                  {order.date}
                                </CardDescription>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Badge className="bg-green-500 text-white flex gap-1 items-center">
                                  <ClipboardCheck size={14} />
                                  {order.status
                                    .replace(/([A-Z])/g, " $1")
                                    .trim()}
                                </Badge>
                                <div className="flex gap-1">
                                  {[...Array(5)].map((_, idx) => (
                                    <Star
                                      key={idx}
                                      size={12}
                                      className={
                                        idx < order.rating
                                          ? "text-yellow-500"
                                          : "text-gray-200"
                                      }
                                      fill={
                                        idx < order.rating
                                          ? "currentColor"
                                          : "none"
                                      }
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-2">
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-2">
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <Truck size={14} className="text-green-500" />
                                Laundry: {order.laundryName.replace(/_/g, " ")}
                              </p>
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <CalendarClock
                                  size={14}
                                  className="text-green-500"
                                />
                                Delivered: {order.deliveredOn}
                              </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="text-xs font-semibold text-gray-700">
                                      Item
                                    </TableHead>
                                    <TableHead className="text-xs font-semibold text-gray-700 text-right">
                                      Qty
                                    </TableHead>
                                    <TableHead className="text-xs font-semibold text-gray-700 text-right">
                                      Weight
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {order.items.map((item, idx) => (
                                    <TableRow
                                      key={idx}
                                      className="border-b border-gray-100"
                                    >
                                      <TableCell className="text-xs font-medium text-gray-700">
                                        {item.item
                                          .replace(/([A-Z])/g, " $1")
                                          .trim()}
                                      </TableCell>
                                      <TableCell className="text-xs text-right text-gray-700">
                                        {item.quantity}
                                      </TableCell>
                                      <TableCell className="text-xs text-right text-gray-700">
                                        {item.weight} kg
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                  <TableRow>
                                    <TableCell className="text-xs font-semibold text-gray-700">
                                      Total
                                    </TableCell>
                                    <TableCell className="text-xs text-right font-semibold text-gray-700">
                                      {order.items.reduce(
                                        (sum, item) => sum + item.quantity,
                                        0
                                      )}
                                    </TableCell>
                                    <TableCell className="text-xs text-right font-semibold text-gray-700">
                                      {order.items
                                        .reduce(
                                          (sum, item) => sum + item.weight,
                                          0
                                        )
                                        .toFixed(1)}{" "}
                                      kg
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between items-center pt-2">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <CalendarClock size={12} />
                              {order.deliveredOn}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-gray-600 border-gray-200 hover:bg-gray-50"
                            >
                              View Details
                              <ArrowRight size={16} className="ml-2" />
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}

                      {orderHistory.length === 0 && (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                          <div className="bg-white p-4 rounded-full inline-flex items-center justify-center mb-4 shadow-sm">
                            <ClipboardCheck
                              size={32}
                              className="text-gray-400"
                            />
                          </div>
                          <p className="text-gray-600 font-medium">
                            No order history yet
                          </p>
                          <p className="text-gray-500 text-sm mb-4">
                            Your completed orders will appear here
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default UserDashboard;
