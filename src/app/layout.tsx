
import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import ClientLayout from './ClientLayout';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://cybermozhi.in'),

  title: {
    default: 'CyberMozhi – Indian Cyber Law & Digital Safety AI Assistant',
    template: '%s | CyberMozhi',
  },

  description:
    'CyberMozhi is a bilingual AI assistant for Indian cyber law, online scams, digital safety, and cybersecurity. Get cyber law guidance in English and Tamil.',

  keywords: [
    'CyberMozhi',
    'Indian cyber law',
    'cyber law AI assistant',
    'online scam checker',
    'cybersecurity India',
    'Tamil cyber law',
    'digital safety',
  ],

  authors: [{ name: 'CyberMozhi' }],
  creator: 'CyberMozhi',
  publisher: 'CyberMozhi',

  alternates: {
    canonical: '/',
  },

  icons: {
    icon: '/favicon.png',
  },

  openGraph: {
    type: 'website',
    url: 'https://cybermozhi.in/',
    siteName: 'CyberMozhi',
    title: 'CyberMozhi – Indian Cyber Law & Digital Safety AI Assistant',
    description:
      'Explore Indian cyber law, online scam awareness, and digital safety with CyberMozhi, your bilingual AI assistant.',
    images: [
      {
        url: '/favicon.png',
        width: 512,
        height: 512,
        alt: 'CyberMozhi logo',
      },
    ],
  },

  twitter: {
    card: 'summary',
    title: 'CyberMozhi – Indian Cyber Law & Digital Safety AI Assistant',
    description:
      'Bilingual AI assistance for Indian cyber law, online scams, and digital safety.',
    images: ['/favicon.png'],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body
        suppressHydrationWarning
        className={`${inter.variable} h-screen overflow-hidden bg-background font-body antialiased`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}