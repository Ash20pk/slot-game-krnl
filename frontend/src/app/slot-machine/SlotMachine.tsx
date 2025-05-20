"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ethers } from 'krnl-sdk';
import { useRouter } from 'next/navigation';
import { executeKrnl, callContractProtectedFunction } from '../../components/kernels/onchain/1557';
import { abi as contractAbi, CONTRACT_ADDRESS, KERNEL_ID } from '../../components/kernels/onchain/1557/config';

// Slot symbols with emojis for visual appeal
const SYMBOLS = [
  { id: 0, symbol: '🍋', name: 'Lemon' },
  { id: 1, symbol: '🍊', name: 'Orange' },
  { id: 2, symbol: '🍒', name: 'Cherry' },
  { id: 3, symbol: '🍇', name: 'Grape' },
  { id: 4, symbol: '🔔', name: 'Bell' },
  { id: 5, symbol: '⭐', name: 'Star' },
  { id: 6, symbol: '💎', name: 'Diamond' },
  { id: 7, symbol: '7️⃣', name: 'Seven' },
  { id: 8, symbol: '🍀', name: 'Clover' },
  { id: 9, symbol: '👑', name: 'Crown' }
];

// Payout table
const PAYOUTS = {
  '777': 1000,
  '666': 500,
  '555': 300,
  '444': 200,
  '333': 150,
  '222': 100,
  '111': 80,
  '000': 50,
  two_sevens: 20,
  one_seven: 10,
  three_of_a_kind: 15,
  two_cherries: 5,
  two_bars: 5,
  two_of_a_kind: 3,
  one_cherry: 2
};

