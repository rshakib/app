import { useNavigate, useLocation } from 'react-router';
import { Button } from '../components/Button';
import { SecurityBadge } from '../components/SecurityBadge';
import { CheckCircle, XCircle, Shield, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

export function TransactionResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const { receiverUsername, amount, timestamp, status = 'success', newBalance, errorMessage } = location.state || {};

  if (!receiverUsername || !amount) {
    navigate('/dashboard');
    return null;
  }

  const calculatedBalance = newBalance !== undefined ? newBalance : undefined;
  const newTimestamp = new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const statusConfig = {
    success: {
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
      title: 'Transfer Authorized',
      message: 'Secure payment settled in real-time',
    },
    hmac_mismatch: {
      icon: XCircle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      title: 'Integrity Failure',
      message: 'Protocol rejected due to signature mismatch (F1 ≠ F2)',
    },
    insufficient_balance: {
      icon: AlertTriangle,
      color: 'text-amber-500',
      bgColor: 'bg-amber-100/50',
      title: 'Liquidity Issue',
      message: 'Account balance insufficient for this authorization',
    },
    receiver_not_found: {
      icon: XCircle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      title: 'Invalid Identifier',
      message: 'Beneficiary could not be located in secure core',
    },
    error: {
      icon: AlertTriangle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      title: 'Protocol Error',
      message: 'An unexpected exception occurred during settlement',
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.error;
  const Icon = config?.icon || AlertTriangle;
  const isSuccess = status === 'success';

  return (
    <div className="min-h-screen bg-primary text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/30 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 overflow-hidden relative z-10 text-primary"
      >
        {isSuccess && <div className="absolute top-0 left-0 w-full h-2 bg-success" />}
        {!isSuccess && <div className="absolute top-0 left-0 w-full h-2 bg-destructive" />}

        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
            className={`inline-flex items-center justify-center w-24 h-24 ${config.bgColor} rounded-[2rem] mb-6 shadow-inner`}
          >
            <Icon size={48} className={config.color} />
          </motion.div>
          <h1 className="text-2xl font-bold tracking-tight text-primary mb-2">{config.title}</h1>
          <p className="text-muted-foreground text-sm font-medium leading-relaxed">{config.message}</p>
          {errorMessage && (
            <p className="text-xs font-bold text-destructive mt-3 uppercase tracking-wider">Error: {errorMessage}</p>
          )}
        </div>

        {isSuccess && (
          <div className="mb-8 flex justify-center gap-3">
            <SecurityBadge type="hmac-verified" className="shadow-sm" />
            <SecurityBadge type="aes-secured" className="shadow-sm" />
          </div>
        )}

        <div className="bg-primary/5 rounded-[2rem] p-6 mb-8 border border-primary/5 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-primary/10">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Recipient</span>
            <span className="text-sm font-bold text-primary">@{receiverUsername}</span>
          </div>
          <div className="flex items-center justify-between pb-4 border-b border-primary/10">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Amount Settled</span>
            <span className="text-xl font-bold text-accent">৳{amount.toFixed(2)}</span>
          </div>
          {isSuccess && calculatedBalance !== undefined && (
            <div className="flex items-center justify-between pb-4 border-b border-primary/10">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Remaining Balance</span>
              <span className="text-sm font-bold text-success">৳{calculatedBalance.toFixed(2)}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Protocol Stamp (T)</span>
            <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">{isSuccess ? newTimestamp : timestamp}</span>
          </div>
        </div>

        {isSuccess ? (
          <div className="bg-secondary/5 border border-secondary/10 rounded-2xl p-5 mb-8">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-secondary/10 rounded-xl">
                <Shield size={20} className="text-secondary" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-secondary uppercase tracking-widest mb-1">Atomic Verification</h4>
                <p className="text-[11px] font-medium text-secondary/60 leading-normal">
                  Data integrity signed with dynamic key K1. Decryption validated via AES-256. Transaction immutable.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-destructive/5 border border-destructive/10 rounded-2xl p-5 mb-8">
            <p className="text-xs font-semibold text-destructive/80 text-center leading-relaxed">
              Security protocol interrupted. No liquidity was moved. Audit log recorded for investigation.
            </p>
          </div>
        )}

        <div className="space-y-4">
          <Button variant="primary" fullWidth size="lg" onClick={() => navigate('/dashboard')} className="py-5 font-bold tracking-tight bg-primary text-white hover:bg-secondary">
            Return to Core
          </Button>

          <button
            onClick={() => navigate('/history')}
            className="w-full text-xs font-bold text-accent hover:text-primary transition-colors uppercase tracking-[0.2em]"
          >
            Access Audit Log
          </button>
        </div>
      </motion.div>
    </div>
  );
}
