import { getReputationTier, getReputationBadgeColor } from '../../utils/reputation';

interface ReputationBadgeProps {
  score: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ReputationBadge({ score, showLabel = true, size = 'md' }: ReputationBadgeProps) {
  const tier = getReputationTier(score);
  const colorClass = getReputationBadgeColor(score);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium border ${colorClass} ${sizeClasses[size]}`}
      title={`Reputation: ${score}/100`}
    >
      <span>{tier.icon}</span>
      {showLabel && <span>{tier.label}</span>}
      <span className="text-xs opacity-75">({score})</span>
    </span>
  );
}
