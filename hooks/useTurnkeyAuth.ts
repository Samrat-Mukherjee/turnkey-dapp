import { WALLET_DERIVATION_CONFIG } from "@/lib/constants/wallets";
import { onError } from "@/lib/utils/onError";
import { useTurnkey } from "@turnkey/sdk-react";
import { useRouter } from "next/navigation";
import { useWallet } from "./useWallet";

export function useTurnkeyAuth() {
  const router = useRouter();
  const { turnkey, indexedDbClient } = useTurnkey();
  const { refreshWallet } = useWallet();

  const onAuthSuccess = async () => {
    try {
      const session = await turnkey?.getSession();

      if (session && indexedDbClient) {
        const organizationId = session.organizationId;

        // Check if user already has wallets
        const existingWallets = await indexedDbClient?.getWallets({
          organizationId,
        });

        console.log(
          existingWallets?.wallets.length,
          "Response=====================>",
          existingWallets
        );

        // Create a new Ethereum wallet only if user has no wallets
        if (existingWallets?.wallets.length < 2) {
          const walletName = "My ETHEREUM Wallet";

          // Create wallet with multi-chain configuration
          const walletResponse = await indexedDbClient.createWallet({
            organizationId,
            walletName,
            accounts: [
              WALLET_DERIVATION_CONFIG?.tron,
              WALLET_DERIVATION_CONFIG?.ethereum,
            ],
          });

          console.log("✅ New wallet created:", walletResponse);
        } else if (existingWallets?.wallets.length == 2) {
          console.log(
            "✅ Auth Success - Using existing wallet ",
            JSON.stringify(existingWallets, null, 2)
          );
        }

        // Refresh wallet before navigation
        await refreshWallet();
      }

      // Navigate to dashboard after wallet is initialized
      router.push("/dashboard");
    } catch (error) {
      console.error("❌ Error creating wallet:", error);
      onError(error);
    }
  };

  return { onAuthSuccess };
}
