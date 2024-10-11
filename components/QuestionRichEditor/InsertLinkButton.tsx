import React, { useState, useRef, useEffect, useCallback } from 'react';
import { EditorProps } from '@/interfaces/Questions'
import { Link as LinkIcon, Type, Globe } from 'lucide-react'

export default function InsertLinkButton({ editor }: EditorProps) {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [linkUrl, setLinkUrl] = useState<string>('');
  const [linkText, setLinkText] = useState<string>('');
  const formRef = useRef<HTMLDivElement>(null);

  const resetForm = useCallback((): void => {
    setLinkUrl('');
    setLinkText('');
    setShowForm(false);
  }, []);

  const insertLink = useCallback((): void => {
    if (editor && linkUrl) {
      const { from, to } = editor.state.selection;
      const selectedText = editor.state.doc.textBetween(from, to);

      if (selectedText) {
        editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .setLink({ href: linkUrl, target: '_blank' })
          .run();
      } else {
        editor
          .chain()
          .focus()
          .insertContent([
            {
              type: 'text',
              marks: [{ type: 'link', attrs: { href: linkUrl, target: '_blank' } }],
              text: linkText || linkUrl,
            },
            { type: 'text', text: ' ' },
          ])
          .run();
      }
      resetForm();
    }
  }, [editor, linkUrl, linkText, resetForm]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setLinkUrl(e.target.value);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setLinkText(e.target.value);
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    insertLink();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setShowForm(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setShowForm((prev) => !prev)}
        type={'button'}
        className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
          showForm ? 'bg-gray-200 dark:bg-gray-600' : ''
        }`}
        title="Insertar enlace"
      >
        <LinkIcon className={`w-3 h-3 md:w-4 md:h-4 ${showForm ? 'text-blue-500' : 'text-gray-600 dark:text-blue-400'}`} />
      </button>

      {showForm && (
        <div
          ref={formRef}
          className="absolute z-10 mt-2 bg-white dark:bg-gray-800 rounded-md shadow-lg p-4 w-64 sm:w-80 transition-all duration-200 ease-in-out lg:left-20 lg:-translate-x-56 md:right-0 md:-translate-x-4 left-1/2 transform -translate-x-1/2"
        >
          <div className="space-y-3">
            <div className="relative">
              <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 dark:text-blue-400 w-3 h-3 lg:w-4 lg:h-4" />
              <input
                type="text"
                placeholder="Texto del enlace"
                value={linkText}
                onChange={handleTextChange}
                className="w-full pl-10 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 dark:text-blue-400 w-3 h-3 lg:w-4 lg:h-4" />
              <input
                type="text"
                placeholder="URL del enlace"
                value={linkUrl}
                onChange={handleUrlChange}
                className="w-full pl-10 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleButtonClick}
                type={'button'}
                className="flex-1 px-4 py-2 text-xs lg:text-sm font-medium text-white bg-button-color rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-200"
              >
                Insertar
              </button>
              <button
                onClick={resetForm}
                type={'button'}
                className="flex-1 px-4 py-2 text-xs lg:text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-colors duration-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
