'use client';

import { EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import MathExtension from '@aarkue/tiptap-math-extension';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Link from '@tiptap/extension-link';
import { ImageResize } from '@/hooks/ImageResize';
import Color from '@tiptap/extension-color';
import { FontSize } from '@/hooks/FontSize';
import TextStyle from '@tiptap/extension-text-style';
import Placeholder from '@tiptap/extension-placeholder';
import Header from '@/components/Header';
import ModuleListNavbar from '@/components/ModulesList/ModuleListNavbar';
import { KeyboardArrowDown, Add, Close, CheckCircle } from '@mui/icons-material';
import Footer from '@/components/Footer';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Categories, PaginatedResponse } from '@/interfaces/Categories';
import { cn } from '@/lib/utils';
import 'katex/dist/katex.min.css';
import { RichEditorFor } from '@/interfaces/RichEditor';
import RichEditor from '@/components/RichEditor/RichEditor';
import { axiosInstance } from '@/lib/axios';
import toast from 'react-hot-toast';
import { handleAxiosError } from '@/utils/generatePassword';
import GoBackButton from "@/components/GoBackButton";
import {useParams} from "next/navigation";

interface Category {
  id: number;
  name: string;
}

interface Question {
  id: number;
  categoryId: string;
  content: any;
  options: {
    id: number;
    content: any;
    isCorrect: boolean;
  }[];
  justification: any;
}

const MAX_OPTIONS = 8;

