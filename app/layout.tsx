import type {Metadata} from "next";
import "./globals.css";
import {Poppins} from "next/font/google";
import React from "react";
import {Toaster} from 'react-hot-toast';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: "CENFI",
  description: "CENFI cuenta con un simulador para el ingreso a las universidades",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
    <body className={poppins.className}>{children}</body>
    <Toaster position="top-center"
             reverseOrder={false}/>
    </html>
  );
}
