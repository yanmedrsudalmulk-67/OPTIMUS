'use client';

import { motion } from 'framer-motion';
import { Activity, Users, Database, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useEffect, useState } from 'react';
import { mockAuth, User } from '@/lib/supabase';

const data = [
  { name: 'Jan', value: 85 },
  { name: 'Feb', value: 88 },
  { name: 'Mar', value: 92 },
  { name: 'Apr', value: 90 },
  { name: 'Mei', value: 95 },
  { name: 'Jun', value: 98 },
];

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(mockAuth.getUser());
  }, []);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-emerald-50 glow-text">Beranda</h1>
          <p className="text-emerald-400/60 mt-1">Selamat datang kembali, {user.username}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Indikator', value: '142', icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { title: 'Data Terkumpul', value: '12.4k', icon: Database, color: 'text-teal-400', bg: 'bg-teal-500/10' },
          { title: 'Unit Aktif', value: '45', icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
          { title: 'Rata-rata Capaian', value: '92%', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-6 rounded-xl border border-emerald-500/20"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-emerald-500/70 uppercase tracking-wider mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold text-emerald-50 glow-text">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-panel p-6 rounded-xl border border-emerald-500/20"
        >
          <h3 className="text-lg font-semibold text-emerald-100 mb-6">Tren Capaian Mutu (6 Bulan Terakhir)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 185, 129, 0.1)" />
                <XAxis dataKey="name" stroke="rgba(16, 185, 129, 0.5)" />
                <YAxis stroke="rgba(16, 185, 129, 0.5)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(2, 20, 10, 0.9)', borderColor: 'rgba(16, 185, 129, 0.3)', borderRadius: '8px' }}
                  itemStyle={{ color: '#34d399' }}
                />
                <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6, fill: '#34d399' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-panel p-6 rounded-xl border border-emerald-500/20"
        >
          <h3 className="text-lg font-semibold text-emerald-100 mb-6">Distribusi Kategori Indikator</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'INM', value: 13 },
                { name: 'IMP-RS', value: 25 },
                { name: 'IMP Unit', value: 80 },
                { name: 'SPM', value: 24 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 185, 129, 0.1)" />
                <XAxis dataKey="name" stroke="rgba(16, 185, 129, 0.5)" />
                <YAxis stroke="rgba(16, 185, 129, 0.5)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(2, 20, 10, 0.9)', borderColor: 'rgba(16, 185, 129, 0.3)', borderRadius: '8px' }}
                  cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
                />
                <Bar dataKey="value" fill="#0f766e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-panel p-6 rounded-xl border border-emerald-500/20 mt-8"
      >
        <h3 className="text-lg font-semibold text-emerald-100 mb-6">Aktivitas Terbaru</h3>
        <div className="space-y-4">
          {[
            { unit: 'IGD', action: 'Input data Waktu Tanggap Pelayanan', time: '10 menit yang lalu', icon: CheckCircle2, color: 'text-emerald-400' },
            { unit: 'Farmasi', action: 'Input data Waktu Tunggu Obat Jadi', time: '1 jam yang lalu', icon: CheckCircle2, color: 'text-emerald-400' },
            { unit: 'Laboratorium', action: 'Belum input data Waktu Tunggu Hasil', time: '3 jam yang lalu', icon: AlertCircle, color: 'text-yellow-400' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-emerald-950/30 border border-emerald-500/10">
              <div className={`mt-1 ${item.color}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-emerald-100 font-medium">{item.unit}</p>
                <p className="text-emerald-400/70 text-sm">{item.action}</p>
              </div>
              <span className="text-xs text-emerald-500/50">{item.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