export default function EditQuestions() {
  const params = useParams();
  const id = Number(params.id);

  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState<Question>({
    id: id,
    categoryId: '',
    content: {},
    options: [],
    justification: {}
  });
  const [isOpenCategory, setIsOpenCategory] = useState(false);
  const [isOpenAnswer, setIsOpenAnswer] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [optionsCount, setOptionsCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    question: string;
    options: string[];
  }>({
    question: '',
    options: [],
  });

  const [questionEditorState, setQuestionEditorState] = useState<Editor | undefined>(undefined);
  const [justificationEditorState, setJustificationEditorState] = useState<Editor | undefined>(undefined);
  const [optionEditorsState, setOptionEditorsState] = useState<(Editor | undefined)[]>([]);



  useEffect(() => {
    setIsMounted(true);
  }, []);

  const createEditor = useCallback((placeholder: string, onUpdate: (editor: Editor) => void, initialContent: any): Editor | undefined => {
    if (typeof window === 'undefined') return undefined;

    return new Editor({
      extensions: [
        StarterKit,
        TextStyle,
        FontSize,
        Color,
        MathExtension.configure({
          evaluation: false,
          katexOptions: {macros: {'\\B': '\\mathbb{B}'}},
          delimiters: 'dollar'
        }),
        Placeholder.configure({
          placeholder: placeholder,
          emptyEditorClass: 'is-editor-empty',
        }),
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        Highlight.configure({
          multicolor: true,
        }),
        Table.configure({
          resizable: true,
        }),
        TableRow,
        TableHeader,
        TableCell,
        ImageResize,
        Link.configure({
          openOnClick: true,
          autolink: true,
          defaultProtocol: 'https',
          HTMLAttributes: {
            rel: 'noopener noreferrer',
            target: '_blank',
          },
        }),
      ],
      content: initialContent,
      editorProps: {
        attributes: {
          class: cn(
            'prose max-w-none',
            '[&_ol]:list-decimal [&_ul]:list-disc',
            '[&_ol]:pl-5 [&_ul]:pl-5',
            '[&_li]:ml-0',
            'prose-sm md:prose-md lg:prose-lg dark:prose-invert mx-auto focus:outline-none min-h-[20px] w-full px-1 py-3',
            'overflow-y-auto max-h-[500px]'
          ),
        },
      },
      onUpdate: ({editor}) => {
        onUpdate(editor);
      },
    });
  }, []);

  const handleQuestionEditorUpdate = useCallback((editor: Editor) => {
    setQuestionEditorState(editor);
    setValidationErrors(prev => ({ ...prev, question: '' }));
  }, []);

  const handleJustificationEditorUpdate = useCallback((editor: Editor) => {
    setJustificationEditorState(editor);
  }, []);

  const handleOptionEditorUpdate = useCallback((index: number, editor: Editor) => {
    setOptionEditorsState(prevState => {
      const newState = [...prevState];
      newState[index] = editor;
      return newState;
    });
    setValidationErrors(prev => {
      const newOptions = [...prev.options];
      newOptions[index] = '';
      return { ...prev, options: newOptions };
    });
  }, []);

  const questionEditor = useMemo(() =>
      isMounted ? createEditor('Ingresa tu pregunta aquí...', handleQuestionEditorUpdate, formData?.content) : undefined,
    [createEditor, isMounted, handleQuestionEditorUpdate, formData.content]);
  console.log(formData.content);

  const justificationEditor = useMemo(() =>
      isMounted ? createEditor('Ingresa la justificación aquí...', handleJustificationEditorUpdate, formData.justification) : undefined,
    [createEditor, isMounted, handleJustificationEditorUpdate, formData.justification]);

  useEffect(() => {
    if (isMounted && formData.options?.length > 0) {
      setOptionEditorsState(formData.options.map((option, index) =>
        createEditor(`Ingresa la opción ${index + 1} aquí...`, (editor) => handleOptionEditorUpdate(index, editor), option.content)
      ));
      setOptionsCount(formData.options?.length);
    }
  }, [createEditor, isMounted, handleOptionEditorUpdate, formData.options]);

  const fetchAllCategories = useCallback(async () => {
    try {
      let allCategories: Categories[] = [];
      let currentPage = 1;
      let totalPages = 1;

      do {
        const response = await axiosInstance.get<PaginatedResponse>('/categories', {
          params: {
            page: currentPage,
            count: 500
          }
        });

        allCategories = [...allCategories, ...response.data.data];
        currentPage++;
        totalPages = response.data.totalPages;
      } while (currentPage <= totalPages);

      setCategories(allCategories);

    } catch (err) {
      setError('Error al cargar las categorías');
      console.error('Error fetching categories:', err);
    }
  }, []);

  const fetchQuestionData = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/questions/${id}`);
      setFormData(response.data);
      console.log(response.data)
    } catch (err) {
      setError('Error al cargar la pregunta');
      console.error('Error fetching question:', err);
    }
  }, [id]);

  useEffect(() => {
    fetchAllCategories();
    fetchQuestionData();
  }, [fetchAllCategories, fetchQuestionData]);

  const isEditorEmpty = (editor: Editor | undefined): boolean => {
    if (!editor) return true;
    const content = editor.getJSON();
    return !content.content || content.content.length === 0 || (content.content.length === 1 && (!content.content[0].content || content.content[0].content.length === 0));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasErrors = false;
    const newValidationErrors = {
      question: '',
      options: optionEditorsState.map(() => ''),
    };

    if (isEditorEmpty(questionEditorState)) {
      newValidationErrors.question = 'La pregunta es requerida';
      hasErrors = true;
    }

    optionEditorsState.forEach((editor, index) => {
      if (isEditorEmpty(editor)) {
        newValidationErrors.options[index] = `La opción ${index + 1} es requerida`;
        hasErrors = true;
      }
    });

    setValidationErrors(newValidationErrors);

    if (hasErrors) {
      toast.error('Por favor, completa todos los campos requeridos');
      return;
    }

    try {
      const formDataWithEditorContent = {
        ...formData,
        question: questionEditorState?.getJSON() ?? {},
        options: optionEditorsState.map((editor, index) => ({
          id: formData.options[index]?.id,
          content: editor?.getJSON() ?? {},
          isCorrect: formData.options[index]?.isCorrect
        })),
        justification: justificationEditorState?.getJSON() ?? {},
      };

      console.log('Form Data:', formDataWithEditorContent);

      await axiosInstance.put(`/questions/${id}`, formDataWithEditorContent);

      toast.success('Pregunta actualizada con éxito');

    } catch (error) {
      handleAxiosError(error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {name, value} = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleAddOption = useCallback(() => {
    if (optionsCount < MAX_OPTIONS) {
      const newIndex = optionsCount;
      setOptionsCount(prevCount => prevCount + 1);
      setOptionEditorsState(prevEditors => [
        ...prevEditors,
        createEditor(`Ingresa la opción ${newIndex + 1} aquí...`, (editor) => handleOptionEditorUpdate(newIndex, editor), {})
      ]);
      setFormData(prevData => ({
        ...prevData,
        options: [...prevData.options, { id: Date.now(), content: {}, isCorrect: false }]
      }));
      setValidationErrors(prev => ({
        ...prev,
        options: [...prev.options, '']
      }));
    }
  }, [optionsCount, createEditor, handleOptionEditorUpdate]);

  const handleRemoveOption = useCallback((indexToRemove: number) => {
    setOptionEditorsState(prevEditors => prevEditors.filter((_, index) => index !== indexToRemove));
    setOptionsCount(prevCount => prevCount - 1);
    setFormData(prevData => ({
      ...prevData,
      options: prevData.options.filter((_, index) => index !== indexToRemove)
    }));
    setValidationErrors(prev => ({
      ...prev,
      options: prev.options.filter((_, index) => index !== indexToRemove)
    }));
  }, []);

  const handleCorrectAnswerChange = useCallback((index: number) => {
    setFormData(prevData => ({
      ...prevData,
      options: prevData.options.map((option, i) => ({
        ...option,
        isCorrect: i === index
      }))
    }));
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='flex flex-col min-h-screen bg-white dark:bg-gray-900'>
      <Header>
        <ModuleListNavbar/>
      </Header>
      <div className='flex-grow flex flex-col items-center px-4'>
        <div className={'w-[87%] grid grid-cols-[3%_97%] grid-rows-2 gap-x-4 justify-items-center'}>
          <div className={'w-auto col-span-2'}>
            <h1 className={'font-bold text-xl lg:text-3xl mt-4 text-gray-900 dark:text-gray-200 text-center'}>
              Editar Pregunta
            </h1>
          </div>
          <div className={'row-start-2 justify-items-center content-center'}>
            <GoBackButton/>
          </div>
          <div className={'w-full row-start-2 content-center justify-items-center'}>
            <div className={'border-t-2 container dark:border-gray-600'}/>
          </div>
        </div>
        <div className='container pb-10'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 items-end'>
              <div className='lg:col-span-3 bg-white dark:bg-gray-900 px-4 sm:pt-2 lg:pt-0 pt-2'>
                <label
                  htmlFor='categoryId'
                  className='block text-sm sm:text-base md:text-base font-medium text-gray-700 dark:text-gray-300 mb-1'
                >
                  Categoría
                </label>
                <div className='relative'>
                  <select
                    id='categoryId'
                    name='categoryId'
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpenCategory(true)}
                    onBlur={() => setIsOpenCategory(false)}
                    className='h-[35px] appearance-none text-sm sm:text-base md:text-base bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700  dark:text-gray-200 py-1 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-gray-500 transition-colors duration-200 ease-in-out w-full'
                    required={true}
                  >
                    <option value=''>Seleccione una categoría</option>
                    {categories.map(category => (
                      <option  key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                  <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-200'>
                    <KeyboardArrowDown className={`transition-transform duration-200 ease-in-out ${isOpenCategory ? 'rotate-180' : ''}`}/>
                  </div>
                </div>
              </div>
              <div className='lg:col-span-6 flex md:justify-end justify-center bg-white dark:bg-gray-900 px-4 sm:pt-4 lg:pt-0 pt-4'>
                <button
                  type='button'
                  onClick={handleAddOption}
                  disabled={optionsCount >= MAX_OPTIONS}
                  className={`w-auto text-sm sm:text-base md:text-base bg-button-color hover:bg-blue-600 text-white font-medium py-1 px-4 rounded-full transition-colors duration-200 ease-in-out flex items-center justify-center ${optionsCount >= MAX_OPTIONS ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Add className='mr-2'/>
                  Agregar opción
                </button>
              </div>
            </div>

            {isMounted && questionEditor && (
              <div className='bg-white dark:bg-gray-900 px-4'>
                <label className='block text-sm sm:text-base md:text-base font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Pregunta
                </label>
                <RichEditor editor={questionEditor} type={RichEditorFor.Questions}/>
                <EditorContent editor={questionEditor} className={'border rounded-b-md p-2 dark:bg-gray-700'}/>
                {validationErrors.question && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.question}</p>
                )}
              </div>
            )}

            <div
              className={`grid grid-cols-1 gap-4 px-4 ${optionsCount % 2 !== 0 ? 'md:last:col-span-2' : ''}`}
            >
              {optionEditorsState.map((editor, index) => (
                editor && (
                  <div
                    key={index}
                    className={`bg-white dark:bg-gray-900 relative ${formData.options[index]?.isCorrect ? 'border-2 border-green-500 rounded-lg' : ''}`}
                  >
                    <label
                      className='block text-sm sm:text-base md:text-base font-medium text-gray-700 dark:text-gray-300 mb-1'
                    >
                      Opción {index + 1}
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={formData.options[index]?.isCorrect}
                        onChange={() => handleCorrectAnswerChange(index)}
                        className="ml-2"
                      />
                      {formData.options[index]?.isCorrect && (
                        <span className='ml-2 text-green-500'>
                          <CheckCircle className='inline-block w-5 h-5'/>
                          <span className='ml-1'>Opción correcta</span>
                        </span>
                      )}
                    </label>
                    <div className='relative'>
                      <RichEditor editor={editor} type={RichEditorFor.Options}/>
                      {optionsCount > 1 && (
                        <button
                          type='button'
                          onClick={() => handleRemoveOption(index)}
                          className='group absolute top-9 right-2 text-gray-500 dark:text-blue-500 hover:text-red-500 transition-colors duration-200 text-xs sm:text-sm md:text-base lg:top-2 lg:right-2'
                        >
                          <Close className='w-3 h-3 sm:w-5 sm:h-5 md:w-6 md:h-6'/>
                          <span
                            className='absolute top-full left-1/2 transform -translate-x-1/2 mt-1 scale-0 transition-all duration-300 bg-red-800 text-white text-xs rounded-lg px-2 py-1 group-hover:scale-100'
                          >
                            Eliminar
                          </span>
                        </button>
                      )}
                    </div>
                    <EditorContent editor={editor} className={'border rounded-b-md p-2 dark:bg-gray-700'}/>
                    {validationErrors.options[index] && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.options[index]}</p>
                    )}
                  </div>
                )
              ))}
            </div>

            {isMounted && justificationEditor && (
              <div className='bg-white dark:bg-gray-900 px-4'>
                <label className='block text-sm sm:text-base md:text-base font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Justificación
                </label>
                <RichEditor editor={justificationEditor} type={RichEditorFor.Justifications}/>
                <EditorContent editor={justificationEditor} className={'border rounded-b-md p-2 dark:bg-gray-700'}/>
              </div>
            )}

            <div className='flex justify-center'>
              <button
                type='submit'
                className='text-sm sm:text-base md:text-base bg-button-color hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-full mt-2 transition-colors ease-in-out duration-200'
              >
                Actualizar Pregunta
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer/>
    </div>
  );
}