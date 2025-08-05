"use client";
import { useTurnkey } from "@turnkey/sdk-react";
import { useEffect, useState } from "react";
import { Session } from "@turnkey/sdk-types";
import { useRouter } from "next/navigation";
import FaucetForm from "@/components/FaucetForm";

export default function Dashboard() {
  const { turnkey, indexedDbClient } = useTurnkey();
  const [session, setSession] = useState<Session | null>(null);
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState<string | null>(null);
  const [tronAddress, setTronAddress] = useState<string>("");
  const [walletBalance, setWalletBalance] = useState<string>("0");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const client = indexedDbClient;

  useEffect(() => {
    const initializeWallet = async () => {
      try {
        setLoading(true);
        await fetchSession();
      } catch (error) {
        console.error("Error initializing wallet:", error);
      }
    };

    initializeWallet();
  }, [turnkey]);

  // Separate useEffect to handle wallet initialization after session is available
  useEffect(() => {
    const getWalletInfo = async () => {
      try {
        if (session && session.organizationId) {
          const address = await getSignWith();
          console.log("Tron Address: ", address);
          if (address) {
            setTronAddress(address);
            await fetchTronBalance(address);
          }
        }
      } catch (error) {
        console.error("Error getting wallet info:", error);
      } finally {
        setLoading(false);
      }
    };

    getWalletInfo();
  }, [session]); // This will run whenever session changes

  const fetchSession = async () => {
    try {
      const currentSession = await turnkey?.getSession();
      console.log("Session Fetched: ", currentSession);

      if (currentSession?.organizationId) {
        setSession(currentSession);
        return currentSession;
      } else {
        console.log("No valid session found");
        setSession(null);
      }
    } catch (error) {
      console.error("Error fetching session:", error);
      setSession(null);
    }
  };

  const fetchTronBalance = async (address: string) => {
    try {
      // Using Tron's Nile testnet API (for testing purposes)
      const response = await fetch(
        `https://nile.trongrid.io/v1/accounts/${address}`
      );
      const data = await response.json();
      const balance = data?.data?.[0]?.balance ?? 0;
      setWalletBalance((balance / 1_000_000).toString()); // Convert from SUN to TRX
    } catch (error) {
      console.error("Error fetching balance:", error);
      setWalletBalance("0");
    }
  };

  const getSignWith = async () => {
    try {
      const organizationId = session?.organizationId;
      if (!organizationId || !client) {
        console.log("No organization ID or client");
        return "";
      }

      console.log("Getting wallets for organization:", organizationId);

      // Get all wallets
      const wallets = await client.getWallets({
        organizationId,
      });

      if (!wallets?.wallets.length) {
        console.log("No wallets found");
        return "";
      }

      // Iterate through each wallet to find a Tron account
      for (const wallet of wallets.wallets) {
        try {
          const accounts = await client.getWalletAccounts({
            organizationId,
            walletId: wallet.walletId,
          });

          console.log("Accounts => ", accounts);

          if (!accounts?.accounts) continue;

          // Look specifically for Tron accounts
          const tronAccount = accounts.accounts.find(
            (account) =>
              //   account.addressFormat === "ADDRESS_FORMAT_TRON" &&
              //   account.path.startsWith("m/44'/195'/") // Verify it's a Tron derivation path

              account.addressFormat === "ADDRESS_FORMAT_ETHEREUM" &&
              account.path.startsWith("m/44'/60'/")
          );

          if (tronAccount) {
            console.log("Found Tron account:", tronAccount);
            return tronAccount.address;
          }
        } catch (err) {
          console.error(`Error checking wallet ${wallet.walletId}:`, err);
          continue;
        }
      }

      console.log("No Tron wallet found in any account");
      return "";
    } catch (error) {
      console.error("Error in getSignWith:", error);
      return "";
    }
  };

  const signMessage = async () => {
    try {
      const signWith = await getSignWith();
      if (!signWith) {
        throw new Error("No Tron wallet found");
      }

      // For Tron, we'll use SHA256 hash function which is standard for Tron
      const signature = await client?.signRawPayload({
        payload: Buffer.from(message).toString("hex"), // Convert message to hex
        signWith,
        encoding: "PAYLOAD_ENCODING_HEXADECIMAL",
        hashFunction: "HASH_FUNCTION_SHA256",
      });

      if (signature?.r && signature?.s && signature?.v) {
        const fullSignature = `0x${signature.r}${signature.s}${signature.v}`;
        setSignature(fullSignature);
      } else {
        setSignature(null);
        console.warn("Incomplete signature components");
      }
    } catch (err) {
      console.error("Signing failed:", err);
      setSignature("Error signing message");
    }
  };

  const handleLogout = async () => {
    try {
      await turnkey?.logout();
      await indexedDbClient?.clear();
      setSession(null);
      setSignature(null);
      setMessage("");
      setTronAddress("");
      setWalletBalance("0");

      // Use window.location.href for a full page refresh after cleanup
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

   const handleSuccess = (txHash: string) => {
    console.log('Faucet request successful:', txHash);
    // You can add additional success handling here
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition-all"
      >
        Logout
      </button>

      <div className="max-w-3xl mx-auto space-y-8 px-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your wallet...</p>
          </div>
        ) : (
          <>
            {/* Wallet Info Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Your Tron Wallet
              </h2>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-gray-50">
                  <p className="text-sm text-gray-600 mb-1">Wallet Address</p>
                  <p className="font-mono text-sm break-all">
                    {tronAddress || "No wallet found"}
                  </p>
                </div>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <p className="text-sm text-gray-600 mb-1">Balance</p>
                  <p className="font-mono text-lg">{walletBalance} TRX</p>
                </div>
              </div>
            </div>

              <FaucetForm onSuccess={handleSuccess} />

            {/* Message Signing Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Sign Message
              </h2>
              <div className="space-y-4">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter message to sign"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />

                <button
                  onClick={signMessage}
                  disabled={!message || !tronAddress}
                  className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Sign Message
                </button>

                {signature && (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      Signature
                    </h3>
                    <div className="bg-white p-4 rounded-lg border">
                      <code className="block text-sm text-gray-800 break-all font-mono">
                        {signature}
                      </code>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
