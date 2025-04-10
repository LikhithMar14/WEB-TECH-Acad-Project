"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, User } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const Navbar = () => {
  const { data: session, status } = useSession();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between px-6 py-4 bg-white text-gray-800 shadow-lg border-b border-gray-200 z-10"
    >
      <Link href="/">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-2xl font-bold text-blue-600"
        >
          True Colors
        </motion.div>
      </Link>
      
      <div className="flex items-center gap-6">
        {/* Cart Icon with Badge */}
        <Link href="/cart">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative cursor-pointer"
          >
            <ShoppingCart className="h-6 w-6 text-blue-600" />
            <Badge className="absolute -top-2 -right-2 bg-blue-600 text-white">3</Badge>
          </motion.div>
        </Link>
        
        {/* User Profile */}
        {status === "authenticated" ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer"
              >
                <Avatar className="h-8 w-8 border-2 border-blue-600">
                  <AvatarImage src={session?.user?.image} alt={session?.user?.name} />
                  <AvatarFallback className="bg-blue-600 text-white">
                    {session?.user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="z-50 w-56 bg-white text-gray-800 shadow-md border border-gray-200"
              sideOffset={5}
            >
              <DropdownMenuLabel className="text-blue-600">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 text-gray-800 hover:bg-blue-100">
                <User className="h-4 w-4 text-blue-600" />
                <span>{session?.user?.name}</span>
              </DropdownMenuItem>
              <Link href="/profile">
                <DropdownMenuItem className="hover:bg-blue-100 cursor-pointer">
                  Profile
                </DropdownMenuItem>
              </Link>
              <Link href="/orders">
                <DropdownMenuItem className="hover:bg-blue-100 cursor-pointer">
                  Orders
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="hover:bg-blue-100 cursor-pointer"
                onClick={() => signOut()}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow"
            >
              <User className="h-4 w-4" />
              Login
            </motion.button>
          </Link>
        )}
      </div>
    </motion.div>
  );
};

export default Navbar;