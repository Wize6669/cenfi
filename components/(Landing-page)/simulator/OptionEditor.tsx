import React from 'react'
import { EditorContent } from '@tiptap/react'
import useCreateReadOnlyEditor from "@/components/(Landing-page)/simulator/useCreateEditor";
import { cn } from '@/lib/utils'

interface Option {
  id: number
  content: {
    type: string
    content: any[]
  }
}

interface OptionEditorProps {
  option: Option
  index: number
  isSelected: boolean
  onSelect: () => void
}

const OptionEditor: React.FC<OptionEditorProps> = ({ option, index, isSelected, onSelect }) => {
  const editor = useCreateReadOnlyEditor({ content: option.content })

  if (!editor) {
    console.error('El editor no se ha inicializado correctamente');
  }

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
          {String.fromCharCode(65 + index)}.
        </span>
        {editor && (
          <EditorContent
            editor={editor}
            className="text-sm md:text-base lg:text-base font-light"
          />
        )}
      </div>
    </label>
  )
}

export default OptionEditor
