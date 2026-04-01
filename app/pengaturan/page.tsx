'use client';

import { useAuth } from '@/AuthContext';
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase';
import { motion } from 'motion/react';
import { Settings, Upload, Save, Image as ImageIcon, Activity } from 'lucide-react';
import { toast } from 'sonner';

import Image from 'next/image';

export default function Pengaturan() {
  const { profile, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [appName, setAppName] = useState('OPTIMUS');
  const [logoUrl, setLogoUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: () => void;

    if (profile?.role === 'admin') {
      unsubscribe = onSnapshot(doc(db, 'settings', 'general'), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setAppName(data.appName || 'OPTIMUS');
          setLogoUrl(data.logoUrl || '');
        }
        setLoading(false);
      }, (error) => {
        console.error("Error fetching settings:", error);
        setLoading(false);
      });
    } else if (!authLoading) {
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [profile, authLoading]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (profile?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600 dark:text-[var(--muted-foreground)]">Anda tidak memiliki akses ke halaman ini.</p>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Limit to 500KB for Firestore storage
      if (selectedFile.size > 500 * 1024) {
        toast.error('Ukuran file maksimal 500KB untuk logo');
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      let finalLogoUrl = logoUrl;

      if (file) {
        // Convert to base64 for direct Firestore storage as requested
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        finalLogoUrl = await base64Promise;
      }

      await setDoc(doc(db, 'settings', 'general'), {
        id: 'general',
        appName,
        logoUrl: finalLogoUrl,
        updatedAt: new Date().toISOString()
      });

      setFile(null);
      setPreview(null);
      toast.success('Pengaturan berhasil disimpan');
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error('Gagal menyimpan pengaturan');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-[var(--foreground)] tracking-tight flex items-center gap-3">
          <Settings className="w-8 h-8 text-blue-600" />
          Pengaturan
        </h1>
        <p className="text-gray-600 dark:text-[var(--muted-foreground)] mt-2 leading-relaxed">Konfigurasi aplikasi OPTIMUS</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[var(--card)] rounded-3xl shadow-xl border border-gray-200 dark:border-[var(--border)] p-6 md:p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full pointer-events-none" />
            
            {loading ? (
              <div className="flex justify-center py-12 relative z-10">
                <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-8 relative z-10">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-[var(--foreground)] flex items-center gap-2 mb-4">
                    <Settings className="w-5 h-5 text-blue-600" />
                    Informasi Aplikasi
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-800 dark:text-[var(--muted-foreground)] mb-2">Nama Aplikasi</label>
                      <input
                        type="text"
                        required
                        value={appName}
                        onChange={(e) => setAppName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-[var(--border)] rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-[var(--background)] text-gray-900 dark:text-[var(--foreground)] outline-none transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-[var(--border)]">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-[var(--foreground)] flex items-center gap-2 mb-4">
                    <ImageIcon className="w-5 h-5 text-blue-600" />
                    Logo Aplikasi
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-[var(--muted-foreground)] mb-4 leading-relaxed">Logo ini akan ditampilkan di halaman depan (Welcome Screen).</p>
                  
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-gray-200 dark:border-[var(--border)] bg-gray-50 dark:bg-[var(--background)] flex items-center justify-center overflow-hidden relative group shrink-0">
                      {preview || logoUrl ? (
                        <Image 
                          src={preview || logoUrl} 
                          alt="Logo Preview" 
                          width={128}
                          height={128}
                          className="w-full h-full object-contain p-2"
                          unoptimized
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-gray-400 dark:text-[var(--muted-foreground)]" />
                      )}
                      
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                      
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                        <p className="text-sm text-blue-700 dark:text-blue-400 font-bold mb-1">Panduan Upload</p>
                        <ul className="text-sm text-blue-700/80 dark:text-blue-400/80 space-y-1 list-disc pl-4 font-medium">
                          <li>Format yang didukung: JPG, PNG, SVG</li>
                          <li>Ukuran maksimal: 500KB</li>
                          <li>Rekomendasi rasio: 1:1 (Persegi)</li>
                          <li>Gunakan background transparan (PNG) untuk hasil terbaik</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-[var(--border)] flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-blue-500/25"
                  >
                    {saving ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Simpan Pengaturan
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>

        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-[var(--card)] rounded-3xl shadow-xl border border-gray-200 dark:border-[var(--border)] p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />
            
            <h3 className="text-lg font-bold text-gray-800 dark:text-[var(--foreground)] mb-4 relative z-10">Preview Welcome Screen</h3>
            <div className="bg-[#020207] rounded-xl p-6 border border-white/10 flex flex-col items-center text-center aspect-[3/4] justify-center relative z-10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />
              
              <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center mb-6 p-2 relative z-10 backdrop-blur-sm">
                {preview || logoUrl ? (
                  <Image 
                    src={preview || logoUrl} 
                    alt="Logo" 
                    width={80}
                    height={80}
                    className="w-full h-full object-contain" 
                    unoptimized
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Activity className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
              <h4 className="text-2xl font-extrabold text-white tracking-tight mb-2 relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{appName}</h4>
              <p className="text-xs text-slate-400 font-medium relative z-10">Optimalisasi Sistem Pelaporan Mutu Rumah Sakit</p>
              
              <div className="mt-8 w-full bg-blue-500/20 text-blue-400 border border-blue-500/30 py-2.5 rounded-xl text-sm font-semibold shadow-sm opacity-50 relative z-10">
                Masuk Menu
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
