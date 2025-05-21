// Sound utility for managing audio effects across the application

// Define sound file paths
const SOUNDS = {
  buttonClick: '/sounds/button-click.mp3',
  leverPull: '/sounds/lever-pull.mp3',
  reelSpin: '/sounds/reel-spin.mp3',
  win: '/sounds/win.mp3',
  jackpot: '/sounds/jackpot.mp3',
  deposit: '/sounds/deposit.mp3',
  withdraw: '/sounds/withdraw.mp3',
  coinDrop: '/sounds/coin-drop.mp3',
  walletConnect: '/sounds/wallet-connect.mp3',
  error: '/sounds/error.mp3',
  success: '/sounds/success.mp3',
};

// Audio cache to avoid creating multiple instances of the same sound
const audioCache: { [key: string]: HTMLAudioElement } = {};

// Play a sound with optional volume control
export const playSound = (soundName: keyof typeof SOUNDS, volume = 1.0): void => {
  if (typeof window === 'undefined') return; // Skip on server-side

  try {
    const soundPath = SOUNDS[soundName];
    
    // Create or retrieve audio element
    if (!audioCache[soundPath]) {
      audioCache[soundPath] = new Audio(soundPath);
    }
    
    const audio = audioCache[soundPath];
    
    // Reset audio to beginning if it's already playing
    audio.currentTime = 0;
    audio.volume = Math.min(Math.max(volume, 0), 1); // Ensure volume is between 0 and 1
    
    // Play the sound
    audio.play().catch(error => {
      // Silently handle autoplay restrictions
      console.log(`Sound playback failed: ${error.message}`);
    });
  } catch (error) {
    console.error('Error playing sound:', error);
  }
};

// Preload sounds for better performance
export const preloadSounds = (): void => {
  if (typeof window === 'undefined') return; // Skip on server-side
  
  Object.values(SOUNDS).forEach(soundPath => {
    if (!audioCache[soundPath]) {
      const audio = new Audio(soundPath);
      audio.preload = 'auto';
      audioCache[soundPath] = audio;
    }
  });
};

// Stop a specific sound
export const stopSound = (soundName: keyof typeof SOUNDS): void => {
  if (typeof window === 'undefined') return; // Skip on server-side
  
  const soundPath = SOUNDS[soundName];
  if (audioCache[soundPath]) {
    audioCache[soundPath].pause();
    audioCache[soundPath].currentTime = 0;
  }
};

// Stop all sounds
export const stopAllSounds = (): void => {
  if (typeof window === 'undefined') return; // Skip on server-side
  
  Object.values(audioCache).forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  });
};

export default SOUNDS;
