'use client';

import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/AuthContext';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { motion } from 'motion/react';
import { ArrowLeft, Edit2, Printer, FileText, Database, Calendar, User } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter, useParams } from 'next/navigation';
import RichTextDisplay from '@/components/RichTextDisplay';
import Link from 'next/link';

interface Indikator {
  id: string;
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
  target: string;
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
  created_at: string;
}

const getProfilTitle = (kategori: string) => {
  switch (kategori) {
    case 'INM': return 'Profil Indikator Nasional Mutu';
    case 'IMP-RS': return 'Profil Indikator Mutu Prioritas Rumah Sakit';
    case 'IMP-Unit': return 'Profil Indikator Mutu Prioritas Unit';
    case 'SPM': return 'Profil Standar Pelayanan Minimal';
    default: return 'Profil Indikator Mutu';
  }
};

export default function DetailIndikator() {
  const { profile } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [indikator, setIndikator] = useState<Indikator | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'indikator_master', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setIndikator({ id: docSnap.id, ...docSnap.data() } as Indikator);
        } else {
          toast.error('Indikator tidak ditemukan');
          router.push('/profil-indikator');
        }
      } catch (error) {
        console.error("Error fetching detail:", error);
        toast.error('Gagal mengambil data detail');
      } finally {
        setLoading(false);
      }
    };

    if (profile?.role === 'admin') {
      fetchDetail();
    }
  }, [id, profile, router]);

  const handlePrint = () => {
    window.print();
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
    return <RichTextDisplay content={formula || '-'} className="text-base text-black" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!indikator) return null;

  return (
    <>
      <div className="max-w-screen-xl mx-auto pb-12 w-full print:pb-0 print:max-w-none">
        {/* Header Actions - Hidden on Print */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 print:hidden">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-all"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                Detail Profil Indikator
              </h1>
              <p className="text-gray-600 dark:text-slate-400 mt-1 text-sm">Format dokumen resmi SNARS / Kemenkes</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-[var(--card)] text-gray-700 dark:text-white border border-gray-200 dark:border-[var(--border)] rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition-all shadow-sm"
            >
              <Printer className="w-5 h-5" />
              Cetak PDF
            </button>
            <Link
              href={`/profil-indikator/${id}/edit`}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/20"
            >
              <Edit2 className="w-5 h-5" />
              Edit Data
            </Link>
          </div>
        </div>

        {/* Document View */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-10 font-sans print:shadow-none print:border-none print:p-0"
          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
          id="printable-document"
        >
          <div className="max-w-4xl mx-auto space-y-10 text-black">
            {/* Document Header */}
            <div className="text-center border-b-2 border-black pb-8 mb-12">
              <h2 className="text-2xl font-bold uppercase tracking-[0.2em] mb-2">{getProfilTitle(indikator.kategori)}</h2>
              <h3 className="text-xl font-semibold leading-tight">{indikator.judul}</h3>
              <div className="mt-4 flex flex-wrap justify-center gap-6 text-xs font-sans uppercase tracking-widest text-gray-700">
                <span className="flex items-center gap-2"><Database className="w-3 h-3" /> {indikator.kategori}</span>
                <span className="flex items-center gap-2"><Calendar className="w-3 h-3" /> {new Date(indikator.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span className="flex items-center gap-2"><User className="w-3 h-3" /> {indikator.penanggung_jawab || '-'}</span>
              </div>
            </div>

            {/* Document Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-x-12 gap-y-8 print:grid-cols-[200px_1fr]">
              <div className="font-bold uppercase text-xs tracking-widest text-gray-800 border-b md:border-b-0 md:border-r border-gray-300 pb-2 md:pb-0 md:pr-6 self-start">Kategori Indikator</div>
              <div className="text-base font-sans text-black">{indikator.kategori}</div>

              <div className="font-bold uppercase text-xs tracking-widest text-gray-800 border-b md:border-b-0 md:border-r border-gray-300 pb-2 md:pb-0 md:pr-6 self-start">Dasar Pemikiran</div>
              <RichTextDisplay content={indikator.dasar_pemikiran} className="text-base text-black" />

              <div className="font-bold uppercase text-xs tracking-widest text-gray-800 border-b md:border-b-0 md:border-r border-gray-300 pb-2 md:pb-0 md:pr-6 self-start">Dimensi Mutu</div>
              <div className="text-base font-sans text-black">{Array.isArray(indikator.dimensi_mutu) ? indikator.dimensi_mutu.join(', ') : indikator.dimensi_mutu || '-'}</div>

              <div className="font-bold uppercase text-xs tracking-widest text-gray-800 border-b md:border-b-0 md:border-r border-gray-300 pb-2 md:pb-0 md:pr-6 self-start">Tujuan</div>
              <RichTextDisplay content={indikator.tujuan} className="text-base text-black" />

              <div className="font-bold uppercase text-xs tracking-widest text-gray-800 border-b md:border-b-0 md:border-r border-gray-300 pb-2 md:pb-0 md:pr-6 self-start">Definisi Operasional</div>
              <RichTextDisplay content={indikator.definisi_operasional} className="text-base text-black" />

              <div className="font-bold uppercase text-xs tracking-widest text-gray-800 border-b md:border-b-0 md:border-r border-gray-300 pb-2 md:pb-0 md:pr-6 self-start">Tipe Indikator</div>
              <div className="text-base font-sans text-black">{indikator.tipe}</div>

              <div className="font-bold uppercase text-xs tracking-widest text-gray-800 border-b md:border-b-0 md:border-r border-gray-300 pb-2 md:pb-0 md:pr-6 self-start">Satuan Pengukuran</div>
              <div className="text-base font-sans text-black">{indikator.satuan || '-'}</div>

              <div className="font-bold uppercase text-xs tracking-widest text-gray-800 border-b md:border-b-0 md:border-r border-gray-300 pb-2 md:pb-0 md:pr-6 self-start">Numerator</div>
              <RichTextDisplay content={indikator.numerator} className="text-base text-black" />

              <div className="font-bold uppercase text-xs tracking-widest text-gray-800 border-b md:border-b-0 md:border-r border-gray-300 pb-2 md:pb-0 md:pr-6 self-start">Denominator</div>
              <RichTextDisplay content={indikator.denominator} className="text-base text-black" />

              <div className="font-bold uppercase text-xs tracking-widest text-gray-800 border-b md:border-b-0 md:border-r border-gray-300 pb-2 md:pb-0 md:pr-6 self-start">Target Pencapaian</div>
              <div className="text-base font-sans font-bold text-black">{indikator.target || '-'}</div>

              <div className="font-bold uppercase text-xs tracking-widest text-gray-800 border-b md:border-b-0 md:border-r border-gray-300 pb-2 md:pb-0 md:pr-6 self-start">Kriteria (Inklusi & Eksklusi)</div>
              <RichTextDisplay content={indikator.kriteria} className="text-base text-black" />

              <div className="font-bold uppercase text-xs tracking-widest text-gray-800 border-b md:border-b-0 md:border-r border-gray-300 pb-2 md:pb-0 md:pr-6 self-start">Formula</div>
              {renderFormulaPreview(indikator.formula)}

              <div className="font-bold uppercase text-xs tracking-widest text-gray-800 border-b md:border-b-0 md:border-r border-gray-300 pb-2 md:pb-0 md:pr-6 self-start">Metode Pengumpulan Data</div>
              <RichTextDisplay content={indikator.metode_pengumpulan} className="text-base text-black" />

              <div className="font-bold uppercase text-xs tracking-widest text-gray-800 border-b md:border-b-0 md:border-r border-gray-300 pb-2 md:pb-0 md:pr-6 self-start">Sumber Data</div>
              <RichTextDisplay content={indikator.sumber_data} className="text-base text-black" />

              <div className="font-bold uppercase text-xs tracking-widest text-gray-800 border-b md:border-b-0 md:border-r border-gray-300 pb-2 md:pb-0 md:pr-6 self-start">Cara Pengambilan Sampel</div>
              <RichTextDisplay content={indikator.cara_sampling} className="text-base text-black" />

              <div className="font-bold uppercase text-xs tracking-widest text-gray-800 border-b md:border-b-0 md:border-r border-gray-300 pb-2 md:pb-0 md:pr-6 self-start">Instrumen Pengambilan Data</div>
              <RichTextDisplay content={indikator.instrumen} className="text-base text-black" />

              <div className="font-bold uppercase text-xs tracking-widest text-gray-800 border-b md:border-b-0 md:border-r border-gray-300 pb-2 md:pb-0 md:pr-6 self-start">Besar Sampel</div>
              <div className="text-base font-sans text-black">{indikator.besar_sampel || '-'}</div>

              <div className="font-bold uppercase text-xs tracking-widest text-gray-800 border-b md:border-b-0 md:border-r border-gray-300 pb-2 md:pb-0 md:pr-6 self-start">Periode Pengumpulan Data</div>
              <div className="text-base font-sans text-black">{Array.isArray(indikator.periode_pengumpulan) ? indikator.periode_pengumpulan.join(', ') : indikator.periode_pengumpulan || '-'}</div>

              <div className="font-bold uppercase text-xs tracking-widest text-gray-800 border-b md:border-b-0 md:border-r border-gray-300 pb-2 md:pb-0 md:pr-6 self-start">Periode Analisis</div>
              <div className="text-base font-sans text-black">{Array.isArray(indikator.periode_analisis) ? indikator.periode_analisis.join(', ') : indikator.periode_analisis || '-'}</div>

              <div className="font-bold uppercase text-xs tracking-widest text-gray-800 border-b md:border-b-0 md:border-r border-gray-300 pb-2 md:pb-0 md:pr-6 self-start">Penyajian Data</div>
              <div className="text-base font-sans text-black">{Array.isArray(indikator.penyajian) ? indikator.penyajian.join(', ') : indikator.penyajian || '-'}</div>

              <div className="font-bold uppercase text-xs tracking-widest text-gray-800 border-b md:border-b-0 md:border-r border-gray-300 pb-2 md:pb-0 md:pr-6 self-start">Penanggung Jawab</div>
              <div className="text-base font-sans font-bold text-black">{indikator.penanggung_jawab || '-'}</div>
            </div>

            {/* Document Footer */}
            <div className="mt-20 pt-12 border-t border-gray-300 grid grid-cols-2 gap-12 text-center text-sm font-sans">
              <div className="space-y-20">
                <p className="font-bold uppercase tracking-widest text-black">Disetujui Oleh,</p>
                <div className="space-y-1">
                  <div className="w-48 h-px bg-black mx-auto" />
                  <p className="font-semibold text-black">Direktur Rumah Sakit</p>
                </div>
              </div>
              <div className="space-y-20">
                <p className="font-bold uppercase tracking-widest text-black">Disusun Oleh,</p>
                <div className="space-y-1">
                  <div className="w-48 h-px bg-black mx-auto" />
                  <p className="font-semibold text-black">{indikator.penanggung_jawab || 'Penanggung Jawab Indikator'}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          nav, aside, button, .print-hidden {
            display: none !important;
          }
          #printable-document {
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }
          .prose {
            color: black !important;
          }
        }
      `}</style>
    </>
  );
}
