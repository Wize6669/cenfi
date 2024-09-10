'use client'

import Navbar from '@/components/(Landing-page)/NavbarLandingPage'
import InformacionCentro from '@/components/(Landing-page)/home/informacion-centro'
import ProcesoAdmision from "@/components/(Landing-page)/home/proceso-admision"
import HeroSection from '@/components/(Landing-page)/home/hero-section'
import InformacionPrueba from '@/components/(Landing-page)/home/informacion-prueba'
import BeneficiosEstudiantes from '@/components/(Landing-page)/home/beneficios-estudiantes'
import NuestrosCursos from '@/components/(Landing-page)/home/nuestros-cursos'
import Footer from "@/components/(Landing-page)/FooterLandingPage"
import FloatingCardScrollUpButton from "@/components/(Landing-page)/FloatingCardScrollUpButton";

export default function Home() {
  return (
    <div
      className={'min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 flex flex-col'}>
      <Navbar/>
      <main className={'flex-grow w-full'}>
        <HeroSection/>
        <InformacionCentro/>
        <InformacionPrueba/>
        <ProcesoAdmision/>
        <BeneficiosEstudiantes/>
        <NuestrosCursos/>
      </main>
      <Footer/>
      <FloatingCardScrollUpButton/>
    </div>
  );
}
