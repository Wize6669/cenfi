import { useMemo } from 'react'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import { FontSize } from '@/hooks/FontSize'
import Color from '@tiptap/extension-color'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import Link from '@tiptap/extension-link'
import { ImageResize } from 'tiptap-extension-resize-image'
import MathExtension from '@aarkue/tiptap-math-extension'

type EditorProps = {
  content: any
}

const useCreateReadOnlyEditor = ({ content }: EditorProps) => {

  if (!content) {
    console.warn('El contenido del editor es undefined o null');
    console.log('Contenido pasado al editor:', content);
    content = JSON.parse(content);
  }

  const extensions = useMemo(() => [
    StarterKit,
    TextStyle,
    FontSize,
    Color,
    MathExtension.configure({
      evaluation: false,
      katexOptions: {macros: {'\\B': '\\mathbb{B}'}},
      delimiters: 'dollar'
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Highlight.configure({
      multicolor: true,
    }),
    Table,
    TableRow,
    TableHeader,
    TableCell,
    ImageResize,
    Link.configure({
      openOnClick: true,
    }),
  ], [])

  const editorProps = useMemo(() => ({
    attributes: {
      class: 'prose max-w-none [&_ol]:list-decimal [&_ul]:list-disc [&_ol]:pl-5 [&_ul]:pl-5 [&_li]:ml-0 prose-sm md:prose-md lg:prose-lg dark:prose-invert mx-auto focus:outline-none min-h-[20px] w-full px-1 py-3 overflow-y-auto max-h-[500px]',
    },
  }), [])

  return useEditor({
    extensions,
    content,
    editorProps,
    editable: false,
    onCreate: ({ editor }) => {
      try {
        if (editor.schema) {
          console.log('Schema creado correctamente:', editor.schema);
        } else {
          throw new Error('El schema no se ha creado correctamente');
        }
      } catch (error) {
        console.error('Error al crear el editor:', error);
      }
    }
  })
}

export default useCreateReadOnlyEditor