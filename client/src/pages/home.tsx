import { Heart, Zap, Gift, Users } from 'lucide-react';
import { WalletConnect } from '@/components/wallet-connect';
import { ThoughtCard } from '@/components/thought-card';
import { StatsSection } from '@/components/stats-section';
import { RecentThoughts } from '@/components/recent-thoughts';

export default function Home() {
  return (
    <div className="bg-cute-gradient min-h-screen font-inter">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo Section */}
            <div className="flex items-center space-x-3" data-testid="logo-section">
              <div className="w-10 h-10 bg-gradient-to-r from-cute-pink to-cute-lavender rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-cute-gray">Cute Thoughts</h1>
                <p className="text-sm text-gray-500">Spread joy on Base</p>
              </div>
            </div>

            {/* Wallet Connection */}
            <WalletConnect />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section - Main Thought Generation Interface */}
        <ThoughtCard />

        {/* Stats Section */}
        <StatsSection />

        {/* Recent Thoughts */}
        <RecentThoughts />

        {/* How It Works Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-cute-gray mb-4" data-testid="how-it-works-title">
              How It Works
            </h3>
            <p className="text-lg text-gray-600">Simple steps to spread joy on the blockchain</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center" data-testid="step-1">
              <div className="w-20 h-20 bg-gradient-to-r from-cute-pink to-cute-lavender rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h4 className="text-xl font-semibold text-cute-gray mb-2">Connect Wallet</h4>
              <p className="text-gray-600">Connect your MetaMask or other Web3 wallet to the Base network</p>
            </div>
            
            <div className="text-center" data-testid="step-2">
              <div className="w-20 h-20 bg-gradient-to-r from-cute-peach to-cute-mint rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h4 className="text-xl font-semibold text-cute-gray mb-2">Generate Thoughts</h4>
              <p className="text-gray-600">Click to generate cute thoughts for free or add a tip to spread more joy</p>
            </div>
            
            <div className="text-center" data-testid="step-3">
              <div className="w-20 h-20 bg-gradient-to-r from-cute-yellow to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h4 className="text-xl font-semibold text-cute-gray mb-2">Share & Spread</h4>
              <p className="text-gray-600">Share your cute thoughts on Twitter, Farcaster, or Instagram</p>
            </div>
          </div>
        </section>
      </main>

      {/* Attribution */}
      <footer className="bg-white border-t border-pink-100 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-sm text-gray-600">
            Made with 💕 & good vibes by{" "}
            <a
              href="http://x.com/the_ansh_man/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cute-pink hover:text-cute-lavender transition-colors duration-200 font-medium"
            >
              Anshuman
            </a>
            {" "}✨
          </p>
        </div>
      </footer>
    </div>
  );
}
