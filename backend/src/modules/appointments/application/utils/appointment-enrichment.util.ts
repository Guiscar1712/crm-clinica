import { IUserRepository } from '../../../users/domain/user.repository.interface';
import { AppointmentNote } from '../../domain/appointment-note.value-object';

export async function buildNoteAuthorMap(
  userRepository: IUserRepository,
  notes: AppointmentNote[],
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  const ids = [...new Set(notes.map((n) => n.authorId))];
  for (const id of ids) {
    const u = await userRepository.findById(id);
    if (u) map.set(id, u.name);
  }
  return map;
}
