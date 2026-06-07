import { ArrowUpRight, CheckCircle, XCircle, Clock } from 'lucide-react';
import { SecurityBadge } from './SecurityBadge';

interface TransactionCardProps {
  receiverUsername: string;
  amount: number;
  timestamp: string;
  status: 'success' | 'rejected' | 'pending';
  showSecurityBadge?: boolean;
}

export function TransactionCard({
  receiverUsername,
  amount,
  timestamp,
  status,
  showSecurityBadge = true,
}: TransactionCardProps) {
  const statusConfig = {
    success: {
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
      label: 'Authorized',
    },
    rejected: {
      icon: XCircle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      label: 'Blocked',
    },
    pending: {
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      label: 'Securing',
    },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div className="bg-white border border-border/50 rounded-2xl p-5 hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl ${config.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
            <ArrowUpRight size={24} className={config.color} />
          </div>
          <div>
            <p className="font-bold text-primary group-hover:text-accent transition-colors">@{receiverUsername}</p>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{timestamp}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-xl text-primary tracking-tight">-৳{amount.toFixed(2)}</p>
          <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg ${config.bgColor} mt-2 shadow-sm border border-black/5`}>
            <StatusIcon size={12} className={config.color} />
            <span className={`text-[10px] font-bold uppercase tracking-wider ${config.color}`}>{config.label}</span>
          </div>
        </div>
      </div>
      {showSecurityBadge && status === 'success' && (
        <div className="flex gap-2 pt-3 border-t border-border/50">
          <SecurityBadge type="aes-secured" className="text-[10px] uppercase font-bold tracking-tighter h-6 px-2" />
          <SecurityBadge type="hmac-verified" className="text-[10px] uppercase font-bold tracking-tighter h-6 px-2" />
        </div>
      )}
    </div>
  );
}
