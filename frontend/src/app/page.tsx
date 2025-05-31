"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ethers } from 'krnl-sdk';
import { CONTRACT_ADDRESS, abi as contractAbi } from '../components/kernels/onchain/1557/config';
import { connectWallet, checkWalletConnection, isDisclaimerAccepted, saveDisclaimerAcceptance } from '../utils/wallet';
import { playSound, preloadSounds } from '../utils/sounds';

export default function Home() {
  const router = useRouter();
  const [walletConnected, setWalletConnected] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [leverPulled, setLeverPulled] = useState(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState('');
  const [reelSpinning, setReelSpinning] = useState(true);
  
  // Check wallet connection and stop reel spinning on component mount
  useEffect(() => {
    // Stop the reel spinning after a shorter delay
    const timer = setTimeout(() => {
      setReelSpinning(false);
    }, 800);
    
    // Preload sounds
    preloadSounds();
    
    // Check if wallet is already connected
    const checkWallet = async () => {
      const result = await checkWalletConnection();
      
      if (result.success) {
        setWalletConnected(true);
        setConnectedAddress(result.address!);
        
        // Check if user has staked
        try {
          const stake = await result.contract!.getStake(result.address!);
          const stakeAmount = ethers.formatEther(stake);
          
          // If user has staked, redirect to cashier page
          if (parseFloat(stakeAmount) > 0) {
            router.push('/cashier');
          }
        } catch (error) {
          console.error('Error checking stake:', error);
        }
      }
      
      // Check if disclaimer has been accepted
      if (isDisclaimerAccepted()) {
        setDisclaimerAccepted(true);
      }
    };
    
    checkWallet();
    
    return () => clearTimeout(timer);
  }, [router]);

  // Connect wallet function
  const connectWalletHandler = async () => {
    try {
      // Play button click sound
      playSound('buttonClick');
      setIsConnecting(true);
      
      const result = await connectWallet();
      
      if (result.success) {
        setWalletConnected(true);
        setConnectedAddress(result.address!);
        setShowToast(true);
        
        // Check if user has staked
        try {
          const stake = await result.contract!.getStake(result.address!);
          const stakeAmount = ethers.formatEther(stake);
          
          // If user has staked, redirect to cashier page
          if (parseFloat(stakeAmount) > 0) {
            router.push('/cashier');
            return;
          }
        } catch (error) {
          playSound('error');
          console.error('Error checking stake:', error);
        }
        
        // Hide toast after 3 seconds
        setTimeout(() => {
          setShowToast(false);
        }, 3000);
      } else {
        // Play error sound
        playSound('error');
        console.error('Error connecting wallet:', result.error);
      }
    } catch (error) {
      console.error('Error connecting to wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Enter casino
  const enterCasino = () => {
    if (walletConnected) {
      if (disclaimerAccepted) {
        // Play lever pull sound
        playSound('leverPull');
        
        // Pull the lever animation
        setLeverPulled(true);
        
        // Delay navigation to show the lever animation
        setTimeout(() => {
          // Navigate to cashier page instead of directly to slot machine
          router.push('/cashier');
        }, 1000);
      } else {
        // Play button click sound
        playSound('buttonClick');
        
        // Show disclaimer modal
        setShowDisclaimerModal(true);
      }
    } else {
      // Play error sound if wallet not connected
      playSound('error');
    }
  };
  
  // Accept disclaimer and proceed
  const acceptDisclaimer = () => {
    // Play button click sound
    playSound('buttonClick');
    
    setDisclaimerAccepted(true);
    setShowDisclaimerModal(false);
    
    // Save disclaimer acceptance using shared utility
    saveDisclaimerAcceptance();
    
    // Pull the lever animation
    setLeverPulled(true);
    
    // Play lever pull sound
    playSound('leverPull');
    
    // Delay navigation to show the lever animation
    setTimeout(() => {
      // Navigate to cashier page instead of directly to slot machine
      router.push('/cashier');
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
      
      {/* Toast notification for wallet connection */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Wallet Connected!
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="relative z-10 flex items-center justify-center w-full">
        {/* Casino Machine with Side Lever - Centered */}
        <div className="relative flex items-center justify-center mx-auto">
          {/* Slot Machine Frame */}
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
                  className={`slot-lever w-6 h-24 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full relative transition-transform duration-300 ${leverPulled ? 'transform translate-y-12' : ''}`}
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
            
            {/* Slot Reel - Metal frame with white background - CENTERED AND LARGER */}
            <div className="bg-black rounded-xl p-6 mb-6 border-4 border-gray-600 relative overflow-hidden w-full">
              {/* Reel container */}
              <div className="flex justify-center">
                <div className="relative w-full">
                  {/* Reel frame - metal look */}
                  <div className="bg-gradient-to-b from-gray-300 to-gray-500 rounded-lg p-3 shadow-inner">
                    <div 
                      className="bg-white rounded-lg h-64 flex items-center justify-center border-4 border-gray-400 overflow-hidden relative"
                      style={{ perspective: '1000px' }}
                    >
                      <AnimatePresence>
                        {reelSpinning ? (
                          // Spinning reel animation - blank white screen with spinning effect
                          <motion.div
                            key="spinning"
                            className="absolute inset-0 flex items-center justify-center"
                            animate={{
                              rotateX: [0, 360],
                              transition: {
                                rotateX: {
                                  repeat: Infinity,
                                  repeatType: "loop",
                                  duration: 0.5,
                                  ease: "linear"
                                }
                              }
                            }}
                          >
                            {/* Spinning blur effect */}
                            <div className="absolute inset-0 bg-white"></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-200 to-transparent opacity-30 animate-pulse"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-full h-1 bg-gray-300 animate-pulse"></div>
                            </div>
                          </motion.div>
                        ) : (
                          // Static message display after spinning stops
                          <motion.div
                            key="static"
                            className="text-center w-full"
                            initial={{ opacity: 0, rotateX: 90 }}
                            animate={{ opacity: 1, rotateX: 0 }}
                            transition={{ type: "spring", duration: 0.4, bounce: 0.4 }}
                          >
                            <div className="text-red-500 text-6xl font-bold mb-6">CITREA SLOTS</div>
                            <div className="text-blue-400 text-2xl mb-4">POWERED BY KRNL</div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      {/* Spinning effect overlay */}
                      {reelSpinning && (
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent opacity-50 z-10 animate-pulse"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Connect wallet button - Centered */}
            <div className="flex justify-center mt-8 w-full">
              {!walletConnected ? (
                <button
                  onClick={connectWalletHandler}
                  disabled={isConnecting}
                  className={`relative overflow-hidden w-full bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 text-white font-bold py-4 px-6 rounded-full border-4 border-yellow-400 shadow-lg transition-all transform ${isConnecting ? 'scale-95 opacity-75 cursor-not-allowed' : 'hover:scale-105 hover:shadow-xl'} group`}
                  style={{
                    boxShadow: isConnecting 
                      ? '0 5px 15px rgba(0,0,0,0.3)' 
                      : '0 10px 25px rgba(0,0,0,0.3), 0 0 30px rgba(239, 68, 68, 0.3)'
                  }}
                  onMouseDown={() => {
                    if (!isConnecting) {
                      // Pull the lever when clicking connect
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
                    }
                  }}
                >
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                  
                  <span className="relative z-10 text-xl">
                    {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                  </span>
                  
                  {/* Pulsing glow when not connecting */}
                  {!isConnecting && (
                    <div className="absolute inset-0 rounded-full bg-red-400 opacity-20 animate-ping"></div>
                  )}
                </button>
              ) : (
                <button
                  onClick={enterCasino}
                  className="relative overflow-hidden w-full bg-gradient-to-b from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 text-white font-bold py-4 px-6 rounded-full border-4 border-yellow-400 shadow-lg transition-all transform hover:scale-105 hover:shadow-xl group"
                  style={{
                    boxShadow: '0 10px 25px rgba(0,0,0,0.3), 0 0 30px rgba(34, 197, 94, 0.3)'
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
                  
                  <span className="relative z-10 text-xl">
                    Enter Casino
                  </span>
                  
                  {/* Pulsing glow */}
                  <div className="absolute inset-0 rounded-full bg-green-400 opacity-20 animate-ping"></div>
                </button>
              )}
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
                    onClick={() => setShowDisclaimerModal(false)}
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
