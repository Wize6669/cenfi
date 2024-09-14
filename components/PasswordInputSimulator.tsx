import React, { useState, ChangeEvent } from 'react'
import { Eye, EyeOff, RefreshCw } from 'lucide-react'

interface PasswordInputProps {
  password: string | undefined;
  handleGetDataInput: (event: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
password,
handleGetDataInput,
label = "Contraseña del Simulador"
}) => {
  const [showPassword, setShowPassword] = useState(false)

  const generatePassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}[]|:;<>,.?~"
    let newPassword = ''
    for (let i = 0; i < 12; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    const event = {
      target: { name: 'password', value: newPassword }
    } as ChangeEvent<HTMLInputElement>
    handleGetDataInput(event)
  }

  return (
    <div>
      <label htmlFor="password" className="block text-base font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          id="password"
          name="password"
          value={password}
          onChange={handleGetDataInput}
          className="peer w-full h-[35px] p-2 placeholder-gray-400 text-gray-700 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-20
          peer-valid:border-green-500 peer-invalid:border-pink-600"
          placeholder="Ingrese la contraseña del simulador"
          required={true}
          minLength={8}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <button
            type="button"
            onClick={generatePassword}
            className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 focus:outline-none peer-focus:text-blue-500"
          >
            <RefreshCw className="h-4 w-4"/>
          </button>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="ml-2 text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 focus:outline-none peer-focus:text-blue-500"
          >
            {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
          </button>
        </div>
        <p className="absolute invisible peer-focus:peer-invalid:visible text-pink-600 text-xs">
          La contraseña debe tener al menos 8 caracteres.
        </p>
      </div>
    </div>
  )
}

export default PasswordInput
