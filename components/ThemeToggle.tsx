'use client'

import React, { useState } from 'react'
import { Sun, Moon, Laptop } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/hooks/useTheme'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { theme, switchTheme } = useTheme()

  useState(() => {
    setMounted(true)
  },)

  if (!mounted) {
    return null
  }

  const themeOptions = [
    { value: 'light', icon: Sun, label: 'Claro', color: 'text-yellow-500' },
    { value: 'dark', icon: Moon, label: 'Oscuro', color: 'text-blue-500' },
    { value: 'system', icon: Laptop, label: 'Sistema', color: 'text-gray-500' },
  ]

  const currentTheme = themeOptions.find((option) => option.value === theme) || themeOptions[0]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-400 dark:focus:ring-offset-gray-900 dark:focus:ring-gray-500"
      >
        <currentTheme.icon className={`h-5 w-5 ${currentTheme.color}`}/>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{opacity: 0, y: -10}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -10}}
            className="absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
          >
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    switchTheme(option.value)
                    setIsOpen(false)
                  }}
                  className={`${
                    theme === option.value || (option.value === 'system' && theme === 'system') ? 'bg-gray-100 dark:bg-gray-700' : ''
                  } flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700`}
                  role="menuitem"
                >
                  <option.icon className={`mr-3 h-5 w-5 ${option.color}`}/>
                  {option.label}
                </button>
              ))}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
