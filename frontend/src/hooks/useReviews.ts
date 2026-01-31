import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useContract } from './useContract';
import { ethers } from 'ethers';
import { Review, MiniApp } from '../types';
import { uploadToIPFS } from '../utils/ipfs';

export function useApps(offset = 0, limit = 100) {
  const { contract } = useContract();

  return useQuery({
    queryKey: ['apps', offset, limit],
    queryFn: async () => {
      if (!contract) throw new Error('Contract not initialized');
      const apps = await contract.getAllApps(offset, limit);
      return apps as MiniApp[];
    },
    enabled: !!contract,
    staleTime: 30000, // 30 seconds
  });
}

export function useApp(appId: number | string) {
  const { contract } = useContract();

  return useQuery({
    queryKey: ['app', appId],
    queryFn: async () => {
      if (!contract) throw new Error('Contract not initialized');
      const app = await contract.getApp(appId);
      return app as MiniApp;
    },
    enabled: !!contract && !!appId,
  });
}

export function useAppReviews(appId: number | string, offset = 0, limit = 100) {
  const { contract } = useContract();

  return useQuery({
    queryKey: ['reviews', appId, offset, limit],
    queryFn: async () => {
      if (!contract) throw new Error('Contract not initialized');
      const reviews = await contract.getReviewsForApp(appId, offset, limit);
      return reviews as Review[];
    },
    enabled: !!contract && !!appId,
  });
}

export function useRegisterApp() {
  const { contractWithSigner } = useContract();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      name: string;
      url: string;
      category: number;
      contractAddresses: string[];
      metadata: any;
    }) => {
      const contract = await contractWithSigner;
      if (!contract) throw new Error('Wallet not connected');

      // Upload metadata to IPFS
      const metadataIPFS = await uploadToIPFS(params.metadata);

      // Register app
      const tx = await contract.registerMiniApp(
        params.name,
        params.url,
        params.category,
        params.contractAddresses,
        metadataIPFS
      );

      const receipt = await tx.wait();
      return receipt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apps'] });
    },
  });
}

export function useSubmitReview() {
  const { contractWithSigner } = useContract();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      appId: number;
      rating: number;
      reviewType: number;
      tags: number[];
      reviewData: any;
      proofData?: any;
      txHashes?: string[];
      stake: bigint;
    }) => {
      const contract = await contractWithSigner;
      if (!contract) throw new Error('Wallet not connected');

      // Upload review to IPFS
      const reviewIPFS = await uploadToIPFS(params.reviewData);
      const proofIPFS = params.proofData
        ? await uploadToIPFS(params.proofData)
        : '';

      // Convert tx hashes to bytes32
      const txHashesBytes32 = params.txHashes?.map((hash) =>
        ethers.zeroPadValue(hash, 32)
      ) || [];

      // Submit review
      const tx = await contract.leaveReview(
        params.appId,
        params.rating,
        params.reviewType,
        params.tags,
        reviewIPFS,
        proofIPFS,
        txHashesBytes32,
        { value: params.stake }
      );

      const receipt = await tx.wait();
      return receipt;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.appId] });
      queryClient.invalidateQueries({ queryKey: ['app', variables.appId] });
    },
  });
}

export function useVoteHelpful() {
  const { contractWithSigner } = useContract();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { reviewId: number; isHelpful: boolean }) => {
      const contract = await contractWithSigner;
      if (!contract) throw new Error('Wallet not connected');

      const tx = await contract.voteHelpful(params.reviewId, params.isHelpful);
      const receipt = await tx.wait();
      return receipt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function useRespondToReview() {
  const { contractWithSigner } = useContract();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { reviewId: number; response: string }) => {
      const contract = await contractWithSigner;
      if (!contract) throw new Error('Wallet not connected');

      const responseIPFS = await uploadToIPFS({ response: params.response });
      const tx = await contract.respondToReview(params.reviewId, responseIPFS);
      const receipt = await tx.wait();
      return receipt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function useReputationScore(address: string) {
  const { contract } = useContract();

  return useQuery({
    queryKey: ['reputation', address],
    queryFn: async () => {
      if (!contract) throw new Error('Contract not initialized');
      const score = await contract.getReputationScore(address);
      return Number(score);
    },
    enabled: !!contract && !!address,
  });
}
