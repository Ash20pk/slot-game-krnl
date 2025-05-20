"use client";

import { useState, useEffect } from 'react';
import { ethers } from 'krnl-sdk';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Contract ABI and address
import { abi as contractAbi, CONTRACT_ADDRESS } from '../../components/kernels/onchain/1557/config';

export default function SlotMachineHome() {
  const router = useRouter();
  
  // State variables
  const [walletConnected, setWalletConnected] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [stakeAmount, setStakeAmount] = useState<string>('0.01');
  const [userStake, setUserStake] = useState<string>('0');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Check if wallet is connected on load
  useEffect(() => {
    checkWalletConnection();
  }, []);

  // Update user stake when contract and address are available
  useEffect(() => {
    if (contract && connectedAddress) {
      getUserStake();
    }
  }, [contract, connectedAddress]);

  // Check wallet connection
  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const newProvider = new ethers.BrowserProvider(window.ethereum);
          const newSigner = await newProvider.getSigner();
          const address = await newSigner.getAddress();
          const newContract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, newSigner);
          
          setProvider(newProvider);
          setSigner(newSigner);
          setConnectedAddress(address);
          setContract(newContract);
          setWalletConnected(true);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setLoading(true);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        await checkWalletConnection();
        setLoading(false);
      } catch (error) {
        console.error('Error connecting wallet:', error);
        setError('Failed to connect wallet');
        setLoading(false);
      }
    } else {
      setError('MetaMask is not installed');
    }
  };

  // Get user's current stake
  const getUserStake = async () => {
    try {
      if (contract && connectedAddress) {
        const stake = await contract.getStake(connectedAddress);
        setUserStake(ethers.formatEther(stake));
      }
    } catch (error) {
      console.error('Error getting user stake:', error);
    }
  };

  // Stake funds
  const stakeFunds = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      if (!contract || !signer) {
        setError('Wallet not connected');
        setLoading(false);
        return;
      }
      
      const stakeAmountWei = ethers.parseEther(stakeAmount);
      
      // Call the stake function on the contract
      const tx = await contract.stake({ value: stakeAmountWei });
      
      // Wait for the transaction to be mined
      await tx.wait();
      
      // Update user stake
      await getUserStake();
      
      setSuccess(`Successfully staked ${stakeAmount} ETH`);
      setLoading(false);
    } catch (error) {
      console.error('Error staking funds:', error);
      setError('Failed to stake funds');
      setLoading(false);
    }
  };

  // Handle stake amount change
  const handleStakeAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStakeAmount(e.target.value);
  };

  // Navigate to slot machine game
  const playGame = () => {
    if (parseFloat(userStake) > 0) {
      router.push('/slot-machine/game');
    } else {
      setError('You need to stake some ETH before playing');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden p-4">
      {/* Elegant dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-gray-900 to-black"></div>
      
      {/* Subtle geometric pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                          radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      {/* Premium ambient lighting */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-blue-600/10 via-blue-600/5 to-transparent rounded-full"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-radial from-purple-600/10 via-purple-600/5 to-transparent rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 w-[32rem] h-[32rem] bg-gradient-radial from-yellow-500/8 via-yellow-500/3 to-transparent rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      
      {/* Minimal subtle particles */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      {/* Content wrapper */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Elegant title with subtle effects */}
        <div className="mb-8 text-center relative">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 mb-4">
            🎰 CITREA CASINO 🎰
          </h1>
          
          {/* Subtle underline accent */}
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto opacity-60"></div>
        </div>
        
        <div className="max-w-md w-full bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-gray-600">
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 p-6 text-center">
            <h1 className="text-4xl font-bold text-black mb-2">CITREA SLOTS</h1>
            <p className="text-black text-xl">Powered by KRNL</p>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Wallet Connection */}
            {!walletConnected ? (
              <button 
                onClick={connectWallet}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-xl transition-colors"
              >
                {loading ? 'Connecting...' : 'Connect Wallet'}
              </button>
            ) : (
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-green-400 mb-2">Connected: {connectedAddress.substring(0, 6)}...{connectedAddress.substring(connectedAddress.length - 4)}</p>
                <p className="text-yellow-400 font-bold text-xl">Your Stake: {userStake} ETH</p>
              </div>
            )}
            
            {/* Staking Section */}
            {walletConnected && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <h2 className="text-white text-xl font-bold mb-4">Stake ETH to Play</h2>
                <div className="flex space-x-4 mb-4">
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={handleStakeAmountChange}
                    min="0.001"
                    step="0.001"
                    className="flex-1 bg-gray-700 text-white p-3 rounded-lg"
                    placeholder="ETH Amount"
                  />
                  <button
                    onClick={stakeFunds}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    {loading ? 'Staking...' : 'Stake'}
                  </button>
                </div>
                
                {/* Play Button */}
                <button
                  onClick={playGame}
                  disabled={loading || parseFloat(userStake) <= 0}
                  className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 text-white font-bold py-4 px-6 rounded-lg text-xl transition-all transform hover:scale-105 border-4 border-yellow-400 shadow-lg"
                  style={{
                    boxShadow: '0 10px 25px rgba(0,0,0,0.3), 0 0 30px rgba(239, 68, 68, 0.3)'
                  }}
                >
                  <span className="relative z-10">
                    🎲 PLAY NOW! 🎲
                  </span>
                  
                  {/* Pulsing glow */}
                  <div className="absolute inset-0 rounded-lg bg-red-400 opacity-20 animate-ping"></div>
                </button>
              </div>
            )}
            
            {/* Messages */}
            {error && (
              <div className="bg-gradient-to-r from-red-600/80 to-red-700/80 backdrop-blur-sm rounded-xl p-4 border border-red-500 text-white text-center">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-gradient-to-r from-green-600/80 to-green-700/80 backdrop-blur-sm rounded-xl p-4 border border-green-500 text-white text-center">
                {success}
              </div>
            )}
            
            {/* Game Info */}
            <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-gray-600">
              <h2 className="text-white text-xl font-bold mb-2">How to Play</h2>
              <ol className="text-gray-300 list-decimal pl-5 space-y-2">
                <li>Connect your wallet</li>
                <li>Stake some ETH to play with</li>
                <li>Click PLAY NOW to start the game</li>
                <li>Bet and spin the reels to win!</li>
              </ol>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>🎲 Play Responsibly • 21+ Only • Ethereum Blockchain Gambling 🎲</p>
        </div>
        
        {/* Custom styles for animations */}
        <style jsx>{`
          /* Custom gradient for radial backgrounds */
          .bg-gradient-radial {
            background: radial-gradient(circle, var(--tw-gradient-stops));
          }
        `}</style>
      </div>
    </div>
  );
}
