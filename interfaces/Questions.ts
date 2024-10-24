import { Editor } from '@tiptap/react';

export interface EditorProps {
  editor: Editor | null
}

export interface QuestionTableInterface {
  id: number;
  content: object;
  justification?: object;
  options: { id: number; content: object; isCorrect: boolean }[];
  categoryId?: number;
  categoryName?: string;
  simulatorId?: string;
}

