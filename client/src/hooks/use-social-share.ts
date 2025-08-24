import { useToast } from '@/hooks/use-toast';

export function useSocialShare() {
  const { toast } = useToast();

  const shareOnTwitter = (thought: string) => {
    const text = `${thought}\n\nGenerate your own cute thoughts on Base! 💖✨\nhttps://cutethoughts.netlify.app\n\n#CuteThoughts #Base #Web3 #SpreadJoy`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    
    toast({
      title: "Shared on Twitter! 🐦",
      description: "Your cute thought is spreading joy on Twitter!",
    });
  };

  const shareOnFarcaster = (thought: string) => {
    const text = `${thought}\n\nJoin me in spreading joy on Base! Generate your own cute thoughts 💜\nhttps://cutethoughts.netlify.app\n\n#CuteThoughts #Base #Web3`;
    const url = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    
    toast({
      title: "Shared on Farcaster! 💜",
      description: "Your cute thought is spreading on Farcaster!",
    });
  };

  const shareOnInstagram = (thought: string) => {
    // Instagram doesn't have direct sharing API, so we copy to clipboard
    navigator.clipboard.writeText(`${thought}\n\nSpread some joy! Generate your own cute thoughts on Base 🌟\nhttps://cutethoughts.netlify.app\n\n#CuteThoughts #Base #Web3 #SpreadJoy`);
    
    toast({
      title: "Copied for Instagram! 📸",
      description: "Your cute thought has been copied to clipboard. Paste it in your Instagram story!",
    });
  };

  return {
    shareOnTwitter,
    shareOnFarcaster,
    shareOnInstagram,
  };
}
