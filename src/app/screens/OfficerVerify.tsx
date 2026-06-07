import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Shield, Smartphone, ArrowLeft } from 'lucide-react';

export function OfficerVerify() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nid: '',
    activationCode: '',
    username: '',
    macAddress: 'AA:BB:CC:DD:EE:FF',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nid && formData.activationCode && formData.username && formData.macAddress) {
      navigate('/biometric-enrollment', { state: formData });
    }
  };

  return (
    <div className="min-h-screen bg-primary text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/30 rounded-full blur-[120px]" />

      <div className="max-w-md w-full relative z-10 my-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl mb-6 shadow-2xl border border-white/20">
            <Shield size={40} className="text-accent" />
          </div>
          <h1 className="text-white text-3xl font-bold tracking-tight mb-2">Verify Identity</h1>
          <p className="text-white/60 font-semibold tracking-wide uppercase text-xs">
            Generate private key (K1)
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-white/10 mb-8 text-primary">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="NID / BRC Number"
              type="text"
              placeholder="Enter your NID or BRC number"
              value={formData.nid}
              onChange={(e) => setFormData({ ...formData, nid: e.target.value })}
              required
            />

            <Input
              label="Activation Code"
              type="text"
              placeholder="Code provided by bank officer"
              value={formData.activationCode}
              onChange={(e) => setFormData({ ...formData, activationCode: e.target.value })}
              required
            />

            <Input
              label="Bank-Assigned Username"
              type="text"
              placeholder="Username provided by officer"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              helperText="This username was assigned by your bank officer"
              required
            />

            <Input
              label="Device MAC Address"
              type="text"
              placeholder="e.g. AA:BB:CC:DD:EE:FF"
              value={formData.macAddress}
              onChange={(e) => setFormData({ ...formData, macAddress: e.target.value })}
              helperText="Physical MAC address of your device for hardware binding"
              required
            />

            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex items-start gap-3">
              <Smartphone size={20} className="text-accent flex-shrink-0 mt-0.5" />
              <p className="text-xs font-semibold text-primary/70 leading-relaxed">
                Your device MAC address will be bound to this account for security (K1 key generation).
              </p>
            </div>

            <Button type="submit" fullWidth size="lg">
              Verify & Continue
            </Button>
          </form>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="group flex items-center justify-center gap-2 w-full text-white/60 font-semibold hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Go Back</span>
        </button>
      </div>
    </div>
  );
}
