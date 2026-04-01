'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'motion/react';
import { Activity, BarChart3, ShieldCheck, Users, Zap, Database, ArrowRight, CheckCircle2, ChevronRight, Menu, X, LineChart, FileText, Cloud, HeartPulse, Sun, Moon } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase';
import Link from 'next/link';
import Image from 'next/image';

import { useAuth } from '@/AuthContext';
import { useTheme } from '@/ThemeContext';

const features = [
  { icon: Activity, title: 'Real-time Monitoring', desc: 'Pantau indikator mutu secara langsung tanpa delay.' },
  { icon: Zap, title: 'Input Data Cepat & Akurat', desc: 'Sistem input yang dioptimalkan untuk kecepatan dan akurasi.' },
  { icon: LineChart, title: 'Grafik Otomatis', desc: 'Visualisasi data otomatis dalam bentuk grafik interaktif.' },
  { icon: FileText, title: 'Laporan Otomatis', desc: 'Generate laporan bulanan, triwulan, dan tahunan instan.' },
  { icon: Cloud, title: 'Integrasi Firebase', desc: 'Penyimpanan cloud yang aman, cepat, dan terpercaya.' },
];

const advantages = [
  { icon: ShieldCheck, text: 'Berbasis standar Kemenkes' },
  { icon: Users, text: 'Multi user (Unit & Tim Mutu)' },
  { icon: Activity, text: 'Data real-time' },
  { icon: Cloud, text: 'Aman & cloud-based' },
  { icon: CheckCircle2, text: 'Mudah digunakan' },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const { user, isAuthReady } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [appName, setAppName] = useState('OPTIMUS');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleScroll = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsScrolled(window.scrollY > 50);
      }, 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'general'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.logoUrl) setLogoUrl(data.logoUrl);
        if (data.appName) setAppName(data.appName);
      }
    }, (error) => {
      console.error("Error fetching settings:", error);
    });
    
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-hidden font-sans selection:bg-blue-500/30 transition-colors duration-300">
      {/* Background Glow Effects */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 dark:bg-blue-600/20 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 dark:bg-purple-500/20 blur-[120px] pointer-events-none" />
      <div className="fixed top-[40%] left-[40%] w-[20%] h-[20%] rounded-full bg-blue-400/5 dark:bg-blue-400/10 blur-[100px] pointer-events-none" />

      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border)] py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <Image src={logoUrl} alt="OPTIMUS Logo" width={40} height={40} className="rounded-xl" unoptimized referrerPolicy="no-referrer" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
                <HeartPulse className="w-6 h-6 text-white" />
              </div>
            )}
            <span className="text-xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-300">
              {appName}
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#beranda" className="text-sm font-medium text-gray-800 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors">Beranda</a>
            <a href="#fitur" className="text-sm font-medium text-gray-800 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors">Fitur</a>
            <a href="#dashboard" className="text-sm font-medium text-gray-800 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors">Dashboard</a>
            <a href="#tentang" className="text-sm font-medium text-gray-800 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors">Tentang</a>
            
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white dark:bg-[var(--card)] border border-gray-200 dark:border-[var(--border)] text-gray-800 dark:text-[var(--muted-foreground)] hover:text-blue-600 dark:hover:text-[var(--foreground)] transition-all"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-500" />}
            </button>

            {isAuthReady && user ? (
              <Link 
                href="/dashboard"
                className="px-5 py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all text-sm font-medium shadow-sm inline-block"
              >
                Ke Dashboard
              </Link>
            ) : (
              <Link 
                href="/login"
                className="px-5 py-2.5 rounded-full bg-white dark:bg-[var(--card)] border border-gray-200 dark:border-[var(--border)] text-gray-800 dark:text-[var(--foreground)] hover:bg-gray-100 dark:hover:bg-white/10 transition-all text-sm font-medium shadow-sm inline-block"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-gray-600 dark:text-slate-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 w-full bg-[var(--background)]/95 backdrop-blur-xl border-b border-[var(--border)] py-4 px-6 flex flex-col gap-4 md:hidden"
          >
            <a href="#beranda" onClick={() => setMobileMenuOpen(false)} className="text-gray-800 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white py-2">Beranda</a>
            <a href="#fitur" onClick={() => setMobileMenuOpen(false)} className="text-gray-800 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white py-2">Fitur</a>
            <a href="#dashboard" onClick={() => setMobileMenuOpen(false)} className="text-gray-800 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white py-2">Dashboard</a>
            <a href="#tentang" onClick={() => setMobileMenuOpen(false)} className="text-gray-800 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white py-2">Tentang</a>
            {isAuthReady && user ? (
              <Link 
                href="/dashboard"
                className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium shadow-sm text-center block"
              >
                Ke Dashboard
              </Link>
            ) : (
              <Link 
                href="/login"
                className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium shadow-sm text-center block"
              >
                Login Sistem
              </Link>
            )}
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="beranda" className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Sistem Pelaporan Mutu v2.0
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-slate-400">{appName}</span>
            <br />
            <span className="text-3xl md:text-5xl text-blue-600 dark:text-blue-400">
              Healthcare Excellence
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-slate-400 mb-8 max-w-xl leading-relaxed">
            Optimalisasi Sistem Pelaporan Mutu Rumah Sakit berbasis digital dan real-time. Tingkatkan efisiensi dan akurasi data mutu dengan teknologi masa depan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            {isAuthReady && user ? (
              <Link 
                href="/dashboard"
                className="px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-lg hover:-translate-y-1"
              >
                Buka Dashboard <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-lg hover:-translate-y-1"
                >
                  Mulai Sekarang <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href="/login"
                  className="px-8 py-4 rounded-full bg-white dark:bg-[var(--card)] border border-gray-300 dark:border-[var(--border)] hover:bg-gray-100 dark:hover:bg-white/10 text-gray-800 dark:text-[var(--foreground)] font-semibold flex items-center justify-center transition-all backdrop-blur-sm shadow-sm"
                >
                  Login Sistem
                </Link>
              </>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex-1 relative z-10 w-full"
        >
          {/* Abstract 3D Mockup Representation */}
          <div className="relative w-full aspect-square max-w-md mx-auto">
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute inset-0 bg-[var(--card)] rounded-3xl border border-[var(--border)] backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Mockup Header */}
              <div className="h-12 border-b border-[var(--border)] flex items-center px-4 gap-2 bg-slate-500/5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-blue-500/80" />
              </div>
              {/* Mockup Content */}
              <div className="p-6 flex-1 flex flex-col gap-4">
                <div className="flex gap-4">
                  <div className="w-1/3 h-24 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 p-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 mb-2" />
                    <div className="w-full h-2 bg-slate-500/10 rounded-full mb-2" />
                    <div className="w-2/3 h-2 bg-slate-500/10 rounded-full" />
                  </div>
                  <div className="w-1/3 h-24 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 p-4">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 mb-2" />
                    <div className="w-full h-2 bg-slate-500/10 rounded-full mb-2" />
                    <div className="w-2/3 h-2 bg-slate-500/10 rounded-full" />
                  </div>
                  <div className="w-1/3 h-24 rounded-2xl bg-gradient-to-br from-pink-500/10 to-transparent border border-pink-500/20 p-4">
                    <div className="w-8 h-8 rounded-full bg-pink-500/20 mb-2" />
                    <div className="w-full h-2 bg-slate-500/10 rounded-full mb-2" />
                    <div className="w-2/3 h-2 bg-slate-500/10 rounded-full" />
                  </div>
                </div>
                <div className="flex-1 rounded-2xl bg-slate-500/5 border border-[var(--border)] p-4 flex items-end gap-2">
                  {[40, 70, 45, 90, 65, 85, 50].map((h, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                      className="flex-1 bg-gradient-to-t from-blue-600 to-purple-500 dark:from-blue-500 dark:to-purple-400 rounded-t-sm opacity-80"
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Floating Elements */}
            <motion.div 
              animate={{ y: [0, 15, 0], rotate: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute -right-8 top-12 p-4 rounded-2xl bg-[var(--card)]/80 backdrop-blur-xl border border-[var(--border)] shadow-xl flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Status Mutu</div>
                <div className="text-sm font-bold text-[var(--foreground)]">Sangat Baik</div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, -15, 0], rotate: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
              className="absolute -left-8 bottom-12 p-4 rounded-2xl bg-[var(--card)]/80 backdrop-blur-xl border border-[var(--border)] shadow-xl flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Real-time Data</div>
                <div className="text-sm font-bold text-[var(--foreground)]">Sync Active</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Keunggulan Sistem */}
      <section className="py-10 border-y border-[var(--border)] bg-slate-500/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {advantages.map((adv, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 text-slate-500 dark:text-slate-400"
              >
                <adv.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium">{adv.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Fitur Unggulan */}
      <section id="fitur" className="py-32 px-6 max-w-7xl mx-auto relative">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-[var(--foreground)]">
            Fitur <span className="text-blue-600 dark:text-blue-400">Unggulan</span>
          </h2>
          <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">Teknologi mutakhir untuk mempermudah pelaporan dan pemantauan mutu rumah sakit Anda.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-8 rounded-3xl bg-white dark:bg-[var(--card)] border border-gray-200 dark:border-[var(--border)] hover:border-blue-500/30 transition-all duration-300 backdrop-blur-sm relative overflow-hidden shadow-sm hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10">
                <feature.icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 relative z-10 text-gray-800 dark:text-[var(--foreground)]">{feature.title}</h3>
              <p className="text-gray-600 dark:text-slate-400 relative z-10 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Preview Dashboard */}
      <section id="dashboard" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-[var(--foreground)]">
                Dashboard <br/> <span className="text-blue-600 dark:text-blue-400">Interaktif & Cerdas</span>
              </h2>
              <p className="text-gray-600 dark:text-slate-400 mb-8 text-lg leading-relaxed">
                Pantau seluruh indikator mutu rumah sakit dalam satu layar. Dilengkapi dengan visualisasi data yang memukau dan analitik mendalam untuk pengambilan keputusan yang lebih baik.
              </p>
              <ul className="space-y-4 mb-8">
                {['Visualisasi data real-time', 'Filter berdasarkan unit & periode', 'Export laporan PDF & Excel'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-800 dark:text-slate-300">
                    <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1 w-full"
            >
              <div className="relative rounded-3xl overflow-hidden border border-[var(--border)] bg-[var(--card)] shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {/* Dashboard Mockup UI */}
                <div className="h-10 bg-slate-500/5 border-b border-[var(--border)] flex items-center px-4 gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                  </div>
                  <div className="mx-auto w-1/3 h-4 bg-slate-500/10 rounded-full" />
                </div>
                <div className="p-6 grid grid-cols-2 gap-4">
                  <div className="col-span-2 h-32 rounded-xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/10 p-4 flex flex-col justify-between relative overflow-hidden">
                    <div className="w-24 h-4 bg-blue-500/20 rounded-full" />
                    <div className="w-32 h-8 bg-blue-500/30 rounded-full" />
                    {/* Abstract Chart Line */}
                    <svg className="absolute bottom-0 left-0 w-full h-16" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <path d="M0,100 L0,50 Q25,20 50,60 T100,30 L100,100 Z" fill="rgba(59, 130, 246, 0.1)" />
                      <path d="M0,50 Q25,20 50,60 T100,30" fill="none" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="2" />
                    </svg>
                  </div>
                  <div className="h-24 rounded-xl bg-slate-500/5 border border-[var(--border)] p-4 flex flex-col justify-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10" />
                    <div className="w-20 h-3 bg-slate-500/10 rounded-full" />
                    <div className="w-12 h-4 bg-slate-500/20 rounded-full" />
                  </div>
                  <div className="h-24 rounded-xl bg-slate-500/5 border border-[var(--border)] p-4 flex flex-col justify-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-500/10" />
                    <div className="w-20 h-3 bg-slate-500/10 rounded-full" />
                    <div className="w-12 h-4 bg-slate-500/20 rounded-full" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistik */}
      <section className="py-20 border-y border-gray-200 dark:border-[var(--border)] bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">100+</div>
              <div className="text-gray-600 dark:text-slate-400 font-medium tracking-wide uppercase text-sm">Indikator Mutu</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <div className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">1000+</div>
              <div className="text-gray-600 dark:text-slate-400 font-medium tracking-wide uppercase text-sm">Data Tersimpan</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">24/7</div>
              <div className="text-gray-600 dark:text-slate-400 font-medium tracking-wide uppercase text-sm">Real-time Monitoring</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 max-w-4xl mx-auto text-center relative">
        <div className="absolute inset-0 bg-blue-600/5 dark:bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative z-10 p-12 rounded-3xl bg-white/80 dark:bg-[var(--card)]/50 border border-gray-200 dark:border-[var(--border)] backdrop-blur-xl shadow-2xl"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-[var(--foreground)]">Mulai Digitalisasi Mutu RS Anda Sekarang</h2>
          <p className="text-gray-600 dark:text-slate-400 mb-10 text-lg leading-relaxed">Tinggalkan cara manual. Beralih ke OPTIMUS untuk pelaporan mutu yang lebih cepat, akurat, and terintegrasi.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {isAuthReady && user ? (
              <Link 
                href="/dashboard"
                className="px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-lg inline-block"
              >
                Buka Dashboard
              </Link>
            ) : (
              <Link 
                href="/login"
                className="px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-lg inline-block"
              >
                Masuk Aplikasi
              </Link>
            )}
            <button className="px-8 py-4 rounded-full bg-white dark:bg-[var(--card)] border border-gray-300 dark:border-[var(--border)] hover:bg-gray-100 dark:hover:bg-white/10 text-gray-800 dark:text-[var(--foreground)] font-semibold transition-all shadow-sm">
              Hubungi Kami
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer id="tentang" className="border-t border-[var(--border)] bg-[var(--background)] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
            <div className="flex items-center gap-3">
              {logoUrl ? (
                <Image src={logoUrl} alt="Logo" width={32} height={32} className="rounded-lg grayscale opacity-70" unoptimized referrerPolicy="no-referrer" />
              ) : (
                <HeartPulse className="w-8 h-8 text-slate-400 dark:text-slate-500" />
              )}
              <span className="text-xl font-bold text-slate-500 dark:text-slate-400 tracking-wider">{appName}</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-slate-500 hover:text-blue-600 dark:hover:text-white transition-colors">Twitter</a>
              <a href="#" className="text-slate-500 hover:text-blue-600 dark:hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="text-slate-500 hover:text-blue-600 dark:hover:text-white transition-colors">Email</a>
            </div>
          </div>
          <div className="text-center text-slate-400 dark:text-slate-600 text-sm">
            &copy; {new Date().getFullYear()} {appName} - Optimalisasi Sistem Pelaporan Mutu Rumah Sakit. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
