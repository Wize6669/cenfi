'use client'

import Navbar from '@/components/(Landing-page)/NavbarLandingPage'
import InformationCenter from '@/components/(Landing-page)/home/InformationCenter'
import AdmissionProcess from "@/components/(Landing-page)/home/AdmissionProcess"
import HeroSection from '@/components/(Landing-page)/home/HeroSection'
import TestInformation from '@/components/(Landing-page)/home/TestInformation'
import StudentBenefits from '@/components/(Landing-page)/home/StudentBenefits'
import OurCourses from '@/components/(Landing-page)/home/OurCourses'
import Footer from "@/components/(Landing-page)/FooterLandingPage"
import FloatingCardScrollUpButton from "@/components/(Landing-page)/FloatingCardScrollUpButton";

export default function Home() {
  return (
    <div
      className={'min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 flex flex-col'}>
      <Navbar/>
      <main className={'flex-grow w-full'}>
        <HeroSection/>
        <InformationCenter/>
        <TestInformation/>
        <AdmissionProcess/>
        <StudentBenefits/>
        <OurCourses/>
      </main>
      <Footer/>
      <FloatingCardScrollUpButton/>
    </div>
  );
}
