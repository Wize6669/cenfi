'use client'

import Footer from "@/components/Footer";
import FinalScore from "@/components/FinalScore";
import { useRouter } from 'next/navigation';

export default function Score() {
  const router = useRouter();

  // Manejador de nuevo intento
  const handleNewAttempt = () => {
    // Redirige al usuario a la página de una nueva prueba
    router.push('/simulator/start-simulator');
  };

  // Manejador de revisar intento
  const handleReviewAttempt = () => {
    // Redirige al usuario a una página de revisión del intento
    router.push('/');
  };

  // Manejador de salir
  const handleExit = () => {
    // Redirige al usuario a la página de inicio
    router.push('/');
  };

  return (
    <div
      className={'min-h-screen dark:bg-gray-900 flex flex-col'}>
      <main className={'flex-grow w-full'}>
        <FinalScore
          score={100}
          total={100}
          onNewAttempt={handleNewAttempt}
          onReviewAttempt={handleReviewAttempt}
          onExit={handleExit}/>
      </main>
      <Footer/>
    </div>
  );
}
