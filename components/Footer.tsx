import {FaTiktok, FaFacebookF, FaInstagram, FaWhatsapp} from "react-icons/fa";
import Link from "next/link";
import React from "react";
import Image from "next/image";

export default function Footer() {

  return (
    <footer className={'container mx-auto py-2 flex justify-between items-center border-t-2'}>
      <div>
        <Image
          src="/images/FooterLogo.png"
          alt="Logo"
          width={50}
          height={50}
          className="rounded-full"
        />
      </div>
      <div><p className={'text-sm font-medium'}>© 2024 Todos los derechos reservados | CENTRO DE FORMACIÓN INTENSIVA CIA. LTDA. “CENFI” |
        Loja - Ecuador</p></div>
      <div className={'flex justify-between items-center gap-3'}>
        <Link className={'border rounded-3xl p-1.5 text-black'}
              href={"https://www.tiktok.com/@preuniversitario.cenfi?_t=8ocuteZQ73G&_r=1"}>
          <FaTiktok width={45} height={45}/>
        </Link>
        <Link className={'border rounded-3xl p-1.5 text-blue-800'}
              href={"https://www.facebook.com/share/3xgwpWEhGxW4kViB/?mibextid=qi2Omg"}>
          <FaFacebookF width={45} height={45}/>
        </Link>
        <Link className={'border rounded-3xl p-1.5 text-red-700'}
              href={"https://www.instagram.com/preuniversitario_cenfi?igsh=MTVyZ2c1cnQzNXR3dw=="}>
          <FaInstagram width={45} height={45}/>
        </Link>
        <Link className={'border rounded-3xl p-1.5 text-green-700'}
              href={"https://api.whatsapp.com/send/?phone=593992562952&text&type=phone_number&app_absent=0"}>
          <FaWhatsapp width={45} height={45}/>
        </Link>
      </div>
    </footer>
  )
}
