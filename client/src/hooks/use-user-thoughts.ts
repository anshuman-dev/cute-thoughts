import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

interface Thought {
  id: string;
  userAddress: string;
  content: string;
  transactionHash: string | null;
  tipAmount: string | null;
  createdAt: Date;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface UserThoughtsResponse {
  thoughts: Thought[];
  pagination: PaginationInfo;
}

async function fetchUserThoughts(address: string, page: number = 1, limit: number = 10): Promise<UserThoughtsResponse> {
  console.log(`🔍 Fetching thoughts for user ${address}, page ${page}, limit ${limit}`);
  
  const response = await fetch(`/api/thoughts/user/${address}?page=${page}&limit=${limit}`);
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ Failed to fetch user thoughts: ${response.status} - ${errorText}`);
    throw new Error('Failed to fetch user thoughts');
  }
  const data = await response.json();
  
  console.log(`📊 Received ${data.thoughts?.length || 0} thoughts from backend:`, data);
  
  // Convert date strings to Date objects
  if (data.thoughts) {
    data.thoughts = data.thoughts.map((thought: any) => ({
      ...thought,
      createdAt: new Date(thought.createdAt)
    }));
  }
  
  return data;
}

export function useUserThoughts(page: number = 1, limit: number = 10) {
  const { address } = useAccount();
  
  return useQuery({
    queryKey: ['userThoughts', address, page, limit],
    queryFn: () => fetchUserThoughts(address!, page, limit),
    enabled: !!address,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
  });
}

export function useUserThoughtsCount() {
  const { address } = useAccount();
  
  return useQuery({
    queryKey: ['userThoughtsCount', address],
    queryFn: async () => {
      if (!address) return 0;
      const response = await fetchUserThoughts(address, 1, 1);
      return response.pagination.total;
    },
    enabled: !!address,
    staleTime: 60000, // 1 minute
  });
}