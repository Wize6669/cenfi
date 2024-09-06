'use client'

import {useAuthStore} from '@/store/auth';
import Link from 'next/link';

export default function ModuleListNavbar() {
  const userAuth = useAuthStore((state) => state.userAuth);

  return(<nav className={'flex justify-between items-center'}>
    <Link href='/admin/menu'>Menú</Link>
    {userAuth?.roleId === 1 && <Link href='/admin/users'>Usuarios</Link> }
    <Link href='/admin/questions'>Preguntas</Link>
    <Link href='/admin/categories'>Categorías</Link>
    <Link href='/admin/simulator'>Simulador</Link>
  </nav>);
}
