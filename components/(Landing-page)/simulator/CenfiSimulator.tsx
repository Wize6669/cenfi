'use client';

import React, {useState, useMemo, useEffect, useRef} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, HelpCircle, Play, Shuffle, ArrowRight, Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import LoginStudentsModal from '@/components/Modal/LoginStudentsModal';

const simuladores = [
  { nombre: 'Simulador Universidad Nacional de Loja', duracion: 100, preguntas: 120, navegacionLibre: true },
  { nombre: 'Simulador Escuela Politécnica Nacional', duracion: 120, preguntas: 100, navegacionLibre: false },
  { nombre: 'Simulador Universidad Central del Ecuador', duracion: 70, preguntas: 120, navegacionLibre: true },
  { nombre: 'Simulador ESPE', duracion: 70, preguntas: 120, navegacionLibre: false },
  { nombre: 'Simulador Udla', duracion: 70, preguntas: 120, navegacionLibre: true },
  { nombre: 'Universidad Técnica Particular de Loja', duracion: 70, preguntas: 120, navegacionLibre: false },
];

interface SimuladorProps {
  nombre: string;
  duracion: number;
  preguntas: number;
  navegacionLibre: boolean;
}

const SimuladorCard: React.FC<SimuladorProps> = ({ nombre, duracion, preguntas, navegacionLibre }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={'bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-600 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col h-full'}
    >
      <div className={'p-6 flex flex-col flex-grow'}>
        <h2 className={'text-xl font-bold text-gray-800 dark:text-blue-300 mb-4 flex-grow'}>
          {nombre}
        </h2>
        <div className={'flex justify-between items-center mt-auto'}>
          <div className={'space-y-2'}>
            <div className={'flex items-center text-gray-600 dark:text-gray-300'}>
              <Clock className={'w-4 h-4 mr-2 text-cyan-950 dark:text-gray-200'} />
              <span className={'text-sm'}>
                {duracion} min
              </span>
            </div>
            <div className={'flex items-center text-gray-600 dark:text-gray-300'}>
              <HelpCircle className={'w-4 h-4 mr-2 text-amber-600'} />
              <span className={'text-sm'}>
                {preguntas} preguntas
              </span>
            </div>
            <div className={'flex items-center text-gray-600 dark:text-gray-300'}>
              {navegacionLibre ? (
                <Shuffle className={'w-4 h-4 mr-2 text-green-600'} />
              ) : (
                <ArrowRight className={'w-4 h-4 mr-2 text-blue-600'} />
              )}
              <span className={'text-sm'}>
                Navegación {navegacionLibre ? 'libre' : 'secuencial'}
              </span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors duration-300'}
            onClick={openModal}
          >
            Iniciar
            <Play className={'w-4 h-4 ml-2'} />
          </motion.button>
        </div>
      </div>
      <LoginStudentsModal isOpenModal={isModalOpen} setIsOpenModal={setIsModalOpen} />
    </motion.div>
  );
};

export default function CenfiSimulator() {
  const [searchTerm, setSearchTerm] = useState('');
  const [navegacionFilter, setNavegacionFilter] = useState('todos');
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectWidth, setSelectWidth] = useState('auto');
  const selectRef = useRef<HTMLButtonElement>(null);

  const filteredSimuladores = useMemo(() => {
    return simuladores.filter(simulador => {
      const matchesSearch = simulador.nombre.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesNavegacion =
        navegacionFilter === 'todos' ||
        (navegacionFilter === 'libre' && simulador.navegacionLibre) ||
        (navegacionFilter === 'secuencial' && !simulador.navegacionLibre);
      return matchesSearch && matchesNavegacion;
    });
  }, [searchTerm, navegacionFilter]);

  const clearSearch = () => {
    setSearchTerm('');
  };

  useEffect(() => {
    const updateSelectWidth = () => {
      if (selectRef.current) {
        const options = ['Todos', 'Navegación Libre', 'Navegación Secuencial'];
        const maxWidth = Math.max(...options.map(option => {
          const tempSpan = document.createElement('span');
          tempSpan.style.visibility = 'hidden';
          tempSpan.style.position = 'absolute';
          tempSpan.style.whiteSpace = 'nowrap';
          tempSpan.innerHTML = option;
          document.body.appendChild(tempSpan);
          const width = tempSpan.offsetWidth;
          document.body.removeChild(tempSpan);
          return width;
        }));
        setSelectWidth(`${maxWidth + 40}px`); // Add some padding
      }
    };

    updateSelectWidth();
    window.addEventListener('resize', updateSelectWidth);
    return () => window.removeEventListener('resize', updateSelectWidth);
  }, []);

  return (
    <div className={'container mx-auto px-4 py-8'}>
      <div className={'mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between'}>
        <p className={'text-xl font-bold text-blue-900 dark:text-blue-500 mb-4 sm:mb-0'}>
          Simuladores disponibles: {filteredSimuladores.length}
        </p>
        <div className={'flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto'}>
          <div className={'relative flex-grow'}>
            <input
              type="text"
              placeholder="Buscar simulador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={'w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'}
            />
            <Search className={'absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'} size={18}/>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className={'absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'}
              >
                <X size={18} />
              </button>
            )}
          </div>
          <div className={'relative'} style={{ width: selectWidth }}>
            <button
              ref={selectRef}
              onClick={() => setIsSelectOpen(!isSelectOpen)}
              className={'w-full sm:w-auto py-2 px-4 bg-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white flex justify-between items-center'}
              style={{ width: '100%' }}
            >
              <span className="truncate">
                {navegacionFilter === 'todos' ? 'Todos' : navegacionFilter === 'libre' ? 'Navegación Libre' : 'Navegación Secuencial'}
              </span>
              {isSelectOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            <AnimatePresence>
              {isSelectOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={'absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg'}
                >
                  {['todos', 'libre', 'secuencial'].map((option) => (
                    <button
                      key={option}
                      className={'w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600'}
                      onClick={() => {
                        setNavegacionFilter(option);
                        setIsSelectOpen(false);
                      }}
                    >
                      {option === 'todos' ? 'Todos' : option === 'libre' ? 'Navegación Libre' : 'Navegación Secuencial'}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}>
        {filteredSimuladores.map((simulador, index) => (
          <SimuladorCard key={index} {...simulador} />
        ))}
      </div>
    </div>
  );
}
