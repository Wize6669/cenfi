export interface ErrorResponse {
  message: string;
  field?: string;
}

interface ApiErrorResponse {
  errors?: ErrorResponse[];
  error?: {
    message: string;
  };
}

export interface CustomErrorMessages {
  conflict?: string;    // 409
  unauthorized?: string; // 401
  notFound?: string;    // 404
  badRequest?: string;  // 400
  default?: string;     // otros errores
}
