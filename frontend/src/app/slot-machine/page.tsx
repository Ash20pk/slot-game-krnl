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
      
      {/* Casino-themed particles */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              background: i % 3 === 0 ? 'radial-gradient(circle at center, #ffd700, #ffed4e)' : 
                         i % 3 === 1 ? 'radial-gradient(circle at center, #ff5e5e, #ff8f8f)' : 
                         'radial-gradient(circle at center, #5eafff, #8fcfff)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
              opacity: 0.6,
              animation: `float ${3 + Math.random() * 5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
      
      {/* Content wrapper */}
      <div className="relative z-10 w-full max-w-6xl mx-auto p-4">     
        
        {/* Main Content */}
        <main>
          
          {/* Slot Machine */}
          <div className="mb-8">
            <SlotMachineWithNoSSR />
          </div>
          
          {/* Game Info */}
          <div className="bg-gradient-to-b from-yellow-600 to-yellow-800 rounded-3xl shadow-2xl border-8 border-yellow-400 p-6 mb-6 max-w-2xl mx-auto"
            style={{
              boxShadow: '0 0 0 4px #1a1a1a, 0 0 0 8px #d4af37, 0 20px 40px rgba(0,0,0,0.5), 0 0 30px rgba(212, 175, 55, 0.3)'
            }}>
            <h3 className="text-2xl font-bold text-white mb-4 text-center">🎮 How to Play 🎮</h3>
            <div className="space-y-3 text-white">
              <div className="flex items-center bg-black/30 p-3 rounded-lg">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-3 text-white font-bold">1</div>
                <p>Connect your wallet and ensure you have ETH staked</p>
              </div>
              <div className="flex items-center bg-black/30 p-3 rounded-lg">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-3 text-white font-bold">2</div>
                <p>Set your bet amount using the controls</p>
              </div>
              <div className="flex items-center bg-black/30 p-3 rounded-lg">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-3 text-white font-bold">3</div>
                <p>Pull the lever or click the Spin button to play</p>
              </div>
              <div className="flex items-center bg-black/30 p-3 rounded-lg">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-3 text-white font-bold">4</div>
                <p>Match symbols to win - 777 is the jackpot!</p>
              </div>
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="mt-8 text-center">
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-4 border-2 border-yellow-600 max-w-2xl mx-auto">
            <div className="text-yellow-400 font-bold text-lg mb-2">CITREA CASINO</div>
            <p className="text-gray-300">© 2025 Citrea Casino. All rights reserved.</p>
            <p className="mt-2 text-gray-400">🎲 Play Responsibly • 21+ Only • Ethereum Blockchain Gambling 🎲</p>
          </div>
        </footer>
        
      </div>
      
      {/* Custom styles for animations */}
      <style jsx>{`
        /* Custom gradient for radial backgrounds */
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}
