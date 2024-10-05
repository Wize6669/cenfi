import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ChevronDown, ChevronUp } from 'lucide-react'

interface CoursesFilterProps {
  onSearchChange: (term: string) => void
  onSortChange: (sort: string) => void
  totalCourses: number
}

export default function CoursesFilter({ onSearchChange, onSortChange, totalCourses }: CoursesFilterProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState('default')
  const [isSelectOpen, setIsSelectOpen] = useState(false)
  const [selectWidth, setSelectWidth] = useState('auto')
  const selectRef = useRef<HTMLButtonElement>(null)

  const clearSearch = () => {
    setSearchTerm('')
    onSearchChange('')
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)
    onSearchChange(term)
  }

  const handleSortChange = (sort: string) => {
    setSortOption(sort)
    setIsSelectOpen(false)
    onSortChange(sort)
  }

  useEffect(() => {
    const updateSelectWidth = () => {
      if (selectRef.current) {
        const options = ['Precio: menor a mayor', 'Precio: mayor a menor', 'Sin ordenar']
        const maxWidth = Math.max(...options.map(option => {
          const tempSpan = document.createElement('span')
          tempSpan.style.visibility = 'hidden'
          tempSpan.style.position = 'absolute'
          tempSpan.style.whiteSpace = 'nowrap'
          tempSpan.innerHTML = option
          document.body.appendChild(tempSpan)
          const width = tempSpan.offsetWidth
          document.body.removeChild(tempSpan)
          return width
        }))
        setSelectWidth(`${maxWidth + 40}px`)
      }
    }

    updateSelectWidth()
    window.addEventListener('resize', updateSelectWidth)
    return () => window.removeEventListener('resize', updateSelectWidth)
  }, [])

  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
      <p className="text-base sm:text-lg md:text-xl font-bold text-blue-900 dark:text-blue-500 mb-4 md:mb-0 text-left">
        Cursos disponibles: {totalCourses}
      </p>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
        <div className="relative flex-grow md:flex-grow-0">
          <input
            type="text"
            placeholder="Buscar por universidad..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full md:w-64 pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18}/>
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <div className="relative" style={{ width: selectWidth }}>
          <button
            ref={selectRef}
            onClick={() => setIsSelectOpen(!isSelectOpen)}
            className="w-full bg-white py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white flex justify-between items-center text-sm sm:text-base"
          >
            <span className="truncate">
              {sortOption === 'default' ? 'Todos' :
                sortOption === 'asc' ? 'Precio: menor a mayor' :
                  'Precio: mayor a menor'}
            </span>
            {isSelectOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          <AnimatePresence>
            {isSelectOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg"
              >
                {[
                  { value: 'default', label: 'Sin ordenar' },
                  { value: 'asc', label: 'Precio: menor a mayor' },
                  { value: 'desc', label: 'Precio: mayor a menor' }
                ].map((option) => (
                  <button
                    key={option.value}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 text-sm sm:text-base"
                    onClick={() => handleSortChange(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
