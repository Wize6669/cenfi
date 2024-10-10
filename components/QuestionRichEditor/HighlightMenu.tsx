import React, { useState, useEffect, useRef } from 'react'
import { Highlighter, Trash } from 'lucide-react'
import { EditorProps } from '@/interfaces/Questions'

export default function HighlightMenu({ editor }: EditorProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const colors = [
    { color: '#fbf05a', label: 'Amarillo' },
    { color: '#ffc078', label: 'Anaranjado' },
    { color: '#8ce99a', label: 'Verde' },
    { color: '#74c0fc', label: 'Azul' },
    { color: '#b197fc', label: 'Violeta' },
    { color: 'red', label: 'Rojo' },
  ];

  const toggleHighlight = (color: string) => {
    if (editor) {
      editor.chain().focus().toggleHighlight({ color }).run();
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
                key={index}
                type={'button'}
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
            title={'Eliminar Subrayado'}
            className="flex items-center justify-center w-full mt-2 bg-red-500 hover:bg-red-700 text-white text-xs py-1 rounded"
          >
            <Trash className="w-3 h-3 lg:w-4 lg:h-4 mr-1" /> Quitar
          </button>
        </div>
      )}
    </div>
  );
}
