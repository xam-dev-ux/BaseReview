import { useState, useEffect, useCallback } from 'react';
import { BrowserProvider } from 'ethers';

const BASE_CHAIN_ID = parseInt(import.meta.env.VITE_BASE_CHAIN_ID || '8453');

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkConnection = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') {
      return;
    }

    try {
      const browserProvider = new BrowserProvider(window.ethereum);
      const accounts = await browserProvider.listAccounts();

      if (accounts.length > 0) {
        const network = await browserProvider.getNetwork();
        setAccount(accounts[0].address);
        setChainId(Number(network.chainId));
        setProvider(browserProvider);
      }
    } catch (err) {
      console.error('Error checking connection:', err);
    }
  }, []);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  useEffect(() => {
    if (typeof window.ethereum === 'undefined') {
      return;
    }

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        checkConnection();
      } else {
        setAccount(null);
        setProvider(null);
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [checkConnection]);

  const connect = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('Please install MetaMask to use this app');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const browserProvider = new BrowserProvider(window.ethereum);
      await browserProvider.send('eth_requestAccounts', []);

      const network = await browserProvider.getNetwork();
      const signer = await browserProvider.getSigner();

      setProvider(browserProvider);
      setAccount(await signer.getAddress());
      setChainId(Number(network.chainId));

      // Check if on correct network
      if (Number(network.chainId) !== BASE_CHAIN_ID) {
        await switchToBase();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      console.error('Connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setProvider(null);
    setChainId(null);
  };

  const switchToBase = async () => {
    if (typeof window.ethereum === 'undefined') {
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${BASE_CHAIN_ID.toString(16)}` }],
      });
    } catch (switchError: any) {
      // Chain not added, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${BASE_CHAIN_ID.toString(16)}`,
                chainName: 'Base Mainnet',
                nativeCurrency: {
                  name: 'Ethereum',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: [import.meta.env.VITE_BASE_RPC_URL],
                blockExplorerUrls: [import.meta.env.VITE_BASE_EXPLORER],
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding Base network:', addError);
        }
      }
    }
  };

  const isCorrectNetwork = chainId === BASE_CHAIN_ID;

  return {
    account,
    chainId,
    provider,
    isConnecting,
    isConnected: !!account,
    isCorrectNetwork,
    error,
    connect,
    disconnect,
    switchToBase,
  };
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
