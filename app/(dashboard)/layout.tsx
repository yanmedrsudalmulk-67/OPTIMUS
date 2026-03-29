'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Activity, Home, FileEdit, BarChart2, FileText, Settings, 
  LogOut, Menu, X, Database, ShieldCheck, User as UserIcon
} from 'lucide-react';
import { mockAuth, User } from '@/lib/supabase';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const currentUser = mockAuth.getUser();
    if (!currentUser) {
      router.push('/login');
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(currentUser);
    }
  }, [router]);

  if (!user) return null;

  const menuItems = [
    { name: 'Beranda', path: '/dashboard', icon: Home, roles: ['UNIT', 'TIM_MUTU'] },
    { name: 'Input Data', path: '/input-data', icon: FileEdit, roles: ['UNIT', 'TIM_MUTU'] },
    { name: 'Profil Indikator', path: '/profil-indikator', icon: Database, roles: ['TIM_MUTU'] },
    { name: 'Grafik', path: '/grafik', icon: BarChart2, roles: ['UNIT', 'TIM_MUTU'] },
    { name: 'Laporan', path: '/laporan', icon: FileText, roles: ['TIM_MUTU'] },
    { name: 'Pengaturan', path: '/pengaturan', icon: Settings, roles: ['TIM_MUTU'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(user.role));

  const handleLogout = () => {
    mockAuth.logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-emerald-950/10 flex overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="fixed inset-y-0 left-0 z-50 w-64 glass-panel border-r border-emerald-500/20 flex flex-col"
          >
            <div className="h-16 flex items-center px-6 border-b border-emerald-500/20">
              <Activity className="w-6 h-6 text-emerald-400 mr-2" />
              <span className="text-lg font-bold tracking-wider text-emerald-50 glow-text">OPTIMUS</span>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
              <div className="mb-6 px-2">
                <p className="text-xs font-semibold text-emerald-500/60 uppercase tracking-wider mb-2">Menu Utama</p>
                {filteredMenu.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                        isActive 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 glow-box' 
                          : 'text-emerald-100/70 hover:bg-emerald-500/10 hover:text-emerald-100'
                      }`}
                    >
                      <item.icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-emerald-500/70'}`} />
                      <span className="font-medium text-sm">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="p-4 border-t border-emerald-500/20">
              <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-emerald-950/40 border border-emerald-500/20 mb-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-emerald-100 truncate">{user.username}</p>
                  <p className="text-xs text-emerald-500/70 truncate flex items-center gap-1">
                    {user.role === 'TIM_MUTU' ? <ShieldCheck className="w-3 h-3" /> : null}
                    {user.role === 'TIM_MUTU' ? 'Administrator' : 'Unit Pelapor'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium text-sm">Keluar</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Topbar */}
        <header className="h-16 glass-panel border-b border-emerald-500/20 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-40">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-emerald-400/80">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
