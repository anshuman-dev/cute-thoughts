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
    const response = await fetch('/api/thoughts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userAddress,
        content,
        transactionHash,
        tipAmount: tipAmount ? tipAmount.toString() : null,
      }),
    });

    if (!response.ok) {
      console.error('Failed to save thought to backend:', response.statusText);
    }
  } catch (error) {
    console.error('Error saving thought to backend:', error);
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
        });

      } catch (error) {
        console.error('Error setting up event listeners:', error);
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

  // Sync historical events on first load
  useEffect(() => {
    if (!publicClient || !address) return;

    const syncHistoricalEvents = async () => {
      try {
        // Get historical events for the current user
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
          fromBlock: 'earliest',
          toBlock: 'latest'
        });

        // Save all historical thoughts
        for (const log of logs) {
          const { user, thought } = log.args;
          
          if (user && thought) {
            await saveThoughtToBackend(
              user,
              thought,
              log.transactionHash,
            );
          }
        }

        // Invalidate queries to refresh the UI
        queryClient.invalidateQueries({ 
          queryKey: ['userThoughts', address] 
        });
        queryClient.invalidateQueries({ 
          queryKey: ['userThoughtsCount', address] 
        });

      } catch (error) {
        console.error('Error syncing historical events:', error);
      }
    };

    // Small delay to avoid overwhelming the RPC
    const timer = setTimeout(syncHistoricalEvents, 1000);
    return () => clearTimeout(timer);
  }, [publicClient, address, queryClient]);
}