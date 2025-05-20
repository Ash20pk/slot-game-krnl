import React from 'react';
import Image from 'next/image';
import CitreaBackground from '../ui/CitreaBackground';

interface CitreaLayoutProps {
  children: React.ReactNode;
  walletConnected?: boolean;
  connectedAddress?: string;
}

const CitreaLayout: React.FC<CitreaLayoutProps> = ({ children, walletConnected = false, connectedAddress = '' }) => {
  return (
    <CitreaBackground>
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white bg-opacity-90 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-xl font-bold flex items-center gap-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-citrea-orange rounded-full opacity-10 animate-pulse"></div>
                  <Image src="/citrea_logo.svg" alt="Citrea Logo" width={30} height={30} />
                </div>
                <span className="text-black font-semibold">Citrea</span>
                <span className="text-black mx-1">x</span>
                <Image src="logo_black.svg" alt="KRNL Logo" width={30} height={30} />
                <span className="text-black font-semibold">KRNL</span>
              </div>
            </div>
            
            {/* Network selector and wallet button */}
            <div className="flex items-center space-x-3">
              {/* Network Selector Button - Citrea style */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full opacity-0 group-hover:opacity-100 transition duration-200"></div>
                <button className="relative px-4 py-1.5 rounded-full bg-white border border-gray-200 hover:border-gray-300 transition-colors text-black shadow-sm flex items-center cursor-pointer">
                  <Image src="/sepolia.svg" alt="Sepolia" width={20} height={20} className='mr-1'/>
                  <span className="mr-1 text-sm font-medium">Sepolia</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              {/* Wallet Button - KRNL style */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-citrea-orange to-krnl-500 rounded-full opacity-75 blur-sm group-hover:opacity-100 transition duration-200"></div>
                {walletConnected ? (
                  <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('disconnect-wallet'))}
                    className="relative px-4 py-1.5 rounded-full font-medium transition-all bg-black hover:bg-gray-900 text-white shadow-sm flex items-center cursor-pointer">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-sm font-mono mr-1 text-gray-300 truncate max-w-[60px]">
                        {connectedAddress ? `${connectedAddress.substring(0, 6)}...${connectedAddress.substring(connectedAddress.length - 4)}` : ''}
                      </span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </button>
                ) : (
                  <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('connect-wallet'))}
                    className="relative px-4 py-1.5 rounded-full font-medium transition-all bg-black hover:bg-gray-900 text-white shadow-sm flex items-center cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-citrea-orange" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">Connect Wallet</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="py-4">
        {children}
      </div>
    </CitreaBackground>
  );
};

export default CitreaLayout;
