"use client";

import { useDashboardLogic } from "@/hooks/useDashboardLogic";
import { WalletCard } from "@/components/WalletCard";
import FaucetForm from "@/components/FaucetForm";
import NavBar from "@/components/NavBar";
import { ActivityCard } from "@/components/ActivityCard";

export default function Dashboard() {
  const {
    loading,
    tronAddress,
    walletBalance,
    message,
    signature,
    setMessage,
    signMessage,
    handleLogout,
    handleSuccess,
  } = useDashboardLogic();

  return (
    <NavBar>
      <div className="min-h-screen bg-gray-50 py-12">
        {/* <button
          onClick={handleLogout}
          className="absolute top-6 right-6 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition-all"
        >
          Logout
        </button> */}

        <div className="max-w-3xl mx-auto space-y-8 px-4">
            <WalletCard />
            <ActivityCard />
          {/* {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto" />
              <p className="mt-4 text-gray-600">Loading your wallet...</p>
            </div>
          ) : (
            <>
              <WalletCard />
             
            </>
          )} */}
        </div>
      </div>
    </NavBar>
  );
}
