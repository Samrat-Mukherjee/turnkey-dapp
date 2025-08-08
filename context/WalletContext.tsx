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

interface WalletContextType {
  loading: boolean;
  session: Session | null;
  ethAddress: string;
  walletBalance: string;
  message: string;
  signature: string | null;
  getEthAddress: () => Promise<string>;
  setMessage: (msg: string) => void;
  signMessage: () => Promise<void>;
  handleLogout: () => Promise<void>;
  refreshWallet: () => Promise<void>;
}

export const WalletContext = createContext<WalletContextType | undefined>(
  undefined
);

export function WalletProvider({ children }: { children: ReactNode }) {
  const { turnkey, indexedDbClient } = useTurnkey();

  // Keep client in state to avoid running before ready
  const [client, setClient] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [ethAddress, setEthAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState("0");
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState<string | null>(null);

  const getEthAddress = async (): Promise<string> => {
    try {
      const wallets = await client.getWallets({
        organizationId: session?.organizationId,
      });

      if (!wallets?.wallets?.length) {
        return "";
      }

      // Get accounts for all wallets
      const walletsWithAccounts = await Promise.all(
        wallets.wallets.map(async (wallet: { walletId: string }) => {
          const accounts = await client.getWalletAccounts({
            organizationId: session?.organizationId,
            walletId: wallet.walletId,
          });
          return accounts?.accounts || [];
        })
      );

      // Find the first ETH account
      const ethAccount = walletsWithAccounts
        .flat()
        .find(
          (account) => account?.addressFormat === "ADDRESS_FORMAT_ETHEREUM"
        );

      if (ethAccount?.address) {
        setEthAddress(ethAccount.address);
        return ethAccount.address;
      }

      return "";
    } catch (error) {
      onError(error);
      return ""; // Return empty string on error
    }
  };

  const refreshWallet = async () => {
    if (!client || !session) return;

    try {
      const address = await getEthAddress();
      if (typeof address === "string") {
        setEthAddress(address);
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
          const address = await getEthAddress();
          if (address) {
            console.log("Found existing ETH address:", address);
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
      const signWith = await getEthAddress();
      if (!signWith) throw new Error("No ETHEREUM wallet found");

      const result = await client.signRawPayload({
        payload: Buffer.from(message).toString("hex"),
        signWith,
        encoding: "PAYLOAD_ENCODING_HEXADECIMAL",
        hashFunction: "HASH_FUNCTION_SHA256",
      });

      if (result?.r && result?.s && result?.v) {
        setSignature(`0x${result.r}${result.s}${result.v}`);
      } else {
        setSignature(null);
      }
    } catch (err) {
     onError(err)
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
        ethAddress,
        walletBalance,

        message,
        signature,
        setMessage,
        signMessage,
        getEthAddress,
        handleLogout,
        refreshWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
