import React, { useState } from 'react';

interface FaucetFormProps {
  onSuccess?: (txHash: string) => void;
}

const FaucetForm: React.FC<FaucetFormProps> = ({ onSuccess }) => {
  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState('sepolia');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [txHash, setTxHash] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setTxHash('');

    try {
      const response = await fetch('/api/faucet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address, network }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        if (data.txHash) {
          setTxHash(data.txHash);
          onSuccess?.(data.txHash);
        }
      } else {
        setMessage(data.message || 'Failed to request funds');
      }
    } catch (error) {
      setMessage('Network error occurred');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const isValidAddress = (addr: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(addr);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Ethereum Testnet Faucet</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="network" className="block text-sm font-medium text-gray-700 mb-2">
            Network
          </label>
          <select
            id="network"
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="sepolia">Sepolia</option>
            <option value="goerli">Goerli</option>
            <option value="mumbai">Mumbai (Polygon)</option>
          </select>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            Ethereum Address
          </label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="0x742d35Cc6634C0532925a3b8D5C9E1A8..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {address && !isValidAddress(address) && (
            <p className="text-red-500 text-sm mt-1">Invalid Ethereum address</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !isValidAddress(address)}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Requesting Funds...' : 'Request Test Funds'}
        </button>
      </form>

      {message && (
        <div className={`mt-4 p-3 rounded-md ${
          message.includes('success') || txHash 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      {txHash && (
        <div className="mt-4 p-3 bg-blue-100 rounded-md">
          <p className="text-sm text-blue-700">
            Transaction Hash: 
            <a 
              href={`https://${network}.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 underline hover:no-underline"
            >
              {txHash.slice(0, 10)}...{txHash.slice(-8)}
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default FaucetForm;