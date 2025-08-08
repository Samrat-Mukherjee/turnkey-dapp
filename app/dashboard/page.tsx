"use client";

import { WalletCard } from "@/components/WalletCard";
import NavBar from "@/components/NavBar";
import { ActivityCard } from "@/components/ActivityCard";

export default function Dashboard() {
  return (
    <NavBar>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto space-y-8 px-4">
          <WalletCard />
          <ActivityCard />
        </div>
      </div>
    </NavBar>
  );
}
