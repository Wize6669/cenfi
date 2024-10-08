import { useState } from 'react';
import { CaseSensitive } from "lucide-react";
import { EditorProps } from '@/interfaces/Questions'

const ColorPicker = ({ editor }: EditorProps) => {
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [textColor, setTextColor] = useState('#000000');

  const handleTextColor = (color: string) => {
    setTextColor(color);
    editor?.chain().focus().setColor(color).run();
  };

  return (
    <div className="relative flex flex-col items-center">
      <div className="flex items-center justify-center">
        <CaseSensitive
          className={`w-4 h-4 sm:w-5 sm:h-5 ${
            isColorPickerOpen ? 'text-blue-500' : 'text-gray-700 dark:text-blue-400'
          }`}
          onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
        />
      </div>
      <input
        type="color"
        value={textColor}
        onChange={(e) => handleTextColor(e.target.value)}
        title="Color del texto"
        className="cursor-pointer opacity-0 absolute top-0 righ-0 w-full h-full"
        onFocus={() => setIsColorPickerOpen(true)}
        onBlur={() => setIsColorPickerOpen(false)}
      />
      <div
        className="w-6 sm:w-8 h-1 rounded"
        style={{ backgroundColor: textColor }}
        title="Color seleccionado"
      ></div>
    </div>
  );
};

export default ColorPicker;
