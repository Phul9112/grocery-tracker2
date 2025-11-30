import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PriceBasket - Grocery Price Tracker',
  description: 'Track and compare grocery prices across different stores',
  manifest: '/manifest.json',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0ea5e9',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
