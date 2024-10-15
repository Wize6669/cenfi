import React from 'react'
import { EditorContent } from '@tiptap/react'
import useCreateReadOnlyEditor from "@/components/(Landing-page)/simulator/useCreateEditor"

interface QuestionEditorProps {
  question: {
    id: number
    content: {
      type: string
      content: any[]
    }
  }
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({ question }) => {
  const editor = useCreateReadOnlyEditor({ content: question.content })

  if (!editor) {
    return <div>Cargando contenido de la pregunta...</div>
  }

  return (
    <div className="question-editor mb-6 text-sm md:text-base lg:text-base dark:text-gray-400">
      <EditorContent editor={editor} />
    </div>
  )
}

export default QuestionEditor
