 export function shortenAddress(address: string): string {
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    throw new Error("Invalid Ethereum address format.");
  }

  const middleStart = 4; // skip 0x + next 2 chars
  const middleEnd = address.length - 4;

  const short = `0x${address.slice(middleStart, middleStart + 6)}...${address.slice(middleEnd)}`;
  return short;
}