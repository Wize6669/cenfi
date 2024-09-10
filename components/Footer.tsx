import { FaTiktok, FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import React from "react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className={'container mx-auto py-2 flex justify-between items-center border-t-2 border-gray-300 bg bg-gradient-to-b dark:border-gray-700 dark:from-black dark:to-gray-700'}>
      <div>
        <Image
          src="/images/FooterLogo.png"
          alt="Logo"
          width={50}
          height={50}
          className={'rounded-full'}
        />
      </div>
      <div>
        <p className={'text-sm font-medium text-gray-800 dark:text-gray-300'}>
          © 2024 Todos los derechos reservados | CENTRO DE FORMACIÓN INTENSIVA CIA. LTDA. “CENFI” | Loja - Ecuador
        </p>
      </div>
      <div className={'flex justify-between items-center gap-3'}>
        <Link
          className={'border rounded-3xl p-1.5 text-black dark:text-white border-gray-300 dark:border-gray-600'}
          href="https://www.tiktok.com/@preuniversitario.cenfi?_t=8ocuteZQ73G&_r=1"
        >
          <FaTiktok width={45} height={45}/>
        </Link>
        <Link
          className={'border rounded-3xl p-1.5 text-blue-800 dark:text-blue-500 border-gray-300 dark:border-gray-600'}
          href="https://www.facebook.com/share/3xgwpWEhGxW4kViB/?mibextid=qi2Omg"
        >
          <FaFacebookF width={45} height={45} />
        </Link>
        <Link
          className={'border rounded-3xl p-1.5 text-red-700 dark:text-red-500 border-gray-300 dark:border-gray-600'}
          href="https://www.instagram.com/preuniversitario_cenfi?igsh=MTVyZ2c1cnQzNXR3dw=="
        >
          <FaInstagram width={45} height={45} />
        </Link>
        <Link
          className={'border rounded-3xl p-1.5 text-green-700 dark:text-green-500 border-gray-300 dark:border-gray-600'}
          href="https://api.whatsapp.com/send/?phone=593992562952&text&type=phone_number&app_absent=0"
        >
          <FaWhatsapp width={45} height={45} />
        </Link>
      </div>
    </footer>
  );
}
