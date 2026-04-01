'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/AuthContext';
import { db } from '@/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  Timestamp,
  getDoc,
  doc
} from 'firebase/firestore';
import { toast } from 'sonner';
import { 
  Save, 
  Database, 
  Calendar, 
  Hospital, 
  Layers, 
  Activity, 
  Hash,
  ChevronRight,
  Search,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import DOMPurify from 'dompurify';

// --- Constants ---

const UNITS = [
  { 
    id: 'rawat-jalan', 
    name: 'Rawat Jalan', 
    hasSub: true,
    subUnits: [
      'Poli Anak', 
      'Poli Bedah', 
      'Poli Obgyn', 
      'Poli Penyakit Dalam', 
      'Poli Umum', 
      'Poli Arafah', 
      'Poli DOTS'
    ]
  },
  { id: 'igd', name: 'IGD' },
  { id: 'icu', name: 'ICU' },
  { id: 'ibs', name: 'IBS' },
  { id: 'ranap-aisyah', name: 'Ranap Aisyah' },
  { id: 'ranap-fatimah', name: 'Ranap Fatimah' },
  { id: 'ranap-khadijah', name: 'Ranap Khadijah' },
  { id: 'ranap-usman', name: 'Ranap Usman' },
  { id: 'farmasi', name: 'Farmasi' },
  { id: 'laboratorium', name: 'Laboratorium' },
  { id: 'radiologi', name: 'Radiologi' },
  { id: 'kesling', name: 'Kesling' },
  { id: 'cssd', name: 'CSSD' },
  { id: 'manajemen', name: 'Manajemen' },
  { id: 'ambulance', name: 'Ambulance' },
  { id: 'security', name: 'Security' }
];

const KATEGORI_OPTIONS = ['INM', 'IMP-RS', 'IMP-Unit', 'SPM'];

// --- Types ---

interface Indikator {
  id: string;
  judul: string;
  kategori: string;
  unit?: string;
  numerator?: string;
  denominator?: string;
}

export default function InputDataPage() {
  const { profile, isAuthReady } = useAuth();
  const [loading, setLoading] = useState(false);
  const [indicators, setIndicators] = useState<Indikator[]>([]);
  
  // Form State
  const [selectedUnit, setSelectedUnit] = useState('');
  const [selectedSubUnit, setSelectedSubUnit] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('');
  const [selectedIndikatorId, setSelectedIndikatorId] = useState('');
  const [inputNumerator, setInputNumerator] = useState('');
  const [inputDenominator, setInputDenominator] = useState('');
  const [nilai, setNilai] = useState('');
  const [analisis, setAnalisis] = useState('');
  const [rencanaTindakLanjut, setRencanaTindakLanjut] = useState('');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);

  // Auto-calculate percentage
  useEffect(() => {
    if (inputNumerator !== '' && inputDenominator !== '') {
      const num = Number(inputNumerator);
      const den = Number(inputDenominator);
      if (den !== 0 && !isNaN(num) && !isNaN(den)) {
        const result = (num / den) * 100;
        setNilai(Number.isInteger(result) ? result.toString() : result.toFixed(2));
      } else {
        setNilai('');
      }
    }
  }, [inputNumerator, inputDenominator]);

  // Fetch Indicators
  useEffect(() => {
    const fetchIndicators = async () => {
      if (!isAuthReady) return;
      try {
        const q = query(collection(db, 'indikator_master'), orderBy('judul', 'asc'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Indikator[];
        setIndicators(data);
      } catch (error) {
        console.error('Error fetching indicators:', error);
        toast.error('Gagal mengambil data indikator');
      }
    };

    fetchIndicators();
  }, [isAuthReady]);

  // Filtered Indicators
  const filteredIndicators = useMemo(() => {
    return indicators.filter(ind => ind.kategori === selectedKategori);
  }, [indicators, selectedKategori]);

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUnit(e.target.value);
    setSelectedSubUnit('');
    setSelectedIndikatorId('');
  };

  const handleKategoriChange = (kat: string) => {
    setSelectedKategori(kat);
    setSelectedIndikatorId('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) {
      toast.error('Anda harus login untuk menginput data');
      return;
    }

    if (!selectedUnit || !selectedKategori || !selectedIndikatorId || !nilai || !tanggal) {
      toast.error('Semua field wajib diisi');
      return;
    }

    if (isNaN(Number(nilai))) {
      toast.error('Nilai harus berupa angka');
      return;
    }

    setLoading(true);
    try {
      const indicator = indicators.find(i => i.id === selectedIndikatorId);
      const dateObj = new Date(tanggal);
      const bulan = dateObj.getMonth() + 1;
      const tahun = dateObj.getFullYear();
      
      await addDoc(collection(db, 'data_indikator'), {
        unit: selectedUnit,
        sub_unit: selectedSubUnit || null,
        kategori: selectedKategori,
        indikator_id: selectedIndikatorId,
        nama_indikator: indicator?.judul || '',
        nilai: Number(nilai),
        numerator_value: inputNumerator !== '' ? Number(inputNumerator) : null,
        denominator_value: inputDenominator !== '' ? Number(inputDenominator) : null,
        tanggal: tanggal,
        analisis: analisis,
        rencana_tindak_lanjut: rencanaTindakLanjut,
        bulan: bulan,
        tahun: tahun,
        created_by: profile.uid,
        created_at: new Date().toISOString()
      });

      toast.success('Data berhasil disimpan');
      
      // Reset Form (except unit and date for convenience)
      setSelectedIndikatorId('');
      setInputNumerator('');
      setInputDenominator('');
      setNilai('');
      setAnalisis('');
      setRencanaTindakLanjut('');
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Gagal menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  if (!profile || (profile.role !== 'unit' && profile.role !== 'admin')) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-[var(--foreground)] mb-2">Akses Ditolak</h1>
        <p className="text-gray-600 dark:text-[var(--muted-foreground)]">Hanya akun dengan role &apos;Unit&apos; atau &apos;Tim Mutu RS&apos; yang dapat mengakses halaman ini.</p>
      </div>
    );
  }

  const currentUnitObj = UNITS.find(u => u.name === selectedUnit);

  return (
    <>
      <div className="mb-8 relative z-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
          <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          Input Data Indikator
        </h1>
        <p className="text-gray-600 dark:text-slate-400 mt-2 leading-relaxed">Silakan lengkapi formulir di bawah ini untuk mencatat capaian indikator mutu.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white dark:bg-[var(--card)] rounded-3xl shadow-xl border border-gray-200 dark:border-[var(--border)] p-6 md:p-8 relative overflow-hidden transition-all duration-300">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full pointer-events-none" />
              
              <div className="space-y-8 relative z-10">
                {/* 1. Pilih Unit & Tanggal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 flex items-center gap-2">
                      <Hospital className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      1. Pilih Unit
                    </label>
                    <select
                      value={selectedUnit}
                      onChange={handleUnitChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[var(--border)] focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-[var(--background)] text-gray-900 dark:text-white outline-none transition-all appearance-none font-medium"
                      required
                    >
                      <option value="" className="bg-white dark:bg-[var(--card)]">-- Pilih Unit --</option>
                      {UNITS.map(unit => (
                        <option key={unit.id} value={unit.name} className="bg-white dark:bg-[var(--card)]">{unit.name}</option>
                      ))}
                    </select>

                    <AnimatePresence>
                      {currentUnitObj?.hasSub && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-2"
                        >
                          <label className="block text-xs font-bold text-gray-700 dark:text-slate-400 ml-1">Pilih Sub Unit / Poliklinik</label>
                          <select
                            value={selectedSubUnit}
                            onChange={(e) => setSelectedSubUnit(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-blue-500/20 focus:ring-2 focus:ring-blue-500 bg-blue-50/30 dark:bg-blue-500/5 text-gray-900 dark:text-white outline-none transition-all appearance-none font-medium"
                            required
                          >
                            <option value="" className="bg-white dark:bg-[var(--card)]">-- Pilih Poliklinik --</option>
                            {currentUnitObj.subUnits?.map(sub => (
                              <option key={sub} value={sub} className="bg-white dark:bg-[var(--card)]">{sub}</option>
                            ))}
                          </select>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      Pilih Tanggal
                    </label>
                    <input
                      type="date"
                      value={tanggal}
                      onChange={(e) => setTanggal(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[var(--border)] focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-[var(--background)] text-gray-900 dark:text-white outline-none transition-all dark:[color-scheme:dark] font-medium"
                      required
                    />
                  </div>
                </div>

                {/* 2. Pilih Kategori */}
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    2. Pilih Kategori Indikator
                  </label>
                  <select
                    value={selectedKategori}
                    onChange={(e) => handleKategoriChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[var(--border)] focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-[var(--background)] text-gray-900 dark:text-white outline-none transition-all appearance-none font-medium"
                    required
                  >
                    <option value="" className="bg-white dark:bg-[var(--card)]">-- Pilih Kategori --</option>
                    {KATEGORI_OPTIONS.map(kat => (
                      <option key={kat} value={kat} className="bg-white dark:bg-[var(--card)]">{kat}</option>
                    ))}
                  </select>
                </div>

                {/* 3. Pilih Indikator */}
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    3. Pilih Indikator
                  </label>
                  <select
                    value={selectedIndikatorId}
                    onChange={(e) => setSelectedIndikatorId(e.target.value)}
                    disabled={!selectedKategori}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[var(--border)] focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-[var(--background)] text-gray-900 dark:text-white outline-none transition-all disabled:opacity-50 appearance-none font-medium"
                    required
                  >
                    <option value="" className="bg-white dark:bg-[var(--card)]">-- Pilih Indikator --</option>
                    {filteredIndicators.map(ind => (
                      <option key={ind.id} value={ind.id} className="bg-white dark:bg-[var(--card)]">{ind.judul}</option>
                    ))}
                  </select>
                  {!selectedKategori && (
                    <p className="text-xs text-amber-600 font-semibold flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      Pilih kategori terlebih dahulu
                    </p>
                  )}
                </div>

                {/* Numerator & Denominator Read-Only Display */}
                <AnimatePresence mode="wait">
                  {selectedIndikatorId && (
                    <motion.div
                      key={selectedIndikatorId}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden"
                    >
                      <div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-gray-200 dark:border-[var(--border)]">
                        <div className="flex items-center gap-2 mb-3 text-gray-700 dark:text-slate-300 font-bold uppercase tracking-wider text-xs">
                          <Activity className="h-4 w-4 text-blue-500" />
                          Numerator
                        </div>
                        <div 
                          className="text-gray-600 dark:text-slate-400 text-sm text-justify leading-relaxed whitespace-pre-line prose prose-sm max-w-none dark:prose-invert"
                          dangerouslySetInnerHTML={{ 
                            __html: DOMPurify.sanitize(indicators.find(i => i.id === selectedIndikatorId)?.numerator || 'Tidak ada data numerator.') 
                          }}
                        />
                      </div>
                      <div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-gray-200 dark:border-[var(--border)]">
                        <div className="flex items-center gap-2 mb-3 text-gray-700 dark:text-slate-300 font-bold uppercase tracking-wider text-xs">
                          <Layers className="h-4 w-4 text-purple-500" />
                          Denominator
                        </div>
                        <div 
                          className="text-gray-600 dark:text-slate-400 text-sm text-justify leading-relaxed whitespace-pre-line prose prose-sm max-w-none dark:prose-invert"
                          dangerouslySetInnerHTML={{ 
                            __html: DOMPurify.sanitize(indicators.find(i => i.id === selectedIndikatorId)?.denominator || 'Tidak ada data denominator.') 
                          }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 4. Input Nilai */}
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    4. Input Nilai
                  </label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Numerator</label>
                      <input
                        type="number"
                        step="any"
                        value={inputNumerator}
                        onChange={(e) => setInputNumerator(e.target.value)}
                        placeholder="Nilai Numerator..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[var(--border)] focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-[var(--background)] text-gray-900 dark:text-white outline-none transition-all font-medium placeholder:text-gray-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Denominator</label>
                      <input
                        type="number"
                        step="any"
                        value={inputDenominator}
                        onChange={(e) => setInputDenominator(e.target.value)}
                        placeholder="Nilai Denominator..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[var(--border)] focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-[var(--background)] text-gray-900 dark:text-white outline-none transition-all font-medium placeholder:text-gray-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Hasil (Persentase)</label>
                      <div className="relative">
                        <input
                          type="number"
                          step="any"
                          value={nilai}
                          onChange={(e) => setNilai(e.target.value)}
                          placeholder="Hasil capaian..."
                          className="w-full px-4 py-3 pr-8 rounded-xl border border-gray-200 dark:border-[var(--border)] focus:ring-2 focus:ring-blue-500 bg-blue-50/50 dark:bg-blue-900/20 text-gray-900 dark:text-white outline-none transition-all font-bold placeholder:text-gray-500"
                          required
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">
                    * Isi Numerator dan Denominator untuk menghitung persentase otomatis, atau isi Hasil secara manual jika bukan persentase.
                  </p>
                </div>

                {/* 5. Analisis */}
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    5. Analisis
                  </label>
                  <textarea
                    value={analisis}
                    onChange={(e) => setAnalisis(e.target.value)}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = "auto";
                      target.style.height = target.scrollHeight + "px";
                    }}
                    placeholder="Masukkan analisis capaian..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[var(--border)] focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-[var(--background)] text-gray-900 dark:text-white outline-none transition-all font-medium placeholder:text-gray-500 min-h-[100px] resize-none overflow-hidden"
                    required
                  />
                </div>

                {/* 6. Rencana Tindak Lanjut */}
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    6. Rencana Tindak Lanjut
                  </label>
                  <textarea
                    value={rencanaTindakLanjut}
                    onChange={(e) => setRencanaTindakLanjut(e.target.value)}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = "auto";
                      target.style.height = target.scrollHeight + "px";
                    }}
                    placeholder="Masukkan rencana tindak lanjut..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[var(--border)] focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-[var(--background)] text-gray-900 dark:text-white outline-none transition-all font-medium placeholder:text-gray-500 min-h-[100px] resize-none overflow-hidden"
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-gray-100 dark:border-[var(--border)]">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    Simpan Data
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[40px] rounded-full pointer-events-none" />
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 relative z-10">
              <CheckCircle2 className="w-5 h-5" />
              Informasi Pengisian
            </h3>
            <div className="space-y-5 text-sm relative z-10">
              <div className="flex flex-col gap-1 border-b border-white/10 pb-3">
                <span className="text-blue-100 text-xs uppercase font-bold tracking-wider">Unit Penginput</span>
                <span className="font-bold text-lg">{profile.unitName || '-'}</span>
              </div>
              <div className="flex flex-col gap-1 border-b border-white/10 pb-3">
                <span className="text-blue-100 text-xs uppercase font-bold tracking-wider">User</span>
                <span className="font-bold text-lg">{profile.username}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-blue-100 text-xs uppercase font-bold tracking-wider">Periode Aktif</span>
                <span className="font-bold text-lg">{new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-[var(--card)] rounded-3xl p-6 border border-gray-200 dark:border-[var(--border)] shadow-sm transition-all duration-300"
          >
            <h3 className="text-sm font-bold text-gray-700 dark:text-slate-400 mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Ringkasan Input
            </h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-500/20">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">01</span>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 dark:text-slate-500 uppercase font-bold tracking-widest mb-1">Unit Terpilih</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedUnit || '-'}</p>
                  {selectedSubUnit && <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mt-0.5">{selectedSubUnit}</p>}
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-500/20">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">02</span>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 dark:text-slate-500 uppercase font-bold tracking-widest mb-1">Indikator</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 leading-relaxed">
                    {indicators.find(i => i.id === selectedIndikatorId)?.judul || '-'}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-500/20">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">03</span>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 dark:text-slate-500 uppercase font-bold tracking-widest mb-1">Nilai Capaian</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{nilai || '-'}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
