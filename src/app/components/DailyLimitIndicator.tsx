import { TrendingDown } from 'lucide-react';

interface DailyLimitIndicatorProps {
  spent: number;
  limit: number;
  showDetails?: boolean;
}

export function DailyLimitIndicator({ spent, limit, showDetails = true }: DailyLimitIndicatorProps) {
  const remaining = limit - spent;
  const percentage = (spent / limit) * 100;

  const getColor = () => {
    if (percentage >= 90) return 'bg-destructive';
    if (percentage >= 70) return 'bg-amber-500';
    return 'bg-accent shadow-[0_0_12px_rgba(0,194,255,0.4)]';
  };

  return (
    <div className="space-y-4">
      {showDetails && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
              <TrendingDown size={16} className="text-accent" />
            </div>
            <span className="font-semibold text-sm tracking-tight text-white/90 uppercase">Daily Limit</span>
          </div>
          <span className="text-xs font-bold text-white/60">
            {percentage.toFixed(0)}%
          </span>
        </div>
      )}

      <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor()} transition-all duration-700 ease-out rounded-full`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-white/60">
          Used: <span className="font-bold text-white">৳{spent.toFixed(0)}</span>
        </span>
        <span className="text-white/60">
          Safe: <span className="font-bold text-accent">৳{remaining.toFixed(0)}</span>
        </span>
      </div>
    </div>
  );
}
