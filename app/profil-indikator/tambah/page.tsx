'use client';

import { useAuth } from '@/AuthContext';
import { useState, useEffect } from 'react';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { motion } from 'motion/react';
import { ArrowLeft, Save, RotateCcw, Database, Eye, EyeOff, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import AutosizeTextarea from '@/components/AutosizeTextarea';
import RichTextEditor from '@/components/RichTextEditor';
import RichTextDisplay from '@/components/RichTextDisplay';

interface IndikatorFormData {
  kategori: string;
  judul: string;
  dasar_pemikiran: string;
  dimensi_mutu: string[];
  tujuan: string;
  definisi_operasional: string;
  tipe: string;
  satuan: string;
  numerator: string;
  denominator: string;
  target: string; // Use string for input, convert to number on save
  kriteria: string;
  formula: string;
  metode_pengumpulan: string;
  sumber_data: string;
  cara_sampling: string;
  instrumen: string;
  besar_sampel: string;
  periode_pengumpulan: string[];
  periode_analisis: string[];
  penyajian: string[];
  penanggung_jawab: string;
}

const initialFormData: IndikatorFormData = {
  kategori: 'INM',
  judul: '',
  dasar_pemikiran: '',
  dimensi_mutu: [],
  tujuan: '',
  definisi_operasional: '',
  tipe: 'Struktur',
  satuan: '',
  numerator: '',
  denominator: '',
  target: '',
  kriteria: '',
  formula: '',
  metode_pengumpulan: '',
  sumber_data: '',
  cara_sampling: '',
  instrumen: '',
  besar_sampel: '',
  periode_pengumpulan: [],
  periode_analisis: [],
  penyajian: [],
  penanggung_jawab: ''
};

const DIMENSI_MUTU_OPTIONS = [
  'Efektivitas',
  'Efisiensi',
  'Keselamatan',
  'Berorientasi pasien',
  'Tepat waktu',
  'Adil'
];

const PERIODE_OPTIONS = [
  'Bulanan',
  'Triwulan',
  'Tahunan'
];

const PENYAJIAN_OPTIONS = [
  'Tabel',
  'Grafik',
  'Run Chart'
];

const getProfilTitle = (kategori: string) => {
  switch (kategori) {
    case 'INM': return 'Profil Indikator Nasional Mutu';
    case 'IMP-RS': return 'Profil Indikator Mutu Prioritas Rumah Sakit';
    case 'IMP-Unit': return 'Profil Indikator Mutu Prioritas Unit';
    case 'SPM': return 'Profil Standar Pelayanan Minimal';
    default: return 'Profil Indikator Mutu';
  }
};

export default function TambahIndikator() {
  const { profile } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<IndikatorFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const [formulaObj, setFormulaObj] = useState({ numerator: '', denominator: '' });

  useEffect(() => {
    if (profile && profile.role !== 'admin') {
      router.push('/profil-indikator');
      toast.error('Anda tidak memiliki akses ke halaman ini');
    }
  }, [profile, router]);

  const handleCheckboxChange = (option: string, field: 'dimensi_mutu' | 'periode_pengumpulan' | 'periode_analisis' | 'penyajian') => {
    setFormData(prev => {
      const current = prev[field];
      if (current.includes(option)) {
        return { ...prev, [field]: current.filter(o => o !== option) };
      } else {
        return { ...prev, [field]: [...current, option] };
      }
    });
  };

  const handleFormulaChange = (field: 'numerator' | 'denominator', value: string) => {
    const newObj = { ...formulaObj, [field]: value };
    setFormulaObj(newObj);
    setFormData({ ...formData, formula: JSON.stringify(newObj) });
  };

  const renderFormulaPreview = (formula: string) => {
    try {
      const parsed = JSON.parse(formula);
      if (parsed.numerator !== undefined && parsed.denominator !== undefined) {
        return (
          <div className="flex items-center gap-4 my-2">
            <div className="flex flex-col items-center text-center">
              <div className="pb-2 border-b-2 border-slate-800 dark:border-slate-200 px-6 font-medium">{parsed.numerator || '-'}</div>
              <div className="pt-2 px-6 font-medium">{parsed.denominator || '-'}</div>
            </div>
            <div className="font-bold text-lg">× 100%</div>
          </div>
        );
      }
    } catch (e) {
      // fallback
    }
    return <RichTextDisplay content={formula || '-'} />;
  };

  const handleReset = () => {
    if (window.confirm('Apakah Anda yakin ingin mereset form? Semua data yang telah diisi akan hilang.')) {
      setFormData(initialFormData);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (formData.dimensi_mutu.length === 0) {
      toast.error('Pilih minimal satu Dimensi Mutu');
      return;
    }

    if (!formData.target.trim()) {
      toast.error('Target tidak boleh kosong');
      return;
    }

    // Basic validation: must contain at least one digit
    if (!/\d/.test(formData.target)) {
      toast.error('Target minimal harus mengandung angka');
      return;
    }

    setLoading(true);
    try {
      const docRef = doc(collection(db, 'indikator_master'));
      const newDoc = {
        ...formData,
        target: formData.target.trim(),
        id: docRef.id,
        created_by: profile?.uid,
        created_at: new Date().toISOString()
      };

      await setDoc(docRef, newDoc);
      
      toast.success('Indikator berhasil ditambahkan');
      router.push('/profil-indikator');
    } catch (error) {
      console.error("Error saving indicator:", error);
      toast.error('Gagal menyimpan indikator');
    } finally {
      setLoading(false);
    }
  };

  if (!profile || profile.role !== 'admin') return null;

  return (
    <>
      <div className="max-w-screen-xl mx-auto pb-12 w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/10 rounded-xl transition-all"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-[var(--foreground)] tracking-tight flex items-center gap-3">
                <Database className="w-8 h-8 text-blue-500" />
                Tambah Indikator Baru
              </h1>
              <p className="text-gray-600 dark:text-[var(--muted-foreground)] mt-1 text-sm">Lengkapi profil indikator standar Kemenkes / SNARS</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPreview(!isPreview)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all border ${
                isPreview 
                  ? 'bg-blue-500 text-white border-blue-600 shadow-lg' 
                  : 'bg-[var(--card)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--foreground)]/5 shadow-sm'
              }`}
            >
              {isPreview ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              {isPreview ? 'Tutup Preview' : 'Preview Dokumen'}
            </button>
          </div>
        </div>

        {isPreview ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-[var(--border)] shadow-2xl overflow-hidden p-12 font-sans"
            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
          >
            <div className="max-w-4xl mx-auto space-y-8 text-slate-900 dark:text-slate-100">
              <div className="text-center border-b-2 border-slate-900 dark:border-slate-100 pb-6 mb-10">
                <h2 className="text-2xl font-bold uppercase tracking-widest">{getProfilTitle(formData.kategori)}</h2>
                <h3 className="text-xl font-semibold mt-2">{formData.judul || '[JUDUL INDIKATOR]'}</h3>
              </div>

              <div className="grid grid-cols-[200px_1fr] gap-x-8 gap-y-6">
                <div className="font-bold uppercase text-sm border-r border-slate-200 dark:border-slate-800 pr-4">Kategori</div>
                <div className="text-sm">{formData.kategori}</div>

                <div className="font-bold uppercase text-sm border-r border-slate-200 dark:border-slate-800 pr-4">Dasar Pemikiran</div>
                <RichTextDisplay content={formData.dasar_pemikiran || '-'} />

                <div className="font-bold uppercase text-sm border-r border-slate-200 dark:border-slate-800 pr-4">Dimensi Mutu</div>
                <div className="text-sm">{Array.isArray(formData.dimensi_mutu) ? formData.dimensi_mutu.join(', ') : formData.dimensi_mutu || '-'}</div>

                <div className="font-bold uppercase text-sm border-r border-slate-200 dark:border-slate-800 pr-4">Tujuan</div>
                <RichTextDisplay content={formData.tujuan || '-'} />

                <div className="font-bold uppercase text-sm border-r border-slate-200 dark:border-slate-800 pr-4">Definisi Operasional</div>
                <RichTextDisplay content={formData.definisi_operasional || '-'} />

                <div className="font-bold uppercase text-sm border-r border-slate-200 dark:border-slate-800 pr-4">Tipe Indikator</div>
                <div className="text-sm">{formData.tipe}</div>

                <div className="font-bold uppercase text-sm border-r border-slate-200 dark:border-slate-800 pr-4">Satuan Pengukuran</div>
                <div className="text-sm">{formData.satuan || '-'}</div>

                <div className="font-bold uppercase text-sm border-r border-slate-200 dark:border-slate-800 pr-4">Numerator</div>
                <RichTextDisplay content={formData.numerator || '-'} />

                <div className="font-bold uppercase text-sm border-r border-slate-200 dark:border-slate-800 pr-4">Denominator</div>
                <RichTextDisplay content={formData.denominator || '-'} />

                <div className="font-bold uppercase text-sm border-r border-slate-200 dark:border-slate-800 pr-4">Target</div>
                <div className="text-sm">{formData.target || '-'}</div>

                <div className="font-bold uppercase text-sm border-r border-slate-200 dark:border-slate-800 pr-4">Kriteria</div>
                <RichTextDisplay content={formData.kriteria || '-'} />

                <div className="font-bold uppercase text-sm border-r border-slate-200 dark:border-slate-800 pr-4">Formula</div>
                {renderFormulaPreview(formData.formula)}

                <div className="font-bold uppercase text-sm border-r border-slate-200 dark:border-slate-800 pr-4">Metode Pengumpulan</div>
                <RichTextDisplay content={formData.metode_pengumpulan || '-'} />

                <div className="font-bold uppercase text-sm border-r border-slate-200 dark:border-slate-800 pr-4">Sumber Data</div>
                <RichTextDisplay content={formData.sumber_data || '-'} />

                <div className="font-bold uppercase text-sm border-r border-slate-200 dark:border-slate-800 pr-4">Cara Sampling</div>
                <RichTextDisplay content={formData.cara_sampling || '-'} />

                <div className="font-bold uppercase text-sm border-r border-slate-200 dark:border-slate-800 pr-4">Instrumen</div>
                <RichTextDisplay content={formData.instrumen || '-'} />

                <div className="font-bold uppercase text-sm border-r border-slate-200 dark:border-slate-800 pr-4">Besar Sampel</div>
                <div className="text-sm">{formData.besar_sampel || '-'}</div>

                <div className="font-bold uppercase text-sm border-r border-slate-200 dark:border-slate-800 pr-4">Periode Pengumpulan</div>
                <div className="text-sm">{Array.isArray(formData.periode_pengumpulan) ? formData.periode_pengumpulan.join(', ') : formData.periode_pengumpulan || '-'}</div>

                <div className="font-bold uppercase text-sm border-r border-slate-200 dark:border-slate-800 pr-4">Periode Analisis</div>
                <div className="text-sm">{Array.isArray(formData.periode_analisis) ? formData.periode_analisis.join(', ') : formData.periode_analisis || '-'}</div>

                <div className="font-bold uppercase text-sm border-r border-slate-200 dark:border-slate-800 pr-4">Penyajian Data</div>
                <div className="text-sm">{Array.isArray(formData.penyajian) ? formData.penyajian.join(', ') : formData.penyajian || '-'}</div>

                <div className="font-bold uppercase text-sm border-r border-slate-200 dark:border-slate-800 pr-4">Penanggung Jawab</div>
                <div className="text-sm">{formData.penanggung_jawab || '-'}</div>
              </div>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-2xl overflow-hidden">
              <div className="p-8 space-y-8">
                {/* Section 1: Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-[var(--muted-foreground)] uppercase tracking-wider">Kategori</label>
                    <select
                      required
                      value={formData.kategori}
                      onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                      className="w-full p-2.5 border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-blue-500 bg-[var(--foreground)]/5 text-[var(--foreground)] outline-none transition-all"
                    >
                      <option value="INM" className="bg-[var(--card)]">INM</option>
                      <option value="IMP-RS" className="bg-[var(--card)]">IMP-RS</option>
                      <option value="IMP-Unit" className="bg-[var(--card)]">IMP-Unit</option>
                      <option value="SPM" className="bg-[var(--card)]">SPM</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-[var(--muted-foreground)] uppercase tracking-wider">Judul Indikator</label>
                    <input
                      type="text"
                      required
                      value={formData.judul}
                      onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                      placeholder="Masukkan judul indikator"
                      className="w-full p-2.5 border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-blue-500 bg-[var(--foreground)]/5 text-[var(--foreground)] outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Section 2: Rationale & Dimensions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-[var(--muted-foreground)] uppercase tracking-wider">Dasar Pemikiran</label>
                    <RichTextEditor
                      value={formData.dasar_pemikiran}
                      onChange={(val) => setFormData({ ...formData, dasar_pemikiran: val })}
                      placeholder="Alasan mengapa indikator ini diukur"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-[var(--muted-foreground)] uppercase tracking-wider">Dimensi Mutu</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3 border border-[var(--border)] rounded-xl bg-[var(--foreground)]/5">
                  {DIMENSI_MUTU_OPTIONS.map(option => (
                        <label key={option} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={formData.dimensi_mutu.includes(option)}
                            onChange={() => handleCheckboxChange(option, 'dimensi_mutu')}
                            className="w-4 h-4 rounded border-[var(--border)] bg-[var(--foreground)]/5 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                          />
                          <span className="text-sm text-gray-600 dark:text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors">{option}</span>
                        </label>
                  ))}
                </div>
                  </div>
                </div>

                {/* Section 3: Objective & Definition */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-[var(--muted-foreground)] uppercase tracking-wider">Tujuan</label>
                    <RichTextEditor
                      value={formData.tujuan}
                      onChange={(val) => setFormData({ ...formData, tujuan: val })}
                      placeholder="Hasil yang ingin dicapai"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-[var(--muted-foreground)] uppercase tracking-wider">Definisi Operasional</label>
                    <RichTextEditor
                      value={formData.definisi_operasional}
                      onChange={(val) => setFormData({ ...formData, definisi_operasional: val })}
                      placeholder="Penjelasan detail variabel indikator"
                    />
                  </div>
                </div>

                {/* Section 4: Type & Unit */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-[var(--muted-foreground)] uppercase tracking-wider">Tipe Indikator</label>
                    <select
                      required
                      value={formData.tipe}
                      onChange={(e) => setFormData({ ...formData, tipe: e.target.value })}
                      className="w-full p-2.5 border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-blue-500 bg-[var(--foreground)]/5 text-[var(--foreground)] outline-none transition-all"
                    >
                      <option value="Struktur" className="bg-[var(--card)]">Struktur</option>
                      <option value="Proses" className="bg-[var(--card)]">Proses</option>
                      <option value="Outcome" className="bg-[var(--card)]">Outcome</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-[var(--muted-foreground)] uppercase tracking-wider">Satuan Pengukuran</label>
                    <input
                      type="text"
                      required
                      value={formData.satuan}
                      onChange={(e) => setFormData({ ...formData, satuan: e.target.value })}
                      placeholder="Contoh: %, menit, jam, dll"
                      className="w-full p-2.5 border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-blue-500 bg-[var(--foreground)]/5 text-[var(--foreground)] outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Section 5: Numerator & Denominator */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-[var(--muted-foreground)] uppercase tracking-wider">Numerator</label>
                    <RichTextEditor
                      value={formData.numerator}
                      onChange={(val) => setFormData({ ...formData, numerator: val })}
                      placeholder="Pembilang"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-[var(--muted-foreground)] uppercase tracking-wider">Denominator</label>
                    <RichTextEditor
                      value={formData.denominator}
                      onChange={(val) => setFormData({ ...formData, denominator: val })}
                      placeholder="Penyebut"
                    />
                  </div>
                </div>

                {/* Section 6: Target & Criteria */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-[var(--muted-foreground)] uppercase tracking-wider">Target</label>
                    <input
                      type="text"
                      required
                      value={formData.target}
                      onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                      placeholder="Contoh: ≥ 85 %"
                      className="w-full p-2.5 border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-blue-500 bg-[var(--foreground)]/5 text-[var(--foreground)] outline-none transition-all"
                    />
                    <p className="text-xs text-gray-500 dark:text-[var(--muted-foreground)]">Gunakan simbol ≥, ≤, &gt;, &lt;, = sesuai kebutuhan</p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-[var(--muted-foreground)] uppercase tracking-wider">Kriteria (Inklusi & Eksklusi)</label>
                    <RichTextEditor
                      value={formData.kriteria}
                      onChange={(val) => setFormData({ ...formData, kriteria: val })}
                      placeholder="Kriteria inklusi dan eksklusi"
                    />
                  </div>
                </div>

                {/* Section 7: Formula */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-[var(--muted-foreground)] uppercase tracking-wider">Formula</label>
                  <div className="bg-[var(--foreground)]/5 border border-[var(--border)] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 overflow-x-auto">
                    <div className="flex flex-col items-center w-full sm:w-auto min-w-[250px] md:min-w-[400px]">
                      <textarea
                        rows={3}
                        value={formulaObj.numerator}
                        onChange={(e) => handleFormulaChange('numerator', e.target.value)}
                        placeholder="Masukkan Numerator"
                        className="w-full text-center p-3 bg-white dark:bg-[var(--card)] border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all mb-4 resize-y min-h-[80px]"
                      />
                      <div className="w-full h-0.5 bg-gray-400 dark:bg-gray-600 rounded-full mb-4"></div>
                      <textarea
                        rows={3}
                        value={formulaObj.denominator}
                        onChange={(e) => handleFormulaChange('denominator', e.target.value)}
                        placeholder="Masukkan Denominator"
                        className="w-full text-center p-3 bg-white dark:bg-[var(--card)] border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-y min-h-[80px]"
                      />
                    </div>
                    <div className="text-2xl font-bold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      × 100%
                    </div>
                  </div>
                </div>

                {/* Section 8: Method & Source */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-[var(--muted-foreground)] uppercase tracking-wider">Metode Pengumpulan Data</label>
                    <RichTextEditor
                      value={formData.metode_pengumpulan}
                      onChange={(val) => setFormData({ ...formData, metode_pengumpulan: val })}
                      placeholder="Retrospektif / Concurrent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-[var(--muted-foreground)] uppercase tracking-wider">Sumber Data</label>
                    <RichTextEditor
                      value={formData.sumber_data}
                      onChange={(val) => setFormData({ ...formData, sumber_data: val })}
                      placeholder="Rekam medis, register, dll"
                    />
                  </div>
                </div>

                {/* Section 9: Sampling & Instrument */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-[var(--muted-foreground)] uppercase tracking-wider">Cara Pengambilan Sampel</label>
                    <RichTextEditor
                      value={formData.cara_sampling}
                      onChange={(val) => setFormData({ ...formData, cara_sampling: val })}
                      placeholder="Total sampling / Random sampling"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-[var(--muted-foreground)] uppercase tracking-wider">Instrumen Pengambilan Data</label>
                    <RichTextEditor
                      value={formData.instrumen}
                      onChange={(val) => setFormData({ ...formData, instrumen: val })}
                      placeholder="Formulir, checklist, dll"
                    />
                  </div>
                </div>

                {/* Section 10: Sample Size & Periods */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-[var(--muted-foreground)] uppercase tracking-wider">Besar Sampel</label>
                    <input
                      type="text"
                      required
                      value={formData.besar_sampel}
                      onChange={(e) => setFormData({ ...formData, besar_sampel: e.target.value })}
                      placeholder="Jumlah sampel yang dibutuhkan"
                      className="w-full p-2.5 border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-blue-500 bg-[var(--foreground)]/5 text-[var(--foreground)] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-[var(--muted-foreground)] uppercase tracking-wider">Periode Pengumpulan Data</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 border border-[var(--border)] rounded-xl bg-[var(--foreground)]/5">
                      {PERIODE_OPTIONS.map(option => (
                        <label key={option} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={formData.periode_pengumpulan.includes(option)}
                            onChange={() => handleCheckboxChange(option, 'periode_pengumpulan')}
                            className="w-4 h-4 rounded border-[var(--border)] bg-[var(--foreground)]/5 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                          />
                          <span className="text-sm text-gray-600 dark:text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section 11: Analysis Period & Presentation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-[var(--muted-foreground)] uppercase tracking-wider">Periode Analisis & Pelaporan</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 border border-[var(--border)] rounded-xl bg-[var(--foreground)]/5">
                      {PERIODE_OPTIONS.map(option => (
                        <label key={option} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={formData.periode_analisis.includes(option)}
                            onChange={() => handleCheckboxChange(option, 'periode_analisis')}
                            className="w-4 h-4 rounded border-[var(--border)] bg-[var(--foreground)]/5 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                          />
                          <span className="text-sm text-gray-600 dark:text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-[var(--muted-foreground)] uppercase tracking-wider">Penyajian Data</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 border border-[var(--border)] rounded-xl bg-[var(--foreground)]/5">
                      {PENYAJIAN_OPTIONS.map(option => (
                        <label key={option} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={formData.penyajian.includes(option)}
                            onChange={() => handleCheckboxChange(option, 'penyajian')}
                            className="w-4 h-4 rounded border-[var(--border)] bg-[var(--foreground)]/5 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                          />
                          <span className="text-sm text-gray-600 dark:text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section 12: PIC */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-[var(--muted-foreground)] uppercase tracking-wider">Penanggung Jawab</label>
                    <input
                      type="text"
                      required
                      value={formData.penanggung_jawab}
                      onChange={(e) => setFormData({ ...formData, penanggung_jawab: e.target.value })}
                      placeholder="Nama jabatan / unit penanggung jawab"
                      className="w-full p-2.5 border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-blue-500 bg-[var(--foreground)]/5 text-[var(--foreground)] outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="p-8 bg-[var(--foreground)]/5 border-t border-[var(--border)] flex flex-col sm:flex-row justify-end gap-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 px-6 py-3 text-gray-700 dark:text-[var(--muted-foreground)] font-semibold hover:bg-[var(--foreground)]/10 rounded-xl transition-all border border-transparent hover:border-[var(--border)]"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset Form
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  Simpan Indikator
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </>

  );
}
