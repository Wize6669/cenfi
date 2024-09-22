import type {Metadata} from 'next';
import './globals.css';
import {Poppins} from 'next/font/google';
import React from 'react';
import {Toaster} from 'react-hot-toast';
import ReactQueryProvider from '@/providers/ReactQueryProvider';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'CENFI CIA. LTDA.',
  description: 'CENFI cuenta con un simulador para el ingreso a las universidades',
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang='es' className={'scrollbar-custom'}>
    <body className={poppins.className}>
    <ReactQueryProvider>
      {children}
      <Toaster position='top-center'
               reverseOrder={false}/>
    </ReactQueryProvider>
    </body>
    </html>
  );
}
