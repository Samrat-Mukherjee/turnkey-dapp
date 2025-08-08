import { useTurnkey } from "@turnkey/sdk-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Session } from "@turnkey/sdk-types";
import { onError } from "@/lib/utils/onError";

export function useDashboardLogic() {
  const { turnkey, indexedDbClient } = useTurnkey();
  const [session, setSession] = useState<Session | null>(null);
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState<string | null>(null);
  const [ethAddress, setEthAddress] = useState<string>("");
  const [walletBalance, setWalletBalance] = useState<string>("0");
  const [loading, setLoading] = useState(true);
  const client = indexedDbClient;

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        const currentSession = await turnkey?.getSession();
        if (currentSession?.organizationId) {
          setSession(currentSession);
        }
      } catch (err) {
        console.error("Session fetch error:", err);
        onError(err)
      }
    };
    initialize();
  }, [turnkey]);

  useEffect(() => {
    const fetchWallet = async () => {
      if (!session) return;
      try {
        const address = await getEthAddress(session.organizationId);
        setEthAddress(address);

       
      } catch (err) {
        console.error("Wallet fetch error:", err);
        onError(err)
      } finally {
        setLoading(false);
      }
    };
    fetchWallet();
  }, [session]);

  const getEthAddress = async (organizationId: string) => {
    const wallets = await client?.getWallets({ organizationId });
    for (const wallet of wallets?.wallets || []) {
      const accounts = await client?.getWalletAccounts({
        organizationId,
        walletId: wallet.walletId,
      });
      const ethAccount = accounts?.accounts?.find(
        (a) =>
          a.addressFormat === "ADDRESS_FORMAT_ETHEREUM" &&
          a.path.startsWith("m/44'/60'")
      );
      if (ethAccount) return ethAccount.address;
    }
    return "";
  };

  const signMessage = async () => {
    try {
      const signWith = await getEthAddress(session?.organizationId || "");

      if (!signWith) throw new Error("No ETHEREUM wallet found");
      const result = await client?.signRawPayload({
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
      console.error("Signature error:", err);
      setSignature("Error signing message");
      onError(err)
    }
  };

  const handleLogout = async () => {
    try {
      await turnkey?.logout();
      await client?.clear();

      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
      onError(err)
    }
  };

  const handleSuccess = (txHash: string) => {};

  return {
    loading,
    ethAddress,
    walletBalance,
    message,
    signature,
    setMessage,
    signMessage,
    handleLogout,
    handleSuccess,
  };
}
