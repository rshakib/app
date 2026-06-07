import { useNavigate, useLocation } from 'react-router';
import { Button } from '../components/Button';
import { CheckCircle, Shield, TrendingDown } from 'lucide-react';
import { motion } from 'motion/react';

export function ActivationSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { username } = location.state || {};

  return (
    <div className="min-h-screen bg-primary text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/30 rounded-full blur-[120px]" />

      <div className="max-w-md w-full relative z-10 my-8">
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-emerald-500 rounded-full mb-6 shadow-xl"
          >
            <CheckCircle size={48} className="text-white" />
          </motion.div>
          <h1 className="text-white text-3xl font-bold tracking-tight mb-2">Activation Complete</h1>
          <p className="text-white/60 font-semibold tracking-wide uppercase text-xs">
            Your e-payment account is secure and active
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-white/10 mb-8 text-primary space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Account ID</span>
            <span className="font-bold text-primary">@{username || 'user'}</span>
          </div>

          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Daily Spending Limit</span>
            <span className="font-bold text-accent">৳5,000.00</span>
          </div>

          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4">
            <h4 className="mb-3 flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
              <Shield size={16} className="text-accent" />
              Cryptographic Safeguards
            </h4>
            <div className="space-y-2 text-xs font-semibold text-primary/70">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <span>AES-256 Symmetric Encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <span>HMAC-SHA256 Integrity Verification</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <span>Hardware bound Device ID Signature (K1)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <span>Local Fingerprint Biometrics (BP)</span>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <TrendingDown size={20} className="text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
                  Daily Petty Cash Security
                </p>
                <p className="text-xs font-medium text-primary/70 leading-relaxed">
                  Your account supports secure micro-payments with a daily spending cap. The limit automatically resets every 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Button fullWidth size="lg" onClick={() => navigate('/login')}>
          Proceed to Login
        </Button>

        <div className="mt-8 text-center">
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">
            No SMS required • End-to-End Encrypted Authenticity
          </p>
        </div>
      </div>
    </div>
  );
}
