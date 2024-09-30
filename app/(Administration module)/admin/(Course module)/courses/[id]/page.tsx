'use client'

import CourseEditForm from "@/components/(Course module)/CourseEditForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ModuleListNavbar from "@/components/ModulesList/ModuleListNavbar";
import { IconButton } from '@mui/material'
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function EditCourse({ params }: { params: { id: string } }) {

  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  return (
    <div className={'flex flex-col min-h-screen bg-white dark:bg-gray-900'}>
      <Header>
        <ModuleListNavbar/>
      </Header>
      <div className={'flex-grow flex flex-col items-center place-items-center px-4'}>
        <div className={'w-[87%] grid grid-cols-[3%_97%] grid-rows-2 gap-x-4 justify-items-center'}>
          <div className={'w-auto col-span-2'}>
            <h1 className={'font-bold text-xl lg:text-3xl mt-4 text-gray-900 dark:text-gray-200 text-center'}>
              Edición del Curso
            </h1>
          </div>
          <div className={'row-start-2 justify-items-center content-center'}>
            <IconButton className={'dark:border-gray-500 dark:hover:bg-gray-600'} sx={{border: '1px solid #ccc'}} onClick={goBack}>
              <ArrowBack className={'text-gray-400 dark:text-gray-500'}/>
            </IconButton>
          </div>
          <div className={'w-full row-start-2 content-center justify-items-center'}>
            <div className={'border-t-2 container dark:border-gray-600'}/>
          </div>
        </div>
        <CourseEditForm courseId={params.id} />
      </div>
      <Footer/>
    </div>
  );
}
