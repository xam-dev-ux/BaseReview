import { formatDistanceToNow } from 'date-fns';
import { ethers } from 'ethers';

/**
 * Format Ethereum address (truncate middle)
 */
export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Format timestamp to relative time
 */
export function formatTimeAgo(timestamp: bigint | number): string {
  const date = typeof timestamp === 'bigint'
    ? new Date(Number(timestamp) * 1000)
    : new Date(timestamp * 1000);

  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Format rating (convert from stored format)
 */
export function formatRating(rating: bigint | number): number {
  const num = typeof rating === 'bigint' ? Number(rating) : rating;
  // Ratings stored as rating * 100 for precision
  return num / 100;
}

/**
 * Format ETH amount
 */
export function formatEth(amount: bigint): string {
  return ethers.formatEther(amount);
}

/**
 * Get star rating component data
 */
export function getStarRating(rating: number): {
  fullStars: number;
  hasHalfStar: boolean;
  emptyStars: number;
} {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return { fullStars, hasHalfStar, emptyStars };
}

/**
 * Format number with commas
 */
export function formatNumber(num: bigint | number): string {
  const n = typeof num === 'bigint' ? Number(num) : num;
  return n.toLocaleString();
}

/**
 * Get percentage from fraction
 */
export function getPercentage(part: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
