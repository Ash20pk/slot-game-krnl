"use client";

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { playSound, preloadSounds } from '../../utils/sounds';
import { ethers } from 'krnl-sdk';
import { CONTRACT_ADDRESS, abi as contractAbi } from '../../components/kernels/onchain/1557/config';

// Dynamically import the SlotMachine component with no SSR to avoid hydration issues
const SlotMachineWithNoSSR = dynamic(
  () => import('./SlotMachine'),
  { ssr: false }
);

export default function SlotMachinePage() {
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  useEffect(() => {
    // Preload sounds
    preloadSounds();
    
    // Check if wallet is connected when component mounts
    const checkWalletAndBalance = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          
          if (accounts.length === 0) {
            // No accounts connected, redirect to home page
            router.push('/');
            return;
          }
          
          // Check user's balance
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, signer);
          
          // Get user stake
          const stake = await contract.getStake(address);
          const stakeAmount = ethers.formatEther(stake);
          
          // If balance is zero or negative, redirect to cashier
          if (parseFloat(stakeAmount) <= 0) {
            // Play error sound
            playSound('error');
            
            // Show toast and redirect after a delay
            setToastMessage('Insufficient balance. Please deposit funds to play.');
            setShowToast(true);
            
            setTimeout(() => {
              router.push('/cashier');
            }, 3000);
          }
        } catch (error) {
          console.error('Error checking wallet or balance:', error);
          router.push('/');
        }
      } else {
        // No ethereum object, redirect to home page
        router.push('/');
      }
    };
    
    checkWalletAndBalance();
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
      
      {/* Toast notification */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center animate-fade-in">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {toastMessage}
        </div>
      )}
      
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
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
