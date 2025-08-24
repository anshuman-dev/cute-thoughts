import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUserThoughts } from '@/hooks/use-user-thoughts';
import { useSocialShare } from '@/hooks/use-social-share';
import { useAccount } from 'wagmi';
import { useState } from 'react';

export function RecentThoughts() {
  const { address } = useAccount();
  const { shareOnTwitter } = useSocialShare();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  const { 
    data: userThoughtsData, 
    isLoading, 
    error,
    refetch 
  } = useUserThoughts(currentPage, pageSize);
  
  const thoughts = userThoughtsData?.thoughts || [];
  const pagination = userThoughtsData?.pagination;
  
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  };
  
  const thoughtsToShow = thoughts.map(thought => ({
    id: thought.id,
    content: thought.content,
    timestamp: formatTimestamp(thought.createdAt),
    user: thought.userAddress,
    transactionHash: thought.transactionHash,
    tipAmount: thought.tipAmount
  }));

  return (
    <section className="mb-12">
      <Card className="bg-white rounded-2xl shadow-lg p-6 border border-pink-100">
        <h3 className="text-2xl font-bold text-cute-gray mb-6 text-center" data-testid="recent-thoughts-title">
          {address ? 'Your Recent Thoughts' : 'Recent Community Thoughts'}
        </h3>
        
        {isLoading ? (
          <div className="text-center py-8" data-testid="loading-state">
            <div className="w-16 h-16 bg-gradient-to-r from-cute-pink to-cute-lavender rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <p className="text-cute-gray">Loading your thoughts...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8" data-testid="error-state">
            <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <p className="text-red-600 mb-2">Failed to load thoughts</p>
            <Button onClick={() => refetch()} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        ) : thoughtsToShow.length === 0 ? (
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
                  <div className={`w-8 h-8 bg-gradient-to-r ${
                    thought.tipAmount && parseFloat(thought.tipAmount) > 0 
                      ? 'from-yellow-400 to-orange-400' 
                      : 'from-cute-peach to-cute-mint'
                  } rounded-full flex items-center justify-center flex-shrink-0 mt-1`}>
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-cute-gray font-medium mb-2" data-testid={`thought-content-${thought.id}`}>
                      "{thought.content}"
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500" data-testid={`thought-timestamp-${thought.id}`}>
                          {thought.timestamp}
                        </span>
                        {thought.tipAmount && parseFloat(thought.tipAmount) > 0 && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                            💝 {parseFloat(thought.tipAmount).toFixed(4)} ETH
                          </span>
                        )}
                      </div>
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
        
        {/* Pagination Controls */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between" data-testid="pagination">
            <div className="text-sm text-gray-600">
              Showing {thoughts.length} of {pagination.total} thoughts
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => p - 1)}
                disabled={!pagination.hasPrev}
                className="flex items-center space-x-1"
                data-testid="prev-page"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNumber = i + 1;
                  const isCurrentPage = pageNumber === pagination.page;
                  
                  return (
                    <Button
                      key={pageNumber}
                      variant={isCurrentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNumber)}
                      className={isCurrentPage ? "bg-cute-pink hover:bg-cute-pink/90" : ""}
                      data-testid={`page-${pageNumber}`}
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
                
                {pagination.totalPages > 5 && (
                  <>
                    <span className="text-gray-400">...</span>
                    <Button
                      variant={pagination.page === pagination.totalPages ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pagination.totalPages)}
                      className={pagination.page === pagination.totalPages ? "bg-cute-pink hover:bg-cute-pink/90" : ""}
                      data-testid={`page-${pagination.totalPages}`}
                    >
                      {pagination.totalPages}
                    </Button>
                  </>
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={!pagination.hasNext}
                className="flex items-center space-x-1"
                data-testid="next-page"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </section>
  );
}