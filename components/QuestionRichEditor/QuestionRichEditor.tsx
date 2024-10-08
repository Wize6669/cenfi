'use client'

import { type Editor } from '@tiptap/react'
import React, { useRef, useState, useCallback, useEffect } from 'react'
import { generateBlobUrls } from '@/utils/images'
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
  Highlighter,
  ChevronDown,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  Calculator,
  Table,
  FoldHorizontal,
  Trash2,
  Split,
  Merge,
  LayoutGrid
} from 'lucide-react'
import { TbAlpha, TbBeta, TbSquareRoot, TbMathFunction} from 'react-icons/tb';
import { IoInfiniteOutline } from 'react-icons/io5';
import { PiTextSuperscript, PiSigma, PiLessThan, PiGreaterThan, PiLessThanOrEqual, PiGreaterThanOrEqual} from "react-icons/pi";
import { LuPi } from "react-icons/lu";


interface MenuBarProps {
  editor: Editor | null
}

type IsActiveProps = string | { [key: string]: any }

const MathButton = ({ editor }: { editor: Editor | null }) => {
  const [isOpen, setIsOpen] = useState(false)
  const mathSymbols = [
    { symbol: '\\alpha', icon: <TbAlpha />, text: 'alpha'},
    { symbol: '\\beta', icon: <TbBeta />, text: 'beta'},
    { symbol: '\\gamma', icon: 'γ', text: 'gamma'},
    { symbol: '\\delta', icon: 'δ', text: 'delta'},
    { symbol: '\\epsilon', icon: 'ε', text: 'epsilon' },
    { symbol: '\\zeta', icon: 'ζ', text:'zeta'},
    { symbol: '\\eta', icon: 'η', text: 'eta' },
    { symbol: '\\theta', icon: 'θ', text: 'theta' },
    { symbol: '\\sum', icon: <PiSigma />, text: 'sumatorio' },
    { symbol: '\\prod', icon: 'Π', text: 'prod' },
    { symbol: '\\int', icon: '∫', text: 'integral' },
    { symbol: '\\frac{a}{b}', icon: 'x/y', text: 'fracción'},
    { symbol: '\\sqrt{x}', icon: <TbSquareRoot />, text: 'raíz' },
    { symbol: '\\lim_{x \\to \\infty}', icon: 'limx→a', text: 'límite' },
    { symbol: '\\sin({x})', icon: 'sin(x)', text: 'sin(x)' },
    { symbol: '\\cos{x}', icon: 'cos(x)', text: 'cos(x)' },
    { symbol: '\\tan{x}', icon: 'tan(x)', text: 'tan(x)' },
    { symbol: '\\log{x}', icon: 'log(x)', text: 'log(x)' },
    { symbol: '\\ln{x}', icon: 'ln(x)', text: 'ln(x)' },
    { symbol: '\\exp{x}', icon: <PiTextSuperscript />, text: 'exponencial' },
    { symbol: '\\infty', icon: <IoInfiniteOutline /> , text: 'infinito' },
    { symbol: '\\pi', icon: <LuPi />, text: 'pi' },
    { symbol: '\\>', icon: <PiGreaterThan />, text: 'mayor que' },
    { symbol: '\\<', icon: <PiLessThan />, text: 'menor que' },
    { symbol: '\\geq', icon: <PiGreaterThanOrEqual />, text: 'mayor o igual que' },
    { symbol: '\\leq', icon: <PiLessThanOrEqual />, text: 'menor o igual que' },
    { symbol: '\\x^{2}+y^{2}=n', icon: <TbMathFunction />, text: 'función matemática' },
    { symbol: '\\n\\frac{1}{2}', icon: 'n x/y', text: 'función mixta' },
    { symbol: '\\left( a\\vec{i} + b\\vec{j} \\right)', icon: 'V', text: 'función matemática' },
  ]

  const insertMath = (symbol: string) => {
    if (editor) {
      editor.chain().focus().insertContent(`$${symbol}$`).run()
      setIsOpen(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-blue-400"/>
      </button>
      {isOpen && (
        <div
          className="absolute z-10 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg p-2 w-48 lg:w-64  left-1/2 transform -translate-x-1/2">
          <div className="max-h-[100px] lg:max-h-[120px] overflow-y-auto grid grid-cols-3 gap-2 left-3">
            {mathSymbols.map((item, index) => (
              <button
                key={index}
                onClick={() => insertMath(item.symbol)}
                className="flex items-center justify-center p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                title={item.text}
                type={'button'}
              >
                <span className="text-xs sm:text-sm md:text-sm">{item.icon}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const TableButton = ({ editor }: { editor: Editor | null }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(3)

  const insertTable = () => {
    if (editor) {
      editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run()
      setIsOpen(false)
    }
  }

  const tableControls = [
    { icon: <FoldHorizontal />, action: () => editor?.chain().focus().addColumnAfter().run(), title: 'Añadir columna después' },
    { icon: <FoldHorizontal />, action: () => editor?.chain().focus().addRowAfter().run(), title: 'Añadir fila después' },
    { icon: <Trash2 />, action: () => editor?.chain().focus().deleteTable().run(), title: 'Eliminar tabla' },
    { icon: <Merge />, action: () => editor?.chain().focus().mergeCells().run(), title: 'Combinar celdas' },
    { icon: <Split />, action: () => editor?.chain().focus().splitCell().run(), title: 'Dividir celda' },
    { icon: <LayoutGrid />, action: () => editor?.chain().focus().toggleHeaderRow().run(), title: 'Alternar fila de encabezado' },
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Insertar tabla"
      >
        <Table className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-blue-400"/>
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg p-4 w-64">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Filas:
              <input
                type="number"
                min="1"
                value={rows}
                onChange={(e) => setRows(parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Columnas:
              <input
                type="number"
                min="1"
                value={cols}
                onChange={(e) => setCols(parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </label>
          </div>
          <button
            onClick={insertTable}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Insertar Tabla
          </button>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {tableControls.map((control, index) => (
              <button
                key={index}
                onClick={control.action}
                className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded"
                title={control.title}
              >
                {control.icon}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function QuestionRichEditor({editor}: MenuBarProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [fontSize, setFontSize] = useState('16px');
  const [editorState, setEditorState] = useState<{ [key: string]: boolean }>({});

  const handleImageUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])

    if (files.length > 0 && editor) {
      const urls = generateBlobUrls(files)

      urls.forEach((url, index) => {
        const reader = new FileReader()
        reader.onload = () => {
          const src = reader.result as string
          editor.chain().focus().setImage({ src, alt: `Imagen ${index + 1}` }).run()
        }

        reader.readAsDataURL(files[index])
      })
    }
  }

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
          heading_1: editor.isActive('heading', { level: 1 }),
          heading_2: editor.isActive('heading', { level: 2 }),
          heading_3: editor.isActive('heading', { level: 3 }),
          textAlign_left: editor.isActive({ textAlign: 'left' }),
          textAlign_center: editor.isActive({ textAlign: 'center' }),
          textAlign_right: editor.isActive({ textAlign: 'right' }),
          textAlign_justify: editor.isActive({ textAlign: 'justify' }),
          bulletList: editor.isActive('bulletList'),
          orderedList: editor.isActive('orderedList'),
          highlight: editor.isActive('highlight'),
        });
      };

      editor.on('update', updateState);
      updateState(); // Initial state update

      return () => {
        editor.off('update', updateState);
      };
    }
  }, [editor]);

  if (!editor) {
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm transition-colors duration-300 ease-in-out">
      <div className="flex flex-wrap items-center p-0.5 border-b border-gray-300 dark:border-gray-600">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-1 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            isActive('bold') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
          type={'button'}
        >
          <Bold
            className={`w-3 h-3 sm:w-4 sm:h-4 ${isActive('bold') ? 'text-blue-500' : 'text-gray-700 dark:text-blue-400'}`}/>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-1 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            isActive('italic') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
          type={'button'}
        >
          <Italic
            className={`w-3 h-3 sm:w-4 sm:h-4 ${isActive('italic') ? 'text-blue-500' : 'text-gray-700 dark:text-blue-400'}`}/>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`p-1 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            isActive('strike') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
          type={'button'}
        >
          <Strikethrough
            className={`w-3 h-3 sm:w-4 sm:h-4 ${isActive('strike') ? 'text-blue-500' : 'text-gray-700 dark:text-blue-400'}`}/>
        </button>
        <div className="mx-1 w-px h-6 bg-gray-300 dark:bg-gray-600"/>
        <button
          onClick={() => editor.chain().focus().toggleHeading({level: 1}).run()}
          className={`p-1 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            isActive('heading_1') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
          type={'button'}
        >
          <Heading1
            className={`w-3 h-3 sm:w-4 sm:h-4 ${isActive('heading_1') ? 'text-blue-500' : 'text-gray-700 dark:text-blue-400'}`}/>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({level: 2}).run()}
          className={`p-1 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            isActive('heading_2') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
          type={'button'}
        >
          <Heading2
            className={`w-3 h-3 sm:w-4 sm:h-4 ${isActive('heading_2') ? 'text-blue-500' : 'text-gray-700 dark:text-blue-400'}`}/>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({level: 3}).run()}
          className={`p-1 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            isActive('heading_3') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
          type={'button'}
        >
          <Heading3
            className={`w-3 h-3 sm:w-4 sm:h-4 ${isActive('heading_3') ? 'text-blue-500' : 'text-gray-700 dark:text-blue-400'}`}/>
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`p-1 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            isActive('paragraph') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
          type={'button'}
        >
          <Pilcrow
            className={`w-3 h-3 sm:w-4 sm:h-4 ${isActive('paragraph') ? 'text-blue-500' : 'text-gray-700 dark:text-blue-400'}`}/>
        </button>
        <div className="mx-1 w-px h-6 bg-gray-300 dark:bg-gray-600"/>
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-1 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            isActive('textAlign_left') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
          type={'button'}
        >
          <AlignLeft
            className={`w-3 h-3 sm:w-4 sm:h-4 ${isActive('textAlign_left') ? 'text-blue-500' : 'text-gray-700 dark:text-blue-400'}`}/>
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-1 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            isActive('textAlign_center') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
          type={'button'}
        >
          <AlignCenter
            className={`w-3 h-3 sm:w-4 sm:h-4 ${isActive('textAlign_center') ? 'text-blue-500' : 'text-gray-700 dark:text-blue-400'}`}/>
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-1 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            isActive('textAlign_right') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
          type={'button'}
        >
          <AlignRight
            className={`w-3 h-3 sm:w-4 sm:h-4 ${isActive('textAlign_right') ? 'text-blue-500' : 'text-gray-700 dark:text-blue-400'}`}/>
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={`p-1 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            isActive('textAlign_justify') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
          type={'button'}
        >
          <AlignJustify
            className={`w-3 h-3 sm:w-4 sm:h-4 ${isActive('textAlign_justify') ? 'text-blue-500' : 'text-gray-700 dark:text-blue-400'}`}/>
        </button>
        <div className="mx-1 w-px h-6 bg-gray-300 dark:bg-gray-600"/>
        <div className="inline-block text-left group relative">
          <select
            value={fontSize}
            onChange={(e) => handleFontSize(e.target.value)}
            className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-blue-400 px-2 pr-6 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 transition-colors duration-200 ease-in-out text-xs sm:text-sm md:text-base"
          >
            <option value="10px">10 px</option>
            <option value="12px">12 px</option>
            <option value="14px">14 px</option>
            <option value="16px">16 px</option>
            <option value="18px">18 px</option>
            <option value="20px">20 px</option>
            <option value="24px">24 px</option>
            <option value="28px">28 px</option>
          </select>
          <div
            className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-200">
            <ChevronDown className="w-3 h-3 text-gray-700 dark:text-blue-400"/>
          </div>
        </div>
        <div className="mx-1 w-px h-6 bg-gray-300 dark:bg-gray-600"/>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
          type={'button'}
        >
          <List
            className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive('bulletList') ? 'text-blue-500' : 'text-gray-700 dark:text-blue-400'}`}/>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
          type={'button'}
        >
          <ListOrdered
            className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive('orderedList') ? 'text-blue-500' : 'text-gray-700 dark:text-blue-400'}`}/>
        </button>
        <div className="mx-1 w-px h-6 bg-gray-300 dark:bg-gray-600"/>
        <button
          onClick={handleImageUpload}
          className="p-1 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          type={'button'}
        >
          <Image className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-blue-400"/>
        </button>
        <input
          type='file'
          accept='image/*'
          ref={fileInputRef}
          style={{display: 'none'}}
          onChange={handleFileChange}
        />
        <div className="mx-1 w-px h-6 bg-gray-300 dark:bg-gray-600"/>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="p-1 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          type={'button'}
        >
          <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700 dark:text-blue-400"/>
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="p-1 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          type={'button'}
        >
          <RotateCw className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700 dark:text-blue-400"/>
        </button>
        <div className="mx-1 w-px h-6 bg-gray-300 dark:bg-gray-600"/>
        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`p-1 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            isActive('highlight') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
          type={'button'}
        >
          <Highlighter
            className={`w-3 h-3 sm:w-4 sm:h-4 ${isActive('highlight') ? 'text-blue-500' : 'text-gray-700 dark:text-blue-400'}`}/>
        </button>
        <MathButton editor={editor} />
        <TableButton editor={editor} />
      </div>
    </div>
  )
}
