import { parseEther, formatEther, decodeEventLog } from 'viem';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, usePublicClient } from 'wagmi';
import { CUTE_THOUGHTS_CONTRACT_ADDRESS, CUTE_THOUGHTS_ABI } from './web3';
import { useState, useEffect } from 'react';

export function useCuteThoughtsContract() {
  const { data: totalThoughts } = useReadContract({
    address: CUTE_THOUGHTS_CONTRACT_ADDRESS,
    abi: CUTE_THOUGHTS_ABI,
    functionName: 'totalThoughts',
  });

  const { data: totalTips } = useReadContract({
    address: CUTE_THOUGHTS_CONTRACT_ADDRESS,
    abi: CUTE_THOUGHTS_ABI,
    functionName: 'totalTips',
  });

  const { data: contractBalance } = useReadContract({
    address: CUTE_THOUGHTS_CONTRACT_ADDRESS,
    abi: CUTE_THOUGHTS_ABI,
    functionName: 'getContractBalance',
  });

  const { data: totalThoughtsAvailable } = useReadContract({
    address: CUTE_THOUGHTS_CONTRACT_ADDRESS,
    abi: CUTE_THOUGHTS_ABI,
    functionName: 'getTotalThoughts',
  });

  return {
    totalThoughts: totalThoughts ? Number(totalThoughts) : 0,
    totalTips: totalTips ? formatEther(totalTips) : '0',
    contractBalance: contractBalance ? formatEther(contractBalance) : '0',
    totalThoughtsAvailable: totalThoughtsAvailable ? Number(totalThoughtsAvailable) : 15,
  };
}

export function useUserStats(address?: string) {
  const { data: userThoughtCount } = useReadContract({
    address: CUTE_THOUGHTS_CONTRACT_ADDRESS,
    abi: CUTE_THOUGHTS_ABI,
    functionName: 'userThoughtCount',
    args: address ? [address as `0x${string}`] : undefined,
    query: { enabled: !!address },
  });

  const { data: userTips } = useReadContract({
    address: CUTE_THOUGHTS_CONTRACT_ADDRESS,
    abi: CUTE_THOUGHTS_ABI,
    functionName: 'userTips',
    args: address ? [address as `0x${string}`] : undefined,
    query: { enabled: !!address },
  });

  return {
    userThoughtCount: userThoughtCount ? Number(userThoughtCount) : 0,
    userTips: userTips ? formatEther(userTips) : '0',
  };
}

export function useGenerateThought() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const publicClient = usePublicClient();
  const [generatedThought, setGeneratedThought] = useState<string>('');
  
  const { isLoading: isConfirming, isSuccess, data: receipt } = useWaitForTransactionReceipt({
    hash,
  });

  // Extract thought from transaction receipt
  useEffect(() => {
    console.log('Contract hook state:', { isSuccess, receipt: !!receipt, publicClient: !!publicClient });
    if (isSuccess && receipt && publicClient) {
      const extractThought = async () => {
        try {
          console.log('Extracting thought from receipt:', receipt);
          const logs = receipt.logs;
          console.log('Found logs:', logs.length);
          
          // Find the ThoughtGenerated event
          for (const log of logs) {
            console.log('Checking log:', log.address, 'vs', CUTE_THOUGHTS_CONTRACT_ADDRESS);
            if (log.address.toLowerCase() === CUTE_THOUGHTS_CONTRACT_ADDRESS.toLowerCase()) {
              console.log('Found contract log, attempting to decode...');
              try {
                const decoded = decodeEventLog({
                  abi: CUTE_THOUGHTS_ABI,
                  data: log.data,
                  topics: log.topics,
                  eventName: 'ThoughtGenerated'
                });
                
                console.log('Decoded event:', decoded);
                if (decoded.args) {
                  const thought = decoded.args.thought as string;
                  console.log('Extracted thought:', thought);
                  setGeneratedThought(thought);
                  break;
                }
              } catch (parseError) {
                console.log('Error parsing log:', parseError);
              }
            }
          }
        } catch (error) {
          console.error('Error extracting thought from receipt:', error);
        }
      };
      
      extractThought();
    }
  }, [isSuccess, receipt, publicClient]);

  const generateFreeThought = () => {
    writeContract({
      address: CUTE_THOUGHTS_CONTRACT_ADDRESS,
      abi: CUTE_THOUGHTS_ABI,
      functionName: 'generateCuteThought',
    });
  };

  const generateThoughtWithTip = (tipAmount: string) => {
    writeContract({
      address: CUTE_THOUGHTS_CONTRACT_ADDRESS,
      abi: CUTE_THOUGHTS_ABI,
      functionName: 'generateThoughtWithTip',
      value: parseEther(tipAmount),
    });
  };

  return {
    generateFreeThought,
    generateThoughtWithTip,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
    generatedThought,
    setGeneratedThought,
  };
}
