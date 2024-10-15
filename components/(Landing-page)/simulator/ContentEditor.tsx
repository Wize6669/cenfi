import React from 'react'
import { EditorContent } from '@tiptap/react'
import useCreateReadOnlyEditor from "@/components/(Landing-page)/simulator/useCreateEditor"
import { cn } from '@/lib/utils'

interface ContentEditorProps {
  content: any
  isOption?: boolean
  index?: number
  isSelected?: boolean
  onSelect?: () => void
}

const ContentEditor: React.FC<ContentEditorProps> = ({content, isOption = false, index, isSelected, onSelect}) => {
  const editor = useCreateReadOnlyEditor({ content })

  if (!editor) {
    return <div>Cargando contenido...</div>
  }

  if (isOption) {
    return (
      <label className={cn(
        'flex flex-col p-2 rounded transition-colors duration-300',
        'dark:hover:bg-gray-700 hover:bg-gray-100',
        'dark:text-gray-400'
      )}>
        <div className="flex items-center">
          <input
            type="radio"
            name="answer"
            checked={isSelected}
            onChange={onSelect}
            className={cn(
              'h-5 w-5 mr-2 rounded-full border',
              'text-blue-600 dark:text-blue-400',
              'transition-colors duration-300'
            )}
          />
          <span className="text-sm md:text-base lg:text-base mr-2 font-semibold">
            {String.fromCharCode(65 + (index || 0))}.
          </span>
          <EditorContent
            editor={editor}
            className="text-sm md:text-base lg:text-base font-light"
          />
        </div>
      </label>
    )
  }

  return (
    <div className="question-editor mb-6 text-sm md:text-base lg:text-base dark:text-gray-400">
      <EditorContent editor={editor} />
    </div>
  )
}

export default ContentEditor
