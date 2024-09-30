'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import QuestionRichEditor from '@/components/QuestionRichEditor/QuestionRichEditor'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'

export default function Questions() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Escribe aqui'
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight,
      Image
    ],
  })

  // Function to print editor content to console
  const printContent = () => {
    if (editor) {
      console.log('Editor Content (JSON):', editor.getJSON())
      //console.log('Editor Content (HTML):', editor.getHTML())
    }
  }

  return (
    <>
      <QuestionRichEditor editor={editor} />
      <EditorContent
        style={{
          border: '1px solid black',
          width: '500px',
          minHeight: '100px',
          borderRadius: '5px',
        }}
        editor={editor}
      />
      <button
        onClick={printContent}
        style={{
          marginTop: '10px',
          padding: '10px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Print Content
      </button>
    </>
  )
}


