import { useNavigate, Navigate } from 'react-router';
import { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { SecurityBadge } from '../components/SecurityBadge';
import { DailyLimitIndicator } from '../components/DailyLimitIndicator';
import { TransactionCard } from '../components/TransactionCard';
import {
  Send,
  History,
  Sparkles,
  LogOut,
  Bell,
  Eye,
  EyeOff,
  Plus,
  CreditCard,
  PieChart,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { getUserSession, clearUserSession } from '../../utils/session';
import { getUser, getTransactionHistory } from '../../utils/api';

export function Dashboard() {
  const navigate = useNavigate();
  const session = getUserSession();
  const [showBalance, setShowBalance] = useState(true);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(session);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      try {
        // Fetch latest balance and limits from database
        const userRes = await getUser(session.username);
        if (isMounted && userRes && userRes.status === 'success' && userRes.user) {
          setProfile(prev => ({
            ...prev,
            balance: userRes.user.balance,
            daily_limit: userRes.user.daily_limit,
            today_spent: userRes.user.today_spent,
          }));
        }

        // Fetch transaction history
        const txRes = await getTransactionHistory(session.username);
        if (isMounted && txRes && txRes.status === 'success' && txRes.transactions) {
          // Sort transactions by date descending and get top 3
          const sorted = [...txRes.transactions]
            .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 3);
          setRecentTransactions(sorted);
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [session.username]);

  const handleLogout = () => {
    clearUserSession();
    navigate('/login');
  };

  const quickActions = [
    { icon: Send, label: 'Transfer', color: 'bg-accent', route: '/send-money' },
    { icon: CreditCard, label: 'Cards', color: 'bg-primary', route: '/features' },
    { icon: PieChart, label: 'Insights', color: 'bg-secondary', route: '/features' },
    { icon: Plus, label: 'Top-up', color: 'bg-success', route: '/features' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Premium Header */}
      <div className="bg-primary text-white relative overflow-hidden pb-32">
        {/* Abstract background shapes */}
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-accent/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-72 h-72 bg-secondary/40 rounded-full blur-[80px]" />
        
        <div className="max-w-4xl mx-auto px-6 pt-10 relative z-10">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center shadow-2xl">
                <span className="text-xl font-bold text-accent">{session.username[0].toUpperCase()}</span>
              </div>
              <div>
                <p className="text-xs font-bold text-white/50 uppercase tracking-[0.2em]">Verified Private Account</p>
                <h2 className="text-xl font-bold">@{session.username}</h2>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => navigate('/features')}
                className="w-11 h-11 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 hover:bg-white/20 transition-all shadow-xl"
              >
                <Bell size={20} />
              </button>
              <button
                onClick={handleLogout}
                className="w-11 h-11 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 hover:bg-destructive/80 transition-all shadow-xl"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-8">
             <div className="space-y-1">
                <p className="text-sm font-semibold text-white/60 tracking-wider uppercase">Total Liquidity</p>
                <div className="flex items-center gap-4">
                  <h1 className="text-5xl font-bold tracking-tighter">
                    {showBalance ? `৳${(profile?.balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '••••••'}
                  </h1>
                  <button 
                    onClick={() => setShowBalance(!showBalance)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    {showBalance ? <EyeOff size={24} className="text-white/40" /> : <Eye size={24} className="text-white/40" />}
                  </button>
                </div>
             </div>
             
             <div className="max-w-xs">
                <DailyLimitIndicator spent={profile?.today_spent ?? 0} limit={profile?.daily_limit ?? 5000} />
             </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-20 pb-20">
        {/* Quick Actions Card */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-white/10 mb-10">
          <div className="flex items-center justify-between mb-8 px-2">
            <h3 className="text-xl font-bold tracking-tight">Core Services</h3>
            <ShieldCheck className="text-accent" size={24} />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(action.route)}
                  className="flex flex-col items-center gap-4 group"
                >
                  <div className={`w-16 h-16 ${action.color} rounded-[1.75rem] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 ring-4 ring-transparent group-hover:ring-accent/10`}>
                    <Icon size={28} className="text-white" />
                  </div>
                  <span className="text-xs font-bold text-primary/80 group-hover:text-accent uppercase tracking-wider transition-colors">
                    {action.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Transactions Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6 px-2">
            <h3 className="text-xl font-bold tracking-tight">Authorizations</h3>
            <button
              onClick={() => navigate('/history')}
              className="group flex items-center gap-2 text-sm font-bold text-accent hover:text-primary transition-colors uppercase tracking-widest"
            >
              <span>Audit Log</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              <div className="bg-white border border-border/50 rounded-2xl p-8 text-center shadow-sm">
                <p className="text-sm text-muted-foreground animate-pulse">Loading transaction records...</p>
              </div>
            ) : recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <TransactionCard 
                  key={transaction.id} 
                  type={transaction.type}
                  amount={transaction.amount}
                  status={transaction.status}
                  timestamp={new Date(transaction.created_at).toLocaleString()}
                  senderUsername={transaction.sender_username || transaction.senderUsername}
                  receiverUsername={transaction.receiver_username || transaction.receiverUsername}
                  showSecurityBadge={true} 
                />
              ))
            ) : (
              <div className="bg-white border border-border/50 rounded-[2rem] p-10 text-center shadow-sm">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="text-muted-foreground" size={24} />
                </div>
                <h4 className="text-base font-bold text-primary mb-1">No Transactions Yet</h4>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  Your recent transaction logs and cryptographic authorizations will show up here.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/send-money')}
                  className="mt-4 border-accent/30 text-accent hover:bg-accent/5 hover:text-accent"
                >
                  Send First Payment
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Feature Teaser */}
        <button
          onClick={() => navigate('/features')}
          className="w-full relative overflow-hidden bg-gradient-to-br from-secondary to-primary text-white rounded-[2.5rem] p-8 shadow-2xl hover:shadow-accent/20 transition-all duration-500 group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="text-left">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
                  <Sparkles size={20} className="text-accent" />
                </div>
                <h4 className="text-lg font-bold tracking-tight">Premium Expansion</h4>
              </div>
              <p className="text-white/60 text-sm font-medium max-w-[240px]">
                Unlock global transfers, smart cards, and advanced portfolio analytics.
              </p>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-accent transition-colors">
              <ArrowRight size={24} />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
