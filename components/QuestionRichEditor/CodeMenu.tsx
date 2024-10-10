import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { Code, Check, X } from 'lucide-react';

interface CodeMenuProps {
  editor: Editor | null;
}

export default function CodeMenu({ editor }: CodeMenuProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setShowMenu((prev) => !prev);

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!editor) {
    return null;
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={toggleMenu}
        type={'button'}
        className={`p-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded transition-colors duration-200 ${
          showMenu ? 'text-blue-500' : 'text-blue-500 dark:text-blue-400'
        }`}
        title="Opciones de código"
      >
        <Code className="w-3 h-3 lg:w-4 lg:h-4" />
      </button>
      {showMenu && (
        <div
          ref={menuRef}
          className="absolute z-10 mt-2 bg-white dark:bg-gray-800 rounded-md shadow-lg p-2 w-32 border left-20 -translate-x-44 transform"
        >
          <div className="flex space-x-2">
            <button
              onClick={() => {
                editor.chain().focus().toggleCode().run();
                setShowMenu(false);
              }}
              type={'button'}
              className={`p-2 rounded-md ${
                editor.isActive('code')
                  ? 'bg-gray-300 dark:bg-gray-600'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title="Alternar código"
            >
              <Code className="w-4 h-4 text-blue-400" />
            </button>
            <button
              onClick={() => {
                editor.chain().focus().setCode().run();
                setShowMenu(false);
              }}
              type={'button'}
              disabled={editor.isActive('code')}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
              title="Establecer como código"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                editor.chain().focus().unsetCode().run();
                setShowMenu(false);
              }}
              type={'button'}
              disabled={!editor.isActive('code')}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
              title="Quitar formato de código"
            >
              <X className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
