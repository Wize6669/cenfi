import React, { useState, useEffect, useRef } from 'react'
import { Highlighter, Trash } from 'lucide-react'
import { EditorProps } from '@/interfaces/Questions'

const isColorLight = (color: string) => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128;
};

export default function HighlightMenu({ editor }: EditorProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  const colors = isDarkMode ? [
    { color: '#f39c12', label: 'Amarillo Oscuro' },
    { color: '#e67e22', label: 'Anaranjado Oscuro' },
    { color: '#2ecc71', label: 'Verde Oscuro' },
    { color: '#3498db', label: 'Azul Oscuro' },
    { color: '#9b59b6', label: 'Violeta Oscuro' },
    { color: '#e74c3c', label: 'Rojo Oscuro' },
  ] : [
    { color: '#fbf05a', label: 'Amarillo' },
    { color: '#ffc078', label: 'Anaranjado' },
    { color: '#8ce99a', label: 'Verde' },
    { color: '#74c0fc', label: 'Azul' },
    { color: '#b197fc', label: 'Violeta' },
    { color: 'red', label: 'Rojo' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleHighlight = (color: string) => {
    if (editor) {
      const textColor = isColorLight(color) ? 'black' : 'white';
      editor.chain().focus().toggleHighlight({ color }).setColor(textColor).run();
      setIsMenuOpen(false);
    }
  };

  const unsetHighlight = () => {
    if (editor) {
      editor.chain().focus().unsetHighlight().run();
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${isMenuOpen ? 'text-blue-500' : 'text-gray-700 dark:text-gray-200'}`}
        type="button"
        title={'Resaltar'}
      >
        <Highlighter className="w-3 h-3 lg:w-4 lg:h-4 dark:text-blue-400" />
      </button>

      {isMenuOpen && (
        <div className="absolute z-10 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg p-2 w-28">
          <div className="grid grid-cols-3 gap-2">
            {colors.map((colorOption, index) => (
              <button
                type={'button'}
                key={index}
                onClick={() => toggleHighlight(colorOption.color)}
                title={colorOption.label}
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: colorOption.color }}
              />
            ))}
          </div>
          <button
            onClick={unsetHighlight}
            type={'button'}
            className="w-full mt-2 bg-red-500 hover:bg-red-700 text-white text-xs py-1 rounded flex items-center justify-center gap-1"
          >
            <Trash className="w-3 h-3 lg:w-4 lg:h-4 mr-1" /> Quitar
          </button>
        </div>
      )}
    </div>
  );
}
