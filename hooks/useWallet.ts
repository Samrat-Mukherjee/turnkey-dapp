import { WalletContext } from "@/context/WalletContext";
import { useContext } from "react";

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used inside WalletProvider");
  return ctx;
}