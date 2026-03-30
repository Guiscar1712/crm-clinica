import type { PatientGender } from '../types';

export const GENDER_LABELS: Record<PatientGender, string> = {
  MALE: 'Masculino',
  FEMALE: 'Feminino',
  OTHER: 'Outro',
  PREFER_NOT_TO_SAY: 'Prefiro não informar',
};