export default function EnhancedSlotMachine() {
  const router = useRouter();
  
  // Blockchain state variables
  const [walletConnected, setWalletConnected] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [transactionHash, setTransactionHash] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [response, setResponse] = useState<any>(null);
  const [eventData, setEventData] = useState<any>(null);
  const [userStake, setUserStake] = useState<string>('1.5');
  const [userBets, setUserBets] = useState<number[]>([]);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<string>('0.01');

  // Enhanced slot machine states
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState([0, 0, 0]);
  const [betAmount, setBetAmount] = useState('0.01');
  const [winAmount, setWinAmount] = useState('0');
  const [isWin, setIsWin] = useState(false);
  const [jackpot, setJackpot] = useState(false);
  const [showPayoutTable, setShowPayoutTable] = useState(false);
  
  // Animation refs
  const reel1Ref = useRef<HTMLDivElement>(null);
  const reel2Ref = useRef<HTMLDivElement>(null);
  const reel3Ref = useRef<HTMLDivElement>(null);
  const machineRef = useRef<HTMLDivElement>(null);
  const coinsRef = useRef<HTMLDivElement>(null);

  // Check if wallet is connected on load
  useEffect(() => {
    checkWalletConnection();
  }, []);

  // Update user stake when contract and address are available
  useEffect(() => {
    if (contract && connectedAddress) {
      getUserStake();
      getUserBets();
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
        } else {
          // Redirect to home if wallet is not connected
          router.push('/slot-machine/home');
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
        // Redirect to home if there's an error
        router.push('/slot-machine/home');
      }
    } else {
      // Redirect to home if MetaMask is not installed
      router.push('/slot-machine/home');
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

  // Get user's bet history
  const getUserBets = async () => {
    try {
      if (contract && connectedAddress) {
        const bets = await contract.getBets(connectedAddress);
        setUserBets(bets.map((bet: ethers.BigNumberish) => Number(bet)));
      }
    } catch (error) {
      console.error('Error getting user bets:', error);
    }
  };

  // Handle spin with blockchain interaction
  const handleSpin = async () => {
    if (spinning || loading) return;
    
    try {
      setSpinning(true);
      setLoading(true);
      setError('');
      setIsWin(false);
      setJackpot(false);
      setWinAmount('0');
      setTransactionHash('');
      setEventData(null);
      
      // Add shake effect to machine
      if (machineRef.current) {
        machineRef.current.classList.add('animate-pulse');
      }
      
      // Validate bet amount
      if (parseFloat(betAmount) <= 0) {
        setError('Bet amount must be greater than 0');
        setSpinning(false);
        setLoading(false);
        if (machineRef.current) {
          machineRef.current.classList.remove('animate-pulse');
        }
        return;
      }
      
      // Check if user has enough stake
      if (parseFloat(betAmount) > parseFloat(userStake)) {
        setError('Insufficient balance for this bet');
        setSpinning(false);
        setLoading(false);
        if (machineRef.current) {
          machineRef.current.classList.remove('animate-pulse');
        }
        return;
      }
      
      // Convert bet amount to Wei
      const betAmountWei = ethers.parseEther(betAmount);
      
      // Execute KRNL to get randomness
      const krnlResponse = await executeKrnl(connectedAddress, KERNEL_ID, betAmountWei);
      
      // Define the type for event data
      interface BetEventData {
        player: string;
        betAmount: string;
        score: string;
      }
      
      // Set up the event listener before sending the transaction
      // Use a promise to handle the event
      const betEventPromise = new Promise<BetEventData>((resolve, reject) => {
        // Set a timeout to reject the promise if the event is not received within 30 seconds
        const timeoutId = setTimeout(() => {
          contract?.removeAllListeners('Bet');
          reject(new Error('Bet event not received within timeout period'));
        }, 30000);

        // Listen for Bet event
        contract?.once('Bet', (player, amount, score, event) => {
          if (player.toLowerCase() === connectedAddress.toLowerCase()) {
            // Clear the timeout
            clearTimeout(timeoutId);
            
            // Store event data
            const eventData = {
              player,
              betAmount: ethers.formatEther(amount),
              score: score.toString().padStart(3, '0')
            };
            setEventData(eventData);
            
            // Resolve the promise with the event data
            resolve(eventData);
          }
        });
      });
      
      // Call the bet function on the contract
      const tx = await callContractProtectedFunction(krnlResponse, signer, betAmountWei);
      
      // Set transaction hash for reference
      setTransactionHash(tx.hash);
      
      try {
        // Wait for the bet event to be received
        const eventData = await betEventPromise;
        
        // Animate reels based on the score
        animateReels(eventData.score);
        
        // Update user stake
        getUserStake();
        getUserBets();
      } catch (eventError) {
        console.error('Error receiving bet event:', eventError);
        setError('Failed to receive bet result. Please check transaction status.');
        setSpinning(false);
        setLoading(false);
        if (machineRef.current) {
          machineRef.current.classList.remove('animate-pulse');
        }
      }
    } catch (error) {
      console.error('Error placing bet:', error);
      setError('Failed to place bet. Please try again.');
      setSpinning(false);
      setLoading(false);
      if (machineRef.current) {
        machineRef.current.classList.remove('animate-pulse');
      }
    }
  };



  // Animate the reels based on the score
  const animateReels = (scoreString: string) => {
    try {
      // Extract individual digits
      const digit1 = parseInt(scoreString[0]);
      const digit2 = parseInt(scoreString[1]);
      const digit3 = parseInt(scoreString[2]);
      
      const finalReels = [digit1, digit2, digit3];
      
      // Simulate spinning with different durations for each reel
      const spinDurations = [1500, 2000, 2500];
      
      // Animate each reel
      [reel1Ref, reel2Ref, reel3Ref].forEach((ref, index) => {
        if (ref.current) {
          ref.current.style.animation = `reel-spin ${spinDurations[index]}ms ease-out`;
          
          setTimeout(() => {
            if (ref.current) {
              ref.current.style.animation = 'reel-stop 0.5s ease-out';
              setReels(prev => {
                const newReels = [...prev];
                newReels[index] = finalReels[index];
                return newReels;
              });
            }
          }, spinDurations[index]);
        }
      });
      
      // Check for win after all reels stop
      setTimeout(() => {
        checkForWin(finalReels);
        setSpinning(false);
        setLoading(false);
        if (machineRef.current) {
          machineRef.current.classList.remove('animate-pulse');
        }
      }, Math.max(...spinDurations) + 500);
    } catch (error) {
      console.error('Error animating reels:', error);
      setSpinning(false);
      setLoading(false);
    }
  };

  // Check for winning combinations
  const checkForWin = (finalReels: number[]) => {
    const [r1, r2, r3] = finalReels;
    let multiplier = 0;
    let winType = '';
    
    // Triple 7s - Jackpot!
    if (r1 === 7 && r2 === 7 && r3 === 7) {
      multiplier = PAYOUTS['777'];
      winType = 'JACKPOT!';
      setJackpot(true);
    }
    // Other triples
    else if (r1 === r2 && r2 === r3) {
      const tripleKey = `${r1}${r1}${r1}` as keyof typeof PAYOUTS;
      multiplier = PAYOUTS[tripleKey] || PAYOUTS.three_of_a_kind;
      winType = 'THREE OF A KIND!';
    }
    // Two 7s
    else if ((r1 === 7 && r2 === 7) || (r2 === 7 && r3 === 7) || (r1 === 7 && r3 === 7)) {
      multiplier = PAYOUTS.two_sevens;
      winType = 'TWO SEVENS!';
    }
    // One 7
    else if (r1 === 7 || r2 === 7 || r3 === 7) {
      multiplier = PAYOUTS.one_seven;
      winType = 'LUCKY SEVEN!';
    }
    // Two of a kind
    else if (r1 === r2 || r2 === r3 || r1 === r3) {
      multiplier = PAYOUTS.two_of_a_kind;
      winType = 'PAIR!';
    }
    
    if (multiplier > 0) {
      const win = parseFloat(betAmount) * multiplier;
      setWinAmount(win.toFixed(4));
      setIsWin(true);
      
      // Coin animation effect
      if (coinsRef.current) {
        coinsRef.current.innerHTML = '';
        for (let i = 0; i < 10; i++) {
          const coin = document.createElement('div');
          coin.className = 'coin';
          coin.style.setProperty('--random-x', `${Math.random() * 200 - 100}px`);
          coin.className = 'absolute w-5 h-5 rounded-full border-2 border-yellow-600 animate-bounce';
          coin.style.background = 'radial-gradient(circle at center, #ffd700, #ffed4e)';
          coin.style.left = `${Math.random() * 100}%`;
          coin.style.top = `${Math.random() * 100}%`;
          coin.style.animationDelay = `${i * 0.1}s`;
          coin.style.animationDuration = `${1 + Math.random()}s`;
          coinsRef.current.appendChild(coin);
          
          // Remove coin after animation
          setTimeout(() => {
            if (coin.parentNode) {
              coin.parentNode.removeChild(coin);
            }
          }, 2000);
        }
      }
    }
  };

  // Handle withdraw
  const handleWithdraw = async () => {
    try {
      setIsWithdrawing(true);
      setError('');
      
      if (!contract || !signer) {
        setError('Wallet not connected');
        setIsWithdrawing(false);
        return;
      }
      
      const withdrawAmountWei = ethers.parseEther(withdrawAmount);
      
      // Call the withdraw function on the contract
      const tx = await contract.withdraw(withdrawAmountWei);
      
      // Wait for the transaction to be mined
      await tx.wait();
      
      // Update user stake
      await getUserStake();
      
      setIsWithdrawing(false);
    } catch (error) {
      console.error('Error withdrawing funds:', error);
      setError('Failed to withdraw funds');
      setIsWithdrawing(false);
    }
  };

  // Handle bet amount change with validation
  const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseFloat(value);
    
    // Validate input
    if (isNaN(numValue) || numValue < 0) {
      return;
    }
    
    // Limit to 4 decimal places
    const formattedValue = numValue.toFixed(4);
    setBetAmount(formattedValue);
  };

  // Handle withdraw amount change with validation
  const handleWithdrawAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseFloat(value);
    
    // Validate input
    if (isNaN(numValue) || numValue < 0) {
      return;
    }
    
    // Ensure withdraw amount doesn't exceed user stake
    if (numValue > parseFloat(userStake)) {
      setWithdrawAmount(userStake);
      return;
    }
    
    // Limit to 4 decimal places
    const formattedValue = numValue.toFixed(4);
    setWithdrawAmount(formattedValue);
  };

  // Go back to home
  const goToHome = () => {
    router.push('/slot-machine/home');
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Main Slot Machine */}
      <div 
        ref={machineRef}
        className="relative bg-gradient-to-b from-yellow-600 to-yellow-800 rounded-3xl shadow-2xl border-8 border-yellow-400 p-8 max-w-2xl w-full mx-auto"
        style={{
          boxShadow: '0 0 0 4px #1a1a1a, 0 0 0 8px #d4af37, 0 20px 40px rgba(0,0,0,0.5), 0 0 30px rgba(212, 175, 55, 0.3)'
        }}
      >

        {/* Casino Name Display */}
        <div className="bg-black rounded-lg p-4 mb-6 border-4 border-red-600">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500 animate-pulse">CITREA SLOTS</div>
            <div className="text-sm text-yellow-400">POWERED BY KRNL</div>
          </div>
        </div>

        {/* Balance and Win Display */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-lg p-4 border-2 border-green-400">
            <div className="text-center">
              <div className="text-sm text-green-200">BALANCE</div>
              <div className="text-2xl font-bold text-white">{parseFloat(userStake).toFixed(4)} ETH</div>
            </div>
          </div>
          <div className={`bg-gradient-to-r from-yellow-600 to-yellow-800 rounded-lg p-4 border-2 border-yellow-400 ${isWin ? 'animate-pulse' : ''}`}>
            <div className="text-center">
              <div className="text-sm text-yellow-200">LAST WIN</div>
              <div className="text-2xl font-bold text-white">{parseFloat(winAmount).toFixed(4)} ETH</div>
            </div>
          </div>
        </div>

        {/* Slot Reels */}
        <div className="bg-black rounded-xl p-6 mb-6 border-4 border-gray-600 relative overflow-hidden">
          {/* Win flash overlay */}
          {isWin && (
            <div className="absolute inset-0 bg-yellow-400 opacity-30 animate-pulse z-10 rounded-lg"></div>
          )}
          
          {/* Jackpot explosion effect */}
          {jackpot && (
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 opacity-50 animate-pulse z-10 rounded-lg"></div>
          )}
          
          {/* Reel containers */}
          <div className="grid grid-cols-3 gap-6">
            {[reel1Ref, reel2Ref, reel3Ref].map((ref, index) => (
              <div key={index} className="relative">
                {/* Reel frame */}
                <div className="bg-gradient-to-b from-gray-300 to-gray-500 rounded-lg p-2 shadow-inner">
                  <div 
                    ref={ref}
                    className="bg-white rounded-lg h-32 flex items-center justify-center border-4 border-gray-400 overflow-hidden relative"
                  >
                    {/* Symbol display */}
                    <div className="text-6xl select-none relative z-20">
                      {SYMBOLS[reels[index]]?.symbol || '❓'}
                    </div>
                    
                    {/* Spinning effect overlay */}
                    {spinning && (
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent opacity-70 animate-pulse z-10"></div>
                    )}
                  </div>
                </div>
                
                {/* Reel number */}
                <div className="text-center text-xs text-gray-400 mt-1">REEL {index + 1}</div>
              </div>
            ))}
          </div>
          
          {/* Win line */}
          <div className="absolute top-1/2 left-4 right-4 h-1 bg-red-500 transform -translate-y-1/2 opacity-50"></div>
          
          {/* Coin explosion container */}
          <div ref={coinsRef} className="absolute inset-0 pointer-events-none"></div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Bet Amount */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-lg p-4 border-2 border-blue-400">
            <div className="flex items-center justify-between">
              <span className="text-white font-bold">BET AMOUNT:</span>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => {
                    const newAmount = Math.max(0.0001, parseFloat(betAmount) - 0.01);
                    setBetAmount(newAmount.toFixed(4));
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold w-8 h-8 rounded-full transition-colors disabled:opacity-50"
                  disabled={spinning || loading}
                >
                  -
                </button>
                <div className="bg-black px-4 py-2 rounded-lg border border-gray-400">
                  <span className="text-green-400 font-mono text-lg">{betAmount} ETH</span>
                </div>
                <button 
                  onClick={() => {
                    const newAmount = parseFloat(betAmount) + 0.01;
                    // Ensure bet amount doesn't exceed user stake
                    if (newAmount <= parseFloat(userStake)) {
                      setBetAmount(newAmount.toFixed(4));
                    } else {
                      // Set max bet to user stake
                      setBetAmount(userStake);
                    }
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold w-8 h-8 rounded-full transition-colors disabled:opacity-50"
                  disabled={spinning || loading || parseFloat(betAmount) >= parseFloat(userStake)}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Spin Button */}
          <div className="text-center">
            <button
              onClick={handleSpin}
              // disabled={spinning || loading || !walletConnected}
              className={`relative overflow-hidden bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 text-white font-bold text-2xl py-6 px-12 rounded-full border-4 border-yellow-400 shadow-lg transition-all transform ${
                spinning || loading ? 'scale-95 opacity-75 cursor-not-allowed' : 'hover:scale-105 hover:shadow-xl'
              }`}
              style={{
                boxShadow: spinning || loading 
                  ? '0 5px 15px rgba(0,0,0,0.3)' 
                  : '0 10px 25px rgba(0,0,0,0.3), 0 0 30px rgba(239, 68, 68, 0.3)'
              }}
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
              
              <span className="relative z-10">
                {spinning || loading ? '🎰 SPINNING... 🎰' : '🎲 SPIN TO WIN! 🎲'}
              </span>
              
              {/* Pulsing glow when not spinning */}
              {!spinning && !loading && (
                <div className="absolute inset-0 rounded-full bg-red-400 opacity-20 animate-ping"></div>
              )}
            </button>
          </div>
        </div>

        {/* Win notification */}
        {isWin && (
          <div className={`mt-6 p-6 rounded-xl border-4 text-center ${
            jackpot 
              ? 'bg-gradient-to-r from-yellow-400 to-red-500 border-yellow-300' 
              : 'bg-gradient-to-r from-green-400 to-blue-500 border-green-300'
          }`}>
            <div className="text-3xl font-bold text-white mb-2">
              {jackpot ? ' JACKPOT! ' : ' YOU WIN! '}
            </div>
            <div className="text-2xl font-bold text-white">
              {winAmount} ETH
            </div>
            {jackpot && (
              <div className="text-lg text-yellow-200 animate-bounce">
                MAXIMUM PAYOUT! 
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes reel-spin {
          0% { transform: translateY(0) rotateX(0deg); }
          100% { transform: translateY(-500px) rotateX(360deg); }
        }
        
        @keyframes reel-stop {
          0% { transform: translateY(0); }
          20% { transform: translateY(-10px); }
          40% { transform: translateY(5px); }
          60% { transform: translateY(-3px); }
          80% { transform: translateY(1px); }
          100% { transform: translateY(0); }
        }
        
        @keyframes coin-burst {
          0% { 
            transform: scale(0) translate(0, 0) rotate(0deg); 
            opacity: 1; 
          }
          100% { 
            transform: scale(1) translate(var(--random-x), var(--random-y)) rotate(720deg); 
            opacity: 0; 
          }
        }
        
        .coin {
          position: absolute;
          bottom: 50%;
          left: 50%;
          width: 20px;
          height: 20px;
          background: radial-gradient(circle at center, #ffd700, #ffed4e);
          border-radius: 50%;
          border: 2px solid #ffb000;
          animation: coin-burst 2s forwards;
          z-index: 30;
        }
        
        .coin::before {
          content: '$';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-weight: bold;
          font-size: 10px;
          color: #b8860b;
        }
      `}</style>
    </div>
  );
}