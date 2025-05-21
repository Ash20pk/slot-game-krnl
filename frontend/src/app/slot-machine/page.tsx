"use client";

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { playSound, preloadSounds } from '../../utils/sounds';

// Dynamically import the SlotMachine component with no SSR to avoid hydration issues
const SlotMachineWithNoSSR = dynamic(
  () => import('./SlotMachine'),
  { ssr: false }
);

export default function SlotMachinePage() {
  const router = useRouter();
  
  useEffect(() => {
    // Preload sounds
    preloadSounds();
    
    // Check if wallet is connected when component mounts
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
      <div className="relative z-10 w-full max-w-6xl mx-auto p-4 h-screen flex flex-col items-center justify-center">     
        
        {/* Main Content */}
        <main className="w-full flex flex-col items-center justify-center">
          
          {/* Slot Machine */}
          <div className="mb-8 flex justify-center">
            <SlotMachineWithNoSSR />
          </div>
        </main>
        
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
