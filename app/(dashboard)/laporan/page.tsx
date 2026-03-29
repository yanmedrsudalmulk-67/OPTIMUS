'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, Filter, FileSpreadsheet } from 'lucide-react';

export default function LaporanPage() {
  const [periode, setPeriode] = useState('bulanan');
  const [bulan, setBulan] = useState('06');
  const [tahun, setTahun] = useState('2026');

  const handleExport = (type: 'pdf' | 'excel') => {
    alert(`Mengekspor laporan ke ${type.toUpperCase()}... (Mock)`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-emerald-50 glow-text">Laporan Mutu</h1>
        <p className="text-emerald-400/60 mt-2">Generate dan unduh laporan capaian indikator mutu rumah sakit.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 md:p-8 rounded-2xl border border-emerald-500/30 shadow-xl"
      >
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Filter Periode */}
          <div>
            <label className="block text-xs font-medium text-emerald-400/80 mb-2 uppercase tracking-wider flex items-center gap-2">
              <Filter className="w-4 h-4" /> Jenis Laporan
            </label>
            <select 
              value={periode}
              onChange={(e) => setPeriode(e.target.value)}
              className="w-full bg-emerald-950/40 border border-emerald-500/30 rounded-lg py-3 px-4 text-emerald-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all appearance-none"
            >
              <option value="bulanan">Laporan Bulanan</option>
              <option value="triwulan">Laporan Triwulan</option>
              <option value="tahunan">Laporan Tahunan</option>
            </select>
          </div>

          {/* Filter Waktu */}
          {periode === 'bulanan' && (
            <div>
              <label className="block text-xs font-medium text-emerald-400/80 mb-2 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Bulan
              </label>
              <select 
                value={bulan}
                onChange={(e) => setBulan(e.target.value)}
                className="w-full bg-emerald-950/40 border border-emerald-500/30 rounded-lg py-3 px-4 text-emerald-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all appearance-none"
              >
                <option value="01">Januari</option>
                <option value="02">Februari</option>
                <option value="03">Maret</option>
                <option value="04">April</option>
                <option value="05">Mei</option>
                <option value="06">Juni</option>
                <option value="07">Juli</option>
                <option value="08">Agustus</option>
                <option value="09">September</option>
                <option value="10">Oktober</option>
                <option value="11">November</option>
                <option value="12">Desember</option>
              </select>
            </div>
          )}

          {periode === 'triwulan' && (
            <div>
              <label className="block text-xs font-medium text-emerald-400/80 mb-2 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Triwulan
              </label>
              <select className="w-full bg-emerald-950/40 border border-emerald-500/30 rounded-lg py-3 px-4 text-emerald-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all appearance-none">
                <option value="1">Triwulan I (Jan-Mar)</option>
                <option value="2">Triwulan II (Apr-Jun)</option>
                <option value="3">Triwulan III (Jul-Sep)</option>
                <option value="4">Triwulan IV (Okt-Des)</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-emerald-400/80 mb-2 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Tahun
            </label>
            <select 
              value={tahun}
              onChange={(e) => setTahun(e.target.value)}
              className="w-full bg-emerald-950/40 border border-emerald-500/30 rounded-lg py-3 px-4 text-emerald-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all appearance-none"
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
        </div>

        {/* Preview Laporan */}
        <div className="bg-emerald-950/60 border border-emerald-500/20 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4 border-b border-emerald-500/20 pb-4">
            <h3 className="text-lg font-semibold text-emerald-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              Preview Data
            </h3>
            <span className="text-sm text-emerald-400/60">Menampilkan 5 dari 142 data</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-emerald-100">
              <thead className="bg-emerald-900/40 text-emerald-400/80 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 font-medium rounded-tl-lg">Indikator</th>
                  <th className="px-4 py-3 font-medium">Kategori</th>
                  <th className="px-4 py-3 font-medium">Target</th>
                  <th className="px-4 py-3 font-medium">Capaian</th>
                  <th className="px-4 py-3 font-medium rounded-tr-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-500/10">
                {[
                  { ind: 'Kepatuhan Kebersihan Tangan', cat: 'INM', target: '≥ 85%', cap: '88.5%', status: 'Tercapai', color: 'text-emerald-400' },
                  { ind: 'Kepatuhan Penggunaan APD', cat: 'INM', target: '100%', cap: '100%', status: 'Tercapai', color: 'text-emerald-400' },
                  { ind: 'Waktu Tanggap Pelayanan IGD', cat: 'IMP-RS', target: '≤ 5 Menit', cap: '4.2 Menit', status: 'Tercapai', color: 'text-emerald-400' },
                  { ind: 'Waktu Tunggu Rawat Jalan', cat: 'IMP-RS', target: '≤ 60 Menit', cap: '65 Menit', status: 'Tidak Tercapai', color: 'text-red-400' },
                  { ind: 'Kepatuhan Identifikasi Pasien', cat: 'INM', target: '100%', cap: '98%', status: 'Tidak Tercapai', color: 'text-red-400' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-emerald-500/5 transition-colors">
                    <td className="px-4 py-3 font-medium text-emerald-50">{row.ind}</td>
                    <td className="px-4 py-3 text-emerald-200/80">{row.cat}</td>
                    <td className="px-4 py-3 text-emerald-400/80 font-mono">{row.target}</td>
                    <td className="px-4 py-3 font-mono">{row.cap}</td>
                    <td className={`px-4 py-3 font-medium ${row.color}`}>{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4 border-t border-emerald-500/20">
          <button 
            onClick={() => handleExport('excel')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-950/50 text-emerald-300 border border-emerald-500/50 font-semibold rounded-lg hover:bg-emerald-900/50 transition-all glow-box"
          >
            <FileSpreadsheet className="w-5 h-5" />
            Export Excel
          </button>
          <button 
            onClick={() => handleExport('pdf')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 text-emerald-950 font-bold rounded-lg hover:bg-emerald-400 transition-all glow-box"
          >
            <Download className="w-5 h-5" />
            Download PDF
          </button>
        </div>
      </motion.div>
    </div>
  );
}
