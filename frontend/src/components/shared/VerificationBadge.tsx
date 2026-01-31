import { ShieldCheck, Shield, AlertTriangle, Ban } from 'lucide-react';
import { VerificationStatus, VERIFICATION_LABELS } from '../../types';

interface VerificationBadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
}

export function VerificationBadge({ status, size = 'md' }: VerificationBadgeProps) {
  const config = getVerificationConfig(status);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${config.className} ${sizeClasses[size]}`}
    >
      <Icon size={iconSizes[size]} />
      <span>{VERIFICATION_LABELS[status]}</span>
    </span>
  );
}

function getVerificationConfig(status: VerificationStatus) {
  switch (status) {
    case VerificationStatus.OFFICIAL:
      return {
        icon: ShieldCheck,
        className: 'bg-green-100 text-green-800 border border-green-300',
      };
    case VerificationStatus.DEVELOPER_VERIFIED:
      return {
        icon: ShieldCheck,
        className: 'bg-blue-100 text-blue-800 border border-blue-300',
      };
    case VerificationStatus.COMMUNITY_VERIFIED:
      return {
        icon: Shield,
        className: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      };
    case VerificationStatus.FLAGGED_SUSPICIOUS:
      return {
        icon: AlertTriangle,
        className: 'bg-warning/10 text-warning border border-warning animate-pulse-slow',
      };
    case VerificationStatus.CONFIRMED_SCAM:
      return {
        icon: Ban,
        className: 'bg-danger/10 text-danger border border-danger',
      };
    default:
      return {
        icon: Shield,
        className: 'bg-gray-100 text-gray-600 border border-gray-300',
      };
  }
}
