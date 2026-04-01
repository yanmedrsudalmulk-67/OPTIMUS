'use client';

import { useAuth } from '@/AuthContext';
import { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/firebase';
import { motion } from 'motion/react';
import { FileText, Download, Filter, Search, FileSpreadsheet, FileOutput, FileBarChart } from 'lucide-react';
import { toast } from 'sonner';

export default function Laporan() {
  const { profile, isAuthReady } = useAuth();
  const [rawData, setRawData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [indikatorList, setIndikatorList] = useState<any[]>([]);
  const [unitList, setUnitList] = useState<any[]>([]);
  
  const [filterBulan, setFilterBulan] = useState<number>(new Date().getMonth() + 1);
  const [filterTahun, setFilterTahun] = useState<number>(new Date().getFullYear());
  const [filterUnit, setFilterUnit] = useState<string>('all');

  useEffect(() => {
    const fetchMasterData = async () => {
      if (!isAuthReady || !profile) return;
      try {
        const indSnapshot = await getDocs(query(collection(db, 'indikator_master'), orderBy('judul', 'asc')));
        const indList: any[] = [];
        indSnapshot.forEach(doc => indList.push({ id: doc.id, ...doc.data() }));
        setIndikatorList(indList);

        if (profile?.role === 'admin') {
          const unitSnapshot = await getDocs(query(collection(db, 'users'), where('role', '==', 'unit')));
          const uList: any[] = [];
          unitSnapshot.forEach(doc => uList.push({ id: doc.id, ...doc.data() }));
          setUnitList(uList);
        }
      } catch (error) {
        console.error("Error fetching master data:", error);
      }
    };
    fetchMasterData();
  }, [profile, isAuthReady]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthReady || !profile) return;
      setLoading(true);
      
      try {
        let q;
        
        if (profile.role === 'unit') {
          q = query(
            collection(db, 'data_indikator'), 
            where('created_by', '==', profile.uid),
            where('bulan', '==', filterBulan),
            where('tahun', '==', filterTahun)
          );
        } else {
          if (filterUnit === 'all') {
            q = query(
              collection(db, 'data_indikator'),
              where('bulan', '==', filterBulan),
              where('tahun', '==', filterTahun)
            );
          } else {
            q = query(
              collection(db, 'data_indikator'),
              where('created_by', '==', filterUnit),
              where('bulan', '==', filterBulan),
              where('tahun', '==', filterTahun)
            );
          }
        }

        const snapshot = await getDocs(q);
        const fetched: any[] = [];
        snapshot.forEach(doc => fetched.push({ id: doc.id, ...doc.data() }));
        setRawData(fetched);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [profile, isAuthReady, filterBulan, filterTahun, filterUnit]);

  const data = useMemo(() => {
    if (indikatorList.length === 0) return [];
    return rawData.map(d => {
      const ind = indikatorList.find(i => i.id === d.indikator_id);
      return {
        ...d,
        indikatorNama: ind ? ind.judul : 'Unknown Indikator',
        target: ind ? ind.target : 0,
        kategori: ind ? ind.kategori : '-'
      };
    });
  }, [rawData, indikatorList]);

  if (profile?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600 dark:text-[var(--muted-foreground)]">Anda tidak memiliki akses ke halaman ini.</p>
      </div>
    );
  }

  const exportPDF = async () => {
    if (data.length === 0) {
      toast.error('Tidak ada data untuk diekspor');
      return;
    }
    
    setLoading(true);
    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');
      
      const doc = new jsPDF();
      const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      
      doc.setFontSize(16);
      doc.text('Laporan Capaian Indikator Mutu', 14, 20);
      doc.setFontSize(11);
      doc.text(`Periode: ${months[filterBulan - 1]} ${filterTahun}`, 14, 28);
      
      if (filterUnit !== 'all') {
        const unitName = unitList.find(u => u.id === filterUnit)?.username || 'Unit';
        doc.text(`Unit: ${unitName}`, 14, 34);
      }

      const tableColumn = ["No", "Kategori", "Indikator", "Unit", "Capaian", "Target"];
      const tableRows: any[] = [];

      data.forEach((item, index) => {
        const rowData = [
          index + 1,
          item.kategori,
          item.indikatorNama,
          item.unit,
          `${item.nilai}%`,
          `${item.target}%`
        ];
        tableRows.push(rowData);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: filterUnit !== 'all' ? 40 : 34,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [37, 99, 235], textColor: 255 }
      });

      doc.save(`Laporan_Mutu_${months[filterBulan - 1]}_${filterTahun}.pdf`);
      toast.success('Laporan PDF berhasil diunduh');
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error('Gagal mengekspor PDF');
    } finally {
      setLoading(false);
    }
  };

  const exportExcel = async () => {
    if (data.length === 0) {
      toast.error('Tidak ada data untuk diekspor');
      return;
    }

    setLoading(true);
    try {
      const XLSX = await import('xlsx');
      const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      
      const exportData = data.map((item, index) => ({
        'No': index + 1,
        'Kategori': item.kategori,
        'Indikator': item.indikatorNama,
        'Unit': item.unit,
        'Capaian (%)': item.nilai,
        'Target (%)': item.target,
        'Status': item.nilai >= item.target ? 'Tercapai' : 'Tidak Tercapai'
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Laporan Mutu");
      XLSX.writeFile(wb, `Laporan_Mutu_${months[filterBulan - 1]}_${filterTahun}.xlsx`);
      toast.success('Laporan Excel berhasil diunduh');
    } catch (error) {
      console.error("Error exporting Excel:", error);
      toast.error('Gagal mengekspor Excel');
    } finally {
      setLoading(false);
    }
  };

  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-[var(--foreground)] tracking-tight flex items-center gap-3">
            <FileBarChart className="w-8 h-8 text-emerald-600" />
            Laporan Mutu
          </h1>
          <p className="text-gray-600 dark:text-[var(--muted-foreground)] mt-2 leading-relaxed">Rekapitulasi dan unduh laporan capaian indikator</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportExcel}
            className="bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
          >
            <FileSpreadsheet className="w-5 h-5" />
            <span className="hidden sm:inline">Export Excel</span>
          </button>
          <button
            onClick={exportPDF}
            className="bg-teal-600/10 hover:bg-teal-600/20 text-teal-700 dark:text-teal-400 border border-teal-500/30 px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 hover:shadow-[0_0_15px_rgba(20,184,166,0.2)]"
          >
            <FileOutput className="w-5 h-5" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[var(--card)] rounded-3xl shadow-xl border border-gray-200 dark:border-[var(--border)] p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 relative z-10">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[var(--muted-foreground)] w-5 h-5" />
            <select
              value={filterBulan}
              onChange={(e) => setFilterBulan(parseInt(e.target.value))}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-[var(--border)] rounded-xl focus:ring-2 focus:ring-emerald-500 bg-gray-50 dark:bg-[var(--foreground)]/5 text-gray-900 dark:text-[var(--foreground)] appearance-none outline-none transition-all font-bold"
            >
              {months.map((m, i) => (
                <option key={i} value={i + 1} className="bg-white dark:bg-[var(--card)] text-gray-900 dark:text-[var(--foreground)]">{m}</option>
              ))}
            </select>
          </div>
          <div className="relative">
            <select
              value={filterTahun}
              onChange={(e) => setFilterTahun(parseInt(e.target.value))}
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-[var(--border)] rounded-xl focus:ring-2 focus:ring-emerald-500 bg-gray-50 dark:bg-[var(--foreground)]/5 text-gray-900 dark:text-[var(--foreground)] appearance-none outline-none transition-all font-bold"
            >
              {years.map(y => (
                <option key={y} value={y} className="bg-white dark:bg-[var(--card)] text-gray-900 dark:text-[var(--foreground)]">{y}</option>
              ))}
            </select>
          </div>
          <div className="relative">
            <select
              value={filterUnit}
              onChange={(e) => setFilterUnit(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-[var(--border)] rounded-xl focus:ring-2 focus:ring-emerald-500 bg-gray-50 dark:bg-[var(--foreground)]/5 text-gray-900 dark:text-[var(--foreground)] appearance-none outline-none transition-all font-bold"
            >
              <option value="all" className="bg-white dark:bg-[var(--card)] text-gray-900 dark:text-[var(--foreground)]">Semua Unit</option>
              {unitList.map(u => (
                <option key={u.id} value={u.uid} className="bg-white dark:bg-[var(--card)] text-gray-900 dark:text-[var(--foreground)]">{u.username}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-[var(--foreground)]/5 border-b border-gray-200 dark:border-[var(--border)] text-gray-800 dark:text-[var(--muted-foreground)] text-sm uppercase tracking-wider">
                <th className="p-4 font-bold rounded-tl-xl">No</th>
                <th className="p-4 font-bold">Indikator</th>
                <th className="p-4 font-bold">Unit</th>
                <th className="p-4 font-bold text-right">Capaian</th>
                <th className="p-4 font-bold text-right rounded-tr-xl">Target</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <div className="flex justify-center items-center gap-3 text-gray-600 dark:text-[var(--muted-foreground)]">
                      <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                      Memuat data...
                    </div>
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((item, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    key={item.id} 
                    className="border-b border-gray-100 dark:border-[var(--border)]/50 hover:bg-gray-50 dark:hover:bg-[var(--foreground)]/5 transition-colors"
                  >
                    <td className="p-4 text-gray-700 dark:text-[var(--muted-foreground)] font-medium">{index + 1}</td>
                    <td className="p-4">
                      <p className="font-bold text-gray-900 dark:text-[var(--foreground)]">{item.indikatorNama}</p>
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md mt-1 inline-block">
                        {item.kategori}
                      </span>
                    </td>
                    <td className="p-4 text-gray-800 dark:text-[var(--foreground)]/80 font-medium">{item.unit}</td>
                    <td className="p-4 text-right">
                      <span className={`font-bold ${item.nilai >= item.target ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                        {item.nilai}%
                      </span>
                    </td>
                    <td className="p-4 text-right text-gray-700 dark:text-[var(--muted-foreground)] font-mono">{item.target}%</td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-600 dark:text-[var(--muted-foreground)]">
                      <FileText className="w-12 h-12 mb-3 opacity-20" />
                      <p className="text-lg font-bold text-gray-900 dark:text-[var(--foreground)]/60">Data tidak ditemukan</p>
                      <p className="text-sm font-medium text-gray-600 dark:text-[var(--muted-foreground)]">Belum ada data yang diinput untuk periode ini.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
