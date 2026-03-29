'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Activity, BarChart3, FileText, Settings, Database, ShieldCheck, Stethoscope, Users } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-b border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-8 h-8 text-emerald-400" />
            <span className="text-xl font-bold tracking-wider text-emerald-50 glow-text">OPTIMUS</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
              Masuk
            </Link>
            <Link href="/login" className="px-4 py-2 text-sm font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 rounded-lg hover:bg-emerald-500/30 transition-all glow-box">
              Daftar Unit
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
                <span className="block text-emerald-50 glow-text">OPTIMUS</span>
                <span className="block text-2xl md:text-3xl mt-4 text-emerald-400/80 font-medium">
                  Optimalisasi Sistem Pelaporan Mutu Rumah Sakit
                </span>
              </h1>
              <p className="text-lg text-emerald-100/60 mb-8 max-w-xl leading-relaxed">
                Platform digital terintegrasi untuk pemantauan, pelaporan, dan evaluasi indikator mutu rumah sakit secara real-time dengan antarmuka futuristik.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/login" className="group flex items-center gap-2 px-6 py-3 bg-emerald-500 text-emerald-950 font-semibold rounded-lg hover:bg-emerald-400 transition-all glow-box">
                  Masuk Menu
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="#dashboard-preview" className="flex items-center gap-2 px-6 py-3 bg-emerald-950/50 text-emerald-400 border border-emerald-500/30 font-semibold rounded-lg hover:bg-emerald-900/50 transition-all">
                  Lihat Dashboard
                </Link>
              </div>
            </motion.div>

            {/* Hero Right - Animated Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full" />
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="relative glass-panel rounded-2xl p-4 border border-emerald-500/30 shadow-2xl"
              >
                <div className="flex gap-2 mb-4 border-b border-emerald-500/20 pb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="h-24 rounded-lg bg-emerald-900/40 border border-emerald-500/20 p-4 flex flex-col justify-between">
                    <div className="w-8 h-8 rounded bg-emerald-500/20" />
                    <div className="w-1/2 h-2 rounded bg-emerald-500/40" />
                  </div>
                  <div className="h-24 rounded-lg bg-emerald-900/40 border border-emerald-500/20 p-4 flex flex-col justify-between">
                    <div className="w-8 h-8 rounded bg-teal-500/20" />
                    <div className="w-2/3 h-2 rounded bg-teal-500/40" />
                  </div>
                </div>
                <div className="h-40 rounded-lg bg-emerald-900/40 border border-emerald-500/20 p-4 flex items-end gap-2">
                  {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                      className="flex-1 bg-gradient-to-t from-emerald-500/20 to-emerald-400/60 rounded-t-sm"
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Live Data Section */}
        <section className="py-20 border-y border-emerald-500/10 bg-emerald-950/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { label: 'Total Indikator', value: '142', icon: Activity, color: 'text-emerald-400' },
                { label: 'Data Terkumpul', value: '12,450+', icon: Database, color: 'text-teal-400' },
                { label: 'Unit Terdaftar', value: '45', icon: Users, color: 'text-cyan-400' }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-panel p-6 rounded-xl flex items-center gap-6"
                >
                  <div className={`p-4 rounded-lg bg-emerald-900/50 ${stat.color}`}>
                    <stat.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-emerald-50 glow-text">{stat.value}</div>
                    <div className="text-sm text-emerald-200/60 uppercase tracking-wider mt-1">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-50 glow-text mb-4">Fitur Unggulan</h2>
            <p className="text-emerald-200/60 max-w-2xl mx-auto">Sistem terpadu untuk mengelola seluruh aspek pelaporan mutu rumah sakit.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Input Data', desc: 'Form dinamis dan responsif untuk setiap unit.', icon: FileText },
              { title: 'Monitoring', desc: 'Pantau capaian mutu secara real-time.', icon: Activity },
              { title: 'Grafik Interaktif', desc: 'Visualisasi data yang mudah dipahami.', icon: BarChart3 },
              { title: 'Laporan Otomatis', desc: 'Generate laporan PDF/Excel instan.', icon: Database },
              { title: 'Manajemen Indikator', desc: 'Kelola profil indikator dengan detail.', icon: Settings },
              { title: 'Keamanan RLS', desc: 'Akses data sesuai hak akses unit.', icon: ShieldCheck },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-panel p-6 rounded-xl group"
              >
                <feature.icon className="w-10 h-10 text-emerald-400 mb-4 group-hover:text-emerald-300 transition-colors" />
                <h3 className="text-xl font-semibold text-emerald-50 mb-2">{feature.title}</h3>
                <p className="text-emerald-200/60 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Profil Indikator Preview */}
        <section className="py-24 bg-emerald-950/30 border-t border-emerald-500/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-emerald-50 glow-text mb-6">Kategori Indikator</h2>
                <p className="text-emerald-200/60 mb-8 doc-text">
                  OPTIMUS mendukung berbagai kategori indikator mutu rumah sakit sesuai standar akreditasi dan regulasi Kementerian Kesehatan.
                </p>
                <ul className="space-y-4">
                  {['Indikator Nasional Mutu (INM)', 'Indikator Mutu Prioritas RS (IMP-RS)', 'Indikator Mutu Prioritas Unit (IMP Unit)', 'Standar Pelayanan Minimal (SPM)'].map((item, i) => (
                    <motion.li 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3 text-emerald-100"
                    >
                      <div className="w-2 h-2 rounded-full bg-emerald-400 glow-box" />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="glass-panel rounded-2xl p-8 border border-emerald-500/30">
                   <Stethoscope className="w-16 h-16 text-emerald-500/20 absolute top-4 right-4" />
                   <div className="space-y-6">
                      <div className="h-4 w-1/3 bg-emerald-500/20 rounded" />
                      <div className="h-8 w-3/4 bg-emerald-500/30 rounded" />
                      <div className="space-y-2">
                        <div className="h-2 w-full bg-emerald-500/10 rounded" />
                        <div className="h-2 w-full bg-emerald-500/10 rounded" />
                        <div className="h-2 w-4/5 bg-emerald-500/10 rounded" />
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-emerald-500/20">
                        <div>
                          <div className="text-xs text-emerald-500/50 mb-1">Numerator</div>
                          <div className="h-3 w-full bg-emerald-500/20 rounded" />
                        </div>
                        <div>
                          <div className="text-xs text-emerald-500/50 mb-1">Denominator</div>
                          <div className="h-3 w-full bg-emerald-500/20 rounded" />
                        </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
