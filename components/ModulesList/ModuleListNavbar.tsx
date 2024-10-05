'use client'

import React, { useState } from 'react';
import { useAuthStore } from '@/store/auth';
import Link from 'next/link';
import { FiMenu, FiX, FiHome, FiUsers, FiHelpCircle, FiFolder, FiMonitor, FiBookOpen } from 'react-icons/fi';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function ModuleListNavbar() {
  const userAuth = useAuthStore((state) => state.userAuth);
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();

  const navItems = [
    { href: '/admin/menu', text: 'Menú', icon: FiHome },
    { href: '/admin/users', text: 'Usuarios', icon: FiUsers, roleRequired: 1 },
    { href: '/admin/questions', text: 'Preguntas', icon: FiHelpCircle },
    { href: '/admin/categories', text: 'Categorías', icon: FiFolder },
    { href: '/admin/simulators', text: 'Simulador', icon: FiMonitor },
    { href: '/admin/courses', text: 'Curso', icon: FiBookOpen, roleRequired: 1 },
  ];

  const isActive = (href: string) => {
    return pathname.startsWith(href);
  };

  return (
    <nav className={'relative w-full'}>
      {/* Hamburger menu for mobile and tablet */}
      <div className={'lg:hidden flex justify-start'}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={'p-2 text-gray-900 dark:text-gray-200'}
          aria-label="Toggle menu"
        >
          {isOpen ? <FiX size={24}/> : <FiMenu size={24}/>}
        </button>
      </div>

      {/* Navigation items */}
      <div className={`
        lg:flex lg:space-x-8 items-center
        ${isOpen ? 'absolute top-full left-0 right-0 w-36 bg-white dark:bg-gray-800 shadow-md rounded-lg z-10' : 'hidden lg:flex'}
      `}>
        {navItems.map((item, index) => (
          (item.roleRequired === undefined || userAuth?.roleId === item.roleRequired) && (
            <Link
              key={index}
              href={item.href}
              className={`
                relative flex items-center p-2 rounded transition-colors duration-200
                ${isActive(item.href)
                ? 'text-blue-600 dark:text-blue-300'
                : 'text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}
                text-sm lg:text-base
              `}
              onClick={() => setIsOpen(false)}
            >
              <item.icon className={`w-5 h-5 mr-2 ${isActive(item.href) ? 'text-blue-600 dark:text-blue-300' : ''}`}/>
              <span className="lg:inline">{item.text}</span>
              {isActive(item.href) && (
                <motion.div
                  className={'absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-300'}
                  layoutId={'underline'}
                  initial={false}
                />
              )}
            </Link>
          )
        ))}
      </div>
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

/*

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
 */
