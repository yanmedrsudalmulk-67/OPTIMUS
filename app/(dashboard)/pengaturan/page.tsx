'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon, Save, Shield, Building } from 'lucide-react';

export default function PengaturanPage() {
  const [logo, setLogo] = useState<string | null>(null);
  const [bgImage, setBgImage] = useState<string | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBgImage(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Pengaturan berhasil disimpan! (Mock)');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-emerald-50 glow-text">Pengaturan Sistem</h1>
        <p className="text-emerald-400/60 mt-2">Konfigurasi tampilan dan identitas rumah sakit.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 rounded-2xl border border-emerald-500/30 shadow-xl"
      >
        <form onSubmit={handleSave} className="space-y-8">
          
          {/* Identitas RS */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-emerald-300 border-l-4 border-emerald-500 pl-3 flex items-center gap-2">
              <Building className="w-5 h-5" /> Identitas Rumah Sakit
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-emerald-400/80 mb-2 uppercase tracking-wider">Nama Rumah Sakit</label>
                <input 
                  type="text" 
                  defaultValue="RSUD Contoh"
                  className="w-full bg-emerald-950/40 border border-emerald-500/30 rounded-lg py-3 px-4 text-emerald-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-emerald-400/80 mb-2 uppercase tracking-wider">Kode RS</label>
                <input 
                  type="text" 
                  defaultValue="RS-001"
                  className="w-full bg-emerald-950/40 border border-emerald-500/30 rounded-lg py-3 px-4 text-emerald-100 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all" 
                />
              </div>
            </div>
          </div>

          {/* Tampilan */}
          <div className="space-y-6 pt-6 border-t border-emerald-500/20">
            <h3 className="text-lg font-semibold text-emerald-300 border-l-4 border-emerald-500 pl-3 flex items-center gap-2">
              <ImageIcon className="w-5 h-5" /> Tampilan Aplikasi
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Logo Upload */}
              <div>
                <label className="block text-xs font-medium text-emerald-400/80 mb-2 uppercase tracking-wider">Logo Rumah Sakit</label>
                <div className="mt-2 flex justify-center rounded-xl border border-dashed border-emerald-500/40 px-6 py-10 bg-emerald-950/20 hover:bg-emerald-950/40 transition-colors relative overflow-hidden group">
                  {logo ? (
                    <img src={logo} alt="Logo" className="max-h-32 object-contain z-10" />
                  ) : (
                    <div className="text-center z-10">
                      <Upload className="mx-auto h-12 w-12 text-emerald-500/50 group-hover:text-emerald-400 transition-colors" aria-hidden="true" />
                      <div className="mt-4 flex text-sm leading-6 text-emerald-400/80 justify-center">
                        <label htmlFor="logo-upload" className="relative cursor-pointer rounded-md font-semibold text-emerald-400 hover:text-emerald-300 focus-within:outline-none">
                          <span>Upload file</span>
                          <input id="logo-upload" name="logo-upload" type="file" className="sr-only" accept="image/*" onChange={handleLogoUpload} />
                        </label>
                        <p className="pl-1">atau drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-emerald-500/50">PNG, JPG, GIF up to 2MB</p>
                    </div>
                  )}
                  {logo && (
                    <label htmlFor="logo-upload" className="absolute inset-0 z-20 cursor-pointer flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white font-medium flex items-center gap-2"><Upload className="w-4 h-4"/> Ganti Logo</span>
                      <input id="logo-upload" name="logo-upload" type="file" className="sr-only" accept="image/*" onChange={handleLogoUpload} />
                    </label>
                  )}
                </div>
              </div>

              {/* Background Upload */}
              <div>
                <label className="block text-xs font-medium text-emerald-400/80 mb-2 uppercase tracking-wider">Gambar Background Login/Landing</label>
                <div className="mt-2 flex justify-center rounded-xl border border-dashed border-emerald-500/40 px-6 py-10 bg-emerald-950/20 hover:bg-emerald-950/40 transition-colors relative overflow-hidden group">
                  {bgImage ? (
                    <img src={bgImage} alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-50 z-0" />
                  ) : null}
                  <div className="text-center z-10 relative">
                    <ImageIcon className="mx-auto h-12 w-12 text-emerald-500/50 group-hover:text-emerald-400 transition-colors" aria-hidden="true" />
                    <div className="mt-4 flex text-sm leading-6 text-emerald-400/80 justify-center">
                      <label htmlFor="bg-upload" className="relative cursor-pointer rounded-md font-semibold text-emerald-400 hover:text-emerald-300 focus-within:outline-none">
                        <span>Upload file</span>
                        <input id="bg-upload" name="bg-upload" type="file" className="sr-only" accept="image/*" onChange={handleBgUpload} />
                      </label>
                      <p className="pl-1">atau drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-emerald-500/50">PNG, JPG up to 5MB</p>
                  </div>
                  {bgImage && (
                    <label htmlFor="bg-upload" className="absolute inset-0 z-20 cursor-pointer flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white font-medium flex items-center gap-2"><Upload className="w-4 h-4"/> Ganti Gambar</span>
                      <input id="bg-upload" name="bg-upload" type="file" className="sr-only" accept="image/*" onChange={handleBgUpload} />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Keamanan */}
          <div className="space-y-6 pt-6 border-t border-emerald-500/20">
            <h3 className="text-lg font-semibold text-emerald-300 border-l-4 border-emerald-500 pl-3 flex items-center gap-2">
              <Shield className="w-5 h-5" /> Keamanan & Akses
            </h3>
            
            <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between">
              <div>
                <h4 className="text-emerald-100 font-medium">Autentikasi Dua Faktor (2FA)</h4>
                <p className="text-sm text-emerald-500/70 mt-1">Tingkatkan keamanan akun Tim Mutu dengan 2FA.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="w-11 h-6 bg-emerald-950/80 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-emerald-200 after:border-emerald-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
          </div>

          <div className="pt-8 border-t border-emerald-500/20 flex justify-end">
            <button 
              type="submit"
              className="flex items-center gap-2 px-8 py-3 bg-emerald-500 text-emerald-950 font-bold rounded-lg hover:bg-emerald-400 transition-all glow-box"
            >
              <Save className="w-5 h-5" />
              Simpan Pengaturan
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
