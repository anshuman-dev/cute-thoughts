import { useEffect } from 'react';
import { usePublicClient, useAccount } from 'wagmi';
import { CUTE_THOUGHTS_CONTRACT_ADDRESS, CUTE_THOUGHTS_ABI } from '@/lib/web3';
import { useQueryClient } from '@tanstack/react-query';

// Helper function to save thought to backend
async function saveThoughtToBackend(
  userAddress: string,
  content: string,
  transactionHash: string,
  tipAmount?: bigint
) {
  try {
    const thoughtData = {
      userAddress,
      content,
      transactionHash,
      tipAmount: tipAmount ? tipAmount.toString() : null,
    };
    
    console.log('💾 Saving thought to backend:', thoughtData);
    
    const response = await fetch('/api/thoughts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(thoughtData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Failed to save thought to backend:', response.status, errorText);
    } else {
      const savedThought = await response.json();
      console.log('✅ Successfully saved thought:', savedThought);
    }
  } catch (error) {
    console.error('❌ Error saving thought to backend:', error);
  }
}

export function useThoughtSync() {
  const publicClient = usePublicClient();
  const { address } = useAccount();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!publicClient) return;

    let unwatch: (() => void) | undefined;

    const setupEventListener = async () => {
      try {
        // Listen for new ThoughtGenerated events
        unwatch = publicClient.watchContractEvent({
          address: CUTE_THOUGHTS_CONTRACT_ADDRESS,
          abi: CUTE_THOUGHTS_ABI,
          eventName: 'ThoughtGenerated',
          onLogs: async (logs) => {
            for (const log of logs) {
              const { user, thought } = log.args;
              
              if (user && thought) {
                // Save to backend storage
                await saveThoughtToBackend(
                  user,
                  thought,
                  log.transactionHash,
                );

                // If this is the current user's thought, invalidate their queries
                if (address && user.toLowerCase() === address.toLowerCase()) {
                  queryClient.invalidateQueries({ 
                    queryKey: ['userThoughts', address] 
                  });
                  queryClient.invalidateQueries({ 
                    queryKey: ['userThoughtsCount', address] 
                  });
                }
              }
            }
          },
          onError: (error) => {
            console.warn('Event listener error (will retry):', error.message);
          }
        });

        // Also listen for TipReceived events to update tip amounts
        publicClient.watchContractEvent({
          address: CUTE_THOUGHTS_CONTRACT_ADDRESS,
          abi: CUTE_THOUGHTS_ABI,
          eventName: 'TipReceived',
          onLogs: async (logs) => {
            for (const log of logs) {
              const { tipper, amount } = log.args;
              
              // Find the corresponding thought and update tip amount
              if (tipper && amount && address && tipper.toLowerCase() === address.toLowerCase()) {
                queryClient.invalidateQueries({ 
                  queryKey: ['userThoughts', address] 
                });
              }
            }
          },
          onError: (error) => {
            console.warn('Tip event listener error (will retry):', error.message);
          }
        });

      } catch (error) {
        console.warn('Error setting up event listeners (will retry):', error.message);
        // Don't throw - let the app continue working
      }
    };

    setupEventListener();

    // Cleanup function
    return () => {
      if (unwatch) {
        unwatch();
      }
    };
  }, [publicClient, address, queryClient]);

  // Sync historical events on first load (but don't block UI if RPC fails)
  useEffect(() => {
    if (!publicClient || !address) return;

    const syncHistoricalEvents = async () => {
      try {
        // Get historical events for the current user with recent blocks only to avoid timeouts
        const currentBlock = await publicClient.getBlockNumber();
        const fromBlock = currentBlock - 10000n; // Last ~10,000 blocks (~1-2 days on Base)
        
        console.log(`🔍 Syncing historical events for ${address} from block ${fromBlock} to ${currentBlock}`);
        
        const logs = await publicClient.getLogs({
          address: CUTE_THOUGHTS_CONTRACT_ADDRESS,
          event: {
            type: 'event',
            name: 'ThoughtGenerated',
            inputs: [
              { name: 'user', type: 'address', indexed: true },
              { name: 'thought', type: 'string' },
              { name: 'thoughtNumber', type: 'uint256' }
            ]
          },
          args: {
            user: address
          },
          fromBlock,
          toBlock: 'latest'
        });

        console.log(`📅 Found ${logs.length} historical ThoughtGenerated events for user ${address}`);

        // Save all historical thoughts
        for (const log of logs) {
          const { user, thought } = log.args;
          
          console.log(`💭 Processing thought: "${thought}" for user ${user}`);
          
          if (user && thought) {
            await saveThoughtToBackend(
              user,
              thought,
              log.transactionHash,
            );
          }
        }

        // Also try fetching ALL ThoughtGenerated events to see if there are any at all
        const allLogs = await publicClient.getLogs({
          address: CUTE_THOUGHTS_CONTRACT_ADDRESS,
          event: {
            type: 'event',
            name: 'ThoughtGenerated',
            inputs: [
              { name: 'user', type: 'address', indexed: true },
              { name: 'thought', type: 'string' },
              { name: 'thoughtNumber', type: 'uint256' }
            ]
          },
          fromBlock,
          toBlock: 'latest'
        });

        console.log(`📊 Total ThoughtGenerated events in recent blocks: ${allLogs.length}`);

        // Invalidate queries to refresh the UI
        queryClient.invalidateQueries({ 
          queryKey: ['userThoughts', address] 
        });
        queryClient.invalidateQueries({ 
          queryKey: ['userThoughtsCount', address] 
        });

      } catch (error) {
        console.warn('Unable to sync historical events - RPC may be unavailable:', error.message);
        // Don't throw error, just log warning - the UI should still work without historical sync
      }
    };

    // Small delay to avoid overwhelming the RPC
    const timer = setTimeout(syncHistoricalEvents, 2000);
    return () => clearTimeout(timer);
  }, [publicClient, address, queryClient]);
}