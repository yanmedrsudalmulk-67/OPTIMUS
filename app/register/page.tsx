'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase';
import { useAuth } from '@/AuthContext';
import { motion } from 'motion/react';
import { Activity, Lock, Building2, HeartPulse } from 'lucide-react';
import { toast } from 'sonner';

export default function Register() {
  const router = useRouter();
  const { user, isAuthReady } = useAuth();
  const [unitName, setUnitName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthReady && user) {
      router.push('/dashboard');
    }
  }, [user, isAuthReady, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Map unit name to email for Firebase Auth
      const email = `${unitName.toLowerCase().replace(/\s+/g, '')}@optimus.local`;
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Save user profile to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        username: unitName,
        role: 'unit',
        unitName: unitName,
        createdAt: new Date().toISOString(),
      });

      toast.success('Pendaftaran berhasil! Anda otomatis masuk.');
      router.push('/dashboard');
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Nama unit ini sudah terdaftar');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Password terlalu lemah (minimal 6 karakter)');
      } else {
        toast.error('Terjadi kesalahan saat mendaftar');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4 relative overflow-hidden transition-colors duration-300">
      {/* Background Effects */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full pointer-events-none opacity-50 dark:opacity-100" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full pointer-events-none opacity-50 dark:opacity-100" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[var(--card)] backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-[var(--border)] relative z-10"
      >
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-8 text-center border-b border-[var(--border)] relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--card)] pointer-events-none" />
          <div className="flex justify-center mb-4 relative z-10">
            <div className="bg-[var(--background)] p-3 rounded-2xl backdrop-blur-sm border border-[var(--border)] shadow-sm">
              <HeartPulse className="w-8 h-8 text-blue-500 dark:text-blue-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-[var(--foreground)] relative z-10">Daftar Unit Baru</h2>
          <p className="text-gray-600 dark:text-[var(--muted-foreground)] mt-2 text-sm relative z-10">Buat akun untuk unit Anda di OPTIMUS</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[var(--muted-foreground)] mb-1">Nama Unit / Ruangan</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-500 dark:text-[var(--muted-foreground)]" />
                  </div>
                  <input
                    type="text"
                    required
                    value={unitName}
                    onChange={(e) => setUnitName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-blue-500 bg-[var(--background)] text-gray-900 dark:text-[var(--foreground)] placeholder-gray-500/50 dark:placeholder-[var(--muted-foreground)]/50 outline-none transition-all"
                    placeholder="Contoh: IGD, Rawat Inap Melati"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[var(--muted-foreground)] mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500 dark:text-[var(--muted-foreground)]" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-blue-500 bg-[var(--background)] text-gray-900 dark:text-[var(--foreground)] placeholder-gray-500/50 dark:placeholder-[var(--muted-foreground)]/50 outline-none transition-all"
                    placeholder="Minimal 6 karakter"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-blue-500/30 rounded-xl shadow-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Daftar'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-[var(--muted-foreground)]">
              Sudah punya akun?{' '}
              <Link href="/login" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-all">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
