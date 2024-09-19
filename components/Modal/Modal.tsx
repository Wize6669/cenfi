import {createPortal} from 'react-dom';
import React, {useEffect} from "react";

interface PropsPortal {
  children: React.ReactNode;
  isOpenModal: boolean;
  setIsOpenModal: (status: boolean) => void;
}

export default function Modal({children, isOpenModal, setIsOpenModal}: PropsPortal) {
  useEffect(() => {
    if (isOpenModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpenModal]);

  if (!isOpenModal) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-50 flex">
      <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg dark:bg-gray-900">
        <div className="flex flex-col items-start">
          {children}
        </div>
        <button
          className="absolute top-0 right-0 mt-4 mr-4 text-gray-400 hover:text-gray-600"
          onClick={() => setIsOpenModal(false)}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>,
    document.body
  );
}
