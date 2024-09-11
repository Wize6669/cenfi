'use client'

import React, { useState } from 'react'
import { Sun, Moon, Laptop, Menu, LogOut, User, ShieldCheck, BookOpen, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from '@/hooks/useTheme'
import { useAuthStore } from "@/store/auth"
import { useRouter } from "next/navigation"

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isThemeOpen, setIsThemeOpen] = useState(false)
  const { theme, switchTheme } = useTheme()
  const userAuth = useAuthStore((state) => state.userAuth)
  const router = useRouter()

  const userRol = userAuth?.roleId === 1 ? 'Administrador' : 'Profesor'
  const userName = userAuth?.name + " " + userAuth?.lastName

  const handleMainMenuToggle = () => {
    setIsOpen(prev => {
      if (!prev) {
        setIsThemeOpen(false)
      }
      return !prev
    })
  }

  const handleLogOut = (event: React.MouseEvent<HTMLButtonElement>) => {
    localStorage.clear()
    router.replace('/admin')
  }

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className={'mr-3 h-5 w-5 text-yellow-500 transition-all'} />
      case "dark":
        return <Moon className={'mr-3 h-5 w-5 text-blue-500 transition-all'} />
      case "system":
        return <Laptop className={'mr-3 h-5 w-5 text-gray-500 transition-all'} />
      default:
        return <Sun className={'mr-3 h-5 w-5 text-yellow-500 transition-all'} />
    }
  }

  return (
    <div className={'relative md:ml-auto pr-2'}>
      <button
        onClick={handleMainMenuToggle}
        className={'flex items-center bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white rounded-full md:rounded-lg lg:rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-gray-500'}
      >
        <div className={'flex items-center px-4 py-2 text-sm text-gray-800 dark:text-white min-w-0 w-auto'}>
          <User className={'lg:mr-2 md:mr-2 h-5 w-5 flex-shrink-0'}/>
          <span className={'hidden md:inline truncate'}>{userName}</span>
          {isOpen ? (
            <ChevronUp className={'lg:ml-2 md:ml-2 h-5 w-5 hidden md:inline'}/>
          ) : (
            <ChevronDown className={'lg:ml-2 md:ml-2 h-5 w-5 hidden md:inline'}/>
          )}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={'absolute right-3 md:right-auto md:left-0 mt-2 lg:w-56 md:w-52 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50'}
          >
            <div className={'py-1'} role="menu">
              <div className={'px-4 text-sm text-gray-600 dark:text-gray-300 font-semibold'}>
                Inicio sesión como
              </div>
              <div className={'flex items-center px-4 py-2 text-sm text-gray-800 dark:text-white min-w-0 w-auto whitespace-nowrap'}>
                {userAuth?.roleId === 1 ? (
                  <ShieldCheck className={'mr-2 h-5 w-5 flex-shrink-0'} />
                ):(
                  <BookOpen className={'mr-2 h-5 w-5 flex-shrink-0'} />
                )}
                <span className={'truncate'}>{userRol}</span>
              </div>
              <hr className={'border-gray-200 dark:border-gray-700'} />
              <button
                className={'flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
                onClick={() => router.push('/admin/menu')}
              >
                <Menu className={'mr-3 h-5 w-5 text-blue-800'} />
                Ir al menú
              </button>
              <button
                className={'flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
                onClick={handleLogOut}
              >
                <LogOut className={'mr-3 h-5 w-5 text-red-700'} />
                Cerrar Sesión
              </button>
              <div className={'relative'}>
                <button
                  className={'flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
                  onClick={() => setIsThemeOpen(prev => !prev)}
                >
                  <div className={'flex items-center'}>
                    {getThemeIcon()}
                    Cambiar tema
                  </div>
                  {isThemeOpen ? (
                    <ChevronDown className={'ml-2 h-5 w-5'} />
                  ) : (
                    <ChevronRight className={'ml-2 h-5 w-5'} />
                  )}
                </button>
                <AnimatePresence>
                  {isThemeOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={'md:absolute lg:left-full md:down-full md:top-12 md:mt-0 lg:top-0 w-full md:w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50'}
                    >
                      <button
                        className={`flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${theme === "light" ? "bg-gray-100 dark:bg-gray-700" : ""}`}
                        onClick={() => {
                          switchTheme("light")
                          setIsThemeOpen(false)
                        }}
                      >
                        <Sun className={'mr-3 h-5 w-5 text-yellow-500'} />
                        Claro
                      </button>
                      <button
                        className={`flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${theme === "dark" ? "bg-gray-100 dark:bg-gray-700" : ""}`}
                        onClick={() => {
                          switchTheme("dark")
                          setIsThemeOpen(false)
                        }}
                      >
                        <Moon className={'mr-3 h-5 w-5 text-blue-500'} />
                        Oscuro
                      </button>
                      <button
                        className={`flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${theme === "system" ? "bg-gray-100 dark:bg-gray-700" : ""}`}
                        onClick={() => {
                          switchTheme("system")
                          setIsThemeOpen(false)
                        }}
                      >
                        <Laptop className={'mr-3 h-5 w-5 text-gray-500'} />
                        Sistema
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default UserDropdown
