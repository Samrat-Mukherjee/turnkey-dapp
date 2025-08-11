 export function shortenAddress(address: string): string {
  if (!address || typeof address !== 'string') {
    throw new Error("Invalid address: Address must be a non-empty string.");
  }

  // Ethereum address validation (0x + 40 hex characters)
  const isEthereumAddress = /^0x[a-fA-F0-9]{40}$/.test(address);
  
  // TRON address validation (starts with T + 33 characters total, base58 encoded)
  const isTronAddress = /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(address);

  if (!isEthereumAddress && !isTronAddress) {
    throw new Error("Invalid address format. Must be a valid Ethereum (0x...) or TRON (T...) address.");
  }

  // Handle Ethereum addresses
  if (isEthereumAddress) {
    const start = address.slice(0, 6); // 0x + first 4 chars
    const end = address.slice(-4); // last 4 chars
    return `${start}...${end}`;
  }

  // Handle TRON addresses
  if (isTronAddress) {
    const start = address.slice(0, 6); // T + first 5 chars
    const end = address.slice(-4); // last 4 chars
    return `${start}...${end}`;
  }

  return address; // fallback (should never reach here due to validation above)
}