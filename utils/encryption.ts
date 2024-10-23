import crypto from 'crypto';

// Verificación de variables de entorno
if (!process.env.NEXT_PUBLIC_ENCRYPTION_KEY || !process.env.NEXT_PUBLIC_ENCRYPTION_IV) {
  throw new Error('Las variables de entorno NEXT_PUBLIC_ENCRYPTION_KEY y NEXT_PUBLIC_ENCRYPTION_IV son requeridas');
}

// Constantes
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
const ENCRYPTION_IV = process.env.NEXT_PUBLIC_ENCRYPTION_IV;

// Interfaz para el resultado de la desencriptación (opcional pero recomendada)
export interface DecryptionResult<T = any> {
  success: boolean;
  data: T | null;
  error?: string;
}

// Función de encriptación
export const encryptData = (data: any): string => {
  const cipher = crypto.createCipheriv('aes-256-gcm', ENCRYPTION_KEY, ENCRYPTION_IV);
  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag().toString('hex');
  return encrypted + tag;
};

// Función de desencriptación
export const decryptData = <T = any>(encryptedData: string): DecryptionResult<T> => {
  try {
    const tag = encryptedData.slice(-32);
    const encrypted = encryptedData.slice(0, -32);
    const decipher = crypto.createDecipheriv('aes-256-gcm', ENCRYPTION_KEY, ENCRYPTION_IV);
    decipher.setAuthTag(Buffer.from(tag, 'hex'));
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return {
      success: true,
      data: JSON.parse(decrypted) as T
    };
  } catch (error) {
    console.error('Error al desencriptar los datos:', error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};
