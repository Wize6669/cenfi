import { useRef } from 'react'
import { toast } from 'react-hot-toast'
import { AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export const useExitFinishToast = (onExit?: () => void) => {
  const toastRef = useRef<string | null>(null)
  const router = useRouter()

  const showExitFinishToast = (action: string) => {
    if (toastRef.current) {
      toast.dismiss(toastRef.current)
    }
    toastRef.current = toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 py-1 px-2">
            <div className="flex items-center">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-600">
                <AlertCircle className="text-yellow-500 dark:text-yellow-300" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  ¿Estás seguro de que quieres {action}?
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Esta acción no puede deshacerse.
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200 dark:border-gray-700">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none p-4 flex items-center justify-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-300"
            >
              Cancelar
            </button>
          </div>
          <div className="flex border-l border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                localStorage.clear()
                router.replace('/')
                toast.dismiss(t.id)
                if (onExit) onExit()
              }}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-300"
            >
              Sí, {action}
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    )
  }

  return { showExitFinishToast }
}
