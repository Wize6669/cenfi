import Navbar from '@/components/(Landing-page)/NavbarLandingPage'
import Footer from "@/components/(Landing-page)/FooterLandingPage"
import FloatingCardScrollUpButton from "@/components/(Landing-page)/FloatingCardScrollUpButton";
import CenfiSimulator from "@/components/(Landing-page)/simulator/CenfiSimulator";

export default function Contact() {
  return (
    <div className={'min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 flex flex-col'}>
      <Navbar />
      <main className={'flex-grow'}>
        <CenfiSimulator />
      </main>
      <Footer />
      <FloatingCardScrollUpButton />
    </div>
  )
}
