"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ElegantContentSection from "./HMV";

interface ExpandableCardProps {
  title: string;
  content: React.ReactNode;
}

const ExpandableCard: React.FC<ExpandableCardProps> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className={'mb-4 dark:bg-gray-800 dark:border-gray-700'}>
      <CardContent className={'p-4'}>
        <Button
          variant={'ghost'}
          className={'w-full flex justify-between items-center dark:text-gray-300'}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={'text-lg font-semibold'}>{title}</span>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </Button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={'overflow-hidden'}
            >
              <p className={'mt-4 text-gray-700 dark:text-gray-300'}>{content}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

const NuestraHistoria = () => {
  return (
    <section className={'h-auto flex items-start bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 pt-10 pb-5 mt-2'}>
      <div className={'max-w-full container mx-auto lg:px-60'}>
        <motion.h1
          className={'text-4xl font-bold text-center mb-8 text-blue-900 dark:text-blue-300'}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Sobre Nosotros
        </motion.h1>
        <div className={'flex flex-col md:flex-row'}>
          <div className={'w-full md:w-1/2 pr-0 md:pr-8 mb-8 md:mb-0'}>
            <motion.h2
              className={'text-4xl font-bold text-blue-800 dark:text-blue-400 mb-2'}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Nuestra Historia
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className={'overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-100 dark:scrollbar-thumb-blue-700 dark:scrollbar-track-gray-900'}
            >
              <ElegantContentSection />
            </motion.div>
          </div>
          <div className={'w-full md:w-1/2 lg:mt-10 md:mt-16'}>
            <motion.div
              className={'sticky top-4 aspect-video md:aspect-auto md:h-[calc(28vh-2rem)] lg:h-[calc(40vh-2rem)]'}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <iframe
                src={'https://drive.google.com/file/d/17-I0QWEIhEPYtjsTUyUHUpDuLySq5JY1/preview'}
                frameBorder={'0'}
                allow={'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'}
                allowFullScreen
                className={'w-full h-full rounded-lg shadow-2xl object-contain dark:bg-gray-700'}
              ></iframe>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NuestraHistoria;
