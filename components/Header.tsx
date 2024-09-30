'use client'

import Image from 'next/image';
import './DropDownProle/DropDownProfile.css';
import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import UserDropdown from "@/components/DropDownProle/UserDropdown";

export default function Header({children}: Readonly<{ children: React.ReactNode; }>) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const router = useRouter();
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setShowLoginMessage(true);
      const timer = setTimeout(() => {
        router.replace('/admin');
      }, 500);

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
    <div className={'container mx-auto py-2 flex justify-between items-center lg:px-0 md:px-4 sm:px-20'}>
      <div
        className={`lg:w-1/2 md:w-auto order-1 md:order-2 flex ${
          children ? 'justify-center md:justify-center lg:justify-start' : 'justify-start'
        }`}
      >
        <Image
          className={'filter dark:drop-shadow-[0_10px_8px_rgba(24,130,172,0.8)] drop-shadow-md pl-2'}
          src={'/images/image-1.png'}
          alt={'Icon'}
          width={80}
          height={65}
        />
      </div>
      {children && (
        <div className={'lg:w-full md:w-3/12 sm:w-1/2 lg:order-2 md:order-1 flex justify-center items-center'}>
          {children}
        </div>
      )}
      <div className={'w-auto order-3 md:order-3 sm:order-3 flex justify-end pr-2'}>
        <UserDropdown/>
      </div>
    </div>
  );
}

/*
<div className={'container mx-auto py-2 flex justify-between items-center lg:px-0 md:px-4 sm:px-20'}>
      <div className={'w-1/2 md:w-auto order-1 md:order-2 flex justify-center md:justify-start'}>
        <Image
          className={'filter dark:drop-shadow-[0_10px_8px_rgba(24,130,172,0.8)] drop-shadow-md pl-2'}
          src={'/images/image-1.png'}
          alt={'Icon'}
          width={80}
          height={65}
        />
      </div>
      <div className={'w-full md:w-1/2 lg:order-2 md:order-1 flex justify-center items-center lg:pr-10'}>
        {children}
      </div>
      <div className={'w-auto order-3 md:order-3 sm:order-3 flex justify-end pr-2'}>
        <UserDropdown/>
      </div>
    </div>
* */
