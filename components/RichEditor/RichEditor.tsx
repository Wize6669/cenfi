'use client';

import { type Editor } from '@tiptap/react';
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { generateBlobUrls, createFileName } from '@/utils/images';
import {
  Bold,
  Italic,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Image,
  RotateCcw,
  RotateCw,
  ChevronDown,
  Heading1,
  Heading2,
  Heading3, Pilcrow
} from 'lucide-react';
import { RichEditorFor } from '@/interfaces/RichEditor';
import { axiosInstance } from '@/lib/axios';
import { handleAxiosError } from '@/utils/generatePassword';
import HighlightMenu from '@/components/QuestionRichEditor/HighlightMenu';
import InsertLinkButton from '@/components/QuestionRichEditor/InsertLinkButton';
import ColorPicker from '@/components/QuestionRichEditor/ColorPicker';
import MathButton from '@/components/QuestionRichEditor/MathButton';
import TableButton from '@/components/QuestionRichEditor/TableButton';
import CodeMenu from '@/components/QuestionRichEditor/CodeMenu';

interface MenuBarProps {
  editor: Editor | null;
  type: RichEditorFor;
}

type IsActiveProps = string | { [key: string]: any }

export default function RichEditor({editor, type}: MenuBarProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fontSize, setFontSize] = useState('16px');
  const [editorState, setEditorState] = useState<{ [key: string]: boolean }>({});

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (files.length > 0 && editor) {
      const formData = new FormData();
      formData.append('type', type);
      const titles: string[] = [];
      const urls: string[] = generateBlobUrls(files);

      files.forEach((file) => {
        const auxFileName = createFileName(file.name);
        const renamedFile = new File([file], auxFileName, {type: file.type});

        titles.push(auxFileName);
        formData.append('question', renamedFile);
      });

      // Log del FormData antes de enviarlo
      formData.forEach((value, key) => {
        console.log(key, value);
      });

      axiosInstance.post('/api/v1/questions/images',
        formData,
        {
          headers: {'Content-Type': 'multipart/form-data'},
          validateStatus: function (status) {
            return status < 500; // Resolver solo si el código de estado es menor que 500
          }
        }).then((response) => {
        console.log('Respuesta completa:', response);
        if (response.status === 400) {
          console.error('Error 400:', response.data);
          // Manejar el error 400 aquí
        } else {
          // Procesar la respuesta exitosa
          urls.forEach((url, index) => {
            const src = url;
            const title = titles[index];
            editor.chain().focus().setImage({src, alt: `Imagen ${files[index].name}`, title}).run();
          });
        }
      }).catch((error) => {
        console.error('Error en la solicitud:', error);
        console.error('Detalles del error:', error.response?.data);
        handleAxiosError(error);
      });
    }
  };

  const handleFontSize = (size: string) => {
    setFontSize(size);
    editor?.chain().focus().setFontSize(size).run();
  };

  const isActive = useCallback((props: IsActiveProps) => {
    if (!editor) return false;

    if (typeof props === 'string') {
      return editorState[props] || false;
    }

    if (typeof props === 'object') {
      return Object.entries(props).every(([key, value]) => editorState[`${key}_${value}`] || false);
    }

    return false;
  }, [editor, editorState]);

  useEffect(() => {
    if (editor) {
      const updateState = () => {
        setEditorState({
          bold: editor.isActive('bold'),
          italic: editor.isActive('italic'),
          strike: editor.isActive('strike'),
          paragraph: editor.isActive('paragraph'),
          heading_1: editor.isActive('heading', {level: 1}),
          heading_2: editor.isActive('heading', {level: 2}),
          heading_3: editor.isActive('heading', {level: 3}),
          textAlign_left: editor.isActive({textAlign: 'left'}),
          textAlign_center: editor.isActive({textAlign: 'center'}),
          textAlign_right: editor.isActive({textAlign: 'right'}),
          textAlign_justify: editor.isActive({textAlign: 'justify'}),
          bulletList: editor.isActive('bulletList'),
          orderedList: editor.isActive('orderedList'),
          highlight: editor.isActive('highlight'),
        });
      };

      editor.on('update', updateState);
      updateState();

      const handlePaste = (event: ClipboardEvent) => {
        const items = event.clipboardData?.items;

        if (items) {
          const files: File[] = [];
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
              event.preventDefault();
              const blob = items[i].getAsFile();
              if (blob) {
                files.push(blob);
              }
            }
          }

          if (files.length > 0 && editor) {
            const formData = new FormData();
            formData.append('type', type);
            const titles: string[] = [];
            const urls: string[] = generateBlobUrls(files);

            files.forEach((file) => {
              const auxFileName = createFileName(file.name);
              const renamedFile = new File([file], auxFileName, {type: file.type});

              titles.push(auxFileName);
              formData.append('question', renamedFile);
            });

            axiosInstance.post('/questions/images',
              formData,
              {headers: {'Content-Type': 'multipart/form-data'}}).then((data) => {
              urls.forEach((url, index) => {
                const src = url;
                const title = titles[index];
                editor.chain().focus().setImage({src, alt: `Imagen ${files[index].name}`, title}).run();
              });
            }).catch((error) => {
              handleAxiosError(error);
            });
          }
        }
      };

      const handleDrop = (event: DragEvent) => {
        event.preventDefault();
        const items = event.dataTransfer?.items;

        if (items) {
          const files: File[] = [];
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
              event.preventDefault();
              const blob = items[i].getAsFile();
              if (blob) {
                files.push(blob);
              }
            }
          }

          if (files.length > 0 && editor) {
            const formData = new FormData();
            formData.append('type', type);
            const titles: string[] = [];
            const urls: string[] = generateBlobUrls(files);

            files.forEach((file) => {
              const auxFileName = createFileName(file.name);
              const renamedFile = new File([file], auxFileName, {type: file.type});

              titles.push(auxFileName);
              formData.append('question', renamedFile);
            });

            axiosInstance.post('/questions/images',
              formData,
              {headers: {'Content-Type': 'multipart/form-data'}}).then((data) => {
              urls.forEach((url, index) => {
                const src = url;
                const title = titles[index];
                editor.chain().focus().setImage({src, alt: `Imagen ${files[index].name}`, title}).run();
              });
            }).catch((error) => {
              handleAxiosError(error);
            });
          }
        }
      };

      editor.view.dom.addEventListener('paste', handlePaste);
      editor.view.dom.addEventListener('drop', handleDrop);

      return () => {
        editor.off('update', updateState);
        editor.view.dom.removeEventListener('paste', handlePaste);
        editor.view.dom.removeEventListener('drop', handleDrop);
      };
    }
  }, [editor]);


  if (!editor) {
    return null;
  }

  return (
    <div
      className='bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm transition-colors duration-300 ease-in-out'
    >
      <div className='flex flex-wrap items-center p-0.5 border-b border-gray-300 dark:border-gray-600'>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-1 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            isActive('bold') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
          type={'button'}
          title={'Negrita'}
        >
          <Bold
            className={`w-3 h-3 sm:w-4 sm:h-4 ${isActive('bold') ? 'text-blue-500' : 'text-gray-700 dark:text-blue-400'}`}
          />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-1 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            isActive('italic') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
          type={'button'}
          title={'Cursiva'}
        >
          <Italic
            className={`w-3 h-3 sm:w-4 sm:h-4 ${isActive('italic') ? 'text-blue-500' : 'text-gray-700 dark:text-blue-400'}`}
          />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`p-1 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            isActive('strike') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
          type={'button'}
          title={'Tachado'}
        >
          <Strikethrough
            className={`w-3 h-3 sm:w-4 sm:h-4 ${isActive('strike') ? 'text-blue-500' : 'text-gray-700 dark:text-blue-400'}`}
          />
        </button>
        <div className='mx-1 w-px h-6 bg-gray-300 dark:bg-gray-600'/>
        <button
          onClick={() => editor.chain().focus().toggleHeading({level: 1}).run()}
          className={`p-1 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            isActive('heading_1') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
          type={'button'}
          title={'Título 1'}
        >
          <Heading1
            className={`w-3 h-3 sm:w-4 sm:h-4 ${isActive('heading_1') ? 'text-blue-500' : 'text-gray-700 dark:text-blue-400'}`}
          />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({level: 2}).run()}
          className={`p-1 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            isActive('heading_2') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
          type={'button'}
          title={'Título 2'}
        >
          <Heading2
            className={`w-3 h-3 sm:w-4 sm:h-4 ${isActive('heading_2') ? 'text-blue-500' : 'text-gray-700 dark:text-blue-400'}`}
          />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({level: 3}).run()}
          className={`p-1 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            isActive('heading_3') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
          type={'button'}
          title={'Título 3'}
        >
          <Heading3
            className={`w-3 h-3 sm:w-4 sm:h-4 ${isActive('heading_3') ? 'text-blue-500' : 'text-gray-700 dark:text-blue-400'}`}
          />
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`p-1 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            isActive('paragraph') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
          type={'button'}
          title={'Párrafo'}
        >
          <Pilcrow
            className={`w-3 h-3 sm:w-4 sm:h-4 ${isActive('paragraph') ? 'text-blue-500' : 'text-gray-700 dark:text-blue-400'}`}
          />
        </button>
        <div className='mx-1 w-px h-6 bg-gray-300 dark:bg-gray-600'/>
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-1 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            isActive('textAlign_left') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
          type={'button'}
          title={'Alinear a la izquierda'}
        >
          <AlignLeft
            className={`w-3 h-3 sm:w-4 sm:h-4 ${isActive('textAlign_left') ? 'text-blue-500' : 'text-gray-700 dark:text-blue-400'}`}
          />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-1 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            isActive('textAlign_center') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
          type={'button'}
          title={'Alinear la centro'}
        >
          <AlignCenter
            className={`w-3 h-3 sm:w-4 sm:h-4 ${isActive('textAlign_center') ? 'text-blue-500' : 'text-gray-700 dark:text-blue-400'}`}
          />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-1 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            isActive('textAlign_right') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
          type={'button'}
          title={'Alinear a la derecha'}
        >
          <AlignRight
            className={`w-3 h-3 sm:w-4 sm:h-4 ${isActive('textAlign_right') ? 'text-blue-500' : 'text-gray-700 dark:text-blue-400'}`}
          />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={`p-1 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            isActive('textAlign_justify') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
          type={'button'}
          title={'Texto Justificado'}
        >
          <AlignJustify
            className={`w-3 h-3 sm:w-4 sm:h-4 ${isActive('textAlign_justify') ? 'text-blue-500' : 'text-gray-700 dark:text-blue-400'}`}
          />
        </button>
        <div className='mx-1 w-px h-6 bg-gray-300 dark:bg-gray-600'/>
        <div className='inline-block text-left group relative'>
          <select
            value={fontSize}
            title={'Tamaño de fuente'}
            onChange={(e) => handleFontSize(e.target.value)}
            className='appearance-none bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-blue-600 dark:text-blue-400 px-1 pr-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 transition-colors duration-200 ease-in-out text-xs sm:text-sm md:text-base'
          >
            <option value='10px'>10 px</option>
            <option value='12px'>12 px</option>
            <option value='14px'>14 px</option>
            <option value='16px'>16 px</option>
            <option value='18px'>18 px</option>
            <option value='20px'>20 px</option>
            <option value='24px'>24 px</option>
            <option value='28px'>28 px</option>
          </select>
          <div
            className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-700 dark:text-gray-200'
          >
            <ChevronDown className='w-3 h-3 text-blue-600 dark:text-blue-400'/>
          </div>
        </div>
        <div className='mx-1 w-px h-6 bg-gray-300 dark:bg-gray-600'/>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
          type={'button'}
          title={'Lista con viñetas'}
        >
          <List
            className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive('bulletList') ? 'text-blue-500' : 'text-gray-700 dark:text-blue-400'}`}
          />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
          type={'button'}
          title={'Lista numerada'}
        >
          <ListOrdered
            className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive('orderedList') ? 'text-blue-500' : 'text-gray-700 dark:text-blue-400'}`}
          />
        </button>
        <div className='mx-1 w-px h-6 bg-gray-300 dark:bg-gray-600'/>
        <button
          onClick={handleImageUpload}
          className='p-1 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700'
          type={'button'}
          title={'Subir imagen'}
        >
          <Image className='w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-blue-400'/>
        </button>
        <input
          type='file'
          accept='image/*'
          ref={fileInputRef}
          style={{display: 'none'}}
          onChange={handleFileChange}
        />
        <div className='mx-1 w-px h-6 bg-gray-300 dark:bg-gray-600'/>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className='p-1 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700'
          type={'button'}
          title={' Deshacer'}
        >
          <RotateCcw className='w-3 h-3 sm:w-4 sm:h-4 text-gray-700 dark:text-blue-400'/>
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className='p-1 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700'
          type={'button'}
          title={'Rehacer'}
        >
          <RotateCw className='w-3 h-3 sm:w-4 sm:h-4 text-gray-700 dark:text-blue-400'/>
        </button>
        <div className='mx-1 w-px h-6 bg-gray-300 dark:bg-gray-600'/>
        <HighlightMenu editor={editor}/>
        <div className='mx-1 w-px h-6 bg-gray-300 dark:bg-gray-600'/>
        <InsertLinkButton editor={editor}/>
        <div className='mx-1 w-px h-6 bg-gray-300 dark:bg-gray-600'/>
        <ColorPicker editor={editor}/>
        <div className='mx-1 w-px h-6 bg-gray-300 dark:bg-gray-600'/>
        <MathButton editor={editor}/>
        <TableButton editor={editor}/>
        <div className='mx-1 w-px h-6 bg-gray-300 dark:bg-gray-600'/>
        <CodeMenu editor={editor}/>
      </div>
    </div>
  );
};
