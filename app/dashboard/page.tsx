"use client";
import { useTurnkey } from "@turnkey/sdk-react";
import { useEffect, useState } from "react";
import { Session } from "@turnkey/sdk-types";

export default function Dashboard() {
  const { turnkey, indexedDbClient } = useTurnkey();
  const [session, setSession] = useState<Session | null>(null);

  const client = indexedDbClient;

  const getAccounts = async () => {
    try {
      if (session) {
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
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  useEffect(() => {
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
  }, [turnkey]);
  return <div>Dashboard</div>;
}
