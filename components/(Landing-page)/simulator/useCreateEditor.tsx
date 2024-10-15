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
import 'katex/dist/katex.min.css';


type EditorProps = {
  content: any
}

const useCreateReadOnlyEditor = ({ content }: EditorProps) => {
  const processedContent = useMemo(() => {
    if (Array.isArray(content) && content.length > 0) {
      return { type: 'doc', content };
    } else if (content && typeof content === 'object' && 'type' in content && 'content' in content) {
      return content;
    } else {
      console.warn('Contenido inválido para el editor:', content);
      return { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Contenido inválido' }] }] };
    }
  }, [content]);

  const extensions = useMemo(() => [
    StarterKit.configure({
      history: false
    }),
    TextStyle,
    FontSize,
    Color,
    MathExtension.configure({
      katexOptions: {
        throwOnError: false,
        macros: {
          '\\B': '\\mathbb{B}',
        },
      },
      delimiters: {
        inlineRegex: '\\$(.+?)\\$', // Para inline math
        blockRegex: '\\$\\$(.+?)\\$\\$', // Para block math
        inlineStart: '\\(',
        inlineEnd: '\\)',
        blockStart: '\\[',
        blockEnd: '\\]',
      },
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
    content: processedContent,
    editorProps,
    editable: false,
    immediatelyRender: false,
  })
}

export default useCreateReadOnlyEditor
