'use client'

import React, {useState} from 'react';
import { Card, CardContent } from "@/components/ui/Card";
import {BookOpen, Target, Eye, ChevronDown, ChevronUp} from 'lucide-react';
import {Button} from "@/components/ui/Button";
import {AnimatePresence, motion} from "framer-motion";

interface ElegantExpandableCardProps {
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const ExpandableCard: React.FC<ElegantExpandableCardProps> = ({ title, content, icon }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className={'overflow-hidden shadow-lg hover:shadow-blue-500/50 dark:shadow-lg dark:border-none dark:hover:shadow-blue-500/50 transition-shadow duration-300 dark:bg-gray-900 dark:border-gray-700'}>
      <CardContent className={'py-2 px-4'}>
        <Button
          variant={'ghost'}
          className={'w-full h-full flex justify-between hover:bg-white dark:hover:bg-gray-900 items-center dark:text-gray-300'}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className={'flex items-center space-x-4'}>
            {icon}
            <h3 className={'text-base md:text-lg lg:text-xl font-semibold text-blue-800 dark:text-blue-400'}>{title}</h3>
          </div>
          {isOpen ? <ChevronUp className={'w-5 h-5 lg:w-6 lg:h-6 text-blue-500 dark:text-blue-400'} size={20}/> : <ChevronDown className={'w-5 h-5 lg:w-6 lg:h-6 text-blue-500 dark:text-blue-400'} size={20}/>}
        </Button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{height: 0, opacity: 0}}
              animate={{height: 'auto', opacity: 1}}
              exit={{height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={'overflow-hidden'}
            >
              <div className={'mt-3 text-gray-700 dark:text-gray-300'}>{content}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

const HistoriaContent = () => (
  <div className={'space-y-6 text-gray-700 dark:text-gray-300'}>
    <p className={'leading-relaxed text-justify text-sm md:text-base lg:text-base dark:text-gray-400'}>
      CENTRO DE FORMACIÓN INTENSIVA CIA. LTDA. <q>CENFI</q>, se origina en el año 2018 con el propósito principal de brindar un nivel de educación acorde a las exigencias académicas actuales.
    </p>
    <p className={'leading-relaxed text-justify text-sm md:text-base lg:text-base dark:text-gray-400'}>
      Disponemos de un equipo de trabajo con profesionales de tercer y cuarto nivel, con más de 10 años de experiencia en la preparación y asesoría académica de estudiantes de tercero de bachillerato y bachilleres graduados, obteniendo excelentes resultados de ingreso a universidades locales y a nivel nacional. Contamos con alumnos vinculados al programa GAR (Grupo de Alto Rendimiento).
    </p>
    <div className={'bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-inner dark:bg-gradient-to-r dark:from-blue-800 dark:to-indigo-900'}>
      <h4 className={'text-sm md:text-base lg:text-xl font-semibold text-blue-800 mb-4 dark:text-blue-400'}>Alumnos destacados:</h4>
      <ul className={'space-y-2 text-sm md:text-base lg:text-base dark:text-gray-400'}>
        {[
          "Marjhorie Krupskaya Caraguay Sivisapa – 1000 puntos.",
          "Marlon Alexander Coronel Loaiza – 997 puntos.",
          "María Susana Alvarez Castillo – 997 puntos.",
          "Celia María Poma Ortiz – 996 puntos.",
          "Albania Mercedes Crespo Carpio – 991 puntos."
        ].map((item, index) => (
          <li key={index} className={'flex items-start'}>
            <span className={'text-blue-500 mr-2 font-bold text-xl'}>•</span>
            <span className={'font-medium'}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
    <p className={'leading-relaxed text-justify text-sm md:text-base lg:text-base dark:text-gray-400'}>
      Cada profesional es especialista en áreas relacionadas con la parte psicotécnica que incluye el dominio de Razonamientos (Numérico, Verbal, Lógico, Atención y concentración) y en conocimientos específicos tales como: Matemática, Ciencias Naturales (Biología, Química y Física), Estudios Sociales (Historia, Geografía, Emprendimiento, Ciudadanía) y Lengua y Literatura.
    </p>
  </div>
);

const MisionContent = () => (
  <div className={'space-y-6 text-gray-700 dark:text-gray-300'}>
    <p className={'leading-relaxed text-justify text-sm md:text-base lg:text-base dark:text-gray-400'}>
      Nuestra misión en CENFI es proporcionar una educación de alta calidad y personalizada para estudiantes que buscan un cupo en el sistema de educación superior o bien nivelar sus conocimientos y habilidades. Nos comprometemos a:
    </p>
    <div className={'bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl shadow-inner dark:bg-gradient-to-r dark:from-blue-900 dark:to-cyan-900'}>
      <ul className={'space-y-4 text-sm md:text-base lg:text-base dark:text-gray-400'}>
        {[
          "Proporcionar un entorno de aprendizaje dinámico y apoyo individualizado para cada estudiante.",
          "Desarrollar habilidades críticas y pensamiento analítico para una comprensión profunda de los conceptos.",
          "Fomentar la confianza y la motivación en nuestros estudiantes para alcanzar su máximo potencial.",
          "Preparar a nuestros estudiantes para el éxito en la educación superior.",
          "Mantener altos estándares de enseñanza y evaluación para garantizar la excelencia académica."
        ].map((item, index) => (
          <li key={index} className={'flex items-start'}>
            <span className={'text-blue-500 mr-3 font-bold text-xl'}>•</span>
            <span className={'flex-1'}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
    <p className={'leading-relaxed text-justify text-sm md:text-base lg:text-base dark:text-gray-400'}>
      En CENFI, nos esforzamos por ser un puente hacia el éxito para nuestros estudiantes, proporcionándoles las herramientas y el conocimiento necesarios para alcanzar sus objetivos y realizar sus sueños.
    </p>
  </div>
);

const VisionContent = () => (
  <div className={'space-y-6 text-gray-700 dark:text-gray-300'}>
    <p className={'leading-relaxed text-justify text-sm md:text-base lg:text-base dark:text-gray-400'}>
      Nuestra visión es ser reconocida como una academia de nivelación líder en la región, destacándonos por nuestra excelencia académica, innovación y compromiso con el éxito de nuestros estudiantes. Nos comprometemos a:
    </p>
    <div className={'bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl shadow-inner dark:bg-gradient-to-r dark:from-cyan-900 dark:to-blue-900'}>
      <ul className={'space-y-4 text-sm md:text-base lg:text-base dark:text-gray-400'}>
        {[
          "Ser el referente en educación de nivelación, brindando programas y servicios de alta calidad que respondan a las necesidades de nuestros estudiantes.",
          "Empoderar a nuestros estudiantes con el conocimiento, habilidades y confianza para alcanzar sus metas académicas.",
          "Fomentar una cultura de aprendizaje colaborativo, inclusivo y estimulante que permita a nuestros estudiantes crecer intelectual y personalmente.",
          "Ser un agente de cambio positivo en la comunidad, contribuyendo al desarrollo educativo y social de la región."
        ].map((item, index) => (
          <li key={index} className={'flex items-start'}>
            <span className={'text-green-500 mr-3 font-bold text-xl'}>•</span>
            <span className={'flex-1'}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
    <p className={'leading-relaxed text-justify text-sm md:text-base lg:text-base dark:text-gray-400'}>
      En CENFI, nos esforzamos por crear un futuro brillante para nuestros estudiantes, y ser un motor de progreso en la educación y la sociedad.
    </p>
  </div>
);

const ElegantContentSection = () => (
  <div className={'container mx-auto px-4 py-4 md:py-7 space-y-7 dark:from-gray-800 dark:to-gray-900 dark:text-gray-300'}>
    <ExpandableCard
      title={'Historia'}
      icon={<BookOpen className={'w-6 h-6 lg:w-8 lg:h-8 text-blue-600 dark:text-blue-400'} />}
      content={<HistoriaContent />}
    />
    <ExpandableCard
      title={'Misión'}
      icon={<Target className={'w-6 h-6 lg:w-8 lg:h-8 text-blue-600 dark:text-blue-400'} />}
      content={<MisionContent />}
    />
    <ExpandableCard
      title={'Visión'}
      icon={<Eye className={'w-6 h-6 lg:w-8 lg:h-8 text-blue-600 dark:text-blue-400'} />}
      content={<VisionContent />}
    />
  </div>
);

export default ElegantContentSection;
