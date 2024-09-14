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

const RadioNavigation: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const handleChange = (value: string) => {
    setSelectedOption(value)
  }

  return (
    <div className={'flex flex-col space-y-1.5'}>
      <label className="text-gray-700 dark:text-gray-300 text-sm sm:text-base font-medium">
        Navegación
      </label>
      <div className="flex flex-row items-center space-x-10 justify-center">
        <CustomRadio
          label="Libre"
          value="libre"
          checked={selectedOption === 'libre'}
          onChange={handleChange}
        />
        <CustomRadio
          label="Secuencial"
          value="secuencial"
          checked={selectedOption === 'secuencial'}
          onChange={handleChange}
        />
      </div>
      {selectedOption === 'libre' && (
        <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
          En la navegación libre puedes moverte entre las preguntas en cualquier orden.
        </div>
      )}
      {selectedOption === 'secuencial' && (
        <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
          En la navegación es secuencial debes responder las preguntas en orden.
        </div>
      )}
    </div>
  )
}

export default RadioNavigation


//Para cuando el simulator ya funcione no BORRAR
/*'use client'

import React from 'react'

interface RadioNavigationProps {
  navigation: string
  handleRadioChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const CustomRadio: React.FC<{
  label: string
  value: string
  checked: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}> = ({ label, value, checked, onChange }) => (
  <label className="flex items-center cursor-pointer">
    <input
      type="radio"
      name="navigation"
      value={value}
      required={true}
      className="hidden"
      checked={checked}
      onChange={onChange}
    />
    <div className={`w-5 h-5 rounded-full border ${checked ? 'border-blue-500 bg-blue-500' : 'border-gray-300'} flex items-center justify-center`}>
      {checked && <div className="w-2 h-2 rounded-full bg-white"></div>}
    </div>
    <span className={`ml-2 text-sm sm:text-base font-medium ${checked ? 'text-blue-600' : 'text-gray-700 dark:text-gray-400'}`}>
      {label}
    </span>
  </label>
)

const RadioNavigation: React.FC<RadioNavigationProps> = ({ navigation, handleRadioChange }) => {
  return (
    <div className={'flex flex-col space-y-1.5'}>
      <label className="text-gray-700 dark:text-gray-300 text-sm sm:text-base font-medium">
        Navegación
      </label>
      <div className="flex flex-row items-center space-x-10 justify-center">
        <CustomRadio
          label="Libre"
          value="libre"
          checked={navigation === 'libre'}
          onChange={handleRadioChange}
        />
        <CustomRadio
          label="Secuencial"
          value="secuencial"
          checked={navigation === 'secuencial'}
          onChange={handleRadioChange}
        />
      </div>
      {navigation === 'libre' && (
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          La navegación es libre, puedes moverte entre las preguntas en cualquier orden.
        </div>
      )}
      {navigation === 'secuencial' && (
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          La navegación es secuencial, debes responder las preguntas en orden.
        </div>
      )}
    </div>
  )
}

export default RadioNavigation
*/
