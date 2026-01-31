import { ALL_TAGS } from '../../types';

interface TagBadgeProps {
  tagId: number;
  size?: 'sm' | 'md';
}

export function TagBadge({ tagId, size = 'sm' }: TagBadgeProps) {
  const tag = ALL_TAGS.find((t) => t.id === tagId);

  if (!tag) return null;

  const isPositive = tagId < 5;
  const isNegative = tagId >= 5 && tagId < 10;
  const isScam = tagId >= 10;

  let colorClass = 'bg-gray-100 text-gray-700';
  if (isPositive) colorClass = 'bg-green-100 text-green-700';
  if (isNegative) colorClass = 'bg-orange-100 text-orange-700';
  if (isScam) colorClass = 'bg-red-100 text-red-700';

  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${colorClass} ${sizeClass}`}
    >
      {tag.label}
    </span>
  );
}
