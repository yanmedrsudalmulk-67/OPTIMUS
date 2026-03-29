'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Calendar, FileText, Activity, Building2 } from 'lucide-react';

export default function InputDataPage() {
  const [formData, setFormData] = useState({
    unit: '',
    kategori: '',
    indikator: '',
    nilai: '',
    tanggal: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Data berhasil disimpan! (Mock)');
    setFormData({ ...formData, nilai: '' });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-emerald-50 glow-text">Input Data Indikator</h1>
        <p className="text-emerald-400/60 mt-2">Masukkan capaian indikator mutu unit Anda.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 rounded-2xl border border-emerald-500/30 shadow-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Unit */}
          <div>
            <label className="block text-sm font-medium text-emerald-400/80 mb-2 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4" /> Unit Pelapor
            </label>
            <select 
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full bg-emerald-950/40 border border-emerald-500/30 rounded-lg py-3 px-4 text-emerald-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all appearance-none"
              required
            >
              <option value="" disabled>Pilih Unit...</option>
              <optgroup label="Pelayanan Medis">
                <option value="igd">Instalasi Gawat Darurat (IGD)</option>
                <option value="rajal">Rawat Jalan</option>
                <option value="ranap">Rawat Inap</option>
              </optgroup>
              <optgroup label="Penunjang Medis">
                <option value="lab">Laboratorium</option>
                <option value="rad">Radiologi</option>
                <option value="farmasi">Farmasi</option>
              </optgroup>
            </select>
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-sm font-medium text-emerald-400/80 mb-2 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4" /> Kategori Indikator
            </label>
            <select 
              value={formData.kategori}
              onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
              className="w-full bg-emerald-950/40 border border-emerald-500/30 rounded-lg py-3 px-4 text-emerald-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all appearance-none"
              required
            >
              <option value="" disabled>Pilih Kategori...</option>
              <option value="inm">Indikator Nasional Mutu (INM)</option>
              <option value="imp-rs">Indikator Mutu Prioritas RS (IMP-RS)</option>
              <option value="imp-unit">Indikator Mutu Prioritas Unit (IMP Unit)</option>
              <option value="spm">Standar Pelayanan Minimal (SPM)</option>
            </select>
          </div>

          {/* Indikator */}
          <div>
            <label className="block text-sm font-medium text-emerald-400/80 mb-2 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4" /> Nama Indikator
            </label>
            <select 
              value={formData.indikator}
              onChange={(e) => setFormData({ ...formData, indikator: e.target.value })}
              className="w-full bg-emerald-950/40 border border-emerald-500/30 rounded-lg py-3 px-4 text-emerald-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all appearance-none"
              required
              disabled={!formData.kategori}
            >
              <option value="" disabled>Pilih Indikator...</option>
              {formData.kategori === 'inm' && (
                <>
                  <option value="inm-1">Kepatuhan Kebersihan Tangan</option>
                  <option value="inm-2">Kepatuhan Penggunaan APD</option>
                  <option value="inm-3">Kepatuhan Identifikasi Pasien</option>
                </>
              )}
              {formData.kategori === 'imp-rs' && (
                <>
                  <option value="imp-1">Waktu Tanggap Pelayanan IGD</option>
                  <option value="imp-2">Waktu Tunggu Rawat Jalan</option>
                </>
              )}
              {/* Add more options as needed for mock */}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Nilai */}
            <div>
              <label className="block text-sm font-medium text-emerald-400/80 mb-2 uppercase tracking-wider">
                Nilai Capaian
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  step="0.01"
                  value={formData.nilai}
                  onChange={(e) => setFormData({ ...formData, nilai: e.target.value })}
                  className="w-full bg-emerald-950/40 border border-emerald-500/30 rounded-lg py-3 px-4 text-emerald-100 placeholder:text-emerald-500/30 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all font-mono text-lg"
                  placeholder="0.00"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500/50 font-medium">%</span>
              </div>
            </div>

            {/* Tanggal */}
            <div>
              <label className="block text-sm font-medium text-emerald-400/80 mb-2 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Tanggal Data
              </label>
              <input 
                type="date" 
                value={formData.tanggal}
                onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                className="w-full bg-emerald-950/40 border border-emerald-500/30 rounded-lg py-3 px-4 text-emerald-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all [color-scheme:dark]"
                required
              />
            </div>
          </div>

          <div className="pt-6 border-t border-emerald-500/20">
            <button 
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-500 text-emerald-950 font-bold rounded-xl hover:bg-emerald-400 transition-all glow-box group text-lg"
            >
              <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Simpan Data Indikator
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
