import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

const generatePassword = (length: number) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}[]|:;<>,.?~';
  let newPassword = '';
  for (let i = 0; i < length; i++) {
    newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  return newPassword;
};

interface ErrorResponse {
  message: string;
}

function handleAxiosError(error: any) {
  if (error instanceof AxiosError) {
    const statusCode = error?.response?.status;
    const errors = error?.response?.data.errors;
    const errorApi = error?.response?.data.error;

    if (statusCode === 400) {
      if (Array.isArray(errors)) {
        const errorsMessages = errors
          .map((errorMessage: ErrorResponse) => errorMessage?.message)
          .join('\n');

        return toast.error(errorsMessages);
      }

      return toast.error(errorApi?.message);
    }

    if (statusCode === 404) {

      return toast.error('Recurso no encontrado.');
    }

    if (statusCode === 409) {

      return toast.error('Conflicto en la solicitud. Puede que el recurso ya exista o haya algún conflicto de datos.');
    }
  }

  toast.error('Ocurrió un error inesperado, inténtelo nuevamente más tarde');
}

const safeStringify = (obj: any) => {
  const seen = new WeakSet();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return; // O devuelve `undefined` para eliminar la propiedad
      }
      seen.add(value);
    }
    return value;
  });
};

export { generatePassword, handleAxiosError, safeStringify };
