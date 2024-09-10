"use client"

import React, { useState, useEffect } from 'react'
import { ChevronUp } from 'lucide-react'

const FloatingCardScrollUpButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY  > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)

    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className={'fixed bottom-5 right-5 p-2 bg-blue-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-lg shadow-md transition-all duration-300 ease-in-out hover:bg-blue-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 sm:p-3 sm:bottom-8 sm:right-8'}
          aria-label={'Scroll to top'}
        >
          <div className={'flex flex-col items-center'}>
            <ChevronUp className={'w-6 h-6 sm:w-8 sm:h-8'} />
          </div>
        </button>
      )}
    </>
  )
}

export default FloatingCardScrollUpButton
