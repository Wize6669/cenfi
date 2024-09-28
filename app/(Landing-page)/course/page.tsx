import Navbar from "@/components/(Landing-page)/NavbarLandingPage";
import Footer from "@/components/(Landing-page)/FooterLandingPage";
import FloatingCardScrollUpButton from "@/components/(Landing-page)/FloatingCardScrollUpButton";
import CourseList from "@/components/(Landing-page)/course/CourseOffer";

export default function Course() {
  return (
    <div className={'min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 flex flex-col'}>
      <Navbar />
      <main className={'flex-grow'}>
        <CourseList />
      </main>
      <Footer />
      <FloatingCardScrollUpButton />
    </div>
  )
}
