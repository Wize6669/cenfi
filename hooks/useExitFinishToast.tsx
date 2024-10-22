import { useRef } from 'react'
import { toast } from 'react-hot-toast'
import { AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export const useExitFinishToast = (simulatorId: string, onExit?: () => void, saveExamData?: () => void) => {
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
          } max-w-md w-full bg-white dark:bg-gray-800 shadow-lg dark:shadow-lg dark:shadow-blue-500/50 rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 py-1 px-2">
            <div className="flex items-center">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-600 mr-2">
                <AlertCircle className="text-yellow-500 dark:text-yellow-600 h-6 w-6"/>
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
              onClick={() => {
                if ((action === 'finalizar' || action === 'salir') && saveExamData) {
                  saveExamData();
                }
                router.replace(`/simulator/${simulatorId}/score`)
                toast.dismiss(t.id)
                if (onExit) onExit()
              }}
              className="w-full rounded-none p-1 flex items-center justify-center text-sm font-medium text-red-600 hover:bg-red-100 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-red-800"
            >
              Sí, {action}
            </button>
          </div>
          <div className="flex border-l border-gray-200 dark:border-gray-700">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full rounded-none rounded-r-lg p-1 flex items-center justify-center text-sm font-medium text-blue-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-blue-400"
            >
              Cancelar
            </button>
          </div>
        </div>
      ),
      {duration: Infinity}
    )
  }

  return {showExitFinishToast}
}
