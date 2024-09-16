'use client'

import React, {useState, ChangeEvent, useRef, useEffect } from 'react'
import { Eye, EyeOff, RefreshCw, ClipboardCopy, Check } from 'lucide-react'
import { useClipboardCopy } from '@/hooks/useClipboardCopy'
import { toast, Toaster } from 'react-hot-toast'

interface PasswordInputProps {
  password: string | undefined;
  handleGetDataInput: (event: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
}

export default function PasswordInput({password, handleGetDataInput, label = "Contraseña del Simulador"}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const copyToClipboard = useClipboardCopy()
  const toastRef = useRef<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)

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

  const handleCopyPassword = async () => {
    if (toastRef.current) {
      toast.dismiss(toastRef.current)
    }
    if (password) {
      try {
        await copyToClipboard(password)
        setIsCopied(true)
        toast.success('¡Contraseña copiada!', {
          duration: 2000,
          position: 'top-center',
        })
      } catch (error) {
        toast.error('¡Ups! No se pudo copiar la contraseña.')
      }
    }
  }

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isCopied) {
      timer = setTimeout(() => setIsCopied(false), 3000)
    }
    return () => clearTimeout(timer)
  }, [isCopied])

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
          className="peer w-full h-[35px] p-2 placeholder-gray-400 text-gray-700 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-28
          peer-valid:border-green-500 peer-invalid:border-pink-600"
          placeholder="Ingrese la contraseña del simulador"
          required={true}
          minLength={8}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
          <button
            type="button"
            onClick={handleCopyPassword}
            className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 focus:outline-none peer-focus:text-blue-500"
          >
            {isCopied ? <Check className="h-4 w-4 text-gray-400" /> : <ClipboardCopy className="h-4 w-4" />}
          </button>
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
            className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 focus:outline-none peer-focus:text-blue-500"
          >
            {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
          </button>
        </div>
        <p className="absolute invisible peer-focus:peer-invalid:visible text-pink-600 text-xs">
          La contraseña debe tener al menos 8 caracteres.
        </p>
      </div>
      <Toaster />
    </div>
  )
}
