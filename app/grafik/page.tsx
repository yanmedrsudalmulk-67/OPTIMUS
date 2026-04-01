'use client';

import { useAuth } from '@/AuthContext';
import { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/firebase';
import { motion } from 'motion/react';
import dynamic from 'next/dynamic';
import { BarChart3, Filter, LineChart as LineChartIcon } from 'lucide-react';

const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const AreaChart = dynamic(() => import('recharts').then(mod => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then(mod => mod.Area), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const Legend = dynamic(() => import('recharts').then(mod => mod.Legend), { ssr: false });

export default function Grafik() {
  const { profile, isAuthReady } = useAuth();
  const [rawData, setRawData] = useState<any[]>([]);
  const [indikatorList, setIndikatorList] = useState<any[]>([]);
  const [selectedIndikator, setSelectedIndikator] = useState<string>('all');
  const [tahun, setTahun] = useState<number>(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIndikator = async () => {
      if (!isAuthReady) return;
      try {
        const q = query(collection(db, 'indikator_master'), orderBy('judul', 'asc'));
        const snapshot = await getDocs(q);
        const list: any[] = [];
        snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
        setIndikatorList(list);
      } catch (error) {
        console.error("Error fetching indikator:", error);
      }
    };
    fetchIndikator();
  }, [isAuthReady]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthReady || !profile) return;
      setLoading(true);
      
      try {
        let q;
        
        if (profile.role === 'unit') {
          q = query(collection(db, 'data_indikator'), where('created_by', '==', profile.uid), where('tahun', '==', tahun));
        } else {
          q = query(collection(db, 'data_indikator'), where('tahun', '==', tahun));
        }

        const snapshot = await getDocs(q);
        const fetched: any[] = [];
        snapshot.forEach(doc => fetched.push(doc.data()));
        setRawData(fetched);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [profile, isAuthReady, tahun]);

  const chartData = useMemo(() => {
    const monthlyData: any = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
    
    months.forEach((m, i) => {
      monthlyData[i + 1] = { name: m, capaian: 0, count: 0 };
    });

    rawData.forEach(d => {
      if (selectedIndikator === 'all' || d.indikator_id === selectedIndikator) {
        monthlyData[d.bulan].capaian += d.nilai;
        monthlyData[d.bulan].count += 1;
      }
    });

    return Object.keys(monthlyData).map(key => {
      const item = monthlyData[key];
      return {
        name: item.name,
        capaian: item.count > 0 ? parseFloat((item.capaian / item.count).toFixed(2)) : 0
      };
    });
  }, [rawData, selectedIndikator]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <>
      <div className="mb-8 relative z-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-[var(--foreground)] tracking-tight flex items-center gap-3">
          <LineChartIcon className="w-8 h-8 text-emerald-600" />
          Grafik Capaian
        </h1>
        <p className="text-gray-600 dark:text-[var(--muted-foreground)] mt-2 leading-relaxed">Visualisasi data capaian indikator mutu</p>
      </div>

      <div className="bg-white dark:bg-[var(--card)] rounded-3xl shadow-xl border border-gray-200 dark:border-[var(--border)] p-6 mb-8 relative overflow-hidden transition-all duration-300">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="flex flex-col md:flex-row gap-4 mb-6 relative z-10">
          <div className="relative flex-1">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[var(--muted-foreground)] w-5 h-5" />
            <select
              value={selectedIndikator}
              onChange={(e) => setSelectedIndikator(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-[var(--border)] rounded-xl focus:ring-2 focus:ring-emerald-500 bg-gray-50 dark:bg-[var(--background)] text-gray-900 dark:text-[var(--foreground)] appearance-none outline-none transition-all font-bold"
            >
              <option value="all" className="bg-white dark:bg-[var(--card)] text-gray-900 dark:text-[var(--foreground)]">Semua Indikator (Rata-rata)</option>
              {indikatorList.map(ind => (
                <option key={ind.id} value={ind.id} className="bg-white dark:bg-[var(--card)] text-gray-900 dark:text-[var(--foreground)]">{ind.judul}</option>
              ))}
            </select>
          </div>
          <div className="relative min-w-[150px]">
            <select
              value={tahun}
              onChange={(e) => setTahun(parseInt(e.target.value))}
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-[var(--border)] rounded-xl focus:ring-2 focus:ring-emerald-500 bg-gray-50 dark:bg-[var(--background)] text-gray-900 dark:text-[var(--foreground)] appearance-none outline-none transition-all font-bold"
            >
              {years.map(y => (
                <option key={y} value={y} className="bg-white dark:bg-[var(--card)] text-gray-900 dark:text-[var(--foreground)]">Tahun {y}</option>
              ))}
            </select>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-[400px] w-full relative z-10"
        >
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
            </div>
          ) : chartData.some(d => d.capaian > 0) ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
                <defs>
                  <linearGradient id="colorCapaian" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} domain={[0, 100]} />
                <Tooltip 
                  cursor={{ stroke: 'var(--border)', strokeWidth: 1, strokeDasharray: '5 5' }}
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    borderRadius: '12px', 
                    border: '1px solid var(--border)', 
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    color: 'var(--foreground)'
                  }}
                  itemStyle={{ color: 'var(--chart-1)', fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Area 
                  type="monotone" 
                  dataKey="capaian" 
                  name="Capaian (%)" 
                  stroke="var(--chart-1)" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorCapaian)"
                  activeDot={{ r: 6, fill: 'var(--chart-1)', strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 dark:text-[var(--muted-foreground)]">
              <BarChart3 className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-bold text-gray-900 dark:text-[var(--foreground)]/60">Belum ada data</p>
              <p className="text-sm font-medium text-gray-600 dark:text-[var(--muted-foreground)]">Tidak ada data capaian untuk filter yang dipilih.</p>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}
