// src/app/create-order/page.jsx
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Trash2 } from "lucide-react"
import { createOrder } from "@/actions/order"
import { addItemToCart, getOrCreateCart, clearCart, removeCartItem } from "@/actions/cart"

// Enum values from the schema
const cartItemsEnum = {
  Jeans: "Jeans",
  Other: "Other",
  Shirt: "Shirt",
  BedSheet: "BedSheet",
  Towel: "Towel",
  Tshirt: "Tshirt",
  TrackPants: "TrackPants"
}

const laundryNameEnum = {
  Krishna_Tower_Basement: "Krishna Tower Basement",
  Vedhavathi_Tower_Basement: "Vedhavathi Tower Basement"
}

const CreateOrderPage = () => {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [cartItems, setCartItems] = useState([])
  const [selectedItem, setSelectedItem] = useState("")
  const [weight, setWeight] = useState("1.0")
  const [quantity, setQuantity] = useState("1")
  const [cart, setCart] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const form = useForm({
    defaultValues: {
      laundryName: "Krishna_Tower_Basement",
    },
  })

  useEffect(() => {
    const fetchInitialData = async () => {
      if (status === "authenticated" && session?.user) {
        try {

          const userCart = await getOrCreateCart(session.user.id);
          setCart(userCart);
          
             
          if (userCart.items?.length > 0) {
            setCartItems(userCart.items.map(item => ({
              id: item.id,
              item: item.item,
              weight: parseFloat(item.weight.toString()),
              quantity: item.quantity
            })));
          }
        } catch (error) {
          console.error("Error fetching cart:", error);
          setError("Failed to load your cart. Please try again.");
        }
      }
    };

    fetchInitialData();
  }, [session, status]);

  const handleAddItem = async () => {
    if (!session) {
      setError("You must be logged in to add items");
      return;
    }
    
    if (selectedItem && weight && quantity) {
      try {
        // Add item to cart in the database
        const newItem = await addItemToCart(
          session.user.id,
          selectedItem,
          parseFloat(weight.toString()),
          parseInt(quantity)
        );
        
        // Update local state
        setCartItems([
          ...cartItems,
          {
            id: newItem.id,
            item: selectedItem,
            weight: parseFloat(weight.toString()),
            quantity: parseInt(quantity),
          },
        ]);
        
        // Reset form fields
        setSelectedItem("");
        setWeight("1.0");
        setQuantity("1");
        setError(null);
      } catch (error) {
        console.error("Error adding item to cart:", error);
        setError("Failed to add item to cart. Please try again.");
      }
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      // Remove item from database
      await removeCartItem(id);
      
      // Update local state
      setCartItems(cartItems.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error removing item:", error);
      setError("Failed to remove item. Please try again.");
    }
  };

  const calculateTotalWashes = () => {
    return cartItems.reduce((total, item) => {
      // Simple calculation - 1 wash per kg, multiplied by quantity
      return total + (item.weight * item.quantity)
    }, 0)
  };

  const onSubmit = async (values) => {
    if (cartItems.length === 0) {
      setError("Please add at least one item to your order");
      return;
    }

    if (!session) {
      setError("You must be logged in to create an order");
      return;
    }

    const totalWashes = calculateTotalWashes();
    if (totalWashes > session.user.washes) {
      setError(`Not enough washes available. You need ${Math.ceil(totalWashes)} washes but have ${session.user.washes} remaining.`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Create the order using server action
      await createOrder(session.user.id, cart.id, values.laundryName);
      
      // Redirect to dashboard
      router.push("/dashboard/user");
    } catch (error) {
      console.error("Error creating order:", error);
      setError(error.message || "Failed to create order. Please try again.");
      setIsSubmitting(false);
    }
  };

  // If not authenticated
  if (status === "unauthenticated") {
    router.push("/signin");
    return null;
  }
  
  // If still loading session
  if (status === "loading") {
    return (
      <div className="container mx-auto py-16 px-4 flex justify-center items-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-blue-700 mb-6">Create New Laundry Order</h1>
        
        {session?.user && (
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-blue-800">
              Welcome, <span className="font-semibold">{session.user.name}</span>
            </p>
            <p className="text-blue-600">
              Available washes: <span className="font-bold">{session.user.washes}</span> / 40
            </p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          className="md:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-blue-200">
            <CardHeader className="bg-blue-50 border-b border-blue-100">
              <CardTitle className="text-blue-800">Add Items to Cart</CardTitle>
              <CardDescription>Select items for laundry service</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Type
                  </label>
                  <Select
                    value={selectedItem}
                    onValueChange={setSelectedItem}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select item" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(cartItemsEnum).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (kg)
                  </label>
                  <Input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
              </div>
              
              <Button 
                type="button" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleAddItem}
              >
                Add Item to Cart
              </Button>
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Cart Items</h3>
                
                {cartItems.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Your cart is empty</p>
                ) : (
                  <motion.div 
                    className="space-y-3"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {cartItems.map((item) => (
                      <motion.div 
                        key={item.id} 
                        className="flex justify-between items-center p-3 border rounded-lg bg-gray-50"
                        variants={itemVariants}
                      >
                        <div>
                          <span className="font-medium">{item.item}</span>
                          <div className="text-sm text-gray-600">
                            {item.quantity} x {item.weight.toFixed(1)} kg
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                            {(item.weight * item.quantity).toFixed(1)} kg total
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}

                    <div className="pt-4 mt-4 border-t">
                      <div className="flex justify-between font-semibold">
                        <span>Total Weight:</span>
                        <span>{calculateTotalWashes().toFixed(1)} kg</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Total Washes Required:</span>
                        <span>{Math.ceil(calculateTotalWashes())}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Available Wash Units:</span>
                        <span className={`${session && calculateTotalWashes() > session.user.washes ? 'text-red-600' : 'text-green-600'}`}>
                          {session ? session.user.washes : '—'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
                  <FormField
                    control={form.control}
                    name="laundryName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Laundry Location</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a laundry location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(laundryNameEnum).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the laundry location closest to you
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-4 pb-2">
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={
                        isSubmitting || 
                        cartItems.length === 0 || 
                        (session && calculateTotalWashes() > session.user.washes)
                      }
                    >
                      {isSubmitting ? "Processing..." : "Create Order"}
                    </Button>
                    
                    {session && calculateTotalWashes() > session.user.washes && (
                      <p className="text-sm text-red-600 mt-2">
                        You don't have enough wash units available. Please remove some items.
                      </p>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          className="md:col-span-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader className="bg-blue-50 border-b border-blue-100">
              <CardTitle className="text-blue-800">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items in cart:</span>
                  <span className="font-medium">{cartItems.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total weight:</span>
                  <span className="font-medium">{calculateTotalWashes().toFixed(1)} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Washes required:</span>
                  <span className="font-medium">{Math.ceil(calculateTotalWashes())}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Remaining after order:</span>
                  <span className={session && (session.user.washes - Math.ceil(calculateTotalWashes())) < 0 ? 'text-red-600' : 'text-green-600'}>
                    {session ? Math.max(0, session.user.washes - Math.ceil(calculateTotalWashes())) : '—'}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2">40 Washes per session</h4>
                <p className="text-sm text-gray-600">
                  As an SRM AP student, you get 40 washes per session. Each kg of laundry counts as one wash unit.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateOrderPage;