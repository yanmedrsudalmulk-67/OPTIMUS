'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  FileEdit, 
  BarChart3, 
  FileText, 
  Settings, 
  LogOut, 
  Menu,
  X,
  Activity,
  ListChecks,
  HeartPulse,
  Sun,
  Moon
} from 'lucide-react';
import { auth, db } from '@/firebase';
import { useAuth } from '@/AuthContext';
import { useTheme } from '@/ThemeContext';
import { toast } from 'sonner';
import { doc, onSnapshot } from 'firebase/firestore';
import Image from 'next/image';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  roles: ('unit' | 'admin')[];
}

const navItems: NavItem[] = [
  { title: 'Beranda', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, roles: ['unit', 'admin'] },
  { title: 'Input Data', href: '/input-data', icon: <FileEdit className="w-5 h-5" />, roles: ['unit', 'admin'] },
  { title: 'Profil Indikator', href: '/profil-indikator', icon: <ListChecks className="w-5 h-5" />, roles: ['admin'] },
  { title: 'Grafik', href: '/grafik', icon: <BarChart3 className="w-5 h-5" />, roles: ['unit', 'admin'] },
  { title: 'Laporan', href: '/laporan', icon: <FileText className="w-5 h-5" />, roles: ['admin'] },
  { title: 'Pengaturan', href: '/pengaturan', icon: <Settings className="w-5 h-5" />, roles: ['admin'] },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const [optimisticPath, setOptimisticPath] = useState(pathname);
  const router = useRouter();
  const { user, profile, isAuthReady } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [appName, setAppName] = useState('OPTIMUS');
  const [logoUrl, setLogoUrl] = useState('');

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'general'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAppName(data.appName || 'OPTIMUS');
        setLogoUrl(data.logoUrl || '');
      }
    }, (error) => {
      console.error("Error fetching settings in layout:", error);
    });
    
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setOptimisticPath(pathname);
  }, [pathname]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const checkMobile = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < 1024);
        if (window.innerWidth >= 1024) {
          setIsSidebarOpen(true);
        } else {
          setIsSidebarOpen(false);
        }
      }, 100);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (isAuthReady && !user) {
      router.push('/');
    }
  }, [user, isAuthReady, router]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await auth.signOut();
      toast.success('Berhasil keluar');
      router.push('/');
    } catch (error) {
      toast.error('Gagal keluar');
      setIsLoggingOut(false);
    }
  };

  if (!isAuthReady || !user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
          <p className="text-[var(--muted-foreground)] font-medium animate-pulse">Memuat OPTIMUS...</p>
        </div>
      </div>
    );
  }

  const filteredNavItems = navItems.filter(item => item.roles.includes(profile.role));

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex overflow-hidden font-sans selection:bg-blue-500/30">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          x: isSidebarOpen ? 0 : -280,
          width: 280
        }}
        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
        className="fixed lg:static inset-y-0 left-0 z-50 bg-white dark:bg-[var(--sidebar)] border-r border-gray-200 dark:border-[var(--sidebar-border)] flex flex-col shadow-[0_0_30px_rgba(0,0,0,0.1)] lg:shadow-none"
      >
        <div className="h-20 flex items-center px-6 border-b border-gray-200 dark:border-[var(--sidebar-border)] justify-between bg-gray-50 dark:bg-[var(--foreground)]/[0.02]">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <Image 
                src={logoUrl} 
                alt="Logo" 
                width={32} 
                height={32} 
                className="rounded-lg object-contain"
                unoptimized
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl text-white shadow-sm">
                <HeartPulse className="w-6 h-6" />
              </div>
            )}
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 tracking-tight">
              {appName}
            </span>
          </div>
          {isMobile && (
            <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-gray-600 dark:text-[var(--muted-foreground)] hover:text-gray-900 dark:hover:text-[var(--foreground)] rounded-lg hover:bg-gray-100 dark:hover:bg-[var(--foreground)]/5 transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <div className="mb-6 px-4">
            <p className="text-xs font-bold text-gray-700 dark:text-[var(--muted-foreground)] uppercase tracking-wider mb-2">Menu Utama</p>
          </div>
          {filteredNavItems.map((item) => {
            const isActive = optimisticPath === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                onClick={() => {
                  setOptimisticPath(item.href);
                  if (isMobile) setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                  isActive 
                    ? 'text-blue-700 dark:text-[var(--foreground)] font-semibold bg-blue-50 dark:bg-blue-500/10' 
                    : 'text-gray-800 dark:text-[var(--muted-foreground)] hover:text-blue-600 dark:hover:text-[var(--foreground)] hover:bg-gray-50 dark:hover:bg-[var(--foreground)]/5'
                }`}
              >
                <div className={`relative z-10 ${isActive ? 'text-blue-600' : 'text-gray-600 group-hover:text-blue-600'} transition-colors`}>
                  {item.icon}
                </div>
                <span className="relative z-10">{item.title}</span>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full shadow-sm" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-[var(--sidebar-border)] bg-gray-50 dark:bg-[var(--foreground)]/[0.02]">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 mb-4 text-gray-800 dark:text-[var(--muted-foreground)] hover:text-blue-600 dark:hover:text-[var(--foreground)] hover:bg-gray-100 dark:hover:bg-[var(--foreground)]/5 rounded-xl transition-all border border-gray-200 dark:border-[var(--sidebar-border)] group bg-white dark:bg-transparent"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-5 h-5 text-yellow-400 group-hover:rotate-45 transition-transform" />
                <span className="font-semibold">Mode Terang</span>
              </>
            ) : (
              <>
                <Moon className="w-5 h-5 text-blue-500 group-hover:-rotate-12 transition-transform" />
                <span className="font-semibold">Mode Gelap</span>
              </>
            )}
          </button>

          <div className="bg-white dark:bg-[var(--foreground)]/5 rounded-2xl p-4 mb-4 border border-gray-200 dark:border-[var(--sidebar-border)] shadow-sm">
            <p className="text-sm font-bold text-gray-900 dark:text-[var(--foreground)] truncate">{profile.username}</p>
            <p className="text-xs text-gray-600 dark:text-[var(--muted-foreground)] capitalize mt-0.5 font-medium">{profile.role === 'admin' ? 'Tim Mutu RS' : 'Unit'}</p>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-medium disabled:opacity-50"
          >
            {isLoggingOut ? (
              <div className="w-5 h-5 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
            ) : (
              <LogOut className="w-5 h-5" />
            )}
            {isLoggingOut ? 'Keluar...' : 'Keluar'}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {/* Background Glows for Main Content Area */}
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none" />

        {/* Header (Mobile) */}
        <header className="lg:hidden h-16 bg-white/80 dark:bg-[var(--sidebar)]/80 backdrop-blur-md border-b border-gray-200 dark:border-[var(--sidebar-border)] flex items-center px-4 justify-between shrink-0 z-30">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <Image 
                src={logoUrl} 
                alt="Logo" 
                width={28} 
                height={28} 
                className="rounded-lg object-contain"
                unoptimized
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-1.5 rounded-lg text-white shadow-sm">
                <HeartPulse className="w-5 h-5" />
              </div>
            )}
            <span className="font-bold text-gray-600 dark:text-[var(--foreground)] tracking-wide">{appName}</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-600 dark:text-[var(--muted-foreground)] hover:text-blue-600 dark:hover:text-[var(--foreground)] rounded-lg hover:bg-gray-100 dark:hover:bg-[var(--foreground)]/10 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 lg:p-8 relative z-10 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
