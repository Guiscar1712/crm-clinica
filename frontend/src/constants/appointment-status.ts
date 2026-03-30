import type { AppointmentStatus } from '../types';

export const STATUS_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus | null> = {
  AGUARDANDO: 'EM_ATENDIMENTO',
  EM_ATENDIMENTO: 'FINALIZADO',
  FINALIZADO: null,
  CANCELADO: null,
};

export const STATUS_LABELS: Record<AppointmentStatus, string> = {
  AGUARDANDO: 'Aguardando',
  EM_ATENDIMENTO: 'Em Atendimento',
  FINALIZADO: 'Finalizado',
  CANCELADO: 'Cancelado',
};

export const ADVANCE_BUTTON_LABELS: Partial<Record<AppointmentStatus, string>> = {
  AGUARDANDO: 'Iniciar Atendimento',
  EM_ATENDIMENTO: 'Finalizar Atendimento',
};
