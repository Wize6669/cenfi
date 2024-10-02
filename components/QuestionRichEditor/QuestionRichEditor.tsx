'use client'

import { type Editor } from '@tiptap/react'
import React, { useRef } from 'react'
import { generateBlobUrls } from '@/utils/images'
import {
  Bold,
  Italic,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Image,
  RotateCcw,
  RotateCw,
  Highlighter,
  Type
} from 'lucide-react'

interface MenuBarProps {
  editor: Editor | null
}

export default function QuestionRichEditor({ editor }: MenuBarProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

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

  if (!editor) {
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
      <div className="flex flex-wrap items-center p-2 border-b border-gray-300 dark:border-gray-600">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
        >
          <Bold className="w-5 h-5"/>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
        >
          <Italic className="w-5 h-5"/>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            editor.isActive('strike') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
        >
          <Strikethrough className="w-5 h-5"/>
        </button>
        <div className="mx-1 w-px h-6 bg-gray-300 dark:bg-gray-600"/>
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            editor.isActive({textAlign: 'left'}) ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
        >
          <AlignLeft className="w-5 h-5"/>
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            editor.isActive({textAlign: 'center'}) ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
        >
          <AlignCenter className="w-5 h-5"/>
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            editor.isActive({textAlign: 'right'}) ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
        >
          <AlignRight className="w-5 h-5"/>
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            editor.isActive({textAlign: 'justify'}) ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
        >
          <AlignJustify className="w-5 h-5"/>
        </button>
        <div className="mx-1 w-px h-6 bg-gray-300 dark:bg-gray-600"/>
        <button
          onClick={() => editor.chain().focus().toggleHeading({level: 1}).run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            editor.isActive('heading', {level: 1}) ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
        >
          <Heading1 className="w-5 h-5"/>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({level: 2}).run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            editor.isActive('heading', {level: 2}) ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
        >
          <Heading2 className="w-5 h-5"/>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({level: 3}).run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            editor.isActive('heading', {level: 3}) ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
        >
          <Heading3 className="w-5 h-5"/>
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            editor.isActive('paragraph') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
        >
          <Type className="w-5 h-5"/>
        </button>
        <div className="mx-1 w-px h-6 bg-gray-300 dark:bg-gray-600"/>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
        >
          <List className="w-5 h-5"/>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
        >
          <ListOrdered className="w-5 h-5"/>
        </button>
        <div className="mx-1 w-px h-6 bg-gray-300 dark:bg-gray-600"/>
        <button
          onClick={handleImageUpload}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Image className="w-5 h-5"/>
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
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <RotateCcw className="w-5 h-5"/>
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <RotateCw className="w-5 h-5"/>
        </button>
        <div className="mx-1 w-px h-6 bg-gray-300 dark:bg-gray-600"/>
        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
            editor.isActive('highlight') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
        >
          <Highlighter className="w-5 h-5"/>
        </button>
      </div>
    </div>
  )
}
