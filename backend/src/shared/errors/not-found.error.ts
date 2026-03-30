import { AppError } from './app-error';

export class NotFoundError extends AppError {
  constructor(entity: string, id: string) {
    super(`${entity} with id "${id}" not found.`, 404);
    this.name = 'NotFoundError';
  }
}
