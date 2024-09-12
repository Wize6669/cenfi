import { FaTiktok, FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import React from "react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer
      className={'container mx-auto py-4 px-4 flex flex-col md:flex-row justify-between items-center border-t-2 border-gray-300 dark:bg-gray-900'}>
      <div className={'mb-4 md:mb-0'}>
        <Image
          src="/images/image-4.png"
          alt="Logo"
          width={50}
          height={50}
          className={'rounded-full'}
        />
      </div>
      <div className={'text-center mb-4 md:mb-0'}>
        <span className={'hidden lg:inline text-sm font-medium text-gray-800 dark:text-gray-300'}>
          © 2024 Todos los derechos reservados | CENTRO DE FORMACIÓN INTENSIVA CIA. LTDA. “CENFI” | Loja - Ecuador
        </span>
        <span className="lg:hidden ml-4 text-l font-bold text-blue-900 dark:text-gray-400">
          © 2024 | CENFI CIA. LTDA. | Loja - Ecuador
        </span>
      </div>
      <div className={'flex justify-center md:justify-between items-center gap-3 flex-wrap'}>
        <Link
          className={'border rounded-3xl p-2 text-black dark:text-white border-gray-300 dark:border-gray-600'}
          href="https://www.tiktok.com/@preuniversitario.cenfi?_t=8ocuteZQ73G&_r=1" target={'_blank'}
        >
          <FaTiktok className={'w-4 h-4'}/>
        </Link>
        <Link
          className={'border rounded-3xl p-2 text-blue-800 dark:text-blue-500 border-gray-300 dark:border-gray-600'}
          href="https://www.facebook.com/share/3xgwpWEhGxW4kViB/?mibextid=qi2Omg" target={'_blank'}
        >
          <FaFacebookF className={'w-4 h-4'}/>
        </Link>
        <Link
          className={'border rounded-3xl p-2 text-red-700 dark:text-red-500 border-gray-300 dark:border-gray-600'}
          href="https://www.instagram.com/preuniversitario_cenfi?igsh=MTVyZ2c1cnQzNXR3dw==" target={'_blank'}
        >
          <FaInstagram className={'w-4 h-4'}/>
        </Link>
        <Link
          className={'border rounded-3xl p-2 text-green-700 dark:text-green-500 border-gray-300 dark:border-gray-600'}
          href="https://api.whatsapp.com/send/?phone=593992562952&text&type=phone_number&app_absent=0" target={'_blank'}
        >
          <FaWhatsapp className={'w-4 h-4'}/>
        </Link>
      </div>
    </footer>
  );
}
