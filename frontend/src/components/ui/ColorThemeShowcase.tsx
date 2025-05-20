import React from 'react';

const ColorThemeShowcase: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Citrea x KRNL Color System</h1>
      
      {/* Primary Brand Colors */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Primary Brand Colors</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Citrea Colors */}
          <div className="rounded-lg overflow-hidden shadow-lg">
            <div className="p-4 bg-citrea-600 text-white font-bold">
              Citrea Primary
            </div>
            <div className="p-4 bg-white">
              <div className="grid grid-cols-1 gap-2">
                <ColorSwatch name="50" color="bg-citrea-50" textColor="text-black" />
                <ColorSwatch name="100" color="bg-citrea-100" textColor="text-black" />
                <ColorSwatch name="200" color="bg-citrea-200" textColor="text-black" />
                <ColorSwatch name="300" color="bg-citrea-300" textColor="text-black" />
                <ColorSwatch name="400" color="bg-citrea-400" textColor="text-black" />
                <ColorSwatch name="500" color="bg-citrea-500" textColor="text-white" />
                <ColorSwatch name="600" color="bg-citrea-600" textColor="text-white" />
                <ColorSwatch name="700" color="bg-citrea-700" textColor="text-white" />
                <ColorSwatch name="800" color="bg-citrea-800" textColor="text-white" />
                <ColorSwatch name="900" color="bg-citrea-900" textColor="text-white" />
                <ColorSwatch name="950" color="bg-citrea-950" textColor="text-white" />
              </div>
            </div>
          </div>
          
          {/* KRNL Colors */}
          <div className="rounded-lg overflow-hidden shadow-lg">
            <div className="p-4 bg-krnl-500 text-white font-bold">
              KRNL Primary
            </div>
            <div className="p-4 bg-white">
              <div className="grid grid-cols-1 gap-2">
                <ColorSwatch name="50" color="bg-krnl-50" textColor="text-black" />
                <ColorSwatch name="100" color="bg-krnl-100" textColor="text-black" />
                <ColorSwatch name="200" color="bg-krnl-200" textColor="text-black" />
                <ColorSwatch name="300" color="bg-krnl-300" textColor="text-black" />
                <ColorSwatch name="400" color="bg-krnl-400" textColor="text-black" />
                <ColorSwatch name="500" color="bg-krnl-500" textColor="text-white" />
                <ColorSwatch name="600" color="bg-krnl-600" textColor="text-white" />
                <ColorSwatch name="700" color="bg-krnl-700" textColor="text-white" />
                <ColorSwatch name="800" color="bg-krnl-800" textColor="text-white" />
                <ColorSwatch name="900" color="bg-krnl-900" textColor="text-white" />
                <ColorSwatch name="950" color="bg-krnl-950" textColor="text-white" />
              </div>
            </div>
          </div>
          
          {/* Bitcoin Gold Colors */}
          <div className="rounded-lg overflow-hidden shadow-lg">
            <div className="p-4 bg-bitcoin-500 text-white font-bold">
              Bitcoin Gold
            </div>
            <div className="p-4 bg-white">
              <div className="grid grid-cols-1 gap-2">
                <ColorSwatch name="50" color="bg-bitcoin-50" textColor="text-black" />
                <ColorSwatch name="100" color="bg-bitcoin-100" textColor="text-black" />
                <ColorSwatch name="200" color="bg-bitcoin-200" textColor="text-black" />
                <ColorSwatch name="300" color="bg-bitcoin-300" textColor="text-black" />
                <ColorSwatch name="400" color="bg-bitcoin-400" textColor="text-black" />
                <ColorSwatch name="500" color="bg-bitcoin-500" textColor="text-white" />
                <ColorSwatch name="600" color="bg-bitcoin-600" textColor="text-white" />
                <ColorSwatch name="700" color="bg-bitcoin-700" textColor="text-white" />
                <ColorSwatch name="800" color="bg-bitcoin-800" textColor="text-white" />
                <ColorSwatch name="900" color="bg-bitcoin-900" textColor="text-white" />
                <ColorSwatch name="950" color="bg-bitcoin-950" textColor="text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Functional Colors */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Functional Colors</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <div className="p-4 bg-success-500 text-white font-bold">
              Success
            </div>
            <div className="p-4 bg-white">
              <div className="grid grid-cols-1 gap-2">
                <ColorSwatch name="500" color="bg-success-500" textColor="text-white" />
              </div>
            </div>
          </div>
          
          <div className="rounded-lg overflow-hidden shadow-lg">
            <div className="p-4 bg-warning-500 text-white font-bold">
              Warning
            </div>
            <div className="p-4 bg-white">
              <div className="grid grid-cols-1 gap-2">
                <ColorSwatch name="500" color="bg-warning-500" textColor="text-white" />
              </div>
            </div>
          </div>
          
          <div className="rounded-lg overflow-hidden shadow-lg">
            <div className="p-4 bg-error-500 text-white font-bold">
              Error
            </div>
            <div className="p-4 bg-white">
              <div className="grid grid-cols-1 gap-2">
                <ColorSwatch name="500" color="bg-error-500" textColor="text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Gradients */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Gradients</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-24 rounded-lg shadow-lg flex items-center justify-center" 
               style={{ background: 'var(--gradient-citrea-krnl)' }}>
            <span className="font-bold text-white text-lg">Citrea x KRNL</span>
          </div>
          
          <div className="h-24 rounded-lg shadow-lg flex items-center justify-center" 
               style={{ background: 'var(--gradient-citrea)' }}>
            <span className="font-bold text-white text-lg">Citrea</span>
          </div>
          
          <div className="h-24 rounded-lg shadow-lg flex items-center justify-center" 
               style={{ background: 'var(--gradient-krnl)' }}>
            <span className="font-bold text-white text-lg">KRNL</span>
          </div>
        </div>
      </section>
      
      {/* Gradient Text */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Gradient Text</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg shadow-lg bg-white">
            <h3 className="citrea-krnl-gradient-text text-2xl font-bold">Citrea x KRNL</h3>
            <p className="mt-2 text-gray-600">Combined gradient text</p>
          </div>
          
          <div className="p-6 rounded-lg shadow-lg bg-white">
            <h3 className="citrea-gradient-text text-2xl font-bold">Citrea</h3>
            <p className="mt-2 text-gray-600">Citrea gradient text</p>
          </div>
          
          <div className="p-6 rounded-lg shadow-lg bg-white">
            <h3 className="krnl-gradient-text text-2xl font-bold">KRNL</h3>
            <p className="mt-2 text-gray-600">KRNL gradient text</p>
          </div>
        </div>
      </section>
      
      {/* UI Components */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">UI Components</h2>
        
        {/* Buttons */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Buttons</h3>
          <div className="flex flex-wrap gap-4">
            <button className="px-4 py-2 bg-citrea-600 hover:bg-citrea-700 text-white font-medium rounded-lg transition-colors">
              Citrea Primary
            </button>
            
            <button className="px-4 py-2 bg-krnl-500 hover:bg-krnl-600 text-white font-medium rounded-lg transition-colors">
              KRNL Primary
            </button>
            
            <button className="px-4 py-2 bg-bitcoin-500 hover:bg-bitcoin-600 text-white font-medium rounded-lg transition-colors">
              Bitcoin Gold
            </button>
            
            <button className="px-4 py-2 border border-citrea-600 text-citrea-600 hover:bg-citrea-50 font-medium rounded-lg transition-colors">
              Citrea Outline
            </button>
            
            <button className="px-4 py-2 border border-krnl-500 text-krnl-500 hover:bg-krnl-50 font-medium rounded-lg transition-colors">
              KRNL Outline
            </button>
          </div>
        </div>
        
        {/* Cards */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="citrea-card p-6">
              <h4 className="text-lg font-semibold mb-2">Citrea Card</h4>
              <p className="text-gray-600">A card with Citrea styling</p>
            </div>
            
            <div className="citrea-card p-6 border-t-4 border-t-krnl-500">
              <h4 className="text-lg font-semibold mb-2">KRNL Card</h4>
              <p className="text-gray-600">A card with KRNL styling</p>
            </div>
            
            <div className="citrea-card p-6 border-t-4 border-t-bitcoin-500">
              <h4 className="text-lg font-semibold mb-2">Bitcoin Card</h4>
              <p className="text-gray-600">A card with Bitcoin styling</p>
            </div>
          </div>
        </div>
        
        {/* Form Elements */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Form Elements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Citrea Input</label>
              <input type="text" className="citrea-input w-full" placeholder="Enter text..." />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">KRNL Input</label>
              <input type="text" className="krnl-input w-full" placeholder="Enter text..." />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Helper component for color swatches
const ColorSwatch: React.FC<{ name: string; color: string; textColor: string }> = ({ 
  name, 
  color, 
  textColor 
}) => {
  return (
    <div className={`${color} p-2 rounded flex justify-between items-center`}>
      <span className={`${textColor} font-medium`}>{name}</span>
      <span className={`${textColor} text-sm opacity-80`}></span>
    </div>
  );
};

export default ColorThemeShowcase;
