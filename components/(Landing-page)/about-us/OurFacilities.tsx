'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Home, Cpu, Thermometer } from 'lucide-react';
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { MdTableBar } from 'react-icons/md'

const images = [
  "/images/image-5.jpg?height=400&width=600&text=Instalación 1",
  "/images/image-6.jpg?height=400&width=600&text=Instalación 2",
  "/images/image-7.jpg?height=400&width=600&text=Instalación 3",
  "/images/image-8.jpg?height=400&width=600&text=Instalación 4",
  "/images/image-9.jpg?height=400&width=600&text=Instalación 5",
];

const features = [
  { icon: Home, text: "Aulas confortables" },
  { icon: Cpu, text: "Equipos de última tecnología" },
  { icon: MdTableBar, text: "Mesas ergonómicas" },
  { icon: Thermometer, text: "Aulas con sistema de calefacción" },
];

const OurFacilities = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <section className={'bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-16'}>
      <div className={'max-w-full container mx-auto lg:px-48 md:px-4'}>
        <motion.h2
          className={'text-4xl font-bold text-blue-800 mb-8 text-right dark:text-blue-300 px-4'}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Nuestras Instalaciones
        </motion.h2>
        <div className={'flex flex-col md:flex-row gap-8'}>
          <Card className={'w-full md:w-1/2 dark:bg-gray-800 dark:border-gray-700'}>
            <CardContent className={'p-4'}>
              <div className={'relative h-[30vh] md:h-[40vh]'}>
                <AnimatePresence mode={'wait'}>
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className={'absolute inset-0'}
                  >
                    <Image
                      src={images[currentIndex]}
                      alt={`Instalación ${currentIndex + 1}`}
                      layout={'fill'}
                      objectFit={'cover'}
                      className={'rounded-lg'}
                    />
                  </motion.div>
                </AnimatePresence>
                <div className={'absolute inset-0 flex items-center justify-between p-4'}>
                  <Button variant={'outline'} size={'icon'} onClick={prevSlide} className={'bg-white bg-opacity-50 dark:border-gray-500 hover:bg-opacity-75 dark:bg-gray-700 dark:bg-opacity-50'}>
                    <ChevronLeft size={24} />
                  </Button>
                  <Button variant={'outline'} size={'icon'} onClick={nextSlide} className={'bg-white bg-opacity-50 dark:border-gray-500 hover:bg-opacity-75 dark:bg-gray-700 dark:bg-opacity-50'}>
                    <ChevronRight size={24} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className={'w-full md:w-1/2 flex flex-col justify-center'}>
            <p className={'text-lg text-gray-700 mb-6 leading-relaxed dark:text-gray-300 mx-4'}>
              Nuestras modernas instalaciones están diseñadas para proporcionar el mejor ambiente de aprendizaje. Contamos con aulas equipadas con la última tecnología, ofreciendo comodidad y eficiencia a nuestros estudiantes.
            </p>
            <ul className={'space-y-4 mx-4'}>
              {features.map((feature, index) => (
                <motion.li
                  key={index}
                  className={'flex items-center p-2 rounded-lg hover:bg-blue-100 transition-colors duration-300 dark:hover:bg-blue-900'}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={'bg-blue-100 p-2 rounded-full mr-4 dark:bg-blue-700'}>
                    <feature.icon className={'w-6 h-6 text-blue-600 dark:text-blue-300'} />
                  </div>
                  <span className={'text-gray-700 font-medium dark:text-gray-300'}>{feature.text}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurFacilities;
