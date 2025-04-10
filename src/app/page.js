"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  WashingMachine,
  Atom,
  Clock,
  Star,
  Truck,
  Check,
  Menu,
  X,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Home() {
  const { data: session, status } = useSession();
  console.log("Session Data: ", session);
  console.log("Session Status: ", status);

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const services = [
    {
      title: "Regular Wash & Fold",
      description:
        "Professional care for everyday laundry needs with eco-friendly detergents",
      icon: <WashingMachine className="h-10 w-10 text-blue-500" />,
    },
    {
      title: "Dry Cleaning",
      description:
        "Expert treatment for your delicate fabrics and special garments",
      icon: <Atom className="h-10 w-10 text-blue-500" />,
    },
    {
      title: "Express Service",
      description: "Same-day service when you need your items cleaned quickly",
      icon: <Clock className="h-10 w-10 text-blue-500" />,
    },
    {
      title: "Stain Removal",
      description: "Specialized treatments to remove even the toughest stains",
      icon: <Star className="h-10 w-10 text-blue-500" />,
    },
    {
      title: "Free Pickup & Delivery",
      description: "Contactless collection and return at your convenience",
      icon: <Truck className="h-10 w-10 text-blue-500" />,
    },
    {
      title: "40 Washes Per Semester",
      description:
        "All SRM AP students get 40 washes each semester included with your housing",
      icon: <Check className="h-10 w-10 text-blue-500" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navbar */}
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <motion.div
                initial={{ rotate: -10, scale: 0.9 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <WashingMachine className="h-8 w-8 text-blue-600" />
              </motion.div>
              <span className="text-2xl font-bold text-blue-600">
                True Colors
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <NavigationMenu>
                <NavigationMenuList className="flex space-x-6">
                  <NavigationMenuItem>
                    <Link
                      href="#services"
                      className="text-gray-700 hover:text-blue-600 font-medium"
                    >
                      Services
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link
                      href="#pricing"
                      className="text-gray-700 hover:text-blue-600 font-medium"
                    >
                      Pricing
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link
                      href="#about"
                      className="text-gray-700 hover:text-blue-600 font-medium"
                    >
                      About Us
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link
                      href="#contact"
                      className="text-gray-700 hover:text-blue-600 font-medium"
                    >
                      Contact
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              {status === "authenticated" ? (
                <div className="flex items-center space-x-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-15 w-15 rounded-full"
                      >
                        {session?.user?.image ? (
                          <Image
                            src={session.user.image}
                            alt="Profile"
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <Avatar>
                            <AvatarFallback>
                              {session?.user?.name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>
                        {session?.user?.name || "User"}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link href="/dashboard" className="w-full">
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/profile" className="w-full">
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <div className="w-full">
                          Washes Remaining: {session?.user?.washes || 0}
                        </div>
                      </DropdownMenuItem>
                      {!session?.user?.isSubscribed && (
                        <DropdownMenuItem>
                          <Link href="/create-order" className="w-full">
                            Create Order
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Button
                          variant="ghost"
                          className="w-full justify-start p-0 text-red-600 hover:text-red-700"
                          onClick={() => signOut()}
                        >
                          Sign Out
                        </Button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Link href="/signin">
                  <Button
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                  >
                    Log In
                  </Button>
                </Link>
              )}
            </nav>
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 pt-2 pb-4 space-y-3">
              <Link
                href="#services"
                className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
              >
                Services
              </Link>
              <Link
                href="#pricing"
                className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
              >
                Pricing
              </Link>
              <Link
                href="#about"
                className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
              >
                About Us
              </Link>
              <Link
                href="#contact"
                className="block py-2 text-gray-700 hover:text-blue-600 font-medium"
              >
                Contact
              </Link>
              {status === "authenticated" ? (
                <div className="pt-2 space-y-2">
                  <div className="flex items-center space-x-2 py-2">
                    {session?.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {session?.user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <span className="font-medium truncate">
                      {session?.user?.name}
                    </span>
                  </div>
                  <div className="py-1">
                    Washes Remaining: {session?.user?.washes || 0}
                  </div>
                  <Link href="/dashboard">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-700 hover:text-blue-600"
                    >
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/profile">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-700 hover:text-blue-600"
                    >
                      Profile
                    </Button>
                  </Link>
                  {!session?.user?.isSubscribed && (
                    <Link href="/create-order">
                      <Button
                        variant="outline"
                        className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                      >
                        Create Order
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="outline"
                    className="w-full border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                    onClick={() => signOut()}
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="pt-2">
                  <Link href="/signin">
                    <Button
                      variant="outline"
                      className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                    >
                      Log In
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center">
              <motion.div
                className="md:w-1/2 mb-10 md:mb-0"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                  <span className="text-blue-600">True Colors</span> Laundry
                  Service
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Professional laundry care that keeps your clothes looking
                  their best. Convenient pickup and delivery to your door.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white text-lg py-6 px-8">
                    Schedule Pickup
                  </Button>
                  <Button
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 text-lg py-6 px-8"
                  >
                    View Services
                  </Button>
                </div>
              </motion.div>
              <motion.div
                className="md:w-1/2"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <div className="relative h-64 sm:h-80 md:h-96 w-full rounded-xl overflow-hidden shadow-2xl">
                  <div className="w-full h-full bg-blue-300 flex items-center justify-center text-center p-4 relative">
                    <Image
                      src="/LaundryLanding.jpg"
                      alt="Laundry Landing"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Why Choose True Colors?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We take pride in delivering exceptional laundry care with
                attention to detail and eco-friendly practices.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerChildren}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {services.map((service, index) => (
                <motion.div key={index} variants={fadeIn}>
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-gray-200">
                    <CardHeader>
                      <div className="mb-4">{service.icon}</div>
                      <CardTitle className="text-xl font-semibold">
                        {service.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{service.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="py-20 bg-gradient-to-b from-blue-50 to-white"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our simple process makes laundry day stress-free
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="bg-blue-100 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-2xl font-semibold mb-3">
                  Schedule a Pickup
                </h3>
                <p className="text-gray-600">
                  Book online or call us to arrange a convenient pickup time
                  from your location.
                </p>
              </motion.div>

              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="bg-blue-100 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="text-2xl font-semibold mb-3">
                  We Clean Your Items
                </h3>
                <p className="text-gray-600">
                  Our professionals clean and treat your garments with care
                  using eco-friendly products.
                </p>
              </motion.div>

              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="bg-blue-100 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-blue-600">3</span>
                </div>
                <h3 className="text-2xl font-semibold mb-3">
                  Delivery to Your Door
                </h3>
                <p className="text-gray-600">
                  We deliver your fresh, clean items back to you folded and
                  ready to use.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose the plan that works best for you with no hidden fees
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="border-gray-200 h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl font-bold">
                      Basic Wash
                    </CardTitle>
                    <div className="mt-4 text-4xl font-bold text-blue-600">
                      12₹
                      <span className="text-sm text-gray-500 font-normal">
                        /kg
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span>Wash, dry & fold service</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span>Eco-friendly detergents</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span>48-hour turnaround</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span>Free pickup over 20 lbs</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Get Started
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
              >
                <Card className="border-blue-600 border-2 h-full shadow-lg">
                  <CardHeader className="text-center pb-4 bg-blue-50 rounded-t-lg">
                    <div className="py-1 px-4 bg-blue-600 text-white text-sm font-medium rounded-full inline-block mb-2">
                      Most Popular
                    </div>
                    <CardTitle className="text-2xl font-bold">
                      Premium Care
                    </CardTitle>
                    <div className="mt-4 text-4xl font-bold text-blue-600">
                      18₹
                      <span className="text-sm text-gray-500 font-normal">
                        /kg
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span>Everything in Basic</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span>Premium fabric softeners</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span>24-hour turnaround</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span>Free pickup & delivery</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span>Stain treatment included</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Choose Plan
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="border-gray-200 h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl font-bold">
                      Business
                    </CardTitle>
                    <div className="mt-4 text-4xl font-bold text-blue-600">
                      Custom
                      <span className="text-sm text-gray-500 font-normal"></span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span>Everything in Premium</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span>Volume discounts</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span>Dedicated account manager</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span>Scheduled recurring service</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span>Commercial solutions</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                      Contact Sales
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20 bg-blue-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                What Our Customers Say
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Join thousands of satisfied customers who love our service
              </p>
            </motion.div>

            <Tabs defaultValue="tab1" className="max-w-4xl mx-auto">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="tab1">Individuals</TabsTrigger>
                <TabsTrigger value="tab2">Families</TabsTrigger>
                <TabsTrigger value="tab3">Businesses</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center mb-4">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 italic mb-4">
                        "True Colors has transformed my laundry experience.
                        Their service is reliable, and my clothes come back
                        perfectly clean every time. Highly recommend!"
                      </p>
                      <p className="font-semibold">- Sarah J.</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center mb-4">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 italic mb-4">
                        "As a busy professional, I don't have time for laundry.
                        True Colors delivers on their promise of quality and
                        convenience. Worth every penny!"
                      </p>
                      <p className="font-semibold">- Michael T.</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="tab2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center mb-4">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 italic mb-4">
                        "With three kids, laundry was overwhelming. True Colors
                        has given us back family time. Their service is
                        exceptional and the staff is wonderful!"
                      </p>
                      <p className="font-semibold">- The Williams Family</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center mb-4">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 italic mb-4">
                        "We've tried several laundry services but True Colors is
                        by far the best. They handle our family's laundry with
                        care and attention to detail."
                      </p>
                      <p className="font-semibold">- The Rodriguez Family</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="tab3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center mb-4">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 italic mb-4">
                        "True Colors handles all our office linens and staff
                        uniforms. Their reliability and quality service has been
                        invaluable to our business."
                      </p>
                      <p className="font-semibold">- Coastal Cafe</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center mb-4">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 italic mb-4">
                        "As a boutique hotel, quality matters. True Colors
                        delivers consistently excellent service that our guests
                        notice and appreciate."
                      </p>
                      <p className="font-semibold">- Harbor View Inn</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Ready to experience True Colors quality?
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Join thousands of satisfied customers who never worry about
                laundry day again.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6">
                  Schedule Your First Pickup
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-white bg-blue-500 text-lg px-8 py-6"
                >
                  Learn More
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <motion.div
                className="text-center mb-16"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeIn}
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Get in Touch
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Have questions or ready to schedule your first pickup? Contact
                  our friendly team today.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold">
                        Contact Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-3 rounded-full mr-4">
                          <MapPin className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-1">
                            Our Location
                          </h3>
                          <p className="text-gray-600">
                            123 Main Street, Suite 100
                            <br />
                            Anytown, CA 12345
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-blue-100 p-3 rounded-full mr-4">
                          <Phone className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-1">
                            Call Us
                          </h3>
                          <p className="text-gray-600">(555) 123-4567</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-blue-100 p-3 rounded-full mr-4">
                          <Mail className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-1">
                            Email Us
                          </h3>
                          <p className="text-gray-600">
                            info@truecolorslaundry.com
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-blue-100 p-3 rounded-full mr-4">
                          <Clock className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-1">
                            Business Hours
                          </h3>
                          <p className="text-gray-600">
                            Monday - Friday: 7:00 AM - 9:00 PM
                            <br />
                            Saturday: 8:00 AM - 6:00 PM
                            <br />
                            Sunday: 9:00 AM - 5:00 PM
                          </p>
                        </div>
                      </div>

                      <div className="pt-4">
                        <h3 className="font-semibold text-lg mb-3">
                          Connect With Us
                        </h3>
                        <div className="flex space-x-4">
                          <a
                            href="#"
                            className="bg-blue-100 p-2 rounded-full hover:bg-blue-200 transition-colors"
                          >
                            <Facebook className="h-6 w-6 text-blue-600" />
                          </a>
                          <a
                            href="#"
                            className="bg-blue-100 p-2 rounded-full hover:bg-blue-200 transition-colors"
                          >
                            <Instagram className="h-6 w-6 text-blue-600" />
                          </a>
                          <a
                            href="#"
                            className="bg-blue-100 p-2 rounded-full hover:bg-blue-200 transition-colors"
                          >
                            <Twitter className="h-6 w-6 text-blue-600" />
                          </a>
                          <a
                            href="#"
                            className="bg-blue-100 p-2 rounded-full hover:bg-blue-200 transition-colors"
                          >
                            <Linkedin className="h-6 w-6 text-blue-600" />
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold">
                        Send Us a Message
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Your Name
                            </label>
                            <input
                              type="text"
                              id="name"
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              placeholder="John Doe"
                            />
                          </div>
                          <div className="space-y-2">
                            <label
                              htmlFor="email"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Email Address
                            </label>
                            <input
                              type="email"
                              id="email"
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              placeholder="john@example.com"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="(555) 123-4567"
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="subject"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Subject
                          </label>
                          <input
                            type="text"
                            id="subject"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="How can we help you?"
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="message"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Message
                          </label>
                          <textarea
                            id="message"
                            rows={5}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Your message here..."
                          ></textarea>
                        </div>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3">
                          Send Message
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="bg-gray-100 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                <div className="relative w-full h-96 bg-blue-200 flex items-center justify-center">
                  <div className="w-full h-full">
                    <iframe
                      className="w-full h-full border border-black"
                      src="https://www.openstreetmap.org/export/embed.html?bbox=80.49607515335083%2C16.455965234215633%2C80.51409959793092%2C16.47084307599445&amp;layer=mapnik&amp;marker=16.46340429781441%2C80.50508737564087"
                    ></iframe>
                  </div>
                </div>
                <div className="text-center py-4">
                  <a
                    href="https://www.openstreetmap.org/?mlat=16.46340&amp;mlon=80.50509#map=16/16.46340/80.50509"
                    className="text-blue-700 underline"
                  >
                    View Larger Map
                  </a>
                  <p className="text-blue-700 mt-2">
                    An interactive map would be displayed here
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                className="text-center mb-16"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeIn}
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Find answers to common questions about our laundry service
                </p>
              </motion.div>

              <div className="space-y-6">
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-lg font-medium">
                      How does your pickup and delivery service work?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      We offer convenient pickup and delivery at your doorstep.
                      Simply schedule a pickup through our website or app,
                      prepare your laundry in a bag, and our driver will collect
                      it. Once your items are cleaned, we'll deliver them back
                      to you at your preferred time.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-lg font-medium">
                      What cleaning products do you use?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      We use high-quality, eco-friendly detergents and fabric
                      softeners that are gentle on your clothes and the
                      environment. Our premium service includes hypoallergenic
                      options for customers with sensitive skin.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-lg font-medium">
                      How do you handle delicate items?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      Delicate garments receive special care with our gentle
                      washing cycles and appropriate temperature settings. For
                      highly sensitive items that require dry cleaning, we use
                      modern cleaning methods that preserve fabric quality.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger className="text-lg font-medium">
                      How long does the service take?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      Our standard service has a 48-hour turnaround time.
                      Premium service offers 24-hour turnaround, and we also
                      provide same-day express service for urgent needs (subject
                      to availability and additional fee).
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger className="text-lg font-medium">
                      Do you offer subscription plans?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      Yes, we offer weekly, bi-weekly, and monthly subscription
                      plans with discounted rates. Subscribers also enjoy
                      priority scheduling and additional perks like free stain
                      removal and garment repairs.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <Link href="/" className="flex items-center space-x-2 mb-6">
                <WashingMachine className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold text-white">
                  True Colors
                </span>
              </Link>
              <p className="text-gray-400 mb-6">
                Premium laundry service that delivers clean, fresh clothes to
                your doorstep. Convenient, reliable, and eco-friendly.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Linkedin className="h-6 w-6" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="#services"
                    className="text-gray-400 hover:text-white"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="text-gray-400 hover:text-white"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#about"
                    className="text-gray-400 hover:text-white"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#contact"
                    className="text-gray-400 hover:text-white"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Services</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Wash & Fold
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Dry Cleaning
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Express Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Stain Removal
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Business Solutions
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Newsletter</h3>
              <p className="text-gray-400 mb-4">
                Subscribe to our newsletter for tips and special offers
              </p>
              <form className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400">
                © 2025 True Colors Laundry. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Terms of Service
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
