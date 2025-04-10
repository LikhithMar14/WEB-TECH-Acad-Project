"use client"

import React from 'react';
import Navbar from "@/components/custom/navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}