import { useConnect, useDisconnect, useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Wallet, Zap, Gift } from 'lucide-react';
import { useUserStats } from '@/lib/contract';

export function WalletConnect() {
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const { userThoughtCount, userTips } = useUserStats(address);

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-4">
        <div className="hidden sm:flex items-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Zap className="w-4 h-4 text-cute-yellow" />
            <span>{userThoughtCount}</span>
            <span>thoughts</span>
          </div>
          <div className="flex items-center space-x-1">
            <Gift className="w-4 h-4 text-cute-pink" />
            <span>{userTips}</span>
            <span>ETH tipped</span>
          </div>
        </div>
        
        <Button
          onClick={() => disconnect()}
          className="bg-gradient-to-r from-cute-pink to-cute-lavender hover:from-cute-lavender hover:to-cute-pink text-white px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
          data-testid="disconnect-wallet-button"
        >
          {`${address.slice(0, 6)}...${address.slice(-4)}`}
        </Button>
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="bg-gradient-to-r from-cute-pink to-cute-lavender hover:from-cute-lavender hover:to-cute-pink text-white px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
          data-testid="connect-wallet-button"
        >
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <DialogHeader className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-cute-pink to-cute-lavender rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-cute-gray mb-2">
            Connect Your Wallet
          </DialogTitle>
          <p className="text-gray-600">
            Choose your preferred wallet to start generating cute thoughts
          </p>
        </DialogHeader>
        
        <div className="space-y-3">
          {connectors.map((connector) => (
            <Button
              key={connector.uid}
              onClick={() => connect({ connector })}
              disabled={isPending}
              className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-cute-pink hover:bg-pink-50 transition-all duration-200 bg-white text-cute-gray"
              data-testid={`connect-${connector.name.toLowerCase()}-button`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-cute-pink to-cute-lavender rounded-lg flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium">{connector.name}</span>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
