"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ethers } from 'krnl-sdk';
import { useRouter } from 'next/navigation';
import { executeKrnl, callContractProtectedFunction } from '../../components/kernels/onchain/1557';
import { abi as contractAbi, CONTRACT_ADDRESS, KERNEL_ID } from '../../components/kernels/onchain/1557/config';
import { playSound, preloadSounds } from '../../utils/sounds';

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

// Payout table - matches the contract's calculateWinnings function
const PAYOUTS = {
  '777': 800,  // Jackpot - Triple 7s
  '666': 200,  // Triple BAR symbols
  '555': 100,  // Triple cherries
  '444': 75,   // Triple bells
  '333': 50,   // Triple plums
  '222': 40,   // Triple oranges
  '111': 30,   // Triple lemons
  '000': 25,   // Triple watermelons
  two_sevens: 20, // Any combination with two 7s
  one_seven: 5,   // Any combination with one 7
  three_of_a_kind: 15, // Any other three of a kind
  two_cherries: 10,    // Two cherries
  two_bars: 8,         // Two bars
  two_of_a_kind: 3,    // Any other two of a kind
  one_cherry: 2        // Single cherry
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
  const machineRef = useRef<HTMLDivElement>(null);
  const coinsRef = useRef<HTMLDivElement>(null);
  
  // Spinning state for each reel
  const [reel1Spinning, setReel1Spinning] = useState(false);
  const [reel2Spinning, setReel2Spinning] = useState(false);
  const [reel3Spinning, setReel3Spinning] = useState(false);

  // Check if wallet is connected on load
  useEffect(() => {
    // Preload sounds
    preloadSounds();
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
          router.push('/');
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
        // Redirect to home if there's an error
        router.push('/');
      }
    } else {
      // Redirect to home if MetaMask is not installed
      router.push('/');
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
      // Play lever pull and reel spin sounds together
      playSound('leverPull');
      playSound('reelSpin');
      
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
        machineRef.current.classList.add('animate-spin-shake');
      }
      
      // Start spinning animation immediately
      startSpinningAnimation();
      
      // Validate bet amount
      if (parseFloat(betAmount) <= 0) {
        // Play error sound
        playSound('error');
        setError('Bet amount must be greater than 0');
        setSpinning(false);
        setLoading(false);
        if (machineRef.current) {
          machineRef.current.classList.remove('animate-spin-shake');
        }
        return;
      }
      
      // Check if user has enough stake
      if (parseFloat(betAmount) > parseFloat(userStake)) {
        // Play error sound
        playSound('error');
        setError('Insufficient balance for this bet');
        setSpinning(false);
        setLoading(false);
        if (machineRef.current) {
          machineRef.current.classList.remove('animate-spin-shake');
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
          machineRef.current.classList.remove('animate-spin-shake');
        }
      }
    } catch (error) {
      console.error('Error placing bet:', error);
      // Play error sound
      playSound('error');
      setError('Failed to place bet. Please try again.');
      setSpinning(false);
      setLoading(false);
      if (machineRef.current) {
        machineRef.current.classList.remove('animate-spin-shake');
      }
    }
  };



  // Start spinning animation immediately after bet is placed
  const startSpinningAnimation = () => {
    // Reset reels to a neutral position first
    setReels([0, 0, 0]);
    
    // Start spinning all reels
    setReel1Spinning(true);
    setReel2Spinning(true);
    setReel3Spinning(true);
    
    // Animate the lever pull
    const leverElements = document.querySelectorAll('.slot-lever');
    leverElements.forEach(el => {
      (el as HTMLElement).style.transform = 'translateY(50px)';
      
      // Return lever to original position after a delay
      setTimeout(() => {
        (el as HTMLElement).style.transform = 'translateY(0)';
      }, 1000);
    });
  };

  // Track the slowing down state for each reel
  const [reel1SlowingDown, setReel1SlowingDown] = useState(false);
  const [reel2SlowingDown, setReel2SlowingDown] = useState(false);
  const [reel3SlowingDown, setReel3SlowingDown] = useState(false);

  // Animate the reels based on the score
  const animateReels = (scoreString: string) => {
    try {
      // Extract individual digits
      const digit1 = parseInt(scoreString[0]);
      const digit2 = parseInt(scoreString[1]);
      const digit3 = parseInt(scoreString[2]);
      
      const finalReels = [digit1, digit2, digit3];
      
      // Create a function to show all symbols in a reel before settling
      const runThroughSymbols = (reelIndex: number, finalValue: number, duration: number) => {
        // Show each symbol for a short time
        let symbolIndex = 0;
        const totalSymbols = SYMBOLS.length;
        const intervalTime = duration / totalSymbols;
        
        // Update the specific reel to show each symbol in sequence
        const interval = setInterval(() => {
          setReels(prev => {
            const newReels = [...prev];
            newReels[reelIndex] = symbolIndex % totalSymbols;
            return newReels;
          });
          
          symbolIndex++;
          
          // When we've gone through all symbols, clear interval
          if (symbolIndex >= totalSymbols) {
            clearInterval(interval);
            
            // Finally set to the actual result value
            setReels(prev => {
              const newReels = [...prev];
              newReels[reelIndex] = finalValue;
              return newReels;
            });
          }
        }, intervalTime);
      };
      
      // First reel animation
      setTimeout(() => {
        setReel1SlowingDown(true);
        
        // Then stops on the correct symbol
        setTimeout(() => {
          setReel1Spinning(false);
          setReel1SlowingDown(false);
          runThroughSymbols(0, finalReels[0], 800);
        }, 1000);
      }, 500);
      
      // Second reel animation
      setTimeout(() => {
        setReel2SlowingDown(true);
        
        // Then stops on the correct symbol
        setTimeout(() => {
          setReel2Spinning(false);
          setReel2SlowingDown(false);
          runThroughSymbols(1, finalReels[1], 800);
        }, 1000);
      }, 2000);
      
      // Third reel animation
      setTimeout(() => {
        setReel3SlowingDown(true);
        
        // Then stops on the correct symbol
        setTimeout(() => {
          setReel3Spinning(false);
          setReel3SlowingDown(false);
          runThroughSymbols(2, finalReels[2], 800);
          
          // Check for win after all reels stop and all symbols have been shown
          setTimeout(() => {
            checkForWin(finalReels);
            setSpinning(false);
            setLoading(false);
            if (machineRef.current) {
              machineRef.current.classList.remove('animate-spin-shake');
            }
          }, 1000);
        }, 1000);
      }, 3500);
    } catch (error) {
      console.error('Error animating reels:', error);
      setSpinning(false);
      setLoading(false);
      setReel1Spinning(false);
      setReel2Spinning(false);
      setReel3Spinning(false);
      setReel1SlowingDown(false);
      setReel2SlowingDown(false);
      setReel3SlowingDown(false);
    }
  };

  // Check for winning combinations - matches the contract's calculateWinnings function
  const checkForWin = (finalReels: number[]) => {
    const [r1, r2, r3] = finalReels;
    let multiplier = 0;
    let winType = '';
    
    // Triple 7s - Jackpot!
    if (r1 === 7 && r2 === 7 && r3 === 7) {
      multiplier = PAYOUTS['777'];
      winType = 'JACKPOT!';
      setJackpot(true);
      // Play jackpot sound
      playSound('jackpot', 0.8);
    }
    // Triple BAR symbols (represented by 6)
    else if (r1 === 6 && r2 === 6 && r3 === 6) {
      multiplier = PAYOUTS['666'];
      winType = 'TRIPLE BARS!';
    }
    // Triple cherries (represented by 5)
    else if (r1 === 5 && r2 === 5 && r3 === 5) {
      multiplier = PAYOUTS['555'];
      winType = 'TRIPLE CHERRIES!';
    }
    // Triple bells (represented by 4)
    else if (r1 === 4 && r2 === 4 && r3 === 4) {
      multiplier = PAYOUTS['444'];
      winType = 'TRIPLE BELLS!';
    }
    // Triple plums (represented by 3)
    else if (r1 === 3 && r2 === 3 && r3 === 3) {
      multiplier = PAYOUTS['333'];
      winType = 'TRIPLE PLUMS!';
    }
    // Triple oranges (represented by 2)
    else if (r1 === 2 && r2 === 2 && r3 === 2) {
      multiplier = PAYOUTS['222'];
      winType = 'TRIPLE ORANGES!';
    }
    // Triple lemons (represented by 1)
    else if (r1 === 1 && r2 === 1 && r3 === 1) {
      multiplier = PAYOUTS['111'];
      winType = 'TRIPLE LEMONS!';
    }
    // Triple watermelons (represented by 0)
    else if (r1 === 0 && r2 === 0 && r3 === 0) {
      multiplier = PAYOUTS['000'];
      winType = 'TRIPLE WATERMELONS!';
    }
    // Any combination with two 7s
    else if ((r1 === 7 && r2 === 7) || (r2 === 7 && r3 === 7) || (r1 === 7 && r3 === 7)) {
      multiplier = PAYOUTS.two_sevens;
      winType = 'TWO SEVENS!';
    }
    // Any combination with one 7
    else if (r1 === 7 || r2 === 7 || r3 === 7) {
      multiplier = PAYOUTS.one_seven;
      winType = 'LUCKY SEVEN!';
    }
    // Any three of a kind (not covered by specific combinations above)
    else if (r1 === r2 && r2 === r3) {
      multiplier = PAYOUTS.three_of_a_kind;
      winType = 'THREE OF A KIND!';
    }
    // Two cherries (represented by 5)
    else if ((r1 === 5 && r2 === 5) || (r2 === 5 && r3 === 5) || (r1 === 5 && r3 === 5)) {
      multiplier = PAYOUTS.two_cherries;
      winType = 'TWO CHERRIES!';
    }
    // Two bars (represented by 6)
    else if ((r1 === 6 && r2 === 6) || (r2 === 6 && r3 === 6) || (r1 === 6 && r3 === 6)) {
      multiplier = PAYOUTS.two_bars;
      winType = 'TWO BARS!';
    }
    // Any other two of a kind
    else if (r1 === r2 || r2 === r3 || r1 === r3) {
      multiplier = PAYOUTS.two_of_a_kind;
      winType = 'PAIR!';
    }
    // Single cherry (represented by 5)
    else if (r1 === 5 || r2 === 5 || r3 === 5) {
      multiplier = PAYOUTS.one_cherry;
      winType = 'CHERRY!';
    }
    
    if (multiplier > 0) {
      const win = parseFloat(betAmount) * multiplier;
      setWinAmount(win.toFixed(4));
      setIsWin(true);
      
      // Play win sound if not a jackpot (jackpot has its own sound)
      if (!jackpot) {
        playSound('win');
      }
      
      // Animate coins falling if it's a win
      if (coinsRef.current) {
        coinsRef.current.classList.add('show-coins');
        
        // Play coin drop sound
        playSound('coinDrop');
        
        // Hide coins after animation
        setTimeout(() => {
          if (coinsRef.current) {
            coinsRef.current.classList.remove('show-coins');
          }
        }, 3000);
      }
      
      // Create and show toast notification
      showWinToast(winType, win.toFixed(4));
    }
  };
  
  // Toast notification for wins
  const [toasts, setToasts] = useState<{message: string, type: string, id: number}[]>([]);
  
  const showWinToast = (winType: string, amount: string) => {
    const newToast = {
      message: `${winType} You won ${amount} ETH!`,
      type: winType.includes('JACKPOT') ? 'jackpot' : 'win',
      id: Date.now()
    };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== newToast.id));
    }, 5000);
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
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Main Slot Machine */}
      <div className="relative flex items-center">
        {/* Side Lever */}
        <div className="relative mr-4 hidden md:block">
          <div className="w-8 h-64 bg-gradient-to-b from-gray-700 to-gray-900 rounded-t-full rounded-b-full flex flex-col items-center justify-between p-2">
            <div className="w-6 h-6 rounded-full bg-red-600 border-2 border-red-800"></div>
            <div 
              className={`slot-lever w-6 h-24 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full relative transition-transform duration-300 ${spinning ? 'transform translate-y-12' : ''}`}
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
        
        {/* Main Slot Machine */}
        <div 
          ref={machineRef}
          className="relative bg-gradient-to-b from-yellow-600 to-yellow-800 rounded-3xl shadow-2xl border-8 border-yellow-400 p-8 mx-auto"
          style={{
            boxShadow: '0 0 0 4px #1a1a1a, 0 0 0 8px #d4af37, 0 20px 40px rgba(0,0,0,0.5), 0 0 30px rgba(212, 175, 55, 0.3)',
            width: '500px',
            height: '720px'
          }}
      >

        {/* Casino Name Display */}
        <div className="bg-black rounded-lg p-4 mb-6 border-4 border-red-600">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">CITREA SLOTS</div>
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
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-4 border-2 border-blue-400">
            <div className="text-center">
              <div className="text-sm text-blue-200">LAST WIN</div>
              <div className="text-2xl font-bold text-white">{parseFloat(winAmount).toFixed(4)} ETH</div>
            </div>
          </div>
        </div>

        {/* Slot Reels */}
        <div className="bg-black rounded-xl p-6 mb-6 border-4 border-gray-600 relative overflow-hidden">
          {/* No win overlay effects */}
          
          {/* Reel containers */}
          <div className="grid grid-cols-3 gap-6">
            {[0, 1, 2].map((index) => {
              // Determine if this reel is spinning or slowing down
              const isSpinning = index === 0 ? reel1Spinning : index === 1 ? reel2Spinning : reel3Spinning;
              const isSlowingDown = index === 0 ? reel1SlowingDown : index === 1 ? reel2SlowingDown : reel3SlowingDown;
              
              return (
                <div key={index} className="relative">
                  {/* Reel frame */}
                  <div className="bg-gradient-to-b from-gray-300 to-gray-500 rounded-lg p-2 shadow-inner">
                    <div 
                      className="bg-white rounded-lg h-32 flex items-center justify-center border-4 border-gray-400 overflow-hidden relative"
                      style={{ perspective: '1000px' }}
                    >
                      <AnimatePresence>
                        {isSpinning ? (
                          // Spinning reel animation
                          <motion.div
                            key="spinning"
                            className="absolute inset-0 flex flex-col items-center justify-center"
                            initial={{ y: 0 }}
                            animate={{
                              y: ["-100%", "0%"],
                              transition: {
                                y: {
                                  repeat: Infinity,
                                  repeatType: "loop",
                                  duration: isSlowingDown ? 3.0 : 0.5, // Slower when slowing down, faster when spinning
                                  ease: isSlowingDown ? "easeOut" : "linear" // Change easing when slowing down
                                }
                              }
                            }}
                          >
                            {/* Triple the symbols to create a seamless loop with more symbols */}
                            {[...SYMBOLS, ...SYMBOLS, ...SYMBOLS].map((symbol, i) => (
                              <div key={i} className="h-32 w-full flex items-center justify-center">
                                <div className="text-5xl select-none">{symbol.symbol}</div>
                              </div>
                            ))}
                          </motion.div>
                        ) : (
                          // Static symbol display
                          <motion.div
                            key="static"
                            className="text-5xl select-none"
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", duration: 0.5 }}
                          >
                            {SYMBOLS[reels[index]]?.symbol || '❓'}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      {/* Spinning effect overlay */}
                      {spinning && (
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent opacity-20 z-10"></div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Win line */}
          <div className="absolute top-1/2 left-4 right-4 h-1 bg-red-500 transform -translate-y-1/2 opacity-50"></div>
          
          {/* No coin explosion container */}
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Bet Amount */}
          <div className="p-4 ">
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
              onMouseDown={() => {
                // Pull the lever down when clicking the spin button
                if (!spinning && !loading) {
                  const leverElements = document.querySelectorAll('.slot-lever');
                  leverElements.forEach(el => {
                    (el as HTMLElement).style.transform = 'translateY(50px)';
                  });
                }
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

        {/* Toast Container */}
        <div className="fixed top-4 right-4 z-50 space-y-4">
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={`p-4 rounded-lg shadow-lg max-w-sm ${toast.type === 'jackpot' ? 'bg-gradient-to-r from-yellow-400 to-red-500 border-2 border-yellow-300' : 'bg-gradient-to-r from-green-400 to-blue-500 border-2 border-green-300'}`}
            >
              <div className="flex justify-between">
                <div className="text-white font-bold">{toast.message}</div>
                <button
                  onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                  className="text-white hover:text-gray-200"
                >
                  ×
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      </div>
      
      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes reel-spin {
          0% { transform: translateY(0); }
          100% { transform: translateY(-320px); }
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
        
        @keyframes spin-shake {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(0.5deg); }
          50% { transform: rotate(0deg); }
          75% { transform: rotate(-0.5deg); }
          100% { transform: rotate(0deg); }
        }
        
        .animate-spin-shake {
          animation: spin-shake 0.2s ease-in-out infinite;
        }
        
        @keyframes lever-pull {
          0% { transform: translateY(0); }
          50% { transform: translateY(50px); }
          100% { transform: translateY(0); }
        }
        
        .slot-lever {
          transition: transform 0.3s ease-out;
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