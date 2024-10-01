'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import QuestionRichEditor from '@/components/QuestionRichEditor/QuestionRichEditor'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import Header from "@/components/Header";
import ModuleListNavbar from "@/components/ModulesList/ModuleListNavbar";
import {IconButton} from "@mui/material";
import {ArrowBack} from "@mui/icons-material";
import Footer from "@/components/Footer";
import React from "react";
import { useRouter } from "next/navigation";

export default function Questions() {
  const router = useRouter();
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Escribe aquí tu pregunta...'
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
  })

  const goBack = () => {
    router.back();
  };

  // Function to print editor content to console
  const printContent = () => {
    if (editor) {
      console.log('Editor Content (JSON):', editor.getJSON())
      //console.log('Editor Content (HTML):', editor.getHTML())
    }
  }

  return (
    <div className={'flex flex-col min-h-screen bg-white dark:bg-gray-900'}>
      <Header>
        <ModuleListNavbar/>
      </Header>
      <div className={'flex-grow flex flex-col items-center place-items-center px-4'}>
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <QuestionRichEditor editor={editor}/>
            <div style={{width: '700px'}} className="transition-all duration-300 ease-in-out">
              <EditorContent
                className="p-4 min-h-[250px] w-full h-full focus:outline-none"
                editor={editor}
              />
            </div>
          </div>
          <button
            onClick={printContent}
            className="mt-6 w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
          >
            Print Content
          </button>
        </div>
        <div className={'flex justify-center'}>
        </div>
        <Footer/>
      </div>
      )
}


