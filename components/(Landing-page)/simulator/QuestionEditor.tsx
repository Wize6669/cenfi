import React from 'react'
import { EditorContent } from '@tiptap/react'
import useCreateReadOnlyEditor from "@/components/(Landing-page)/simulator/useCreateEditor"

interface QuestionContent {
  type: string
  content: any[]
}

interface QuestionEditorProps {
  content: QuestionContent
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({ content }) => {
  const editor = useCreateReadOnlyEditor({ content })

  if (!editor) {
    return null
  }

  return (
    <div className="question-editor mb-6 text-sm md:text-base lg:text-base dark:text-gray-400">
      <EditorContent editor={editor} />
    </div>
  )
}

export default QuestionEditor
