import React, { useEffect } from 'react'
import Image from 'next/image'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

interface OptionContent {
  type: string;
  content: any[];
}

interface Option {
  content: OptionContent;
  images?: string[];
}

interface OptionEditorProps {
  option: Option;
  index: number;
  isSelected: boolean;
  onSelect: (content: OptionContent) => void;
}

const OptionEditor: React.FC<OptionEditorProps> = ({ option, index, isSelected, onSelect }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: option.content,
    editable: false,
  })

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(option.content)
    }
  }, [editor, option.content])

  return (
    <label className={'flex flex-col p-2 rounded dark:hover:bg-gray-700 hover:bg-gray-100 transition-colors duration-300 dark:text-gray-400'}>
      <div className="flex items-center">
        <input
          type="radio"
          name="answer"
          value={JSON.stringify(option.content)}
          checked={isSelected}
          onChange={() => onSelect(option.content)}
          className="h-5 w-5 mr-2 rounded-full border text-blue-600 dark:text-blue-400 transition-colors duration-300"
        />
        <span className="text-sm md:text-base lg:text-base mr-2 font-semibold">{String.fromCharCode(65 + index)}.</span>
        {editor && (
          <EditorContent editor={editor} className="text-sm md:text-base lg:text-base font-light" />
        )}
      </div>
      {option.images && option.images.length > 0 && (
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {option.images.map((image, imageIndex) => (
            <div key={imageIndex} className="relative h-32 w-full">
              <Image
                src={image}
                alt={`Imagen ${imageIndex + 1} para la opción ${String.fromCharCode(65 + index)}`}
                fill={true}
                className="rounded-lg object-contain"
              />
            </div>
          ))}
        </div>
      )}
    </label>
  )
}

export default OptionEditor;
