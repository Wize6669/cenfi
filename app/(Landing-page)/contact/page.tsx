import Navbar from '@/components/(Landing-page)/NavbarLandingPage'
import Contacto from '@/components/(Landing-page)/contact/contacto'
import Footer from "@/components/(Landing-page)/FooterLandingPage"
import FloatingCardScrollUpButton from "@/components/(Landing-page)/FloatingCardScrollUpButton";

export default function Contact() {
  return (
    <div className={'min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 flex flex-col'}>
      <Navbar />
      <main className={'flex-grow'}>
        <Contacto />
      </main>
      <Footer />
      <FloatingCardScrollUpButton />
    </div>
  )
}
