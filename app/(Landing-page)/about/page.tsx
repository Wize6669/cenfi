import Navbar from '@/components/(Landing-page)/NavbarLandingPage'
import Footer from '@/components/(Landing-page)/FooterLandingPage'
import OurHistory from '@/components/(Landing-page)/about-us/OurHistory'
import OurFacilities from '@/components/(Landing-page)/about-us/OurFacilities'
import OurResults from '@/components/(Landing-page)/about-us/OurResults'
import FloatingCardScrollUpButton from "@/components/(Landing-page)/FloatingCardScrollUpButton";

export default function Contact() {
  return (
    <div className={'min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 flex flex-col'}>
      <Navbar />
      <main className={'flex-grow'}>
        <OurHistory />
        <OurFacilities />
        <OurResults />
      </main>
      <Footer />
      <FloatingCardScrollUpButton />
    </div>
  )
}
