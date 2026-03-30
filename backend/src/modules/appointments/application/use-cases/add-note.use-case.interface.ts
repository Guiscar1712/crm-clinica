import { AddNoteInput } from '../dtos/add-note.input';
import { AppointmentOutput } from '../dtos/appointment.output';

export interface IAddNoteUseCase {
  execute(
    appointmentId: string,
    tenantId: string,
    authorId: string,
    input: AddNoteInput,
  ): Promise<AppointmentOutput>;
}

export const ADD_NOTE_USE_CASE = Symbol('IAddNoteUseCase');
