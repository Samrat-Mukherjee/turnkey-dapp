"use client";
import { useTurnkey } from "@turnkey/sdk-react";
import { useEffect, useState } from "react";
import { Session } from "@turnkey/sdk-types";
import { get } from "http";
import { hashMessage } from "viem";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { turnkey, indexedDbClient } = useTurnkey();
  const [session, setSession] = useState<Session | null>(null);
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState<string | null>(null);
  const router = useRouter();

  const client = indexedDbClient;

   useEffect(() => {
    fetchSession();
    //getSignWith();
  }, [turnkey]);

  const fetchSession = async () => {
    try {
      const currentSession = await turnkey?.getSession();
      if (currentSession) {
        setSession(currentSession);
        console.log("Current Session: ", currentSession);
      }
    } catch (error) {
      console.error("Error fetching session:", error);
    }
  };

  const getSignWith = async () => {
    try {
      if (session) {
        console.log("Session exists:", session);
        // The user's sub-organization id
        const organizationId = session?.organizationId;

        // Get the user's wallets
        const wallets = await client?.getWallets({
          organizationId,
        });

        // Get the first wallet of the user
        const walletId = wallets?.wallets[0].walletId ?? "";

        // Use the `walletId` to get the accounts associated with the wallet
        const accounts = await client?.getWalletAccounts({
          organizationId,
          walletId,
        });

        // find an Ethereum account
        const matchingAccount = accounts?.accounts.find(
          (account) => account.addressFormat === "ADDRESS_FORMAT_ETHEREUM"
        );

        const signWith = matchingAccount?.address ?? "";

        console.log("signWith:", signWith);

        return signWith;
      } else {
        // log out and clear session
        handleLogout
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const signMessage = async () => {
    try {
      const payload = hashMessage(message);
      const signWith = await getSignWith();
      if (!signWith) {
        throw new Error("Missing signWith value");
      }

      const signature = await client?.signRawPayload({
        payload,
        signWith,
        // The message encoding format
        encoding: "PAYLOAD_ENCODING_TEXT_UTF8",
        // The hash function used to hash the message
        hashFunction: "HASH_FUNCTION_KECCAK256",
      });

      if (signature?.r && signature?.s && signature?.v) {
        const fullSignature = `0x${signature.v}${signature.r}${signature.s}`;
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
      turnkey?.logout();
      indexedDbClient?.clear();
      setSession(null);
      setSignature(null);
      setMessage('');
    
      router.push('/'); // Redirect to the first page
      window.location.href = "/";
    
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

 
  return (
    <div className="max-w-2xl mx-auto mt-20 p-8 bg-white rounded-xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Sign a Message</h2>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter message to sign"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <button
        onClick={signMessage}
        className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
      >
        Sign Message
      </button>

      {signature && (
        <div className="bg-gray-100 p-4 rounded-lg border border-gray-300">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Signature</h3>
          <code className="block text-sm text-gray-800 break-words">
            {signature}
          </code>
        </div>
      )}

       <button
        onClick={handleLogout}
        className="absolute top-6 right-6 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition-all"
      >
        Logout
      </button>
    </div>
  );
}
