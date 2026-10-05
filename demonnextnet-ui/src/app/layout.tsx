import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { SettingsProvider } from '@/context/settings/SettingsContext';
import styles from './layout.module.scss';
import '../styles/globals.scss';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Project Manager',
  description: 'A simple project manager app built with Next.js',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <SettingsProvider>
          <div className={styles.layout}>{children}</div>
        </SettingsProvider>
      </body>
    </html>
  );
}
