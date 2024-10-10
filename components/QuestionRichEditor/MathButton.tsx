import React, { useEffect, useRef, useState } from 'react';
import { TbAlpha, TbBeta, TbMathFunction, TbSquareRoot } from 'react-icons/tb';
import {
  PiGreaterThan,
  PiGreaterThanOrEqual,
  PiLessThan,
  PiLessThanOrEqual,
  PiSigma,
  PiTextSuperscript
} from "react-icons/pi";
import {IoInfiniteOutline} from "react-icons/io5";
import {LuPi} from "react-icons/lu";
import {Calculator} from "lucide-react";
import { EditorProps } from '@/interfaces/Questions'

export default function MathButton ({ editor }: EditorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const mathSymbols = [
    { symbol: '\\alpha', icon: <TbAlpha />, text: 'Alpha'},
    { symbol: '\\beta', icon: <TbBeta />, text: 'Beta'},
    { symbol: '\\gamma', icon: 'γ', text: 'Gamma'},
    { symbol: '\\delta', icon: 'δ', text: 'Delta'},
    { symbol: '\\epsilon', icon: 'ε', text: 'Epsilon' },
    { symbol: '\\zeta', icon: 'ζ', text:'Zeta'},
    { symbol: '\\eta', icon: 'η', text: 'Eta' },
    { symbol: '\\theta', icon: 'θ', text: 'Theta' },
    { symbol: '\\sum', icon: <PiSigma />, text: 'Sumatorio' },
    { symbol: '\\prod', icon: 'Π', text: 'Prod' },
    { symbol: '\\int', icon: '∫', text: 'Integral' },
    { symbol: '\\frac{a}{b}', icon: 'x/y', text: 'Fracción'},
    { symbol: '\\sqrt{x}', icon: <TbSquareRoot />, text: 'Raíz' },
    { symbol: '\\lim_{x \\to \\infty}', icon: 'limx→a', text: 'Límite' },
    { symbol: '\\sin({x})', icon: 'sin(x)', text: 'Sin(x)' },
    { symbol: '\\cos{x}', icon: 'cos(x)', text: 'Cos(x)' },
    { symbol: '\\tan{x}', icon: 'tan(x)', text: 'Tan(x)' },
    { symbol: '\\log{x}', icon: 'log(x)', text: 'Log(x)' },
    { symbol: '\\ln{x}', icon: 'ln(x)', text: 'Ln(x)' },
    { symbol: '\\exp{x}', icon: <PiTextSuperscript />, text: 'Exponencial' },
    { symbol: '\\infty', icon: <IoInfiniteOutline /> , text: 'Infinito' },
    { symbol: '\\pi', icon: <LuPi />, text: 'Pi' },
    { symbol: '\\>', icon: <PiGreaterThan />, text: 'Mayor que' },
    { symbol: '\\<', icon: <PiLessThan />, text: 'Menor que' },
    { symbol: '\\geq', icon: <PiGreaterThanOrEqual />, text: 'Mayor o igual que' },
    { symbol: '\\leq', icon: <PiLessThanOrEqual />, text: 'Menor o igual que' },
    { symbol: '\\x^{2}+y^{2}=n', icon: <TbMathFunction />, text: 'Función matemática' },
    { symbol: '\\n\\frac{1}{2}', icon: 'n x/y', text: 'Función mixta' },
    { symbol: '\\left( a\\vec{i} + b\\vec{j} \\right)', icon: 'V', text: 'Función matemática' },
  ]

  const menuRef = useRef<HTMLDivElement>(null);

  const insertMath = (symbol: string) => {
    if (editor) {
      editor.chain().focus().insertContent(`$${symbol}$`).run()
      setIsOpen(false)
    }
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={'p-1 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700'}
        type={'button'}
        title={'Símbolos matemáticos'}
      >
        <Calculator className={`w-4 h-4 sm:w-5 sm:h-5 ${isOpen ? 'text-blue-500' : 'text-gray-700 dark:text-blue-400'}`}/>
      </button>
      {isOpen && (
        <div
          className={'absolute z-10 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg p-2 w-48 lg:w-64 lg:left-0 lg:-translate-x-56 left-1/2 transform -translate-x-1/2'}>
          <div className={'max-h-[100px] lg:max-h-[120px] overflow-y-auto grid grid-cols-3 gap-2 left-3'}>
            {mathSymbols.map((item, index) => (
              <button
                key={index}
                onClick={() => insertMath(item.symbol)}
                className={'flex items-center justify-center p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded'}
                title={item.text}
                type={'button'}
              >
                <span className={'text-xs sm:text-sm md:text-sm'}>{item.icon}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
