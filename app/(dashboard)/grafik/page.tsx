'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, AreaChart, Area, Cell } from 'recharts';
import { Filter, Download } from 'lucide-react';

const mockDataBulanan = [
  { name: 'Jan', INM: 85, IMPRS: 80, IMPUnit: 90, SPM: 88 },
  { name: 'Feb', INM: 88, IMPRS: 82, IMPUnit: 92, SPM: 90 },
  { name: 'Mar', INM: 92, IMPRS: 85, IMPUnit: 95, SPM: 91 },
  { name: 'Apr', INM: 90, IMPRS: 88, IMPUnit: 94, SPM: 93 },
  { name: 'Mei', INM: 95, IMPRS: 90, IMPUnit: 97, SPM: 95 },
  { name: 'Jun', INM: 98, IMPRS: 92, IMPUnit: 98, SPM: 96 },
];

const mockDataUnit = [
  { name: 'IGD', capaian: 95 },
  { name: 'Rawat Jalan', capaian: 88 },
  { name: 'Rawat Inap', capaian: 92 },
  { name: 'Farmasi', capaian: 98 },
  { name: 'Laboratorium', capaian: 90 },
  { name: 'Radiologi', capaian: 94 },
];

export default function GrafikPage() {
  const [filterBulan, setFilterBulan] = useState('6');
  const [filterKategori, setFilterKategori] = useState('semua');

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-emerald-50 glow-text">Analisis Grafik</h1>
          <p className="text-emerald-400/60 mt-2">Visualisasi data capaian indikator mutu secara komprehensif.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="glass-panel px-4 py-2 rounded-lg border border-emerald-500/30 flex items-center gap-2">
            <Filter className="w-4 h-4 text-emerald-400" />
            <select 
              value={filterBulan}
              onChange={(e) => setFilterBulan(e.target.value)}
              className="bg-transparent text-emerald-100 text-sm focus:outline-none appearance-none cursor-pointer"
            >
              <option value="3" className="bg-emerald-950">3 Bulan Terakhir</option>
              <option value="6" className="bg-emerald-950">6 Bulan Terakhir</option>
              <option value="12" className="bg-emerald-950">1 Tahun Terakhir</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 rounded-lg hover:bg-emerald-500/30 transition-all glow-box text-sm font-medium">
            <Download className="w-4 h-4" />
            Export Chart
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Tren Capaian Keseluruhan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 rounded-xl border border-emerald-500/20 lg:col-span-2"
        >
          <h3 className="text-lg font-semibold text-emerald-100 mb-6">Tren Capaian per Kategori (Bulanan)</h3>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockDataBulanan}>
                <defs>
                  <linearGradient id="colorINM" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorIMP" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 185, 129, 0.1)" />
                <XAxis dataKey="name" stroke="rgba(16, 185, 129, 0.5)" />
                <YAxis stroke="rgba(16, 185, 129, 0.5)" domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(2, 20, 10, 0.9)', borderColor: 'rgba(16, 185, 129, 0.3)', borderRadius: '8px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Legend />
                <Area type="monotone" dataKey="INM" stroke="#10b981" fillOpacity={1} fill="url(#colorINM)" />
                <Area type="monotone" dataKey="IMPRS" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorIMP)" />
                <Area type="monotone" dataKey="IMPUnit" stroke="#f59e0b" fillOpacity={0.1} fill="#f59e0b" />
                <Area type="monotone" dataKey="SPM" stroke="#8b5cf6" fillOpacity={0.1} fill="#8b5cf6" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Capaian per Unit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-6 rounded-xl border border-emerald-500/20"
        >
          <h3 className="text-lg font-semibold text-emerald-100 mb-6">Rata-rata Capaian per Unit</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockDataUnit} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 185, 129, 0.1)" horizontal={true} vertical={false} />
                <XAxis type="number" domain={[0, 100]} stroke="rgba(16, 185, 129, 0.5)" />
                <YAxis dataKey="name" type="category" stroke="rgba(16, 185, 129, 0.8)" width={80} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(2, 20, 10, 0.9)', borderColor: 'rgba(16, 185, 129, 0.3)', borderRadius: '8px' }}
                  cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
                />
                <Bar dataKey="capaian" fill="#0f766e" radius={[0, 4, 4, 0]} barSize={20}>
                  {
                    mockDataUnit.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.capaian >= 90 ? '#10b981' : entry.capaian >= 80 ? '#f59e0b' : '#ef4444'} />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Capaian Indikator Spesifik */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel p-6 rounded-xl border border-emerald-500/20"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-emerald-100">Tren Indikator Spesifik</h3>
            <select className="bg-emerald-950/50 border border-emerald-500/30 rounded text-xs text-emerald-300 px-2 py-1 focus:outline-none">
              <option>Kepatuhan Cuci Tangan</option>
              <option>Waktu Tanggap IGD</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockDataBulanan}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 185, 129, 0.1)" />
                <XAxis dataKey="name" stroke="rgba(16, 185, 129, 0.5)" />
                <YAxis stroke="rgba(16, 185, 129, 0.5)" domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(2, 20, 10, 0.9)', borderColor: 'rgba(16, 185, 129, 0.3)', borderRadius: '8px' }}
                />
                {/* Target Line */}
                <Line type="step" dataKey={() => 85} stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Target (85%)" />
                <Line type="monotone" dataKey="INM" stroke="#34d399" strokeWidth={3} dot={{ r: 4, fill: '#34d399' }} name="Capaian" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
