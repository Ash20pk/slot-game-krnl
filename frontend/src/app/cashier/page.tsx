"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ethers } from 'krnl-sdk';
import { CONTRACT_ADDRESS, abi as contractAbi } from '../../components/kernels/onchain/1557/config';
import { checkWalletConnection as checkWallet, isDisclaimerAccepted, saveDisclaimerAcceptance } from '../../utils/wallet';
import { playSound, preloadSounds } from '../../utils/sounds';

export default function Cashier() {
  const router = useRouter();
  const [walletConnected, setWalletConnected] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [userStake, setUserStake] = useState<string>('0');
  const [depositAmount, setDepositAmount] = useState<string>('0.1');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('0.01');
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [reelSpinning, setReelSpinning] = useState(true);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);

  // Check wallet connection on load
  useEffect(() => {
    // Preload sounds
    preloadSounds();
    
    // Stop the reel spinning after a shorter delay
    const timer = setTimeout(() => {
      setReelSpinning(false);
    }, 800);
    
    // Check if wallet is already connected using shared utility
    const checkWalletStatus = async () => {
      const result = await checkWallet();
      
      if (result.success) {
        setWalletConnected(true);
        setConnectedAddress(result.address!);
        setProvider(result.provider!);
        setSigner(result.signer!);
        setContract(result.contract!);
        
        // Get user stake
        getUserStake(result.contract!, result.address!);
        
        // Check if disclaimer has been accepted
        const disclaimerAccepted = isDisclaimerAccepted();
        if (disclaimerAccepted) {
          setDisclaimerAccepted(true);
        } else {
          // Show disclaimer modal if not accepted
          setShowDisclaimerModal(true);
        }
      } else {
        // Redirect to home if wallet is not connected
        router.push('/');
      }
    };
    
    checkWalletStatus();
    
    return () => clearTimeout(timer);
  }, [router]);

  // Update user stake when contract and address are available
  useEffect(() => {
    if (contract && connectedAddress) {
      getUserStake();
    }
  }, [contract, connectedAddress]);

  // Get user's current stake
  const getUserStake = async (contractInstance = contract, address = connectedAddress) => {
    try {
      if (contractInstance && address) {
        const stake = await contractInstance.getStake(address);
        setUserStake(ethers.formatEther(stake));
      }
    } catch (error) {
      console.error('Error getting user stake:', error);
    }
  };

  // Handle deposit
  const handleDeposit = async () => {
    try {
      // Play button click sound
      playSound('buttonClick');
      
      setIsDepositing(true);
      setError('');
      setSuccess('');
      
      if (!signer || !contract) {
        // Play error sound
        playSound('error');
        setError('Wallet not connected');
        setIsDepositing(false);
        return;
      }
      
      const depositAmountWei = ethers.parseEther(depositAmount);
      
      // Play coin drop sound
      playSound('coinDrop');
      
      // Call the deposit function on the contract
      const tx = await contract.stake({ value: depositAmountWei });
      await tx.wait();
      
      // Update user stake
      await getUserStake();
      
      setSuccess(`Successfully deposited ${depositAmount} ETH`);
      showToastNotification('Deposit successful!', 'success');
      setIsDepositing(false);
    } catch (error) {
      // Play error sound
      playSound('error');
      console.error('Error depositing funds:', error);
      setError('Failed to deposit funds');
      showToastNotification('Deposit failed', 'error');
      setIsDepositing(false);
    }
  };

  // Handle withdraw
  const handleWithdraw = async () => {
    try {
      // Play button click sound
      playSound('buttonClick');
      
      setIsWithdrawing(true);
      setError('');
      setSuccess('');
      
      if (!signer || !contract) {
        // Play error sound
        playSound('error');
        setError('Wallet not connected');
        setIsWithdrawing(false);
        return;
      }
      
      const withdrawAmountWei = ethers.parseEther(withdrawAmount);
      
      // Call the withdraw function on the contract
      const tx = await contract.withdraw(withdrawAmountWei);
      await tx.wait();
      
      // Update user stake
      await getUserStake();
      
      setSuccess(`Successfully withdrew ${withdrawAmount} ETH`);
      showToastNotification('Withdrawal successful!', 'success');
      setIsWithdrawing(false);
    } catch (error) {
      // Play error sound
      playSound('error');
      console.error('Error withdrawing funds:', error);
      setError('Failed to withdraw funds');
      showToastNotification('Withdrawal failed', 'error');
      setIsWithdrawing(false);
    }
  };

  // Handle deposit amount change with validation
  const handleDepositAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow empty input
    if (value === '') {
      setDepositAmount('');
      return;
    }
    
    // Only allow numbers and decimals
    if (!/^\d*\.?\d*$/.test(value)) return;
    
    // Convert to number for validation
    const numValue = parseFloat(value);
    
    // Ensure it's a positive number
    if (numValue <= 0) return;
    
    // Limit to 4 decimal places
    const formattedValue = numValue.toFixed(4);
    setDepositAmount(formattedValue);
  };

  // Handle withdraw amount change with validation
  const handleWithdrawAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow empty input
    if (value === '') {
      setWithdrawAmount('');
      return;
    }
    
    // Only allow numbers and decimals
    if (!/^\d*\.?\d*$/.test(value)) return;
    
    // Convert to number for validation
    const numValue = parseFloat(value);
    
    // Ensure it's a positive number
    if (numValue <= 0) return;
    
    // Ensure withdraw amount doesn't exceed user stake
    if (numValue > parseFloat(userStake)) {
      setWithdrawAmount(userStake);
      return;
    }
    
    // Limit to 4 decimal places
    const formattedValue = numValue.toFixed(4);
    setWithdrawAmount(formattedValue);
  };

  // Show toast notification
  const showToastNotification = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Accept disclaimer and proceed
  const acceptDisclaimer = () => {
    setDisclaimerAccepted(true);
    setShowDisclaimerModal(false);
    
    // Save disclaimer acceptance using shared utility
    saveDisclaimerAcceptance();
    
    // Show toast notification
    showToastNotification('Disclaimer accepted', 'success');
  };
  
  // Go to slot machine
  const goToSlotMachine = () => {
    // Check if disclaimer has been accepted
    if (!disclaimerAccepted) {
      // Play button click sound
      playSound('buttonClick');
      setShowDisclaimerModal(true);
      return;
    }
    
    // Play lever pull sound
    playSound('leverPull');
    
    // Navigate to slot machine page after animation
    setTimeout(() => {
      router.push('/slot-machine');
    }, 1000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4">
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
      
      {/* Toast notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            className={`fixed top-4 right-4 ${toastType === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center`}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              {toastType === 'success' ? (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              )}
            </svg>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="relative z-10 flex items-center justify-center w-full">
        {/* Cashier Machine with Side Lever - Centered */}
        <div className="relative flex items-center justify-center mx-auto">
          {/* Cashier Frame */}
          <div 
            className="relative bg-gradient-to-b from-yellow-600 to-yellow-800 rounded-3xl shadow-2xl border-8 border-yellow-400 p-8 mx-auto flex flex-col items-center"
            style={{
              boxShadow: '0 0 0 4px #1a1a1a, 0 0 0 8px #d4af37, 0 20px 40px rgba(0,0,0,0.5), 0 0 30px rgba(212, 175, 55, 0.3)',
              width: '500px',
              height: '720px'
            }}>
            
            {/* Side Lever - Attached to the machine */}
            <div className="absolute -left-12 top-1/3 hidden md:block">
              <div className="w-8 h-64 bg-gradient-to-b from-gray-700 to-gray-900 rounded-t-full rounded-b-full flex flex-col items-center justify-between p-2">
                <div className="w-6 h-6 rounded-full bg-red-600 border-2 border-red-800"></div>
                <div 
                  className="slot-lever w-6 h-24 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full relative transition-transform duration-300"
                  style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
                >
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-red-500 border-2 border-red-700"></div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-b from-red-500 to-red-700 border-2 border-red-800 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-red-600 border border-red-800"></div>
                  </div>
                </div>
                <div className="w-full h-4 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full"></div>
              </div>
              <div 
                className="w-4 h-32 bg-gradient-to-b from-gray-800 to-gray-900 absolute -right-2 top-1/2 transform -translate-y-1/2 rounded-r-lg"
                style={{ boxShadow: '2px 0 5px rgba(0,0,0,0.3)' }}
              ></div>
            </div>
            
            {/* Current Balance - Elegant Display */}
            <div className="bg-gradient-to-b from-gray-900 to-black rounded-xl p-5 mb-8 border-2 border-yellow-500 w-full shadow-lg">
              <div className="text-center">
                <div className="text-sm uppercase tracking-wider text-yellow-400 mb-1 font-semibold">CURRENT BALANCE</div>
                <div className="text-3xl font-bold text-white bg-black/40 py-3 rounded-lg border border-yellow-500/30">
                  {parseFloat(userStake).toFixed(4)} <span className="text-yellow-400">ETH</span>
                </div>
              </div>
            </div>
            
            {/* Transaction Controls Container */}
            <div className="flex flex-col space-y-6 w-full mb-8">
              {/* Deposit Section - Cleaner Design */}
              <div className="bg-gradient-to-b from-gray-900 to-black rounded-xl p-5 border-2 border-green-500/70 w-full shadow-lg">
                <div className="text-center mb-3">
                </div>
                
                <div className="flex items-center mb-4 bg-black/50 p-2 rounded-lg border border-green-500/30">
                  <input
                    type="text"
                    value={depositAmount}
                    onChange={handleDepositAmountChange}
                    className="bg-transparent text-white text-xl font-bold w-full text-center focus:outline-none"
                    disabled={isDepositing}
                    placeholder="0.0"
                  />
                  <span className="ml-2 text-green-400 font-bold">ETH</span>
                </div>
                
                <button
                  onClick={handleDeposit}
                  disabled={isDepositing || !depositAmount}
                  className={`relative overflow-hidden w-full bg-gradient-to-b from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 text-white font-bold py-3 px-6 rounded-full border-4 border-yellow-400 shadow-lg transition-all transform ${isDepositing ? 'scale-95 opacity-75 cursor-not-allowed' : 'hover:scale-105 hover:shadow-xl'} group`}
                  style={{
                    boxShadow: isDepositing 
                      ? '0 5px 15px rgba(0,0,0,0.3)' 
                      : '0 10px 25px rgba(0,0,0,0.3), 0 0 30px rgba(34, 197, 94, 0.3)'
                  }}
                >
                  {isDepositing ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : 'Deposit Funds'}
                </button>
              </div>
              
              {/* Withdraw Section - Cleaner Design */}
              <div className="bg-gradient-to-b from-gray-900 to-black rounded-xl p-5 border-2 border-red-500/70 w-full shadow-lg">
                <div className="text-center mb-3">
                </div>
                
                <div className="flex items-center mb-4 bg-black/50 p-2 rounded-lg border border-red-500/30">
                  <input
                    type="text"
                    value={withdrawAmount}
                    onChange={handleWithdrawAmountChange}
                    className="bg-transparent text-white text-xl font-bold w-full text-center focus:outline-none"
                    disabled={isWithdrawing}
                    placeholder="0.0"
                  />
                  <span className="ml-2 text-red-400 font-bold">ETH</span>
                </div>
                
                <button
                  onClick={handleWithdraw}
                  disabled={isWithdrawing || !withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > parseFloat(userStake)}
                  className={`relative overflow-hidden w-full bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 text-white font-bold py-3 px-6 rounded-full border-4 border-yellow-400 shadow-lg transition-all transform ${isWithdrawing ? 'scale-95 opacity-75 cursor-not-allowed' : 'hover:scale-105 hover:shadow-xl'} group`}
                  style={{
                    boxShadow: isWithdrawing 
                      ? '0 5px 15px rgba(0,0,0,0.3)' 
                      : '0 10px 25px rgba(0,0,0,0.3), 0 0 30px rgba(239, 68, 68, 0.3)'
                  }}
                >
                  {isWithdrawing ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : 'Withdraw Funds'}
                </button>
              </div>
            </div>
            
            {/* Play Button - Matching other screens */}
            <div className="flex justify-center w-full mt-auto mb-2">
              <button
                onClick={goToSlotMachine}
                className="relative overflow-hidden w-full bg-gradient-to-b from-yellow-500 to-yellow-700 hover:from-yellow-400 hover:to-yellow-600 text-white font-bold py-4 px-6 rounded-full border-4 border-yellow-400 shadow-lg transition-all transform hover:scale-105 hover:shadow-xl group"
                style={{
                  boxShadow: '0 10px 25px rgba(0,0,0,0.3), 0 0 30px rgba(234, 179, 8, 0.3)'
                }}
                onMouseDown={() => {
                  // Pull the lever when clicking enter
                  const leverElements = document.querySelectorAll('.slot-lever');
                  leverElements.forEach(el => {
                    (el as HTMLElement).style.transform = 'translateY(50px)';
                  });
                  
                  // Return lever to original position after a delay
                  setTimeout(() => {
                    leverElements.forEach(el => {
                      (el as HTMLElement).style.transform = 'translateY(0)';
                    });
                  }, 1000);
                }}
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                
                <span className="relative z-10 text-xl font-bold">
                  PLAY SLOTS
                </span>
                
                {/* Pulsing glow */}
                <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-20 animate-ping"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Disclaimer Modal */}
      <AnimatePresence>
        {showDisclaimerModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <motion.div 
              className="bg-gradient-to-b from-yellow-600 to-yellow-800 rounded-3xl shadow-2xl border-8 border-yellow-400 overflow-hidden max-w-lg w-full"
              style={{
                boxShadow: '0 0 0 4px #1a1a1a, 0 0 0 8px #d4af37, 0 20px 40px rgba(0,0,0,0.5), 0 0 30px rgba(212, 175, 55, 0.3)',
                width: '500px',
                minHeight: '400px'
              }}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="p-6">
                <div className="bg-black rounded-lg p-4 mb-6 border-4 border-red-600">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">DISCLAIMER</div>
                    <div className="text-sm text-yellow-400">PLEASE READ CAREFULLY</div>
                  </div>
                </div>
                
                <div className="bg-black/70 rounded-lg p-4 mb-6 text-white">
                  <p className="mb-4">By entering Citrea Casino, you acknowledge that:</p>
                  <ul className="list-disc pl-5 space-y-2 mb-4">
                    <li>You are at least 21 years of age</li>
                    <li>Gambling involves risk and can be addictive</li>
                    <li>You are responsible for any taxes on winnings</li>
                    <li>All transactions are final and non-refundable</li>
                  </ul>
                  <p>Please gamble responsibly and only bet what you can afford to lose.</p>
                </div>
                
                <div className="flex space-x-4">
                  <button 
                    onClick={() => router.push('/')}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors"
                  >
                    Decline
                  </button>
                  <button 
                    onClick={acceptDisclaimer}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 text-white py-3 px-4 rounded-lg transition-colors"
                  >
                    I Accept
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
