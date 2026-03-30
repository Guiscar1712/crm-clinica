import type { AppointmentType } from '../types';

export const TYPE_LABELS: Record<AppointmentType, string> = {
  CONSULTATION: 'Consulta',
  RETURN: 'Retorno',
  EXAM: 'Exame',
  PROCEDURE: 'Procedimento',
  EMERGENCY: 'Emergência',
  TELEMEDICINE: 'Teleconsulta',
};
