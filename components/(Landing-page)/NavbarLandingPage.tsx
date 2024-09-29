"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, Home, Phone, Users, BookOpen, ShieldCheck, AppWindow } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

const navItems = [
  { name: 'Inicio', href: '/', icon: Home },
  { name: 'Cursos', href: '/course', icon: AppWindow },
  { name: 'Contacto', href: '/contact', icon: Phone },
  { name: 'Sobre nosotros', href: '/about', icon: Users },
  { name: 'Administración', href: '/admin', icon: ShieldCheck },
  { name: 'Simuladores', href: '/simulator', icon: BookOpen }
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-48">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" passHref>
              <Image
                src="/images/image-1.png"
                alt="CENFI Logo"
                width={60}
                height={70}
                priority={true}
                style={{ width: 'auto', height: 'auto' }}
              />
            </Link>
            <span className="hidden lg:inline ml-4 text-l font-bold text-blue-900 dark:text-gray-400">
              CENTRO DE FORMACIÓN INTENSIVA CIA. LTDA.
            </span>
            <span className="lg:hidden ml-4 text-l font-bold text-blue-900 dark:text-gray-400">
              CENFI CIA. LTDA.
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group relative flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-gray-700/50 px-3 py-2 rounded-md text-sm font-medium"
              >
                <item.icon className="w-5 h-5 text-blue-700 dark:text-blue-400 mr-2" />
                <span className="hidden lg:inline">{item.name}</span>
              </Link>
            ))}
            <ThemeToggle />
          </div>

          <div className="md:hidden flex items-center">
            <ThemeToggle />
            <button onClick={() => setIsOpen(!isOpen)} className="ml-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 shadow-lg">
              {navItems.map((item) => (
                <Link key={item.name} href={item.href} className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white px-3 py-2 rounded-md text-base font-medium">
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
