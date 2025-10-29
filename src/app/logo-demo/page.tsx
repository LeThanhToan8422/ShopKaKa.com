'use client';

import ShopKaKaLogo from '@/app/components/ShopKaKaLogo';

export default function LogoDemoPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            ShopKaKa Logo Showcase
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover the versatile and animated logo options for ShopKaKa
          </p>
        </div>

        {/* Size Variations */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 mb-12 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Size Variations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/50 dark:bg-gray-700/50 rounded-2xl p-6 text-center border border-gray-200 dark:border-gray-600 hover:bg-white/70 dark:hover:bg-gray-600/70 transition-all duration-300">
              <div className="mb-4 flex justify-center">
                <ShopKaKaLogo size="sm" />
              </div>
              <h3 className="text-gray-800 dark:text-white font-semibold">Small (sm)</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Perfect for headers</p>
            </div>
            
            <div className="bg-white/50 dark:bg-gray-700/50 rounded-2xl p-6 text-center border border-gray-200 dark:border-gray-600 hover:bg-white/70 dark:hover:bg-gray-600/70 transition-all duration-300">
              <div className="mb-4 flex justify-center">
                <ShopKaKaLogo size="md" />
              </div>
              <h3 className="text-gray-800 dark:text-white font-semibold">Medium (md)</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Default size</p>
            </div>
            
            <div className="bg-white/50 dark:bg-gray-700/50 rounded-2xl p-6 text-center border border-gray-200 dark:border-gray-600 hover:bg-white/70 dark:hover:bg-gray-600/70 transition-all duration-300">
              <div className="mb-4 flex justify-center">
                <ShopKaKaLogo size="lg" />
              </div>
              <h3 className="text-gray-800 dark:text-white font-semibold">Large (lg)</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">For hero sections</p>
            </div>
            
            <div className="bg-white/50 dark:bg-gray-700/50 rounded-2xl p-6 text-center border border-gray-200 dark:border-gray-600 hover:bg-white/70 dark:hover:bg-gray-600/70 transition-all duration-300">
              <div className="mb-4 flex justify-center">
                <ShopKaKaLogo size="xl" />
              </div>
              <h3 className="text-gray-800 dark:text-white font-semibold">Extra Large (xl)</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Maximum impact</p>
            </div>
          </div>
        </div>

        {/* Variant Options */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 mb-12 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Logo Variants</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/50 dark:bg-gray-700/50 rounded-2xl p-6 text-center border border-gray-200 dark:border-gray-600 hover:bg-white/70 dark:hover:bg-gray-600/70 transition-all duration-300">
              <div className="mb-4 flex justify-center">
                <ShopKaKaLogo variant="text" size="lg" />
              </div>
              <h3 className="text-gray-800 dark:text-white font-semibold">Text Only</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Clean text-based logo</p>
            </div>
            
            <div className="bg-white/50 dark:bg-gray-700/50 rounded-2xl p-6 text-center border border-gray-200 dark:border-gray-600 hover:bg-white/70 dark:hover:bg-gray-600/70 transition-all duration-300">
              <div className="mb-4 flex justify-center">
                <ShopKaKaLogo variant="icon" size="lg" />
              </div>
              <h3 className="text-gray-800 dark:text-white font-semibold">Icon Only</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Minimalist icon version</p>
            </div>
            
            <div className="bg-white/50 dark:bg-gray-700/50 rounded-2xl p-6 text-center border border-gray-200 dark:border-gray-600 hover:bg-white/70 dark:hover:bg-gray-600/70 transition-all duration-300">
              <div className="mb-4 flex justify-center">
                <ShopKaKaLogo variant="combined" size="lg" />
              </div>
              <h3 className="text-gray-800 dark:text-white font-semibold">Combined</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Icon and text together</p>
            </div>
          </div>
        </div>

        {/* Animation Demo */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 mb-12 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Animation Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/50 dark:bg-gray-700/50 rounded-2xl p-6 text-center border border-gray-200 dark:border-gray-600 hover:bg-white/70 dark:hover:bg-gray-600/70 transition-all duration-300">
              <div className="mb-4 flex justify-center">
                <ShopKaKaLogo size="lg" animated={true} />
              </div>
              <h3 className="text-gray-800 dark:text-white font-semibold">Animated</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">With hover effects and entrance animations</p>
            </div>
            
            <div className="bg-white/50 dark:bg-gray-700/50 rounded-2xl p-6 text-center border border-gray-200 dark:border-gray-600 hover:bg-white/70 dark:hover:bg-gray-600/70 transition-all duration-300">
              <div className="mb-4 flex justify-center">
                <ShopKaKaLogo size="lg" animated={false} />
              </div>
              <h3 className="text-gray-800 dark:text-white font-semibold">Static</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">No animations for simpler use cases</p>
            </div>
          </div>
        </div>

        {/* Interactive Demo */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 mb-12 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Interactive Demo</h2>
          <div className="text-center py-12">
            <div className="inline-block mb-8 transform transition-transform duration-300 hover:scale-105">
              <ShopKaKaLogo 
                size="xl" 
                variant="combined" 
                animated={true}
                onClick={() => alert('ShopKaKa Logo Clicked!')}
              />
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Try hovering over the logo to see the interactive animations
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">
              Click the logo above to see the interactive click handler
            </p>
          </div>
        </div>

        {/* Showcase Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Logo Showcase</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-2xl p-8 text-center border border-orange-400/30 dark:border-orange-600/30">
              <div className="mb-4 flex justify-center">
                <ShopKaKaLogo variant="text" size="lg" />
              </div>
              <h3 className="text-gray-800 dark:text-white font-semibold mb-2">Text Variant</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Vibrant gradient text with floating emojis</p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-8 text-center border border-blue-400/30 dark:border-blue-600/30">
              <div className="mb-4 flex justify-center">
                <ShopKaKaLogo variant="icon" size="lg" />
              </div>
              <h3 className="text-gray-800 dark:text-white font-semibold mb-2">Icon Variant</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Animated shopping cart with particle effects</p>
            </div>
          </div>
          
          <div className="mt-8 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-2xl p-8 text-center border border-pink-400/30 dark:border-pink-600/30">
            <div className="mb-4 flex justify-center">
              <ShopKaKaLogo variant="combined" size="xl" />
            </div>
            <h3 className="text-gray-800 dark:text-white font-semibold mb-2">Combined Variant</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">The full experience with all effects combined</p>
          </div>
        </div>
      </div>
    </div>
  );
}