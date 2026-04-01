import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Global styles
import { AuthProvider } from '@/AuthContext';
import { ThemeProvider } from '@/ThemeContext';
import { Toaster } from 'sonner';
import ClientLayoutWrapper from '@/components/ClientLayoutWrapper';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'OPTIMUS - Optimalisasi Sistem Pelaporan Mutu Rumah Sakit',
  description: 'Aplikasi pelaporan mutu rumah sakit',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={inter.variable}>
      <body suppressHydrationWarning className="antialiased transition-colors duration-300 font-sans">
        <ThemeProvider>
          <AuthProvider>
            <ClientLayoutWrapper>
              {children}
            </ClientLayoutWrapper>
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
