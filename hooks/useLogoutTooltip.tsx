import { useRef } from 'react'
import { useRouter } from "next/navigation"
import toast from 'react-hot-toast'
import { AlertTriangle } from 'lucide-react'

export const useLogoutTooltip = (onClose: () => void) => {
  const router = useRouter()
  const toastRef = useRef<string | null>(null)

  const handleLogOut = () => {
    if (toastRef.current) {
      toast.dismiss(toastRef.current)
    }
    toastRef.current = toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className={'flex-1 w-0 p-1'}>
          <div className={'flex items-center justify-center'}>
            <div className={'flex-shrink pt-0.5'}>
              <AlertTriangle className={'h-10 w-10 mx-1 text-yellow-500'}/>
            </div>
            <div className={'flex-1'}>
              <p className={'text-sm font-medium text-center text-gray-900 dark:text-white'}>
                Cerrar Sesión
              </p>
              <p className={'mt-1 text-sm text-center text-gray-500 dark:text-gray-400 sm:block'}>
                ¿Estás seguro de que quieres cerrar sesión?
              </p>
            </div>
          </div>
        </div>
        <div className={'flex border-l border-gray-200 dark:border-gray-700'}>
          <button
            onClick={() => {
              localStorage.clear()
              router.replace('/admin')
              toast.dismiss(t.id)
              onClose()
            }}
            className={'w-full border border-transparent rounded-none p-2 flex items-center justify-center text-sm font-medium text-red-600 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500'}
          >
            Confirmar
          </button>
        </div>
        <div className={'flex border-l border-gray-200 dark:border-gray-700'}>
          <button
            onClick={() => toast.dismiss(t.id)}
            className={'w-full border border-transparent rounded-none rounded-r-lg p-2 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500'}
          >
            Cancelar
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
    })
  }

  return {handleLogOut}
}
