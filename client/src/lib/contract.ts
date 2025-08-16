import { parseEther, formatEther } from 'viem';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CUTE_THOUGHTS_CONTRACT_ADDRESS, CUTE_THOUGHTS_ABI } from './web3';

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
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

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
  };
}
