'use client';

import { useAuth } from '@/AuthContext';
import { motion } from 'motion/react';
import { Activity, TrendingUp, Users, CheckCircle2, BarChart3, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase';
import dynamic from 'next/dynamic';

const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const AreaChart = dynamic(() => import('recharts').then(mod => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then(mod => mod.Area), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });

export default function Dashboard() {
  const { profile, isAuthReady } = useAuth();
  const [stats, setStats] = useState({
    totalIndikator: 0,
    rataRataCapaian: 0,
    totalUnit: 0,
    dataInputted: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!isAuthReady || !profile) return;
      
      try {
        // Fetch total indicators
        const indikatorSnapshot = await getDocs(collection(db, 'indikator_master'));
        const totalIndikator = indikatorSnapshot.size;

        // Fetch total units (admin only)
        let totalUnit = 0;
        if (profile.role === 'admin') {
          const usersSnapshot = await getDocs(query(collection(db, 'users'), where('role', '==', 'unit')));
          totalUnit = usersSnapshot.size;
        }

        // Fetch data inputted
        let dataQuery = collection(db, 'data_indikator');
        if (profile.role === 'unit') {
          dataQuery = query(collection(db, 'data_indikator'), where('created_by', '==', profile.uid)) as any;
        }
        
        const dataSnapshot = await getDocs(dataQuery);
        const dataInputted = dataSnapshot.size;

        // Calculate average achievement
        let totalCapaian = 0;
        const monthlyData: Record<string, number[]> = {};
        
        dataSnapshot.forEach(doc => {
          const data = doc.data();
          totalCapaian += data.nilai || 0;
          
          const monthKey = `${data.tahun}-${String(data.bulan).padStart(2, '0')}`;
          if (!monthlyData[monthKey]) monthlyData[monthKey] = [];
          monthlyData[monthKey].push(data.nilai || 0);
        });

        const rataRataCapaian = dataInputted > 0 ? (totalCapaian / dataInputted) : 0;

        // Prepare chart data
        const formattedChartData = Object.keys(monthlyData).sort().map(key => {
          const capaianArray = monthlyData[key];
          const avg = capaianArray.reduce((sum, val) => sum + val, 0) / capaianArray.length;
          const [year, month] = key.split('-');
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
          return {
            name: `${monthNames[parseInt(month) - 1]} ${year}`,
            capaian: parseFloat(avg.toFixed(2))
          };
        }).slice(-6); // Last 6 months

        setStats({
          totalIndikator,
          rataRataCapaian: parseFloat(rataRataCapaian.toFixed(2)),
          totalUnit,
          dataInputted
        });
        setChartData(formattedChartData);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [profile, isAuthReady]);

  if (!profile) return null;

  const StatCard = ({ title, value, icon: Icon, color, delay, gradient }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl bg-white dark:bg-[var(--card)] border border-gray-200 dark:border-[var(--border)] p-6 group hover:border-blue-500/30 transition-all duration-300 shadow-sm hover:shadow-md"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
      <div className="relative z-10 flex items-center gap-4">
        <div className={`p-4 rounded-2xl ${color} bg-opacity-10 border border-${color.split('-')[1]}-500/20 shadow-sm`}>
          <Icon className={`w-8 h-8 ${color.replace('bg-', 'text-')}`} />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-600 dark:text-slate-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-[var(--foreground)] tracking-tight">
            {loading ? <div className="h-8 w-16 bg-gray-200 dark:bg-[var(--foreground)]/10 rounded animate-pulse" /> : value}
          </h3>
        </div>
      </div>
      {/* Abstract background line */}
      <svg className="absolute bottom-0 right-0 w-32 h-32 opacity-10 transform translate-x-8 translate-y-8 group-hover:scale-110 transition-transform duration-500" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 90 L40 40 L60 60 L90 10" stroke="currentColor" className={color.replace('bg-', 'text-')} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </motion.div>
  );

  return (
    <div className="relative overflow-hidden transition-colors duration-300">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none opacity-50 dark:opacity-100" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none opacity-50 dark:opacity-100" />

        <div className="relative z-10">
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 dark:text-blue-400 text-xs font-medium mb-4">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                Sistem Pelaporan Mutu RSUD Al-Mulk
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-gray-900 dark:text-white">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Dashboard</span>
                <span className="text-blue-500 dark:text-blue-400">.</span>
              </h1>
              <p className="text-gray-800 dark:text-slate-400 text-lg leading-relaxed">Ringkasan performa mutu rumah sakit secara real-time.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-xl bg-white dark:bg-[var(--card)] border border-gray-200 dark:border-[var(--border)] backdrop-blur-md flex items-center gap-2 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-sm font-semibold text-gray-800 dark:text-slate-300">Live Sync</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard 
              title="Total Indikator" 
              value={stats.totalIndikator} 
              icon={Activity} 
              color="bg-blue-600" 
              gradient="from-blue-600/20 to-transparent"
              delay={0.1} 
            />
            <StatCard 
              title="Rata-rata Capaian" 
              value={`${stats.rataRataCapaian}%`} 
              icon={TrendingUp} 
              color="bg-blue-600" 
              gradient="from-blue-600/20 to-transparent"
              delay={0.2} 
            />
            {profile.role === 'admin' && (
              <StatCard 
                title="Total Unit" 
                value={stats.totalUnit} 
                icon={Users} 
                color="bg-purple-600" 
                gradient="from-purple-600/20 to-transparent"
                delay={0.3} 
              />
            )}
            <StatCard 
              title="Data Diinput" 
              value={stats.dataInputted} 
              icon={CheckCircle2} 
              color="bg-blue-500" 
              gradient="from-blue-500/20 to-transparent"
              delay={0.4} 
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="rounded-3xl bg-white dark:bg-[var(--card)] border border-gray-200 dark:border-[var(--border)] p-6 md:p-8 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-[var(--foreground)] mb-2 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                  Tren Capaian Mutu
                </h2>
                <p className="text-gray-600 dark:text-slate-400 leading-relaxed">Rata-rata capaian dari seluruh indikator yang diinput (6 Bulan Terakhir)</p>
              </div>
              <div className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-[var(--background)] border border-gray-200 dark:border-[var(--border)] text-sm font-semibold text-gray-800 dark:text-slate-300">
                Periode: {chartData.length > 0 ? `${chartData[0].name} - ${chartData[chartData.length - 1].name}` : 'N/A'}
              </div>
            </div>
            
            <div className="h-96 w-full relative z-10">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-[var(--border)] border-t-blue-500 rounded-full animate-spin shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                </div>
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCapaian" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--foreground)', fontSize: 12, opacity: 0.6 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--foreground)', fontSize: 12, opacity: 0.6 }} domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--card)', 
                        backdropFilter: 'blur(10px)',
                        borderRadius: '16px', 
                        border: '1px solid var(--border)', 
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                        color: 'var(--foreground)'
                      }}
                      itemStyle={{ color: 'var(--chart-1)', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="capaian" stroke="var(--chart-1)" strokeWidth={3} fillOpacity={1} fill="url(#colorCapaian)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                  <BarChart3 className="w-16 h-16 mb-4 opacity-20" />
                  <p className="text-lg">Belum ada data capaian</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
  );
}
