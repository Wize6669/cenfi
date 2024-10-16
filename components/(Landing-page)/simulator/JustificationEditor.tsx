import React from 'react'
import { EditorContent } from '@tiptap/react'
import useCreateReadOnlyEditor from "@/components/(Landing-page)/simulator/useCreateEditor"

interface JustificationEditorProps {
  justification?: {
    type: string
    content: any[]
  }
  questionId: number
}

const JustificationEditor: React.FC<JustificationEditorProps> = ({ justification }) => {
  const editor = useCreateReadOnlyEditor({ content: justification })

  if (!editor) {
    return <div>Cargando contenido de la justificación...</div>
  }

  // Verifica si la justificación está vacía
  const isJustificationEmpty = !justification ||
    !justification.content ||
    justification.content.length === 0 ||
    (justification.content.length === 1 &&
      justification.content[0].type === 'paragraph' &&
      (!justification.content[0].content || justification.content[0].content.length === 0))

  if (isJustificationEmpty) {
    return (
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 italic">
          Pregunta sin justificación
        </p>
      </div>
    )
  }

  return (
    <div className="justification-editor mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="text-sm md:text-base lg:text-base dark:text-gray-400">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default JustificationEditor
