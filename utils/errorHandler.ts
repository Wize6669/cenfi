import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';
import { ErrorResponse, CustomErrorMessages } from "@/interfaces/ResponseAPI";

export const handleAxiosError = (
  error: unknown,
  customMessages?: CustomErrorMessages
) => {
  if (error instanceof AxiosError) {
    const status = error?.response?.status;
    const data = error?.response?.data;

    switch (status) {
      case 400: {
        const errors = data.errors;
        const errorApi = data.error;

        if (Array.isArray(errors)) {
          const errorsMessages = errors
            .map((errorMessage: ErrorResponse) => {
              if (errorMessage.field) {
                return `${errorMessage.field}: ${errorMessage.message}`;
              }
              return errorMessage.message;
            })
            .join('\n');

          return toast.error(errorsMessages || customMessages?.badRequest || 'Error en la solicitud');
        }

        return toast.error(errorApi?.message || customMessages?.badRequest || 'Error en la solicitud');
      }

      case 401:
        return toast.error(customMessages?.unauthorized || 'No autorizado');

      case 403:
        return toast.error('No tienes permisos para realizar esta acción');

      case 404:
        return toast.error(customMessages?.notFound || 'Recurso no encontrado');

      case 409:
        return toast.error(customMessages?.conflict || 'El elemento ya existe');

      case 422:
        return toast.error('Datos de entrada inválidos');

      case 500:
        return toast.error('Error interno del servidor');

      default:
        return toast.error(customMessages?.default || 'Ha ocurrido un error inesperado');
    }
  }

  // Si no es un error de Axios
  return toast.error(customMessages?.default || 'Ha ocurrido un error inesperado');
};
