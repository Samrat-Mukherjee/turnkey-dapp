import { NextApiRequest, NextApiResponse } from 'next';

interface FaucetResponse {
  success: boolean;
  txHash?: string;
  message: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FaucetResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { address, network } = req.body;

  if (!address) {
    return res.status(400).json({ success: false, message: 'Address is required' });
  }

  try {
    // Example: Sepolia testnet faucet
    if (network === 'sepolia') {
      const response = await fetch('https://faucet.sepolia.dev/api/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: address,
          tier: 1
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        return res.status(200).json({
          success: true,
          txHash: data.transactionHash,
          message: 'Funds requested successfully!'
        });
      } else {
        return res.status(400).json({
          success: false,
          message: data.message || 'Failed to request funds'
        });
      }
    }

    // Example: Goerli testnet faucet (alternative method)
    if (network === 'goerli') {
      const response = await fetch(`https://goerli-faucet.pk910.de/api/getBalance/${address}`);
      
      if (response.ok) {
        // This is just checking balance - actual faucet would need different endpoint
        return res.status(200).json({
          success: true,
          message: 'Balance checked - implement actual faucet logic here'
        });
      }
    }

    return res.status(400).json({
      success: false,
      message: 'Unsupported network or faucet unavailable'
    });

  } catch (error) {
    console.error('Faucet API error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}