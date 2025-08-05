import { WALLET_DERIVATION_CONFIG } from "@/lib/constants/wallets";
import { onError } from "@/lib/utills/onError";
import { useTurnkey } from "@turnkey/sdk-react";
import { useRouter } from "next/navigation";

export function useTurnkeyAuth() {
  const router = useRouter();
  const { turnkey, indexedDbClient } = useTurnkey();

  const onAuthSuccess = async () => {
    try {
      const session = await turnkey?.getSession();

      if (session && indexedDbClient) {
        const organizationId = session.organizationId;

        // Check if user already has wallets
        const existingWallets = await indexedDbClient?.getWallets({
          organizationId,
        });

        // Create a new Tron wallet only if user has no wallets
        if (!existingWallets?.wallets.length) {
          const walletName = "My Tron Wallet";
          // Create wallet with ONLY Tron configuration
          const wallet = await indexedDbClient?.createWallet({
            organizationId,
            walletName,
            accounts: [WALLET_DERIVATION_CONFIG.tron],
          });
        } else {
          console.log("✅ Auth Success - Using existing wallet: ");
        }
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("❌ Error creating wallet:", error);
      onError(error);
    }
  };

  return { onAuthSuccess };
}
