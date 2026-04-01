'use client';

import { useAuth } from '@/AuthContext';
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '@/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Edit2, Trash2, X, Filter, Database, FileText, Eye } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Indikator {
  id: string;
  kategori: 'INM' | 'IMP-RS' | 'IMP-Unit' | 'SPM';
  judul: string;
  penanggung_jawab?: string;
  createdAt: string;
}

export default function ProfilIndikator() {
  const { profile } = useAuth();
  const [indikatorList, setIndikatorList] = useState<Indikator[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKategori, setFilterKategori] = useState<string>('Semua');

  const fetchIndikator = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'indikator_master'), orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);
      const data: Indikator[] = [];
      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        data.push({ 
          id: doc.id, 
          ...docData,
          createdAt: docData.created_at // Map created_at to createdAt for local state if needed
        } as Indikator);
      });
      setIndikatorList(data);
    } catch (error) {
      console.error("Error fetching indikator:", error);
      toast.error('Gagal mengambil data indikator');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchIndikator();
    }
  }, [profile]);

  if (profile?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600 dark:text-[var(--muted-foreground)]">Anda tidak memiliki akses ke halaman ini.</p>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus indikator ini?')) {
      try {
        await deleteDoc(doc(db, 'indikator_master', id));
        toast.success('Indikator berhasil dihapus');
        fetchIndikator();
      } catch (error) {
        console.error("Error deleting indikator:", error);
        toast.error('Gagal menghapus indikator');
      }
    }
  };

  const filteredData = indikatorList.filter(item => {
    const judul = item.judul || '';
    const matchesSearch = judul.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterKategori === 'Semua' || item.kategori === filterKategori;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <Database className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            Profil Indikator
          </h1>
          <p className="text-gray-600 dark:text-slate-400 mt-2 leading-relaxed">Kelola master data indikator mutu rumah sakit</p>
        </div>
        <Link
          href="/profil-indikator/tambah"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2 hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          Tambah Indikator
        </Link>
      </div>

      <div className="bg-white dark:bg-[var(--card)] rounded-3xl shadow-xl border border-gray-200 dark:border-[var(--border)] p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="flex flex-col md:flex-row gap-4 mb-6 relative z-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari judul indikator..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-[var(--border)] rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-[var(--foreground)]/5 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-500 outline-none transition-all font-medium"
            />
          </div>
          <div className="relative min-w-[200px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-500 w-5 h-5" />
            <select
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-[var(--border)] rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-[var(--foreground)]/5 text-gray-900 dark:text-white appearance-none outline-none transition-all font-bold"
            >
              <option value="Semua" className="bg-white dark:bg-[var(--card)] text-gray-900 dark:text-white">Semua Kategori</option>
              <option value="INM" className="bg-white dark:bg-[var(--card)] text-gray-900 dark:text-white">INM</option>
              <option value="IMP-RS" className="bg-white dark:bg-[var(--card)] text-gray-900 dark:text-white">IMP-RS</option>
              <option value="IMP-Unit" className="bg-white dark:bg-[var(--card)] text-gray-900 dark:text-white">IMP-Unit</option>
              <option value="SPM" className="bg-white dark:bg-[var(--card)] text-gray-900 dark:text-white">SPM</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4 relative z-10">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-50 dark:bg-[var(--foreground)]/5 rounded-xl animate-pulse border border-gray-100 dark:border-[var(--border)]"></div>
            ))}
          </div>
        ) : filteredData.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 relative z-10">
            {filteredData.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={item.id}
                className="border border-gray-100 dark:border-[var(--border)] rounded-xl p-5 hover:border-blue-500/50 hover:shadow-lg transition-all bg-white dark:bg-[var(--card)]/50 backdrop-blur-sm group"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold tracking-wider ${
                        item.kategori === 'INM' ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20' :
                        item.kategori === 'IMP-RS' ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20' :
                        item.kategori === 'SPM' ? 'bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20' :
                        'bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20'
                      }`}>
                        {item.kategori}
                      </span>
                      {item.penanggung_jawab && (
                        <span className="text-xs font-bold text-gray-700 dark:text-slate-400 bg-gray-50 dark:bg-[var(--foreground)]/5 px-2 py-1 rounded border border-gray-100 dark:border-[var(--border)]">
                          PIC: {item.penanggung_jawab}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 leading-tight">{item.judul}</h3>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <Link
                      href={`/profil-indikator/${item.id}`}
                      className="p-2 text-blue-600 hover:bg-blue-500/20 rounded-lg transition-colors border border-transparent hover:border-blue-500/30"
                      title="Lihat Detail"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/profil-indikator/${item.id}/edit`}
                      className="p-2 text-blue-600 hover:bg-blue-500/20 rounded-lg transition-colors border border-transparent hover:border-blue-500/30"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-600 hover:bg-red-500/20 rounded-lg transition-colors border border-transparent hover:border-red-500/30"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 relative z-10">
            <div className="bg-gray-50 dark:bg-[var(--foreground)]/5 border border-gray-100 dark:border-[var(--border)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-300 dark:text-slate-700" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Tidak ada data</h3>
            <p className="text-gray-600 dark:text-slate-400">Indikator tidak ditemukan atau belum ditambahkan.</p>
          </div>
        )}
      </div>
    </>
  );
}
