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
    <div className={`flex items-start space-x-2 p-2 rounded-lg transition-colors duration-200 ${
      isSelected ? (option.isCorrect ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900') : 'hover:bg-gray-100 dark:hover:bg-gray-800'
    }`}>
      <div className="flex-shrink-0 mt-1">
        <input
          type="radio"
          id={`option-${option.id}`}
          name={`question-${option.id}`}
          checked={isSelected}
          onChange={onSelect}
          disabled={isReviewMode}
          className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
        />
      </div>
      <label htmlFor={`option-${option.id}`} className="flex-grow cursor-pointer">
        <div className="font-medium text-sm md:text-base lg:text-base mb-1 flex items-center">
          {String.fromCharCode(65 + index)}.
          {isReviewMode && (
            <>
              {option.isCorrect && <CheckCircle className="w-4 h-4 lg:h-5 lg:w-5 text-green-500 ml-2"/>}
              {isSelected && !option.isCorrect && <XCircle className="w-4 h-4 lg:h-5 lg:w-5 text-red-500 ml-2"/>}
            </>
          )}
        </div>
        <div className="text-sm md:text-base lg:text-base option-editor">
          <EditorContent editor={editor} />
        </div>
      </label>
    </div>
  )
}

export default OptionEditor
