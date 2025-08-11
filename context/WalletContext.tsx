"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useTurnkey } from "@turnkey/sdk-react";
import { Session } from "@turnkey/sdk-types";
import { onError } from "@/lib/utils/onError";
import { TurnkeyIndexedDbClient } from "@turnkey/sdk-browser";

interface WalletAddress {
  address: string;
  addressFormat: string;
  walletId: string;
  walletAccountId: string;
}

interface WalletContextType {
  loading: boolean;
  session: Session | null;
  walletAddress: WalletAddress[];
  walletBalance: string;
  message: string;
  signature: string | null;
  getAccountAddress: () => Promise<WalletAddress[]>;
  setMessage: (msg: string) => void;
  signMessage: () => Promise<void>;
  handleLogout: () => Promise<void>;
  refreshWallet: () => Promise<void>;
}

export const WalletContext = createContext<WalletContextType | undefined>(
  undefined
);

type WALLET_TYPE = "ADDRESS_FORMAT_ETHEREUM" | "ADDRESS_FORMAT_TRON";

export function WalletProvider({ children }: { children: ReactNode }) {
  const { turnkey, indexedDbClient } = useTurnkey();

  // Keep client in state to avoid running before ready
  const [client, setClient] = useState<TurnkeyIndexedDbClient | null>(null);

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [allAddress, setAllAddress] = useState<WalletAddress[]>([]);
  const [walletBalance, setWalletBalance] = useState("0");
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState<string | null>(null);

  const getAccountAddress = async (): Promise<WalletAddress[]> => {
    try {
      const wallets = await client?.getWallets({
        organizationId: session?.organizationId,
      });

      if (!wallets?.wallets?.length) {
        return [];
      }

      // Get accounts for all wallets
      const walletsWithAccounts = await Promise.all(
        wallets.wallets.map(async (wallet: { walletId: string }) => {
          const accounts = await client?.getWalletAccounts({
            organizationId: session?.organizationId,
            walletId: wallet.walletId,
          });
          return accounts?.accounts || [];
        })
      );

      const allAddresses: WalletAddress[] = [];

      // Find the first ETH  & TRON accounts
      walletsWithAccounts[0]?.find((account) => {
        if (
          account.addressFormat === "ADDRESS_FORMAT_ETHEREUM" ||
          account.addressFormat === "ADDRESS_FORMAT_TRON"
        ) {
          allAddresses.push({
            address: account?.address,
            addressFormat: account?.addressFormat,
            walletId: account?.walletId,
            walletAccountId: account?.walletAccountId,
          });
        }
      });

      if (allAddresses?.length > 0) {
        setAllAddress(allAddresses);
        return allAddresses;
      }

      return [];
    } catch (error) {
      onError(error);
      return []; // Return empty array on error
    }
  };

  const refreshWallet = async () => {
    if (!client || !session) return;

    try {
      const addresses = await getAccountAddress();
      if (addresses && addresses.length > 0) {
        setAllAddress(addresses);
      }
    } catch (err) {
      onError(err);
    }
  };

  // Initialize client and session
  useEffect(() => {
    const initialize = async () => {
      if (!indexedDbClient || !turnkey) return;

      try {
        setLoading(true);
        setClient(indexedDbClient);

        const currentSession = await turnkey.getSession();
        if (currentSession?.organizationId) {
          setSession(currentSession);

          // Immediately try to get the address
          const address = await getAccountAddress();
          if (address) {
            console.log("Found existing wallet address");
          } else {
            console.log("No ETH address found, will try refresh...");
            await refreshWallet();
          }
        }
      } catch (err) {
        onError(err);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [indexedDbClient, turnkey]);

  // Ensure wallet is refreshed when client or session changes
  useEffect(() => {
    if (session?.organizationId && client && !loading) {
      refreshWallet();
    }
  }, [session?.organizationId, client]);

  const signMessage = async () => {
    if (!client || !session) return;
    try {
      const addresses = await getAccountAddress();
      const walletAddress = addresses.find(
        (addr) => addr.addressFormat === "ADDRESS_FORMAT_ETHEREUM"
      );

      if (!walletAddress?.address) throw new Error("No ETHEREUM wallet found");

      const result = await client.signRawPayload({
        payload: Buffer.from(message).toString("hex"),
        signWith: walletAddress.address,
        encoding: "PAYLOAD_ENCODING_HEXADECIMAL",
        hashFunction: "HASH_FUNCTION_SHA256",
      });

      if (result?.r && result?.s && result?.v) {
        setSignature(`0x${result.r}${result.s}${result.v}`);
      } else {
        setSignature(null);
      }
    } catch (err) {
      onError(err);
      setSignature("Error signing message");
      onError(err);
    }
  };

  const handleLogout = async () => {
    try {
      await turnkey?.logout();
      await client?.clear();
      window.location.href = "/";
    } catch (err) {
      onError(err);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        loading,
        session,
        walletAddress: allAddress,
        walletBalance,

        message,
        signature,
        setMessage,
        signMessage,
        getAccountAddress,
        handleLogout,
        refreshWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
