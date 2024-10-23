import React from 'react'
import { EditorContent } from '@tiptap/react'
import useCreateReadOnlyEditor from "@/components/(Landing-page)/simulator/useCreateEditor";
import { cn } from '@/lib/utils'
import { CheckCircle, XCircle } from 'lucide-react'

interface Option {
  id: number
  content: {
    type: string
    content: any[]
  }
  isCorrect: boolean
}

interface OptionEditorProps {
  option: Option
  index: number
  isSelected: boolean
  onSelect: () => void
  isReviewMode: boolean
}

const OptionEditor: React.FC<OptionEditorProps> = ({ option, index, isSelected, onSelect, isReviewMode }) => {
  const editor = useCreateReadOnlyEditor({ content: option.content })

  if (!editor) {
    return <div>Cargando opción...</div>
  }

  return (
    <label className={cn(
      'flex flex-col p-2 rounded transition-colors duration-300',
      'dark:hover:bg-gray-700 hover:bg-gray-100',
      'dark:text-gray-400',
      isReviewMode && isSelected && option.isCorrect && 'bg-green-50 dark:bg-green-900/40',
      isReviewMode && isSelected && !option.isCorrect && 'bg-red-50 dark:bg-red-900/20',
      isReviewMode && !isSelected && option.isCorrect && 'bg-green-50 dark:bg-green-900/20',
      // Solo muestra el círculo interno cuando NO está en modo revisión
      !isReviewMode && 'before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-2.5 before:h-2.5 before:rounded-full before:bg-blue-600 dark:before:bg-blue-400 before:opacity-0 checked:before:opacity-100'
      )}>
      <div className="flex items-center">
        <input
          type="radio"
          name="answer"
          checked={isSelected}
          onChange={onSelect}
          disabled={isReviewMode}
          className={cn(
            'h-5 w-5 mr-2 rounded-full border',
            'text-blue-600 dark:text-blue-400',
            'transition-colors duration-300',
            isReviewMode && 'cursor-not-allowed opacity-50',
            isReviewMode && option.isCorrect && 'text-green-500 dark:text-green-400',
            isReviewMode && isSelected && !option.isCorrect && 'text-red-500 dark:text-red-400'
          )}
        />
        <span className="text-sm md:text-base lg:text-base mr-2 font-semibold">
          {String.fromCharCode(65 + index)}
        </span>
        {isReviewMode && (
          <span className="mr-2">
            {option.isCorrect ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : isSelected ? (
              <XCircle className="w-4 h-4 text-red-500" />
            ) : null}
          </span>
        )}
        <EditorContent
          editor={editor}
          className={cn(
            "text-sm md:text-base lg:text-base font-light",
            isReviewMode && option.isCorrect && 'text-green-700 dark:text-green-400',
            isReviewMode && isSelected && !option.isCorrect && 'text-red-700 dark:text-red-400'
          )}
        />
      </div>
    </label>
  )
}

export default OptionEditor
