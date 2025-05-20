"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ethers } from 'krnl-sdk';
import { abi as contractAbi, CONTRACT_ADDRESS } from '../../components/kernels/onchain/1557/config';

export default function StakePage() {
  const router = useRouter();
  const [walletConnected, setWalletConnected] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string>('');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [userStake, setUserStake] = useState<string>('0');
  const [stakeAmount, setStakeAmount] = useState<string>('0.1');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('0.05');
  const [transactionHash, setTransactionHash] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string>('');

  // Check if wallet is connected on load
  useEffect(() => {
    // Check if wallet is connected when component mounts
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length === 0) {
            // No accounts connected, redirect to home page
            router.push('/');
          } else {
            checkWalletConnection();
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

  // Check wallet connection
  const checkWalletConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
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
          
          // Get user stake
          try {
            const stake = await newContract.stakes(address);
            setUserStake(ethers.formatEther(stake));
          } catch (error) {
            console.error('Error getting user stake:', error);
          }
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  // Handle staking
  const handleStake = async () => {
    if (!contract || !signer || parseFloat(stakeAmount) <= 0) {
      setError('Invalid stake amount');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Convert stake amount to wei
      const stakeAmountWei = ethers.parseEther(stakeAmount);
      
      // Call the stake function on the contract
      const tx = await contract.stake({ value: stakeAmountWei });
      
      // Wait for the transaction to be mined
      await tx.wait();
      
      setTransactionHash(tx.hash);
      setSuccess(`Successfully staked ${stakeAmount} ETH`);
      
      // Update user stake
      if (contract) {
        const stake = await contract.stakes(connectedAddress);
        setUserStake(ethers.formatEther(stake));
      }
    } catch (error) {
      console.error('Error staking:', error);
      setError('Failed to stake. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle withdrawal
  const handleWithdraw = async () => {
    if (!contract || !signer || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > parseFloat(userStake)) {
      setError('Invalid withdrawal amount');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Convert withdraw amount to wei
      const withdrawAmountWei = ethers.parseEther(withdrawAmount);
      
      // Call the withdraw function on the contract
      const tx = await contract.withdraw(withdrawAmountWei);
      
      // Wait for the transaction to be mined
      await tx.wait();
      
      setTransactionHash(tx.hash);
      setSuccess(`Successfully withdrew ${withdrawAmount} ETH`);
      
      // Update user stake
      if (contract) {
        const stake = await contract.stakes(connectedAddress);
        setUserStake(ethers.formatEther(stake));
      }
    } catch (error) {
      console.error('Error withdrawing:', error);
      setError('Failed to withdraw. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle enter casino
  const handleEnterCasino = () => {
    if (parseFloat(userStake) > 0) {
      router.push('/slot-machine');
    } else {
      setError('You need to stake some ETH to enter the casino');
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
      
      <div className="relative z-10 max-w-2xl w-full slot-cabinet">
        {/* Casino cashier header */}
        <div className="relative py-8 px-6 text-center mb-4">
          <div className="bg-black p-4 rounded-lg border-4 border-yellow-400">
            <h1 className="text-4xl font-bold text-yellow-400 tracking-wider mb-2 drop-shadow-lg">CASHIER</h1>
          </div>
          
          <div className="flex justify-center items-center mt-4">
            {/* Cabinet lights */}
            <div className="flex space-x-4 mr-3">
              {[...Array(3)].map((_, i) => (
                <div key={`left-${i}`} className="cabinet-light" style={{ animationDelay: `${i * 0.2}s`, backgroundColor: '#00ff66' }}></div>
              ))}
            </div>
            <div className="bg-black px-4 py-2 rounded-lg border-2 border-green-800">
              <p className="text-green-400 font-bold tracking-widest">STAKE & WITHDRAW</p>
            </div>
            <div className="flex space-x-4 ml-3">
              {[...Array(3)].map((_, i) => (
                <div key={`right-${i}`} className="cabinet-light" style={{ animationDelay: `${i * 0.2}s`, backgroundColor: '#00ff66' }}></div>
              ))}
            </div>
          </div>
          
          {/* Decorative coin graphics */}
          <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-gradient-to-r from-green-300 to-green-500 border-2 border-green-600 flex items-center justify-center text-black font-bold">$</div>
          <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-r from-green-300 to-green-500 border-2 border-green-600 flex items-center justify-center text-black font-bold">$</div>
        </div>
        
        <div className="p-8 bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700 shadow-2xl">
          {/* Back to lobby button */}
          <div className="mb-6">
            <button 
              onClick={() => router.push('/')} 
              className="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-yellow-400 font-bold py-2 px-4 rounded-full flex items-center border border-yellow-600 shadow-lg transition-all transform hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Lobby
            </button>
          </div>
          
          {/* Current stake display */}
          <div className="slot-display p-6 rounded-lg mb-8 bg-black/50 backdrop-blur-sm border-2 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4 text-center tracking-wider">YOUR BALANCE</h2>
            <div className="flex items-center justify-center">
              <div className="bg-black p-6 rounded-lg border-2 border-yellow-500 min-w-[200px] relative overflow-hidden shadow-inner">
                {/* Digital display effect */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-white opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-30"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMiIgaGVpZ2h0PSIyIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDIgMCBMIDAgMCAwIDIiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIwLjUiPjwvcGF0aD48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiPjwvcmVjdD48L3N2Zz4=')]" opacity-10></div>
                <p className="text-5xl font-mono font-bold text-yellow-400 text-center text-shadow-glow relative animate-pulse-subtle">{parseFloat(userStake).toFixed(4)} <span className="text-3xl">ETH</span></p>
              </div>
            </div>
          </div>
          
          {/* Stake and withdraw controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Stake section */}
            <div className="slot-display p-6 rounded-lg bg-black/50 backdrop-blur-sm border-2 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
              <div className="bg-black bg-opacity-80 p-4 rounded-lg">
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 mb-4 text-center tracking-wider">STAKE</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-green-400 mb-2">Amount (ETH)</label>
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500 opacity-10 rounded-md"></div>
                    <input 
                      type="number" 
                      min="0.01" 
                      step="0.01"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      className="relative w-full bg-black border-2 border-green-500 text-green-400 text-xl font-mono rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-inner"
                      disabled={loading}
                    />
                  </div>
                </div>
                <button
                  onClick={handleStake}
                  disabled={loading || !walletConnected}
                  className={`relative overflow-hidden w-full bg-gradient-to-b from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 text-white font-bold py-4 px-6 rounded-md border-2 border-green-400 shadow-lg transition-all transform ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-xl'}`}
                  style={{
                    boxShadow: loading 
                      ? '0 5px 15px rgba(0,0,0,0.3)' 
                      : '0 10px 25px rgba(0,0,0,0.3), 0 0 30px rgba(34,197,94,0.3)'
                  }}
                >
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                  
                  <span className="relative z-10 text-xl">
                    {loading ? 'Processing...' : '💰 Stake ETH 💰'}
                  </span>
                  
                  {/* Pulsing glow when not loading */}
                  {!loading && (
                    <div className="absolute inset-0 rounded-md bg-green-400 opacity-20 animate-ping"></div>
                  )}
                </button>
              </div>
            </div>
            
            {/* Withdraw section */}
            <div className="slot-display p-6 rounded-lg bg-black/50 backdrop-blur-sm border-2 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              <div className="bg-black bg-opacity-80 p-4 rounded-lg">
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 mb-4 text-center tracking-wider">WITHDRAW</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-red-400 mb-2">Amount (ETH)</label>
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-500 opacity-10 rounded-md"></div>
                    <input 
                      type="number" 
                      min="0.01" 
                      step="0.01"
                      max={userStake}
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="relative w-full bg-black border-2 border-red-500 text-red-400 text-xl font-mono rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-inner"
                      disabled={loading}
                    />
                  </div>
                </div>
                <button
                  onClick={handleWithdraw}
                  disabled={loading || !walletConnected || parseFloat(userStake) <= 0}
                  className={`relative overflow-hidden w-full bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 text-white font-bold py-4 px-6 rounded-md border-2 border-red-400 shadow-lg transition-all transform ${(loading || parseFloat(userStake) <= 0) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-xl'}`}
                  style={{
                    boxShadow: (loading || parseFloat(userStake) <= 0) 
                      ? '0 5px 15px rgba(0,0,0,0.3)' 
                      : '0 10px 25px rgba(0,0,0,0.3), 0 0 30px rgba(239,68,68,0.3)'
                  }}
                >
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                  
                  <span className="relative z-10 text-xl">
                    {loading ? 'Processing...' : '💸 Withdraw ETH 💸'}
                  </span>
                  
                  {/* Pulsing glow when not disabled */}
                  {!loading && parseFloat(userStake) > 0 && (
                    <div className="absolute inset-0 rounded-md bg-red-400 opacity-20 animate-ping"></div>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Enter casino button */}
          <div className="text-center mb-6">
            <div className="relative">
              {/* Slot machine lever */}
              <div className="flex items-end justify-center mb-4">
                <div 
                  className={`slot-lever ${parseFloat(userStake) <= 0 ? 'opacity-50' : 'slot-lever-pulled'}`} 
                  onClick={parseFloat(userStake) > 0 && !loading ? handleEnterCasino : undefined}
                  style={{
                    cursor: parseFloat(userStake) > 0 && !loading ? 'pointer' : 'not-allowed',
                    filter: parseFloat(userStake) > 0 && !loading ? 'drop-shadow(0 0 10px rgba(234, 179, 8, 0.5))' : 'none'
                  }}
                ></div>
              </div>
              <button
                onClick={handleEnterCasino}
                disabled={loading || parseFloat(userStake) <= 0}
                className={`relative overflow-hidden w-auto h-auto px-12 py-5 rounded-full bg-gradient-to-b from-yellow-500 to-yellow-700 hover:from-yellow-400 hover:to-yellow-600 text-black font-bold border-4 border-yellow-300 shadow-lg transition-all transform ${(loading || parseFloat(userStake) <= 0) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-xl'}`}
                style={{
                  boxShadow: (loading || parseFloat(userStake) <= 0) 
                    ? '0 5px 15px rgba(0,0,0,0.3)' 
                    : '0 10px 25px rgba(0,0,0,0.3), 0 0 30px rgba(234, 179, 8, 0.5)'
                }}
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                
                <span className="relative z-10 text-2xl tracking-wider">
                  🎰 ENTER CASINO 🎰
                </span>
                
                {/* Pulsing glow when not disabled */}
                {!loading && parseFloat(userStake) > 0 && (
                  <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-20 animate-ping"></div>
                )}
              </button>
            </div>
          </div>
          
          {/* Status messages */}
          {error && (
            <div className="mb-4 bg-gradient-to-r from-red-600/30 to-red-700/30 backdrop-blur-sm p-4 rounded-lg border border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
              <div className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-red-400 font-bold text-center">{error}</p>
              </div>
            </div>
          )}
          
          {success && (
            <div className="mb-4 bg-gradient-to-r from-green-600/30 to-green-700/30 backdrop-blur-sm p-4 rounded-lg border border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
              <div className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-green-400 font-bold text-center">{success}</p>
              </div>
            </div>
          )}
          
          {/* Transaction Hash */}
          {transactionHash && (
            <div className="mb-4 bg-gradient-to-r from-blue-600/30 to-blue-700/30 backdrop-blur-sm p-4 rounded-lg border border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
              <div className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-blue-300 text-center">
                  TX: <a href={`https://sepolia.etherscan.io/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline hover:text-blue-300 transition-colors">{transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}</a>
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Custom styles for animations */}
        <style jsx>{`
          /* Custom gradient for radial backgrounds */
          .bg-gradient-radial {
            background: radial-gradient(circle, var(--tw-gradient-stops));
          }
          
          /* Text glow effect */
          .text-shadow-glow {
            text-shadow: 0 0 10px rgba(234, 179, 8, 0.5);
          }
          
          /* Subtle pulse animation */
          @keyframes pulse-subtle {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.8;
            }
          }
          
          .animate-pulse-subtle {
            animation: pulse-subtle 2s ease-in-out infinite;
          }
          
          /* Enhanced slot lever */
          .slot-lever {
            position: relative;
            width: 30px;
            height: 100px;
            background: linear-gradient(to right, #444, #777, #444);
            border-radius: 10px;
            margin-bottom: 20px;
            transform-origin: bottom center;
            transition: all 0.3s ease;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            border: 2px solid #333;
          }
          
          .slot-lever:before {
            content: '';
            position: absolute;
            top: -20px;
            left: 50%;
            transform: translateX(-50%);
            width: 40px;
            height: 40px;
            background: linear-gradient(to right, #d4af37, #f9d423, #d4af37);
            border-radius: 50%;
            border: 3px solid #333;
            box-shadow: 0 0 15px rgba(234, 179, 8, 0.5);
          }
          
          .slot-lever-pulled {
            transform: rotate(-25deg);
            transition: transform 0.3s ease;
          }
          
          .slot-lever-pulled:hover {
            transform: rotate(-15deg);
          }
          
          .slot-lever:not(.slot-lever-pulled):hover {
            transform: rotate(-5deg);
          }
          
          /* Cabinet lights animation */
          .cabinet-light {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            animation: blink 1.5s infinite alternate;
            box-shadow: 0 0 10px currentColor;
          }
          
          @keyframes blink {
            0% {
              opacity: 0.4;
            }
            100% {
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
