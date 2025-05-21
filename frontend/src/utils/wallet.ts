import { ethers } from 'krnl-sdk';
import { CONTRACT_ADDRESS, abi as contractAbi } from '../components/kernels/onchain/1557/config';

// Save wallet connection to localStorage
export const saveWalletConnection = (address: string) => {
  localStorage.setItem('walletConnected', 'true');
  localStorage.setItem('connectedAddress', address);
};

// Check if wallet is connected from localStorage
export const isWalletConnected = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('walletConnected') === 'true';
};

// Get connected address from localStorage
export const getConnectedAddress = (): string => {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('connectedAddress') || '';
};

// Clear wallet connection from localStorage
export const clearWalletConnection = () => {
  localStorage.removeItem('walletConnected');
  localStorage.removeItem('connectedAddress');
};

// Connect wallet and return connection details
export const connectWallet = async (): Promise<{
  success: boolean;
  address?: string;
  provider?: ethers.BrowserProvider;
  signer?: ethers.Signer;
  contract?: ethers.Contract;
  error?: string;
}> => {
  if (typeof window === 'undefined' || !window.ethereum) {
    return { success: false, error: 'MetaMask is not installed' };
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    if (accounts.length > 0) {
      const address = accounts[0];
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, signer);
      
      // Save connection to localStorage
      saveWalletConnection(address);
      
      return {
        success: true,
        address,
        provider,
        signer,
        contract
      };
    } else {
      return { success: false, error: 'No accounts found' };
    }
  } catch (error) {
    console.error('Error connecting wallet:', error);
    return { success: false, error: 'Failed to connect wallet' };
  }
};

// Check existing wallet connection and return connection details
export const checkWalletConnection = async (): Promise<{
  success: boolean;
  address?: string;
  provider?: ethers.BrowserProvider;
  signer?: ethers.Signer;
  contract?: ethers.Contract;
  error?: string;
}> => {
  if (typeof window === 'undefined' || !window.ethereum) {
    clearWalletConnection();
    return { success: false, error: 'MetaMask is not installed' };
  }

  try {
    // Check if wallet is already connected
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    
    if (accounts.length > 0) {
      const address = accounts[0];
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, signer);
      
      // Update localStorage with current address
      saveWalletConnection(address);
      
      return {
        success: true,
        address,
        provider,
        signer,
        contract
      };
    } else {
      clearWalletConnection();
      return { success: false, error: 'No accounts found' };
    }
  } catch (error) {
    console.error('Error checking wallet connection:', error);
    clearWalletConnection();
    return { success: false, error: 'Failed to check wallet connection' };
  }
};

// Check if disclaimer has been accepted
export const isDisclaimerAccepted = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('disclaimerAccepted') === 'true';
};

// Save disclaimer acceptance
export const saveDisclaimerAcceptance = () => {
  localStorage.setItem('disclaimerAccepted', 'true');
};
