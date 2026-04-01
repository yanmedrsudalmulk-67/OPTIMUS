'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/firebase';
import { useAuth } from '@/AuthContext';
import { motion } from 'motion/react';
import { Activity, Lock, User, ShieldCheck, HeartPulse } from 'lucide-react';
import { toast } from 'sonner';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function Login() {
  const router = useRouter();
  const { user, isAuthReady } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'unit' | 'admin'>('unit');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthReady && user) {
      router.push('/dashboard');
    }
  }, [user, isAuthReady, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Map username to email for Firebase Auth
      const email = `${username.toLowerCase().replace(/\s+/g, '')}@optimus.local`;
      
      let userCredential;
      try {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } catch (signInError: any) {
        // Bootstrap Tim Mutu RS account if it doesn't exist
        if (
          role === 'admin' && 
          username.toLowerCase() === 'tim mutu rs' && 
          password === '123456' && 
          (signInError.code === 'auth/invalid-credential' || signInError.code === 'auth/user-not-found')
        ) {
          userCredential = await createUserWithEmailAndPassword(auth, email, password);
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            uid: userCredential.user.uid,
            username: 'Tim Mutu RS',
            role: 'admin',
            createdAt: new Date().toISOString(),
          });
          toast.success('Akun Tim Mutu RS berhasil dibuat otomatis!');
        } else {
          throw signInError;
        }
      }
      
      // Verify role
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role !== role) {
          await auth.signOut();
          toast.error(`Akun ini tidak memiliki akses sebagai ${role === 'admin' ? 'Tim Mutu' : 'Unit'}`);
          setLoading(false);
          return;
        }
      } else {
        // Fallback if user doc doesn't exist but auth succeeded
        if (role === 'admin') {
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            uid: userCredential.user.uid,
            username: 'Tim Mutu RS',
            role: 'admin',
            createdAt: new Date().toISOString(),
          });
          toast.success('Profil Tim Mutu RS berhasil dipulihkan!');
        } else if (role === 'unit') {
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            uid: userCredential.user.uid,
            username: username,
            role: 'unit',
            unitName: username,
            createdAt: new Date().toISOString(),
          });
          toast.success('Profil Unit berhasil dipulihkan!');
        } else {
          await auth.signOut();
          toast.error('Profil pengguna tidak ditemukan. Silakan daftar ulang.');
          setLoading(false);
          return;
        }
      }

      toast.success('Login berhasil!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        toast.error('Username atau password salah');
      } else {
        toast.error('Terjadi kesalahan saat login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4 relative overflow-hidden transition-colors duration-300">
      {/* Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full pointer-events-none opacity-50 dark:opacity-100" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full pointer-events-none opacity-50 dark:opacity-100" />
      
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
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-[var(--foreground)] relative z-10">Selamat Datang</h2>
          <p className="text-gray-600 dark:text-[var(--muted-foreground)] mt-2 text-sm relative z-10">Silakan masuk ke akun OPTIMUS Anda</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="flex bg-[var(--background)] p-1 rounded-xl border border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setRole('unit')}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                    role === 'unit' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30' : 'text-gray-600 dark:text-[var(--muted-foreground)] hover:text-gray-900 dark:hover:text-[var(--foreground)]'
                  }`}
                >
                  Unit
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                    role === 'admin' ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30' : 'text-gray-600 dark:text-[var(--muted-foreground)] hover:text-gray-900 dark:hover:text-[var(--foreground)]'
                  }`}
                >
                  Tim Mutu
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-[var(--muted-foreground)] mb-1">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {role === 'admin' ? <ShieldCheck className="h-5 w-5 text-gray-500 dark:text-[var(--muted-foreground)]" /> : <User className="h-5 w-5 text-gray-500 dark:text-[var(--muted-foreground)]" />}
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-blue-500 bg-[var(--background)] text-gray-900 dark:text-[var(--foreground)] placeholder-gray-500/50 dark:placeholder-[var(--muted-foreground)]/50 outline-none transition-all"
                    placeholder={role === 'admin' ? "Tim Mutu RS" : "Nama Unit"}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-blue-500 bg-[var(--background)] text-gray-900 dark:text-[var(--foreground)] placeholder-gray-500/50 dark:placeholder-[var(--muted-foreground)]/50 outline-none transition-all"
                    placeholder="••••••••"
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
                'Masuk'
              )}
            </button>
          </form>

          {role === 'unit' && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-[var(--muted-foreground)]">
                Belum punya akun unit?{' '}
                <Link href="/register" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-all">
                  Daftar di sini
                </Link>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
