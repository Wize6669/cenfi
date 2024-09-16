'use client'

import React, { useState } from 'react'

interface CustomRadioProps {
  label: string
  value: string
  checked: boolean
  onChange: (value: string) => void
}

const CustomRadio: React.FC<CustomRadioProps> = ({ label, value, checked, onChange }) => (
  <label className="flex items-center cursor-pointer">
    <input
      type="radio"
      name="navigation"
      value={value}
      required={true}
      className="hidden"
      checked={checked}
      onChange={() => onChange(value)}
    />
    <div className={`w-5 h-5 rounded-full border ${checked ? 'border-blue-500 bg-blue-500' : 'border-gray-300'} flex items-center justify-center`}>
      {checked && <div className="w-2 h-2 rounded-full bg-white"></div>}
    </div>
    <span className={`ml-2 text-sm sm:text-base font-medium ${checked ? 'text-blue-600' : 'text-gray-700 dark:text-gray-400'}`}>
      {label}
    </span>
  </label>
)

const RadioVisible: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const handleChange = (value: string) => {
    setSelectedOption(value)
  }

  return (
    <div className={'flex flex-col space-y-1.5 z-10'}>
      <label className="text-gray-700 dark:text-gray-300 text-sm sm:text-base font-medium flex lg:justify-center sm:justify-start md:justify-start">
        Visibilidad
      </label>
      <div className="flex flex-row items-center space-x-10 justify-center">
        <CustomRadio
          label="Activo"
          value="activo"
          checked={selectedOption === 'activo'}
          onChange={handleChange}
        />
        <CustomRadio
          label="Inactivo"
          value="inactivo"
          checked={selectedOption === 'inactivo'}
          onChange={handleChange}
        />
      </div>
      {selectedOption === 'activo' && (
        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 flex justify-center">
          El simulador está visible en la web y disponible para su uso.
        </div>
      )}
      {selectedOption === 'inactivo' && (
        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 flex justify-center">
          El simulador no está visible en la web.
        </div>
      )}
    </div>
  )
}

export default RadioVisible;
