/**
 * Get reputation tier based on score
 */
export function getReputationTier(score: number): {
  tier: number;
  label: string;
  color: string;
  icon: string;
} {
  if (score >= 81) {
    return {
      tier: 3,
      label: 'Expert',
      color: 'text-purple-600',
      icon: '👑',
    };
  }

  if (score >= 51) {
    return {
      tier: 2,
      label: 'Trusted',
      color: 'text-blue-600',
      icon: '💎',
    };
  }

  if (score >= 21) {
    return {
      tier: 1,
      label: 'Regular',
      color: 'text-green-600',
      icon: '⭐',
    };
  }

  return {
    tier: 0,
    label: 'Newbie',
    color: 'text-gray-600',
    icon: '🌱',
  };
}

/**
 * Get vote weight multiplier based on score
 */
export function getVoteWeight(score: number): number {
  if (score >= 81) return 2.0;
  if (score >= 51) return 1.5;
  if (score >= 21) return 1.0;
  return 0.5;
}

/**
 * Format reputation score for display
 */
export function formatReputationScore(score: bigint | number): string {
  const numScore = typeof score === 'bigint' ? Number(score) : score;
  return `${numScore}/100`;
}

/**
 * Get reputation badge color
 */
export function getReputationBadgeColor(score: number): string {
  if (score >= 81) return 'bg-purple-100 text-purple-800 border-purple-300';
  if (score >= 51) return 'bg-blue-100 text-blue-800 border-blue-300';
  if (score >= 21) return 'bg-green-100 text-green-800 border-green-300';
  return 'bg-gray-100 text-gray-800 border-gray-300';
}
