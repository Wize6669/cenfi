import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const HeroSection: React.FC = () => {

  const handleClick = () => {
    window.open('https://api.whatsapp.com/send/?phone=593992562952&text&type=phone_number&app_absent=0', '_blank');
  };

  return (
    <section className={'lg:min-h-[45vh] md:min-h-[30vh] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 flex items-center mt-2'}>
      <div className={'max-w-full mx-auto px-4 sm:px-6 lg:px-48 py-8'}>
        <div className={'grid md:grid-cols-2 gap-8 items-center'}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className={'text-3xl md:text-4xl font-bold text-blue-900 dark:text-blue-300 mb-4'}>
              Prepárate para tu futuro universitario
            </h1>
            <p className={'text-lg text-blue-700 dark:text-blue-100 mb-6'}>
              Alcanza tu máximo potencial con nuestros cursos preuniversitarios diseñados para asegurar tu ingreso a la universidad de tus sueños.
            </p>
            <Button size="lg" className={'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'} onClick={handleClick}>
              Inscríbete ahora
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className={'relative'}
          >
            <Image
              src={'/images/image-3.png'}
              alt={'Estudiantes mostrando sus resultados'}
              width={700}
              height={600}
              className={'rounded p-1 shadow-xl shadow-blue-500/50 w-full h-auto md:w-auto'}
            />
            <div className={'absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg shadow-cyan-500/50 mt-4 md:scale-100'}>
              <h3 className={'text-sm md:text-base font-semibold text-blue-900 dark:text-white mb-2'}>Nuestros servicios</h3>
              <ul className={'space-y-1 text-sm md:text-base'}>
                <li className={'flex items-center text-blue-700 dark:text-gray-300'}>
                  <CheckCircle className={'mr-2 h-4 w-4 text-green-500'} /> Tutorías
                </li>
                <li className={'flex items-center text-blue-700 dark:text-gray-300'}>
                  <CheckCircle className={'mr-2 h-4 w-4 text-green-500'} /> Pruebas de admisión
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;