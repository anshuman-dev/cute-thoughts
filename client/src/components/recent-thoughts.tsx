import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Share2 } from 'lucide-react';
import { useContractEvents } from '@/hooks/use-contract';
import { useSocialShare } from '@/hooks/use-social-share';
import { useAccount } from 'wagmi';

export function RecentThoughts() {
  const { address } = useAccount();
  const { recentThoughts } = useContractEvents();
  const { shareOnTwitter } = useSocialShare();

  // Filter user's thoughts if connected
  const userThoughts = address 
    ? recentThoughts.filter(thought => thought.user.toLowerCase() === address.toLowerCase())
    : [];

  // Mock thoughts for demonstration when no real thoughts are available
  const mockThoughts = [
    {
      id: '1',
      content: "Your smile could light up the entire blockchain!",
      timestamp: "5 minutes ago",
      user: address || "0x1234...5678"
    },
    {
      id: '2', 
      content: "You're absolutely pawsome!",
      timestamp: "1 hour ago",
      user: address || "0x1234...5678"
    },
    {
      id: '3',
      content: "You're like a warm hug on a cold day!",
      timestamp: "2 hours ago", 
      user: address || "0x1234...5678"
    }
  ];

  const thoughtsToShow = userThoughts.length > 0 ? userThoughts.map(thought => ({
    id: thought.transactionHash,
    content: thought.thought,
    timestamp: thought.timestamp.toLocaleString(),
    user: thought.user
  })) : (address ? [] : mockThoughts);

  return (
    <section className="mb-12">
      <Card className="bg-white rounded-2xl shadow-lg p-6 border border-pink-100">
        <h3 className="text-2xl font-bold text-cute-gray mb-6 text-center" data-testid="recent-thoughts-title">
          {address ? 'Your Recent Thoughts' : 'Recent Community Thoughts'}
        </h3>
        
        {thoughtsToShow.length === 0 ? (
          <div className="text-center py-8" data-testid="empty-state">
            <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">No thoughts generated yet. Start spreading joy!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="thoughts-grid">
            {thoughtsToShow.map((thought) => (
              <div
                key={thought.id}
                className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-4 border border-pink-100 hover:shadow-md transition-all duration-300"
                data-testid={`thought-card-${thought.id}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-cute-peach to-cute-mint rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-cute-gray font-medium mb-2" data-testid={`thought-content-${thought.id}`}>
                      "{thought.content}"
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500" data-testid={`thought-timestamp-${thought.id}`}>
                        {thought.timestamp}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => shareOnTwitter(thought.content)}
                          className="text-gray-400 hover:text-cute-pink transition-colors duration-200 p-1"
                          data-testid={`share-thought-${thought.id}`}
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </section>
  );
}
