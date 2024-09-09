'use client'

import {useAuthStore} from '@/store/auth';
import Link from 'next/link';

export default function ModuleListNavbar() {
  const userAuth = useAuthStore((state) => state.userAuth);

  return (
    <nav className={'flex justify-between space-x-1 sm:space-x-20 items-center'}>
      <Link href='/admin/menu' className={'text-with-underline text-gray-900 dark:text-gray-200 transition-colors duration-200'}>
        Menú
      </Link>
      {userAuth?.roleId === 1 ? (
        <Link href='/admin/users' className={'text-with-underline text-gray-900 dark:text-gray-200 transition-colors duration-200'}>
          Usuarios
        </Link>
      ) : ''}
      <Link href='/admin/questions' className={'text-with-underline text-gray-900 dark:text-gray-200 transition-colors duration-200'}>
        Preguntas
      </Link>
      <Link href='/admin/categories' className={'text-with-underline text-gray-900 dark:text-gray-200 transition-colors duration-200'}>
        Categorías
      </Link>
      <Link href='/admin/simulator' className={'text-with-underline text-gray-900 dark:text-gray-200 transition-colors duration-200'}>
        Simulador
      </Link>
    </nav>
  );

}


/*

<Link href='/admin/menu' className={'text-with-underline'}>Menú</Link>
    {userAuth?.roleId === 1 ? <Link href='/admin/users' className={'text-with-underline'}>Usuarios</Link> : '' }
    <Link href='/admin/questions' className={'text-with-underline'}>Preguntas</Link>
    <Link href='/admin/categories' className={'text-with-underline'}>Categorías</Link>
    <Link href='/admin/simulator' className={'text-with-underline'}>Simulador</Link>
  </nav>);
}
*/
