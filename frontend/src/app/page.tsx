"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const router = useRouter();
  const [walletConnected, setWalletConnected] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState('');
  const [leverPulled, setLeverPulled] = useState(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);

  // Connect wallet
  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      setConnecting(true);
      setError('');
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletConnected(true);
        setConnecting(false);
      } catch (error) {
        console.error('Error connecting wallet:', error);
        setError('Failed to connect wallet');
        setConnecting(false);
      }
    } else {
      setError('MetaMask is not installed');
    }
  };

  // Enter casino
  const enterCasino = () => {
    if (walletConnected) {
      if (disclaimerAccepted) {
        // Pull the lever animation
        setLeverPulled(true);
        
        // Delay navigation to show the lever animation
        setTimeout(() => {
          router.push('/slot-machine');
        }, 1000);
      } else {
        // Show disclaimer modal
        setShowDisclaimerModal(true);
      }
    }
  };
  
  // Accept disclaimer and proceed
  const acceptDisclaimer = () => {
    setDisclaimerAccepted(true);
    setShowDisclaimerModal(false);
    
    // Pull the lever animation
    setLeverPulled(true);
    
    // Delay navigation to show the lever animation
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
      
      <div className="relative z-10 max-w-2xl w-full">
        {/* Casino Machine with Side Lever */}
        <div className="relative flex items-center">
          {/* Side Lever */}
          <div className="relative mr-4 hidden md:block">
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
          
          {/* Slot Machine Frame */}
          <div 
            className="relative bg-gradient-to-b from-yellow-600 to-yellow-800 rounded-3xl shadow-2xl border-8 border-yellow-400 p-8 max-w-2xl w-full mx-auto"
            style={{
              boxShadow: '0 0 0 4px #1a1a1a, 0 0 0 8px #d4af37, 0 20px 40px rgba(0,0,0,0.5), 0 0 30px rgba(212, 175, 55, 0.3)',
              minHeight: '680px'
            }}>
            {/* Casino Name Display */}
            <div className="bg-black rounded-lg p-4 mb-6 border-4 border-red-600">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">CITREA SLOTS</div>
                <div className="text-sm text-yellow-400">POWERED BY KRNL</div>
              </div>
            </div>
            
            {/* Welcome Display - Mimics Balance and Win Display */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-4 border-2 border-blue-400">
                <div className="text-center">
                  <div className="text-sm text-blue-200">WELCOME</div>
                  <div className="text-2xl font-bold text-white">BLOCKCHAIN CASINO</div>
                </div>
              </div>
            </div>
            
            {/* Slot Preview - Mimics Reels */}
            <div className="bg-black rounded-xl p-6 mb-6 border-4 border-gray-600 relative overflow-hidden">
              <div className="flex flex-col items-center justify-center h-32">
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500">🎰 WELCOME 🎰</div>
                <p className="text-white mt-2">Experience the future of blockchain gambling</p>
              </div>
            </div>
            
            <div className="text-center">
            
            <div className="flex justify-center space-x-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto bg-blue-900/50 rounded-full flex items-center justify-center mb-2 border border-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-blue-400">Secure</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto bg-purple-900/50 rounded-full flex items-center justify-center mb-2 border border-purple-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-purple-400">Transparent</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto bg-green-900/50 rounded-full flex items-center justify-center mb-2 border border-green-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-green-400">Fair</p>
              </div>
            </div>
            
            {/* Connect wallet */}
            {!walletConnected ? (
              <button
                onClick={connectWallet}
                disabled={connecting}
                className={`relative overflow-hidden w-full bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 text-white font-bold py-4 px-6 rounded-full border-4 border-yellow-400 shadow-lg transition-all transform ${connecting ? 'scale-95 opacity-75 cursor-not-allowed' : 'hover:scale-105 hover:shadow-xl'}`}
                style={{
                  boxShadow: connecting 
                    ? '0 5px 15px rgba(0,0,0,0.3)' 
                    : '0 10px 25px rgba(0,0,0,0.3), 0 0 30px rgba(239, 68, 68, 0.3)'
                }}
                onMouseDown={() => {
                  if (!connecting) {
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
                  {connecting ? 'Connecting...' : '🎮 Connect Wallet 🎮'}
                </span>
                
                {/* Pulsing glow when not connecting */}
                {!connecting && (
                  <div className="absolute inset-0 rounded-full bg-red-400 opacity-20 animate-ping"></div>
                )}
              </button>
            ) : (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-600/30 to-green-800/30 backdrop-blur-sm rounded-lg p-4 mb-6 border border-green-500">
                  <div className="flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    <p className="text-green-400 font-medium">Wallet Connected!</p>
                  </div>
                </div>
                
                {/* Enter Casino Button */}
                <button
                  onClick={enterCasino}
                  className="relative overflow-hidden w-full bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 text-white font-bold py-4 px-6 rounded-full border-4 border-yellow-400 shadow-lg transition-all transform hover:scale-105 hover:shadow-xl"
                  style={{
                    boxShadow: '0 10px 25px rgba(0,0,0,0.3), 0 0 30px rgba(239, 68, 68, 0.3)'
                  }}
                  onMouseDown={() => {
                    // Pull the lever when clicking enter
                    const leverElements = document.querySelectorAll('.slot-lever');
                    leverElements.forEach(el => {
                      (el as HTMLElement).style.transform = 'translateY(50px)';
                    });
                  }}
                >
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                  
                  <span className="relative z-10 text-xl">
                    🎰 Enter Casino 🎰
                  </span>
                  
                  {/* Pulsing glow */}
                  <div className="absolute inset-0 rounded-full bg-red-400 opacity-20 animate-ping"></div>
                </button>
              </div>
            )}
            </div>
          </div>
        </div>
        
        {/* Disclaimer Modal */}
        <AnimatePresence>
          {showDisclaimerModal && (
            <motion.div 
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-gradient-to-b from-yellow-600 to-yellow-800 rounded-3xl shadow-2xl border-8 border-yellow-400 overflow-hidden max-w-lg w-full"
                style={{
                  boxShadow: '0 0 0 4px #1a1a1a, 0 0 0 8px #d4af37, 0 20px 40px rgba(0,0,0,0.5), 0 0 30px rgba(212, 175, 55, 0.3)',
                  minHeight: '400px'
                }}
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
              >
                <div className="bg-black rounded-lg p-4 mb-2 border-4 border-red-600 mx-4 mt-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-red-500">DISCLAIMER</div>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-white text-sm mb-6">This is a blockchain gambling application. You must be of legal age to gamble in your jurisdiction. Gambling involves risk and should be considered entertainment only. Never gamble with funds you cannot afford to lose.</p>
                  
                  <div className="flex items-center mb-6">
                    <input 
                      type="checkbox" 
                      id="disclaimer" 
                      checked={disclaimerAccepted}
                      onChange={() => setDisclaimerAccepted(!disclaimerAccepted)}
                      className="h-5 w-5 text-yellow-600 focus:ring-yellow-500 border-gray-700 rounded bg-gray-800"
                    />
                    <label htmlFor="disclaimer" className="ml-2 text-sm text-white cursor-pointer">
                      I understand and accept the risks
                    </label>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setShowDisclaimerModal(false)}
                      className="relative overflow-hidden flex-1 bg-gradient-to-b from-gray-500 to-gray-700 hover:from-gray-400 hover:to-gray-600 text-white font-bold py-3 px-4 rounded-full border-4 border-gray-400 shadow-lg transition-all transform hover:scale-105"
                    >
                      Cancel
                    </button>
                    
                    <button
                      onClick={acceptDisclaimer}
                      disabled={!disclaimerAccepted}
                      className={`relative overflow-hidden flex-1 bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 text-white font-bold py-3 px-4 rounded-full border-4 border-yellow-400 shadow-lg transition-all transform ${!disclaimerAccepted ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-xl'}`}
                    >
                      Accept & Play
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Error Message */}
        {error && (
          <div className="bg-gradient-to-r from-red-600/30 to-red-700/30 backdrop-blur-sm rounded-xl p-4 border border-red-500 mb-6">
            <p className="text-red-400 font-medium text-center">{error}</p>
          </div>
        )}
        
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
