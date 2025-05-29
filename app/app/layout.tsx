import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import PageLayout from '@/components/layout/page-layout';
import { ScrollSettingsProvider } from '@/contexts/scroll-settings-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PHI',
  description: 'PHI Mobile Application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ScrollSettingsProvider>
            <PageLayout>
              {children}
            </PageLayout>
          </ScrollSettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}