'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Lock, User, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { mockAuth, UserRole } from '@/lib/supabase';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication logic
    if (username.toLowerCase() === 'tim mutu rs' && password === '123456') {
      mockAuth.login(username, 'TIM_MUTU');
      router.push('/dashboard');
    } else if (username.length > 0) {
      // Any other username is treated as a UNIT
      mockAuth.login(username, 'UNIT');
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-emerald-500/5 blur-[150px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-panel p-8 rounded-2xl border border-emerald-500/30 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4 glow-box">
              <Activity className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-emerald-50 glow-text">OPTIMUS</h1>
            <p className="text-emerald-400/60 text-sm mt-1">Sistem Pelaporan Mutu RS</p>
          </div>

          <div className="flex gap-2 mb-8 p-1 bg-emerald-950/50 rounded-lg border border-emerald-500/20">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isLogin ? 'bg-emerald-500/20 text-emerald-300 shadow-sm' : 'text-emerald-500/60 hover:text-emerald-400'}`}
            >
              Masuk
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isLogin ? 'bg-emerald-500/20 text-emerald-300 shadow-sm' : 'text-emerald-500/60 hover:text-emerald-400'}`}
            >
              Daftar Unit
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-emerald-400/80 mb-1 uppercase tracking-wider">
                {isLogin ? 'Username / Nama Unit' : 'Nama Unit Baru'}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500/50" />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-emerald-950/40 border border-emerald-500/30 rounded-lg py-2.5 pl-10 pr-4 text-emerald-100 placeholder:text-emerald-500/30 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
                  placeholder={isLogin ? "Contoh: Tim Mutu RS / IGD" : "Nama Unit"}
                  required
                />
              </div>
            </div>

            {isLogin && (
              <div>
                <label className="block text-xs font-medium text-emerald-400/80 mb-1 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500/50" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-emerald-950/40 border border-emerald-500/30 rounded-lg py-2.5 pl-10 pr-4 text-emerald-100 placeholder:text-emerald-500/30 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
                    placeholder="••••••"
                  />
                </div>
                <p className="text-xs text-emerald-500/60 mt-2">
                  *Tim Mutu RS: pass 123456. Unit: kosongkan password.
                </p>
              </div>
            )}

            <button 
              type="submit"
              className="w-full mt-6 flex items-center justify-center gap-2 py-3 bg-emerald-500 text-emerald-950 font-semibold rounded-lg hover:bg-emerald-400 transition-all glow-box group"
            >
              {isLogin ? 'Masuk ke Sistem' : 'Daftarkan Unit'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
