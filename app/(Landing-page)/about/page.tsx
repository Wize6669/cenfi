import Navbar from '@/components/(Landing-page)/NavbarLandingPage'
import Footer from '@/components/(Landing-page)/FooterLandingPage'
import NuestraHistoria from '@/components/(Landing-page)/about-us/nuestra-historia'
import NuestrasInstalaciones from '@/components/(Landing-page)/about-us/nuestras-instalaciones'
import NuestrosResultados from '@/components/(Landing-page)/about-us/nuestros-resultados'
import FloatingCardScrollUpButton from "@/components/(Landing-page)/FloatingCardScrollUpButton";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <NuestraHistoria />
        <NuestrasInstalaciones />
        <NuestrosResultados />
      </main>
      <Footer />
      <FloatingCardScrollUpButton />
    </div>
  )
}
