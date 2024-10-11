"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ElegantContentSection from "./Hmv";
import { FaPlay } from "react-icons/fa";
import Image from 'next/image';

const OurHistory: React.FC = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const handlePlayVideo = () => {
    setIsVideoLoaded(true);
  };

  return (
    <section className={'h-auto py-2 md:py-6 flex items-start bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 mt-2'}>
      <div className={'max-w-full container mx-auto lg:px-52'}>
        <motion.h1
          className={'text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-center mb-5 lg:mb-8 text-blue-900 dark:text-blue-300'}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Sobre Nosotros
        </motion.h1>
        <div className={'flex flex-col lg:flex-row'}>
          <div className={'w-full mb-3 md:mb-0'}>
            <motion.h2
              className={'text-lg sm:text-xl md:text-xl lg:text-2xl font-bold text-blue-800 dark:text-blue-400 mb-2 px-4 lg:px-0 md:px-4'}
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
          <div className={'w-full lg:mt-8 px-4'}>
            <motion.div
              className={'sticky top-4 aspect-video md:aspect-auto md:h-[calc(28vh-2rem)] lg:h-[calc(40vh-2rem)]'}
              initial={{opacity: 0, scale: 0.9}}
              animate={{opacity: 1, scale: 1}}
              transition={{delay: 0.4, duration: 0.5}}
            >
              {!isVideoLoaded ? (
                <div className="relative w-full rounded-lg overflow-hidden h-full">
                  <Image
                    src="/images/image-1.png"
                    alt="Imagen que cubre el video de un testimonio sobre el preuniversitario CENFI"
                    fill={true}
                    className="rounded-lg image-class-contain filter dark:drop-shadow-[0_10px_8px_rgba(6,60,74,0.8)] drop-shadow-[0_10px_8px_rgba(74,153,144,0.8)]"
                  />
                  <button
                    onClick={handlePlayVideo}
                    className="absolute inset-0 flex items-center justify-center bg-blue-300 bg-opacity-20 hover:bg-opacity-40 transition-opacity duration-300"
                  >
                    <div
                      className="flex items-center justify-center w-14 h-14 lg:w-20 lg:h-20 rounded-full bg-black/70 hover:bg-black/90 transition-colors">
                      <FaPlay className={'w-7 h-7 lg:w-10 lg:h-10 pl-1 lg:pl-2 text-blue-400 dark:text-button-video-color'}/>
                    </div>
                  </button>
                </div>
              ) : (
                <iframe
                  src={process.env.NEXT_PUBLIC_VIDEO_URL}
                  allow={'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'}
                  allowFullScreen
                  className={'w-full h-full rounded-lg shadow-2xl object-contain dark:bg-gray-700'}
                ></iframe>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurHistory;
