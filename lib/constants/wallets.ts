import { WalletDerivationConfig } from "@/types/wallets";

export const WALLET_DERIVATION_CONFIG: WalletDerivationConfig = {
  tron: {
    curve: "CURVE_SECP256K1",
    pathFormat: "PATH_FORMAT_BIP32",
    path: "m/44'/195'/0'/0/0", // TRON derivation path
    addressFormat: "ADDRESS_FORMAT_TRON",
  },

  ethereum: {
    addressFormat: "ADDRESS_FORMAT_ETHEREUM",
    curve: "CURVE_SECP256K1",
    pathFormat: "PATH_FORMAT_BIP32",
    path: "m/44'/60'/0'/0/0",
  },
};
