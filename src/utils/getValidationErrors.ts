import { ValidationError } from 'yup';

interface Errors {
  // recebe qualquer nome do tipo string (chamamos de key, mas pode ser qulaquer coisa)
  [key: string]: string;
}

export default function getValidationErrors(err: ValidationError): Errors {
  const validationErrors: Errors = {};

  err.inner.forEach((error) => {
    validationErrors[error.path] = error.message;
  });

  return validationErrors;
}
