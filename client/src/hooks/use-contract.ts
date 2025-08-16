import { useEffect, useState } from 'react';
import { usePublicClient } from 'wagmi';
import { CUTE_THOUGHTS_CONTRACT_ADDRESS, CUTE_THOUGHTS_ABI } from '@/lib/web3';
import { formatEther } from 'viem';

interface ThoughtEvent {
  user: string;
  thought: string;
  thoughtNumber: bigint;
  timestamp: Date;
  transactionHash: string;
}

export function useContractEvents() {
  const [recentThoughts, setRecentThoughts] = useState<ThoughtEvent[]>([]);
  const publicClient = usePublicClient();

  useEffect(() => {
    if (!publicClient) return;

    const fetchRecentEvents = async () => {
      try {
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
          fromBlock: 'latest',
          toBlock: 'latest'
        });

        const thoughts = logs.map((log) => ({
          user: log.args.user as string,
          thought: log.args.thought as string,
          thoughtNumber: log.args.thoughtNumber as bigint,
          timestamp: new Date(),
          transactionHash: log.transactionHash,
        }));

        setRecentThoughts(thoughts.slice(-10).reverse()); // Get last 10 thoughts
      } catch (error) {
        console.error('Error fetching contract events:', error);
      }
    };

    fetchRecentEvents();
  }, [publicClient]);

  return { recentThoughts };
}
