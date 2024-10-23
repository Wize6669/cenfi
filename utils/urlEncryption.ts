import { Buffer } from 'buffer';
import crypto from 'crypto';

// Verificación de variables de entorno
if (!process.env.NEXT_PUBLIC_ENCRYPTION_KEY || !process.env.NEXT_PUBLIC_ENCRYPTION_IV) {
  throw new Error('Las variables de entorno NEXT_PUBLIC_ENCRYPTION_KEY y NEXT_PUBLIC_ENCRYPTION_IV son requeridas');
}
// Constantes
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
const ENCRYPTION_IV = process.env.NEXT_PUBLIC_ENCRYPTION_IV;

export const encryptUrlId = (id: string): string => {
  // Convertir a Base64 y hacer algunas transformaciones adicionales
  const encoded = Buffer.from(id).toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  // Añadir un timestamp codificado para hacer el ID único por sesión
  const timestamp = Date.now().toString(36);
  return `${timestamp}-${encoded}`;
};

export const decryptUrlId = (encodedId: string): string | null => {
  try {
    // Separar el timestamp del ID
    const [_, base64Id] = encodedId.split('-');

    // Revertir las transformaciones
    const paddedId = base64Id
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    // Añadir padding si es necesario
    const padding = '='.repeat((4 - (paddedId.length % 4)) % 4);
    const finalId = paddedId + padding;

    // Decodificar
    return Buffer.from(finalId, 'base64').toString();
  } catch {
    return null;
  }
};

export const encryptLocalStorageId = (id: string): string => {
  const cipher = crypto.createCipheriv('aes-256-gcm', ENCRYPTION_KEY, ENCRYPTION_IV);
  let encrypted = cipher.update(id, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag().toString('hex');
  return encrypted + tag;
};

export const decryptLocalStorageId = (encryptedId: string): string | null => {
  try {
    const tag = encryptedId.slice(-32);
    const encrypted = encryptedId.slice(0, -32);
    const decipher = crypto.createDecipheriv('aes-256-gcm', ENCRYPTION_KEY, ENCRYPTION_IV);
    decipher.setAuthTag(Buffer.from(tag, 'hex'));
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch {
    return null;
  }
};
