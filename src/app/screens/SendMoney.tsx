import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { ArrowLeft, AlertCircle, CheckCircle, Loader, ShieldCheck } from 'lucide-react';
import { getUserSession } from '../../utils/session';
import { checkReceiver, getUser } from '../../utils/api';

export function SendMoney() {
  const navigate = useNavigate();
  const session = getUserSession();

  const [formData, setFormData] = useState({
    receiverUsername: '',
    amount: '',
  });
  const [receiverFound, setReceiverFound] = useState<boolean | null>(null);
  const [searchingReceiver, setSearchingReceiver] = useState(false);
  const [profile, setProfile] = useState(session);

  useEffect(() => {
    if (!session) {
      navigate('/login');
      return;
    }

    let isMounted = true;
    const fetchLatestLimit = async () => {
      try {
        const result = await getUser(session.username);
        if (isMounted && result && result.status === 'success' && result.user) {
          setProfile(prev => prev ? {
            ...prev,
            daily_limit: result.user.daily_limit,
            today_spent: result.user.today_spent,
            balance: result.user.balance
          } : null);
        }
      } catch (error) {
        console.error('Error fetching latest limits:', error);
      }
    };
    fetchLatestLimit();
    return () => {
      isMounted = false;
    };
  }, [session?.username]);

  if (!session || !profile) {
    return null;
  }

  const dailyLimit = profile.daily_limit;
  const spent = profile.today_spent;
  const remaining = Math.max(0, dailyLimit - spent);

  const handleUsernameChange = async (value: string) => {
    setFormData({ ...formData, receiverUsername: value });
    
    if (value.length > 2) {
      setSearchingReceiver(true);
      try {
        const result = await checkReceiver(value.trim());
        setReceiverFound(result.found);
      } catch (error) {
        console.error('Error searching receiver:', error);
        setReceiverFound(false);
      } finally {
        setSearchingReceiver(false);
      }
    } else {
      setReceiverFound(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);

    if (amount > remaining) {
      alert(`Exceeds daily petty cash limit. Remaining: ৳${remaining.toFixed(2)}`);
      return;
    }

    if (amount > profile.balance) {
      alert(`Insufficient balance. Available balance: ৳${profile.balance.toFixed(2)}`);
      return;
    }

    if (formData.receiverUsername && formData.amount && receiverFound) {
      navigate('/transaction-processing', {
        state: {
          receiverUsername: formData.receiverUsername,
          amount,
        },
      });
    }
  };

  const amountValue = parseFloat(formData.amount) || 0;
  const exceedsLimit = amountValue > remaining;
  const exceedsBalance = amountValue > profile.balance;

  return (
    <div className="min-h-screen bg-primary text-white relative overflow-hidden pb-12">
      {/* Decorative gradients */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Premium Header */}
      <div className="px-6 py-8 relative overflow-hidden">
        <div className="max-w-2xl mx-auto flex items-center gap-4 relative z-10">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transition-colors border border-white/10"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-white text-2xl font-bold tracking-tight mb-1">Send Money</h1>
            <p className="text-xs text-white/40 font-semibold tracking-wider uppercase">Zero-Trust Authorizer</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 mb-6 text-primary">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                label="Receiver's Username"
                type="text"
                placeholder="Enter bank-assigned username"
                value={formData.receiverUsername}
                onChange={(e) => handleUsernameChange(e.target.value)}
                helperText="Username must be bank-assigned (not phone number)"
                required
                disabled={searchingReceiver}
              />
              {searchingReceiver && (
                <div className="mt-2 flex items-center gap-2 text-accent">
                  <Loader size={16} className="animate-spin" />
                  <span className="text-sm font-medium">Searching receiver...</span>
                </div>
              )}
              {receiverFound && !searchingReceiver && (
                <div className="mt-2 flex items-center gap-2 text-emerald-600">
                  <CheckCircle size={16} />
                  <span className="text-sm font-semibold">Receiver found in database</span>
                </div>
              )}
              {receiverFound === false && !searchingReceiver && (
                <div className="mt-2 flex items-center gap-2 text-destructive">
                  <AlertCircle size={16} />
                  <span className="text-sm font-semibold">Receiver not found</span>
                </div>
              )}
            </div>

            <div>
              <Input
                label="Amount (BDT)"
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                error={exceedsLimit ? `Exceeds daily limit` : exceedsBalance ? 'Insufficient balance' : undefined}
                required
                min="1"
                step="0.01"
              />
              <div className="mt-3 flex justify-between text-xs font-semibold text-muted-foreground">
                <span>Available Balance: <strong className="text-primary">৳{profile.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></span>
                <span>Daily Limit Remaining: <strong className="text-accent">৳{remaining.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></span>
              </div>
            </div>

            {(exceedsLimit || exceedsBalance) && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle size={20} className="text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-destructive">
                    {exceedsBalance ? 'Insufficient available balance' : 'Amount exceeds daily limit'}
                  </p>
                  <p className="text-xs font-semibold text-destructive/80 mt-1">
                    {exceedsBalance 
                      ? `Your current balance is ৳${profile.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                      : `Maximum allowed transfer today: ৳${remaining.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                  </p>
                </div>
              </div>
            )}

            <Button type="submit" fullWidth size="lg" disabled={exceedsLimit || exceedsBalance || !receiverFound || searchingReceiver}>
              Proceed
            </Button>
          </form>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck size={20} className="text-accent" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Transfer Information</h4>
          </div>
          <ul className="text-xs font-medium text-white/60 space-y-2">
            <li>• Username-to-username transfer only</li>
            <li>• No phone number or bank account transfer</li>
            <li>• Biometric verification required for each transaction</li>
            <li>• Daily limit: ৳{dailyLimit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</li>
            <li>• Receiver must exist in Supabase database</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
