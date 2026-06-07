import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Button } from '../components/Button';
import { Fingerprint, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import CryptoJS from 'crypto-js';

export function BiometricEnrollment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scanCount, setScanCount] = useState(0);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    if (scanCount < 3) {
      setIsScanning(true);
      setTimeout(() => {
        setScanCount(scanCount + 1);
        setIsScanning(false);
      }, 1200);
    }
  };

  const isComplete = scanCount === 3;

  const handleComplete = () => {
    // Simulate fingerprint template string
    const fingerprintSim = "123456";
    const bpHash = CryptoJS.SHA256(fingerprintSim).toString();
    
    navigate('/create-password', { 
      state: { 
        ...location.state, 
        bp_hash: bpHash,
        macAddress: location.state?.macAddress || "AA:BB:CC:DD:EE:FF"
      } 
    });
  };

  return (
    <div className="min-h-screen bg-primary text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/30 rounded-full blur-[120px]" />

      <div className="max-w-md w-full relative z-10 my-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl mb-6 shadow-2xl border border-white/20">
            <Fingerprint size={40} className="text-accent" />
          </div>
          <h1 className="text-white text-3xl font-bold tracking-tight mb-2">Biometric Registry</h1>
          <p className="text-white/60 font-semibold tracking-wide uppercase text-xs">
            Register your hardware signature key (BP)
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-white/10 mb-8 text-primary">
          <div className="flex flex-col items-center">
            <motion.div
              animate={
                isScanning
                  ? { scale: [1, 1.05, 1], opacity: [1, 0.7, 1] }
                  : isComplete
                  ? { scale: 1.05 }
                  : {}
              }
              transition={
                isScanning
                  ? { repeat: Infinity, duration: 1.2 }
                  : { duration: 0.3 }
              }
              className={`relative cursor-pointer w-32 h-32 rounded-3xl flex items-center justify-center border-2 border-dashed ${
                isComplete
                  ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5'
                  : isScanning
                  ? 'text-accent border-accent/30 bg-accent/5'
                  : 'text-primary border-primary/20 hover:border-accent hover:text-accent transition-colors'
              }`}
              onClick={!isComplete ? handleScan : undefined}
            >
              <Fingerprint size={80} strokeWidth={1.5} />
              {!isComplete && !isScanning && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 rounded-3xl border-2 border-accent"
                />
              )}
            </motion.div>

            <div className="mt-6 text-center">
              <p className="font-bold text-lg mb-1">
                {isScanning
                  ? 'Capturing Signature...'
                  : isComplete
                  ? 'Enrollment Verified!'
                  : 'Tap fingerprint to scan'}
              </p>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Scan progress: {scanCount} of 3
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i <= scanCount ? 'bg-accent w-6' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 mt-8">
            <p className="text-xs font-semibold text-primary/70 leading-relaxed text-center">
              Your biometric pattern (BP) is cryptographically combined with your secret password keys locally on this device.
            </p>
          </div>
        </div>

        <Button
          fullWidth
          size="lg"
          disabled={!isComplete}
          onClick={handleComplete}
          className={isComplete ? 'bg-accent text-white shadow-accent/20' : ''}
        >
          {isComplete ? 'Complete Registration' : `Scan ${3 - scanCount} more time${3 - scanCount !== 1 ? 's' : ''}`}
        </Button>

        <button
          onClick={() => navigate(-1)}
          className="group flex items-center justify-center gap-2 w-full mt-6 text-white/60 font-semibold hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Go Back</span>
        </button>
      </div>
    </div>
  );
}
