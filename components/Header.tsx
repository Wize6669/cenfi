'use client'

import Image from 'next/image';
import DropDownProfile from '@/components/DropDownProle/DropDownProfile';
import './DropDownProle/DropDownProfile.css';
import { FaUser } from 'react-icons/fa';
import { IoMdArrowDropdown } from 'react-icons/io';
import React, {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import { useAuthStore} from '@/store/auth';
import UserDropdown from "@/components/DropDownProle/UserDropdown";

export default function Header({children}: Readonly<{children: React.ReactNode;}>) {
  //const [openDropDownProfile, setOpenDropDownProfile] = useState(false);
  //const userAuth = useAuthStore((state) => state.userAuth);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const router = useRouter();
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  useEffect(() => {
    if (!isLoggedIn ) {
      setShowLoginMessage(true);
      const timer = setTimeout(() => {
        router.replace('/admin');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, router]);

  if (showLoginMessage) {
    return (<div className={'flex flex-col min-h-screen'}>
      <div className={'flex-grow flex flex-col justify-center items-center'}>
        <div className={'justify-center gap-2 border-2 rounded-md w-[330px] h-[100px] px-2.5 py-1.5'}>
          <p className={'text-center font-bold text-3xl mb-3'}>⚠️ Inicia sesión ⚠️</p>
          <p className={'text-base'}>Redirigiendo a la página de Log In <b>...</b></p>
        </div>
      </div>
      </div>);
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className={'container mx-auto py-3 flex justify-between items-center'}>
      <div className={'w-1/4'}>
        <Image src={'/images/image-1.png'} alt={'Icon'} width={75} height={60} />
      </div>

      <div className={'w-1/2'}>
        {children}
      </div>

      <div>
        <UserDropdown />
      </div>
    </div>);
}
