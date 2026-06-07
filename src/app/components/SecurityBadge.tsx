import { Shield, CheckCircle, Lock, Hash } from 'lucide-react';

interface SecurityBadgeProps {
  type: 'device-verified' | 'hmac-verified' | 'aes-secured' | 'integrity-check';
  className?: string;
}

export function SecurityBadge({ type, className = '' }: SecurityBadgeProps) {
  const badges = {
    'device-verified': {
      icon: Shield,
      text: 'Encrypted Core',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    'hmac-verified': {
      icon: CheckCircle,
      text: 'HMAC Validated',
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    'aes-secured': {
      icon: Lock,
      text: 'AES-256 GCM',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    'integrity-check': {
      icon: Hash,
      text: 'Verified Hash',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
  };

  const badge = badges[type];
  const Icon = badge.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${badge.bgColor} ${className}`}>
      <Icon size={16} className={badge.color} />
      <span className={`text-sm font-medium ${badge.color}`}>{badge.text}</span>
    </div>
  );
}
