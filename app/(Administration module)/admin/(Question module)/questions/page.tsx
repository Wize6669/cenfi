'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import QuestionRichEditor from '@/components/QuestionRichEditor/QuestionRichEditor'
import { FontSize } from '@/hooks/FontSize';
import TextStyle from '@tiptap/extension-text-style';
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import Header from "@/components/Header"
import ModuleListNavbar from "@/components/ModulesList/ModuleListNavbar"
import { IconButton } from "@mui/material"
import { ArrowBack, KeyboardArrowDown } from "@mui/icons-material"
import Footer from "@/components/Footer"
import React, {useState, useEffect, useCallback} from "react"
import { useRouter } from "next/navigation"
import {Categories, PaginatedResponse} from "@/interfaces/Categories";
import axios from "axios";
import {config} from "@/config";
import {cn} from "@/lib/utils";

interface Category {
  id: number;
  name: string;
}

export default function Questions() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    category: '',
    answer: '',
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    justification: ''
  });
  const [isOpenCategory, setIsOpenCategory] = useState(false);
  const [isOpenAnswer, setIsOpenAnswer] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const useCreateEditor = (placeholder: string) => useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontSize,
      Placeholder.configure({
        placeholder: placeholder,
        emptyEditorClass: 'tiptap-placeholder',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight,
      Image.configure({
        inline: false,
      }),
    ],
    content: '<p></p>',
    editorProps: {
      attributes: {
        class: cn(
          'prose max-w-none',
          '[&_ol]:list-decimal [&_ul]:list-disc',
          '[&_ol]:pl-5 [&_ul]:pl-5',
          '[&_li]:ml-0',
          'prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[100px] w-full',
          'overflow-y-auto max-h-[500px]'
        ),
      },
    },
    immediatelyRender: false
  });

  const questionEditor = useCreateEditor('Ingresa tu pregunta aquí...');
  const option1Editor = useCreateEditor('Ingresa la opción 1 aquí...');
  const option2Editor = useCreateEditor('Ingresa la opción 1 aquí...');
  const option3Editor = useCreateEditor('Ingresa la opción 1 aquí...');
  const option4Editor = useCreateEditor('Ingresa la opción 1 aquí...');
  const justificationEditor = useCreateEditor('Ingresa la justificación aquí...');
  const [error, setError] = useState<string | null>(null)
  const HOST_BACK_END = config.NEXT_PUBLIC_HOST_BACK_END.env;

  const fetchAllCategories = useCallback(async () => {
    try {
      let allCategories: Categories[] = [];
      let currentPage = 1;
      let totalPages = 1;

      do {
        const response = await axios.get<PaginatedResponse>(`${HOST_BACK_END}/api/v1/categories`, {
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
  }, [HOST_BACK_END]);

  useEffect(() => {
    fetchAllCategories();
  }, [fetchAllCategories]);

  const goBack = () => {
    router.back();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formDataWithEditorContent = {
      ...formData,
      question: questionEditor?.getHTML() || '',
      option1: option1Editor?.getHTML() || '',
      option2: option2Editor?.getHTML() || '',
      option3: option3Editor?.getHTML() || '',
      option4: option4Editor?.getHTML() || '',
      justification: justificationEditor?.getHTML() || '',
    };
    console.log('Form Data:', formDataWithEditorContent);
    // Aquí iría la lógica para enviar los datos al servidor
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <Header>
        <ModuleListNavbar/>
      </Header>
      <div className="flex-grow flex flex-col items-center px-4">
        <div className={'w-[87%] grid grid-cols-[3%_97%] grid-rows-2 gap-x-4 justify-items-center'}>
          <div className={'w-auto col-span-2'}>
            <h1
              className={'font-bold text-xl lg:text-3xl mt-4 text-gray-900 dark:text-gray-200 text-center'}>
              Crear una Nueva Pregunta
            </h1>
          </div>
          <div className={'row-start-2 justify-items-center content-center'}>
            <IconButton className={'dark:border-gray-500 dark:hover:bg-gray-600'} sx={{border: '1px solid #ccc'}}
                        onClick={goBack}>
              <ArrowBack className={'text-gray-400 dark:text-gray-500'}/>
            </IconButton>
          </div>
          <div className={'w-full row-start-2 content-center justify-items-center'}>
            <div className={'border-t-2 container dark:border-gray-600'}/>
          </div>
        </div>
        <div className="container pb-10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4">
              <div className="bg-white dark:bg-gray-900 px-4 sm:pt-2 lg:pt-0 pt-2">
                <label htmlFor="category" className="block text-sm sm:text-base md:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Categoría
                </label>
                <div className="relative">
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpenCategory(true)}
                    onBlur={() => setIsOpenCategory(false)}
                    className="appearance-none text-sm sm:text-base md:text-base bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-gray-500 transition-colors duration-200 ease-in-out w-full"
                  >
                    <option value="">Seleccione una categoría</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                  <div
                    className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-200">
                    <KeyboardArrowDown
                      className={`transition-transform duration-200 ease-in-out ${isOpenCategory ? 'rotate-180' : ''}`}/>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-900 px-4 sm:pt-2 lg:pt-0 pt-2">
                <label htmlFor="answer" className="block text-sm sm:text-base md:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Respuesta
                </label>
                <div className="relative">
                  <select
                    id="answer"
                    name="answer"
                    value={formData.answer}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpenAnswer(true)}
                    onBlur={() => setIsOpenAnswer(false)}
                    className="appearance-none text-sm sm:text-base md:text-base bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-gray-500 transition-colors duration-200 ease-in-out w-full"
                  >
                    <option value="">Opción correcta</option>
                    <option value="option1">Opción 1</option>
                    <option value="option2">Opción 2</option>
                    <option value="option3">Opción 3</option>
                    <option value="option4">Opción 4</option>
                  </select>
                  <div
                    className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-200">
                    <KeyboardArrowDown
                      className={`transition-transform duration-200 ease-in-out ${isOpenAnswer ? 'rotate-180' : ''}`}/>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 px-4">
              <label className="block text-sm sm:text-base md:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pregunta
              </label>
              <QuestionRichEditor editor={questionEditor}/>
              <EditorContent editor={questionEditor} className={'border rounded-b-md p-2 dark:bg-gray-700'} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[option1Editor, option2Editor, option3Editor, option4Editor].map((editor, index) => (
                <div key={index} className="bg-white dark:bg-gray-900 px-4">
                  <label className="block text-sm sm:text-base md:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Opción {index + 1}
                  </label>
                  <QuestionRichEditor editor={editor}/>
                  <EditorContent editor={editor} className={'border rounded-b-md p-2 dark:bg-gray-700'}/>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-gray-900 px-4">
              <label className="block text-sm sm:text-base md:text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                Justificación
              </label>
              <QuestionRichEditor editor={justificationEditor}/>
              <EditorContent editor={justificationEditor} className={'border rounded-b-md p-2 dark:bg-gray-700'}/>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="text-sm sm:text-base md:text-base bg-button-color hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-full mt-2 transition-colors ease-in-out duration-200"
              >
                Guardar Pregunta
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer/>
    </div>
  )
}
