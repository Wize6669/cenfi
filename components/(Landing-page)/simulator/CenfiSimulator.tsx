'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, HelpCircle, Play, Shuffle, ArrowRight, Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import LoginStudentsModal from '@/components/Modal/LoginStudentsModal';
import {axiosInstance} from "@/lib/axios";

interface Simulator {
  id: string;
  name: string;
  duration: number;
  number_of_questions: number;
  navigate: boolean;
  visibility: boolean;
}

interface PaginatedResponseSimulator {
  data: Simulator[];
  currentPage: number;
  totalPages: number;
}

const SimulatorCard: React.FC<Simulator> = ({ id, name, duration, number_of_questions, navigate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [simulatorId, setSimulatorId] = useState('');

  const openModal = () => {
    setSimulatorId(id);
    setIsModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={'bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-600 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col h-full'}
    >
      <div className={'p-6 flex flex-col flex-grow'}>
        <h2 className={'text-lg md:text-base lg:text-xl font-bold text-blue-800 dark:text-blue-300 mb-4 flex-grow'}>
          {name}
        </h2>
        <div className={'flex justify-between items-center mt-auto'}>
          <div className={'space-y-2'}>
            <div className={'flex items-center text-gray-600 dark:text-gray-300'}>
              <Clock className={'w-4 h-4 mr-2 text-cyan-950 dark:text-gray-200'} />
              <span className={'text-xs md:text-sm lg:text-sm'}>
                {duration} min
              </span>
            </div>
            <div className={'flex items-center text-gray-600 dark:text-gray-300'}>
              <HelpCircle className={'w-4 h-4 mr-2 text-amber-600'} />
              <span className={'text-xs md:text-sm lg:text-sm'}>
                {number_of_questions} preguntas
              </span>
            </div>
            <div className={'flex items-center text-gray-600 dark:text-gray-300'}>
              {navigate ? (
                <Shuffle className={'w-4 h-4 mr-2 text-green-600'} />
              ) : (
                <ArrowRight className={'w-4 h-4 mr-2 text-blue-600'} />
              )}
              <span className={'text-xs md:text-sm lg:text-sm'}>
                Navegación {navigate ? 'libre' : 'secuencial'}
              </span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={'text-sm md:text-sm lg:text-base bg-blue-500 hover:bg-blue-600 text-gray-200 font-bold py-2 px-4 rounded-lg flex items-center transition-colors duration-300'}
            onClick={openModal}
          >
            Iniciar
            <Play className={'w-4 h-4 ml-2'} />
          </motion.button>
        </div>
      </div>
      <LoginStudentsModal
        id={id}
        simulatorName={name}
        isOpenModal={isModalOpen}
        setIsOpenModal={setIsModalOpen}

      />
    </motion.div>
  );
};

export default function CenfiSimulator() {
  const [searchTerm, setSearchTerm] = useState('');
  const [navegacionFilter, setNavegacionFilter] = useState('todos');
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectWidth, setSelectWidth] = useState('auto');
  const selectRef = useRef<HTMLButtonElement>(null);
  const [simulators, setSimulators] = useState<Simulator[]>([]);
  const [filteredSimulators, setFilteredSimulators] = useState<Simulator[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSimulators = useCallback(async (page: number) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get<PaginatedResponseSimulator>('/simulators', {
        params: {
          page: page,
          count: 50
        }
      });

      const visibleSimulators = response.data.data.filter(simulator => simulator.visibility);

      if (page === 1) {
        setSimulators(visibleSimulators);
        setFilteredSimulators(visibleSimulators);
      } else {
        setSimulators(prevSimulators => {
          const newSimulators = [...prevSimulators, ...visibleSimulators];
          setFilteredSimulators(newSimulators);
          return newSimulators;
        });
      }

      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
      setIsLoading(false);
    } catch (err) {
      setError('Error al cargar los simuladores');
      setIsLoading(false);
      console.error('Error fetching simulators:', err);
    }
  }, []);

  useEffect(() => {
    fetchSimulators(1)
      .then(() => {
      console.log('Simuladores cargadas correctamente.');
    })
      .catch((error) => {
        console.error('Error fetching simulators:', error);
      });
  }, [fetchSimulators]);

  useEffect(() => {
    const filtered = simulators.filter(simulator => {
      const matchesSearch = simulator.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesNavegacion =
        navegacionFilter === 'todos' ||
        (navegacionFilter === 'libre' && simulator.navigate) ||
        (navegacionFilter === 'secuencial' && !simulator.navigate);
      return matchesSearch && matchesNavegacion;
    });
    setFilteredSimulators(filtered);
  }, [searchTerm, navegacionFilter, simulators]);

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

  const loadMore = () => {
    if (currentPage < totalPages) {
      fetchSimulators(currentPage + 1);
    }
  };

  return (
    <div className={'container mx-auto px-4 md:py-8 py-4'}>
      <motion.h1
        className="pb-0 md:pb-2 text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-center mb-4 text-blue-800 dark:text-blue-500"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >Simuladores CENFI
      </motion.h1>
      <div className={'mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between'}>
        <p className={'text-sm md:text-base lg:text-lg font-bold text-blue-900 dark:text-blue-500 mb-4 sm:mb-0'}>
          Simuladores disponibles: {filteredSimulators.length}
        </p>
        <div className={'flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto'}>
          <div className={'relative flex-grow'}>
            <input
              type="text"
              placeholder="Buscar simulador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={'w-full h-[35px] md:text-sm lg:text-base dark:text-gray-200 md:w-64 pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 text-sm sm:text-base'}
            />
            <Search className={'absolute left-3 top-1/2 transform -translate-y-2.5 text-blue-500 dark:text-blue-400'}
                    size={18}/>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className={'absolute right-3 top-1/2 transform -translate-y-2.5 text-gray-400 hover:text-gray-600'}
              >
                <X
                  className={'right-0 top-1/2 transform -translate-y-0 dark:text-blue-400 text-blue-500 hover:text-red-600 dark:hover:text-red-400'}
                  size={18}/>
              </button>
            )}
          </div>
          <div className={'relative'} style={{width: selectWidth}}>
            <button
              ref={selectRef}
              onClick={() => setIsSelectOpen(!isSelectOpen)}
              className={'w-full h-[35px] text-sm md:text-sm lg:text-base sm:w-auto py-2 px-4 bg-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white flex justify-between items-center'}
              style={{width: '100%'}}
            >
              <span className="truncate">
                {navegacionFilter === 'todos' ? 'Todos' : navegacionFilter === 'libre' ? 'Navegación Libre' : 'Navegación Secuencial'}
              </span>
              {isSelectOpen ? <ChevronUp className={'text-blue-500 dark:text-blue-400'} size={18}/> :
                <ChevronDown className={'text-blue-500 dark:text-blue-400'} size={18}/>}
            </button>
            <AnimatePresence>
              {isSelectOpen && (
                <motion.div
                  initial={{opacity: 0, y: -10}}
                  animate={{opacity: 1, y: 0}}
                  exit={{opacity: 0, y: -10}}
                  transition={{duration: 0.2}}
                  className={'absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg'}
                >
                  {['todos', 'libre', 'secuencial'].map((option) => (
                    <button
                      key={option}
                      className={'w-full h-[35px] text-sm md:text-sm lg:text-base text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600'}
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
        {filteredSimulators.map((simulator) => (
          <SimulatorCard key={simulator.id} {...simulator} />
        ))}
      </div>
      {currentPage < totalPages && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            disabled={isLoading}
          >
            {isLoading ? 'Cargando...' : 'Cargar más'}
          </button>
        </div>
      )}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
}
