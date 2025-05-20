"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [walletConnected, setWalletConnected] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState('');

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
    if (walletConnected && disclaimerAccepted) {
      router.push('/stake');
    }
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
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden mb-8 border border-gray-600">
          <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-2"></div>
          <div className="p-8 text-center">
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 mb-4">🎰 CITREA CASINO 🎰</h1>
            <p className="text-gray-300 mb-6">Experience the future of blockchain gambling</p>
            
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
              <div className="bg-gradient-to-r from-green-600/30 to-green-800/30 backdrop-blur-sm rounded-lg p-4 mb-6 border border-green-500">
                <div className="flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <p className="text-green-400 font-medium">Wallet Connected!</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Disclaimer Section */}
        {walletConnected && (
          <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden mb-8 border border-gray-600">
            <div className="p-6">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">Gambling Disclaimer</h3>
              <p className="text-gray-300 text-sm mb-6">This is a blockchain gambling application. You must be of legal age to gamble in your jurisdiction. Gambling involves risk and should be considered entertainment only. Never gamble with funds you cannot afford to lose.</p>
              
              <div className="flex items-center mb-6">
                <input 
                  type="checkbox" 
                  id="disclaimer" 
                  checked={disclaimerAccepted}
                  onChange={() => setDisclaimerAccepted(!disclaimerAccepted)}
                  className="h-5 w-5 text-yellow-600 focus:ring-yellow-500 border-gray-700 rounded bg-gray-800"
                />
                <label htmlFor="disclaimer" className="ml-2 text-sm text-gray-300 cursor-pointer">
                  I understand and accept the risks
                </label>
              </div>
              
              <button
                onClick={enterCasino}
                disabled={!disclaimerAccepted}
                className={`relative overflow-hidden w-full bg-gradient-to-b from-yellow-500 to-yellow-700 hover:from-yellow-400 hover:to-yellow-600 text-black font-bold py-4 px-6 rounded-full border-4 border-yellow-300 shadow-lg transition-all transform ${!disclaimerAccepted ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-xl'}`}
                style={{
                  boxShadow: !disclaimerAccepted 
                    ? '0 5px 15px rgba(0,0,0,0.3)' 
                    : '0 10px 25px rgba(0,0,0,0.3), 0 0 30px rgba(234, 179, 8, 0.3)'
                }}
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                
                <span className="relative z-10 text-xl">
                  🎰 Enter Casino 🎰
                </span>
                
                {/* Pulsing glow when disclaimer accepted */}
                {disclaimerAccepted && (
                  <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-20 animate-ping"></div>
                )}
              </button>
            </div>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="bg-gradient-to-r from-red-600/30 to-red-700/30 backdrop-blur-sm rounded-xl p-4 border border-red-500 mb-6">
            <p className="text-red-400 font-medium text-center">{error}</p>
          </div>
        )}
        
        {/* Footer */}
        <div className="text-center text-gray-400 text-sm mt-8">
          <p>© 2025 Citrea Casino. All rights reserved.</p>
          <p className="mt-1">🎲 Play Responsibly • 21+ Only • Ethereum Blockchain Gambling 🎲</p>
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
