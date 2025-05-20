import React from 'react';

interface CitreaBackgroundProps {
  children: React.ReactNode;
}

const CitreaBackground: React.FC<CitreaBackgroundProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-citrea-teal via-citrea-yellow to-citrea-orange">
      {/* Overlay to make the gradient more subtle */}
      <div className="absolute inset-0 bg-white opacity-90"></div>
      
      {/* Animated gradient mesh */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_rgba(255,92,0,0.3)_0,_rgba(255,214,0,0.2)_25%,_rgba(0,255,204,0.1)_50%,_rgba(0,82,255,0.2)_75%,_rgba(0,0,0,0)_100%)] animate-gradient-slow"></div>
      
      {/* Circular gradient blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-citrea-orange opacity-20 blur-3xl"></div>
      <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-krnl-500 opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full bg-citrea-yellow opacity-20 blur-3xl"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default CitreaBackground;
