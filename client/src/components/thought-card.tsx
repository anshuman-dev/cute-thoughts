import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, RefreshCw, Share2, Twitter, Instagram } from 'lucide-react';
import { useGenerateThought } from '@/lib/contract';
import { useSocialShare } from '@/hooks/use-social-share';
import { useToast } from '@/hooks/use-toast';
import { useAccount } from 'wagmi';

export function ThoughtCard() {
  const [currentThought, setCurrentThought] = useState("Click below to generate your first cute thought! 💕");
  const [showShareButtons, setShowShareButtons] = useState(false);
  
  const { isConnected } = useAccount();
  const { toast } = useToast();
  const { shareOnTwitter, shareOnFarcaster, shareOnInstagram } = useSocialShare();
  const {
    generateFreeThought,
    generateThoughtWithTip,
    isPending,
    isConfirming,
    isSuccess,
    error,
    generatedThought,
    setGeneratedThought
  } = useGenerateThought();

  const handleGenerateThought = () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to generate thoughts",
        variant: "destructive",
      });
      return;
    }

    // Reset thought and show buttons state
    setGeneratedThought('');
    setShowShareButtons(false);
    generateFreeThought();
  };

  const handleGenerateWithTip = (amount: string) => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to generate thoughts",
        variant: "destructive",
      });
      return;
    }

    // Reset thought and show buttons state
    setGeneratedThought('');
    setShowShareButtons(false);
    generateThoughtWithTip(amount);
  };

  // Update the displayed thought when a new one is generated from the contract
  useEffect(() => {
    console.log('Thought generation status:', { isSuccess, generatedThought, currentThought });
    if (isSuccess && generatedThought && generatedThought !== currentThought) {
      console.log('Updating thought to:', generatedThought);
      setCurrentThought(generatedThought);
      setShowShareButtons(true);
      toast({
        title: "Cute thought generated! ✨",
        description: "Your adorable thought is ready to spread joy!",
      });
    }
  }, [isSuccess, generatedThought, currentThought, toast]);

  const isLoading = isPending || isConfirming;

  return (
    <section className="text-center mb-12">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-cute-gray mb-4">
          Generate{" "}
          <span className="bg-gradient-to-r from-cute-pink to-cute-lavender bg-clip-text text-transparent">
            Cute Thoughts
          </span>{" "}
          ✨
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Spread joy and positivity on the blockchain! Generate heartwarming thoughts and share them with the world.
        </p>

        {/* Main Thought Card */}
        <Card className="bg-white rounded-3xl shadow-xl p-8 mb-8 transform hover:scale-[1.02] transition-all duration-300 border border-pink-100">
          <div className="animate-float">
            <div className="w-16 h-16 bg-gradient-to-r from-cute-peach to-cute-mint rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-white" />
            </div>
            
            <div className="min-h-[100px] flex items-center justify-center">
              <p className="text-xl md:text-2xl text-cute-gray font-medium leading-relaxed" data-testid="current-thought">
                "{currentThought}"
              </p>
            </div>
          </div>
          
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center mt-4" data-testid="loading-indicator">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-cute-pink border-t-transparent"></div>
              <span className="ml-2 text-cute-gray">Generating magical thought...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg" data-testid="error-message">
              <p className="text-red-600">Error: {error.message}</p>
            </div>
          )}
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button
            onClick={handleGenerateThought}
            disabled={isLoading}
            className="bg-gradient-to-r from-cute-pink to-cute-peach hover:from-cute-peach hover:to-cute-pink text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
            data-testid="generate-free-thought-button"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Generate Thought (Free)</span>
          </Button>
          
          {/* Tip Options */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex space-x-2">
              {['0.001', '0.005', '0.01'].map((amount) => (
                <Button
                  key={amount}
                  onClick={() => handleGenerateWithTip(amount)}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-cute-yellow to-orange-400 hover:from-orange-400 hover:to-cute-yellow text-white px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                  data-testid={`tip-${amount}-button`}
                >
                  Tip {amount} ETH
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Social Share Buttons */}
        {showShareButtons && (
          <div className="flex justify-center space-x-4" data-testid="social-share-buttons">
            <Button
              onClick={() => shareOnTwitter(currentThought)}
              className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-lg"
              data-testid="share-twitter-button"
            >
              <Twitter className="w-5 h-5" />
            </Button>
            <Button
              onClick={() => shareOnFarcaster(currentThought)}
              className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-lg"
              data-testid="share-farcaster-button"
            >
              <span className="text-sm font-bold">FC</span>
            </Button>
            <Button
              onClick={() => shareOnInstagram(currentThought)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-pink-600 hover:to-purple-600 text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-lg"
              data-testid="share-instagram-button"
            >
              <Instagram className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
