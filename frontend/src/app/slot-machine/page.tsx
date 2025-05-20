"use client";

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Dynamically import the SlotMachine component with no SSR to avoid hydration issues
const SlotMachineWithNoSSR = dynamic(
  () => import('./SlotMachine'),
  { ssr: false }
);

export default function SlotMachinePage() {
  const router = useRouter();
  
  // Check if wallet is connected when component mounts
  useEffect(() => {
    // This is a simple check to see if the user came from the home page
    // In a production app, you might want to use a more robust state management solution
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length === 0) {
            // No accounts connected, redirect to home page
            router.push('/');
          }
        })
        .catch((error: any) => {
          console.error('Error checking wallet connection:', error);
          router.push('/');
        });
    } else {
      // No ethereum object, redirect to home page
      router.push('/');
    }
  }, [router]);

  return (
    <div className="min-h-screen relative overflow-hidden">
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
      <div className="relative z-10 w-full max-w-6xl mx-auto p-4">     
        
        {/* Main Content */}
        <main>
          
          {/* Slot Machine */}
          <div className="rounded-xl overflow-hidden mb-8">
            <SlotMachineWithNoSSR />
          </div>
          
          {/* Game Info */}
          <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 mb-6 border border-gray-600">
            <h3 className="text-xl font-bold text-white mb-4">How to Play</h3>
            <div className="space-y-2 text-gray-300">
              <p>1. Connect your wallet and ensure you have ETH staked</p>
              <p>2. Set your bet amount</p>
              <p>3. Click the Spin button to play</p>
              <p>4. Match symbols to win - 777 is the jackpot!</p>
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="mt-8 text-center text-gray-400 text-sm">
          <p>© 2025 Citrea Casino. All rights reserved.</p>
          <p className="mt-1">🎲 Play Responsibly • 21+ Only • Ethereum Blockchain Gambling 🎲</p>
        </footer>
      </div>
      
      {/* Custom styles for animations */}
      <style jsx>{`
        /* Custom gradient for radial backgrounds */
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
}
