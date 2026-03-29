'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, FileText, X, Save, CheckSquare } from 'lucide-react';

const categories = ['Semua', 'INM', 'IMP-RS', 'IMP Unit', 'SPM'];

const mockData = [
  { id: 1, judul: 'Kepatuhan Kebersihan Tangan', kategori: 'INM', unit: 'Semua Unit', target: '≥ 85 %' },
  { id: 2, judul: 'Waktu Tanggap Pelayanan IGD', kategori: 'IMP-RS', unit: 'IGD', target: '≤ 5 Menit' },
  { id: 3, judul: 'Waktu Tunggu Obat Jadi', kategori: 'IMP Unit', unit: 'Farmasi', target: '≤ 30 Menit' },
];

export default function ProfilIndikatorPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState('Semua');

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-emerald-50 glow-text">Profil Indikator</h1>
          <p className="text-emerald-400/60 mt-2">Manajemen master data indikator mutu rumah sakit.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-emerald-950 font-semibold rounded-lg hover:bg-emerald-400 transition-all glow-box"
          >
            <Plus className="w-5 h-5" />
            Tambah Indikator
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!isAdding ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Filters */}
            <div className="glass-panel p-4 rounded-xl border border-emerald-500/20 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveTab(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                      activeTab === cat 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 glow-box' 
                        : 'text-emerald-500/70 hover:bg-emerald-500/10 hover:text-emerald-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/50" />
                <input 
                  type="text" 
                  placeholder="Cari indikator..." 
                  className="w-full bg-emerald-950/40 border border-emerald-500/30 rounded-lg py-2 pl-9 pr-4 text-sm text-emerald-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
                />
              </div>
            </div>

            {/* Table */}
            <div className="glass-panel rounded-xl border border-emerald-500/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-emerald-100">
                  <thead className="bg-emerald-950/60 text-emerald-400/80 uppercase tracking-wider border-b border-emerald-500/20">
                    <tr>
                      <th className="px-6 py-4 font-medium">Judul Indikator</th>
                      <th className="px-6 py-4 font-medium">Kategori</th>
                      <th className="px-6 py-4 font-medium">Unit PIC</th>
                      <th className="px-6 py-4 font-medium">Target</th>
                      <th className="px-6 py-4 font-medium text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-500/10">
                    {mockData.filter(d => activeTab === 'Semua' || d.kategori === activeTab).map((row) => (
                      <tr key={row.id} className="hover:bg-emerald-500/5 transition-colors">
                        <td className="px-6 py-4 font-medium text-emerald-50">{row.judul}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                            {row.kategori}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-emerald-200/80">{row.unit}</td>
                        <td className="px-6 py-4 text-emerald-400 font-mono">{row.target}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-emerald-500 hover:text-emerald-300 transition-colors">
                            <FileText className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-panel p-8 rounded-2xl border border-emerald-500/30 shadow-xl"
          >
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-emerald-500/20">
              <h2 className="text-2xl font-bold text-emerald-50 glow-text flex items-center gap-3">
                <FileText className="w-6 h-6 text-emerald-400" />
                Form Profil Indikator Baru
              </h2>
              <button 
                onClick={() => setIsAdding(false)}
                className="p-2 rounded-lg text-emerald-500/70 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); alert('Disimpan!'); setIsAdding(false); }}>
              {/* Section 1: Identitas */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-emerald-300 border-l-4 border-emerald-500 pl-3">Identitas Indikator</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-emerald-400/80 mb-2 uppercase tracking-wider">Kategori</label>
                    <select className="w-full bg-emerald-950/40 border border-emerald-500/30 rounded-lg py-2.5 px-4 text-emerald-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all appearance-none">
                      <option value="inm">INM</option>
                      <option value="imp-rs">IMP-RS</option>
                      <option value="imp-unit">IMP Unit</option>
                      <option value="spm">SPM</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-emerald-400/80 mb-2 uppercase tracking-wider">Tipe Indikator</label>
                    <select className="w-full bg-emerald-950/40 border border-emerald-500/30 rounded-lg py-2.5 px-4 text-emerald-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all appearance-none">
                      <option value="struktur">Struktur</option>
                      <option value="proses">Proses</option>
                      <option value="outcome">Outcome</option>
                      <option value="proses-outcome">Proses & Outcome</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-emerald-400/80 mb-2 uppercase tracking-wider">Judul Indikator</label>
                  <input type="text" className="w-full bg-emerald-950/40 border border-emerald-500/30 rounded-lg py-2.5 px-4 text-emerald-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all" placeholder="Contoh: Kepatuhan Kebersihan Tangan" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-emerald-400/80 mb-2 uppercase tracking-wider">Dasar Pemikiran</label>
                  <textarea rows={3} className="w-full bg-emerald-950/40 border border-emerald-500/30 rounded-lg py-2.5 px-4 text-emerald-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all doc-text" placeholder="Dasar hukum atau literatur..."></textarea>
                </div>

                <div>
                  <label className="block text-xs font-medium text-emerald-400/80 mb-2 uppercase tracking-wider">Dimensi Mutu</label>
                  <input type="text" className="w-full bg-emerald-950/40 border border-emerald-500/30 rounded-lg py-2.5 px-4 text-emerald-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all" placeholder="Contoh: Keselamatan, Efektivitas" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-emerald-400/80 mb-2 uppercase tracking-wider">Tujuan</label>
                  <textarea rows={2} className="w-full bg-emerald-950/40 border border-emerald-500/30 rounded-lg py-2.5 px-4 text-emerald-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all doc-text" placeholder="Tujuan pengukuran indikator..."></textarea>
                </div>

                <div>
                  <label className="block text-xs font-medium text-emerald-400/80 mb-2 uppercase tracking-wider">Definisi Operasional</label>
                  <textarea rows={4} className="w-full bg-emerald-950/40 border border-emerald-500/30 rounded-lg py-2.5 px-4 text-emerald-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all doc-text" placeholder="Penjelasan detail mengenai indikator..."></textarea>
                </div>
              </div>

              {/* Section 2: Pengukuran */}
              <div className="space-y-6 pt-6 border-t border-emerald-500/20">
                <h3 className="text-lg font-semibold text-emerald-300 border-l-4 border-emerald-500 pl-3">Pengukuran & Formula</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-emerald-400/80 mb-2 uppercase tracking-wider">Numerator (Pembilang)</label>
                    <textarea rows={2} className="w-full bg-emerald-950/40 border border-emerald-500/30 rounded-lg py-2.5 px-4 text-emerald-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all doc-text" placeholder="Jumlah kejadian yang diukur..."></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-emerald-400/80 mb-2 uppercase tracking-wider">Denominator (Penyebut)</label>
                    <textarea rows={2} className="w-full bg-emerald-950/40 border border-emerald-500/30 rounded-lg py-2.5 px-4 text-emerald-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all doc-text" placeholder="Jumlah keseluruhan populasi/sampel..."></textarea>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-emerald-400/80 mb-2 uppercase tracking-wider">Formula</label>
                  <div className="p-4 bg-emerald-950/60 border border-emerald-500/20 rounded-lg text-center font-mono text-emerald-300">
                    (Numerator / Denominator) × 100%
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-emerald-400/80 mb-2 uppercase tracking-wider">Target</label>
                    <input type="text" className="w-full bg-emerald-950/40 border border-emerald-500/30 rounded-lg py-2.5 px-4 text-emerald-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all font-mono" placeholder="Contoh: ≥ 85 %" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-emerald-400/80 mb-2 uppercase tracking-wider">Satuan</label>
                    <input type="text" className="w-full bg-emerald-950/40 border border-emerald-500/30 rounded-lg py-2.5 px-4 text-emerald-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all" placeholder="Contoh: Persentase (%), Menit" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-emerald-400/80 mb-2 uppercase tracking-wider">Kriteria Inklusi & Eksklusi</label>
                  <textarea rows={3} className="w-full bg-emerald-950/40 border border-emerald-500/30 rounded-lg py-2.5 px-4 text-emerald-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all doc-text" placeholder="Inklusi: ...&#10;Eksklusi: ..."></textarea>
                </div>
              </div>

              {/* Section 3: Metodologi */}
              <div className="space-y-6 pt-6 border-t border-emerald-500/20">
                <h3 className="text-lg font-semibold text-emerald-300 border-l-4 border-emerald-500 pl-3">Metodologi & Pelaporan</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-emerald-400/80 mb-2 uppercase tracking-wider">Sumber Data</label>
                    <input type="text" className="w-full bg-emerald-950/40 border border-emerald-500/30 rounded-lg py-2.5 px-4 text-emerald-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all" placeholder="Contoh: Rekam Medis, Observasi" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-emerald-400/80 mb-2 uppercase tracking-wider">Instrumen Pengumpulan Data</label>
                    <input type="text" className="w-full bg-emerald-950/40 border border-emerald-500/30 rounded-lg py-2.5 px-4 text-emerald-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all" placeholder="Contoh: Formulir Sensus Harian" />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-emerald-400/80 mb-2 uppercase tracking-wider">Metode Pengumpulan</label>
                    <select className="w-full bg-emerald-950/40 border border-emerald-500/30 rounded-lg py-2.5 px-4 text-emerald-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all appearance-none">
                      <option value="retrospektif">Retrospektif</option>
                      <option value="konkuren">Konkuren</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-emerald-400/80 mb-2 uppercase tracking-wider">Cara Sampling</label>
                    <select className="w-full bg-emerald-950/40 border border-emerald-500/30 rounded-lg py-2.5 px-4 text-emerald-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all appearance-none">
                      <option value="total">Total Sampling</option>
                      <option value="purposive">Purposive Sampling</option>
                      <option value="random">Simple Random Sampling</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-emerald-400/80 mb-2 uppercase tracking-wider">Besar Sampel</label>
                    <input type="text" className="w-full bg-emerald-950/40 border border-emerald-500/30 rounded-lg py-2.5 px-4 text-emerald-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all" placeholder="Contoh: N=100" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-emerald-400/80 mb-2 uppercase tracking-wider">Periode Pengumpulan Data</label>
                    <select className="w-full bg-emerald-950/40 border border-emerald-500/30 rounded-lg py-2.5 px-4 text-emerald-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all appearance-none">
                      <option value="harian">Harian</option>
                      <option value="mingguan">Mingguan</option>
                      <option value="bulanan">Bulanan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-emerald-400/80 mb-2 uppercase tracking-wider">Penanggung Jawab (PIC)</label>
                    <input type="text" className="w-full bg-emerald-950/40 border border-emerald-500/30 rounded-lg py-2.5 px-4 text-emerald-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all" placeholder="Contoh: Kepala Ruang IGD" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-emerald-400/80 mb-3 uppercase tracking-wider">Periode Analisis (Multi Select)</label>
                    <div className="space-y-2">
                      {['Bulanan', 'Triwulan', 'Semester', 'Tahunan'].map(item => (
                        <label key={item} className="flex items-center gap-3 cursor-pointer group">
                          <div className="w-5 h-5 rounded border border-emerald-500/50 flex items-center justify-center bg-emerald-950/40 group-hover:border-emerald-400 transition-colors">
                            <CheckSquare className="w-3.5 h-3.5 text-emerald-400 opacity-0 group-hover:opacity-50" />
                          </div>
                          <span className="text-emerald-100/80 text-sm">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-emerald-400/80 mb-3 uppercase tracking-wider">Penyajian Data (Multi Select)</label>
                    <div className="space-y-2">
                      {['Tabel', 'Grafik Batang', 'Grafik Garis', 'Run Chart', 'Control Chart'].map(item => (
                        <label key={item} className="flex items-center gap-3 cursor-pointer group">
                          <div className="w-5 h-5 rounded border border-emerald-500/50 flex items-center justify-center bg-emerald-950/40 group-hover:border-emerald-400 transition-colors">
                            <CheckSquare className="w-3.5 h-3.5 text-emerald-400 opacity-0 group-hover:opacity-50" />
                          </div>
                          <span className="text-emerald-100/80 text-sm">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-emerald-500/20 flex justify-end gap-4">
                <button 
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-6 py-3 rounded-lg font-medium text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex items-center gap-2 px-8 py-3 bg-emerald-500 text-emerald-950 font-bold rounded-lg hover:bg-emerald-400 transition-all glow-box"
                >
                  <Save className="w-5 h-5" />
                  Simpan Profil
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
