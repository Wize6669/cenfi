import {Editor} from '@tiptap/core';
import React, {useRef} from 'react';
import {generateBlobUrls} from '@/utils/images';

interface MenuBarProps {
  editor: Editor | null;
}

export default function QuestionRichEditor({editor}: MenuBarProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (files.length > 0 && editor) {
      const urls = generateBlobUrls(files);

      urls.forEach((url, index) => {
        const reader = new FileReader();
        reader.onload = () => {
          const src = reader.result as string;
          editor.chain().focus().setImage({ src }).run();
        };

        reader.readAsDataURL(files[index]);
      });
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className='control-group'>
      <div className='button-group'>
        <button onClick={() => editor.chain().focus().toggleHeading({level: 1}).run()}
                className={editor.isActive('heading', {level: 1}) ? 'is-active' : ''}>
          H1
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({level: 2}).run()}
                className={editor.isActive('heading', {level: 2}) ? 'is-active' : ''}>
          H2
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({level: 3}).run()}
                className={editor.isActive('heading', {level: 3}) ? 'is-active' : ''}>
          H3
        </button>
        <button onClick={() => editor.chain().focus().setParagraph().run()}
                className={editor.isActive('paragraph') ? 'is-active' : ''}>
          Paragraph
        </button>
        <button onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'is-active' : ''}>
          Bold
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'is-active' : ''}>
          Italic
        </button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()}
                className={editor.isActive('strike') ? 'is-active' : ''}>
          Strike
        </button>
        <button onClick={() => editor.chain().focus().toggleHighlight().run()}
                className={editor.isActive('highlight') ? 'is-active' : ''}>
          Highlight
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={editor.isActive({textAlign: 'left'}) ? 'is-active' : ''}>
          Left
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={editor.isActive({textAlign: 'center'}) ? 'is-active' : ''}>
          Center
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={editor.isActive({textAlign: 'right'}) ? 'is-active' : ''}>
          Right
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                className={editor.isActive({textAlign: 'justify'}) ? 'is-active' : ''}>
          Justify
        </button>
        <button onClick={handleImageUpload}>
          Upload Image
        </button>
        <input
          type='file'
          accept='image/*'
          ref={fileInputRef}
          style={{display: 'none'}}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
