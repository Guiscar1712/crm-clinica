import type { Patient, Appointment, User, Tenant, AuthUser, AppointmentNote } from '@/types';

export const MOCK_TENANT: Tenant = {
  id: 'tenant-1',
  name: 'Clínica Saúde Plena',
  slug: 'saude-plena',
  document: '12.345.678/0001-90',
  email: 'contato@saudeplena.com.br',
  phone: '(11) 3456-7890',
  logoUrl: null,
  isActive: true,
  createdAt: '2024-01-15T10:00:00Z',
};

export const MOCK_AUTH_USER: AuthUser = {
  id: 'user-1',
  name: 'Dr. Carlos Silva',
  email: 'carlos@saudeplena.com.br',
  role: 'ADMIN',
  tenantId: 'tenant-1',
};

export const MOCK_USERS: User[] = [
  { id: 'user-1', tenantId: 'tenant-1', name: 'Dr. Carlos Silva', email: 'carlos@saudeplena.com.br', role: 'ADMIN', isActive: true, createdAt: '2024-01-15T10:00:00Z' },
  { id: 'user-2', tenantId: 'tenant-1', name: 'Dra. Ana Oliveira', email: 'ana@saudeplena.com.br', role: 'MANAGER', isActive: true, createdAt: '2024-02-10T08:00:00Z' },
  { id: 'user-3', tenantId: 'tenant-1', name: 'João Santos', email: 'joao@saudeplena.com.br', role: 'ATTENDANT', isActive: true, createdAt: '2024-03-05T09:00:00Z' },
  { id: 'user-4', tenantId: 'tenant-1', name: 'Maria Souza', email: 'maria@saudeplena.com.br', role: 'VIEWER', isActive: false, createdAt: '2024-04-20T14:00:00Z' },
];

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'pat-1', tenantId: 'tenant-1', name: 'Roberto Almeida', cpf: '12345678901', dateOfBirth: '1985-06-15', age: 39,
    gender: 'MALE', phone: '(11) 99999-1111', secondaryPhone: null, email: 'roberto@email.com',
    address: { street: 'Rua das Flores', number: '123', complement: 'Apto 45', neighborhood: 'Jardim Paulista', city: 'São Paulo', state: 'SP', zipCode: '01234567' },
    healthInsurance: 'Unimed', healthInsuranceNumber: '123456789', notes: 'Alergia a dipirona', isActive: true, createdAt: '2024-06-01T10:00:00Z', updatedAt: '2024-06-01T10:00:00Z',
  },
  {
    id: 'pat-2', tenantId: 'tenant-1', name: 'Fernanda Costa', cpf: '98765432100', dateOfBirth: '1992-03-22', age: 32,
    gender: 'FEMALE', phone: '(11) 99999-2222', secondaryPhone: '(11) 3333-4444', email: 'fernanda@email.com',
    address: { street: 'Av. Paulista', number: '1000', complement: null, neighborhood: 'Bela Vista', city: 'São Paulo', state: 'SP', zipCode: '01310100' },
    healthInsurance: 'Amil', healthInsuranceNumber: '987654321', notes: null, isActive: true, createdAt: '2024-06-05T14:00:00Z', updatedAt: '2024-06-05T14:00:00Z',
  },
  {
    id: 'pat-3', tenantId: 'tenant-1', name: 'Lucas Mendes', cpf: '11122233344', dateOfBirth: '1978-11-30', age: 46,
    gender: 'MALE', phone: '(21) 98888-3333', secondaryPhone: null, email: null,
    address: null, healthInsurance: null, healthInsuranceNumber: null, notes: 'Paciente hipertenso', isActive: true, createdAt: '2024-07-10T09:00:00Z', updatedAt: '2024-07-10T09:00:00Z',
  },
  {
    id: 'pat-4', tenantId: 'tenant-1', name: 'Juliana Pereira', cpf: null, dateOfBirth: '2000-01-10', age: 25,
    gender: 'FEMALE', phone: '(11) 97777-4444', secondaryPhone: null, email: 'juliana@email.com',
    address: null, healthInsurance: 'SulAmérica', healthInsuranceNumber: '555666777', notes: null, isActive: false, createdAt: '2024-08-01T11:00:00Z', updatedAt: '2024-08-01T11:00:00Z',
  },
  {
    id: 'pat-5', tenantId: 'tenant-1', name: 'Pedro Barbosa', cpf: '55566677788', dateOfBirth: '1965-07-04', age: 59,
    gender: 'MALE', phone: '(31) 96666-5555', secondaryPhone: null, email: 'pedro.b@email.com',
    address: { street: 'Rua Minas Gerais', number: '500', complement: 'Casa', neighborhood: 'Savassi', city: 'Belo Horizonte', state: 'MG', zipCode: '30130170' },
    healthInsurance: 'Unimed', healthInsuranceNumber: '111222333', notes: 'Diabético tipo 2', isActive: true, createdAt: '2024-08-15T16:00:00Z', updatedAt: '2024-08-15T16:00:00Z',
  },
];

const now = new Date();
const h = (hoursAgo: number) => new Date(now.getTime() - hoursAgo * 3600000).toISOString();

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1', tenantId: 'tenant-1', patientId: 'pat-1', patientName: 'Roberto Almeida',
    assignedUserId: 'user-1', assignedUserName: 'Dr. Carlos Silva',
    type: 'CONSULTATION', priority: 'NORMAL', description: 'Consulta de rotina — check-up anual',
    status: 'AGUARDANDO', scheduledAt: h(-1), startedAt: null, finishedAt: null,
    cancelledAt: null, cancellationReason: null, durationMinutes: null,
    notes: [], createdAt: h(2), updatedAt: h(2),
  },
  {
    id: 'apt-2', tenantId: 'tenant-1', patientId: 'pat-2', patientName: 'Fernanda Costa',
    assignedUserId: 'user-2', assignedUserName: 'Dra. Ana Oliveira',
    type: 'RETURN', priority: 'HIGH', description: 'Retorno para avaliação de exames laboratoriais',
    status: 'EM_ATENDIMENTO', scheduledAt: h(0), startedAt: h(0.5), finishedAt: null,
    cancelledAt: null, cancellationReason: null, durationMinutes: null,
    notes: [
      { id: 'note-1', authorId: 'user-2', authorName: 'Dra. Ana Oliveira', content: 'Paciente relatou melhora nos sintomas após medicação.', createdAt: h(0.3) },
    ],
    createdAt: h(3), updatedAt: h(0.5),
  },
  {
    id: 'apt-3', tenantId: 'tenant-1', patientId: 'pat-3', patientName: 'Lucas Mendes',
    assignedUserId: 'user-1', assignedUserName: 'Dr. Carlos Silva',
    type: 'EXAM', priority: 'URGENT', description: 'Eletrocardiograma de urgência',
    status: 'FINALIZADO', scheduledAt: h(5), startedAt: h(4.5), finishedAt: h(4),
    cancelledAt: null, cancellationReason: null, durationMinutes: 30,
    notes: [
      { id: 'note-2', authorId: 'user-1', authorName: 'Dr. Carlos Silva', content: 'ECG sem alterações significativas. Manter acompanhamento.', createdAt: h(4) },
      { id: 'note-3', authorId: 'user-3', authorName: 'João Santos', content: 'Paciente liberado após resultado.', createdAt: h(3.8) },
    ],
    createdAt: h(6), updatedAt: h(4),
  },
  {
    id: 'apt-4', tenantId: 'tenant-1', patientId: 'pat-5', patientName: 'Pedro Barbosa',
    assignedUserId: null, assignedUserName: null,
    type: 'PROCEDURE', priority: 'NORMAL', description: 'Curativo em ferida no pé direito',
    status: 'AGUARDANDO', scheduledAt: h(-2), startedAt: null, finishedAt: null,
    cancelledAt: null, cancellationReason: null, durationMinutes: null,
    notes: [], createdAt: h(1), updatedAt: h(1),
  },
  {
    id: 'apt-5', tenantId: 'tenant-1', patientId: 'pat-4', patientName: 'Juliana Pereira',
    assignedUserId: 'user-2', assignedUserName: 'Dra. Ana Oliveira',
    type: 'TELEMEDICINE', priority: 'LOW', description: 'Orientação nutricional por teleconsulta',
    status: 'CANCELADO', scheduledAt: h(8), startedAt: null, finishedAt: null,
    cancelledAt: h(6), cancellationReason: 'Paciente solicitou reagendamento', durationMinutes: null,
    notes: [], createdAt: h(10), updatedAt: h(6),
  },
  {
    id: 'apt-6', tenantId: 'tenant-1', patientId: 'pat-1', patientName: 'Roberto Almeida',
    assignedUserId: 'user-1', assignedUserName: 'Dr. Carlos Silva',
    type: 'EMERGENCY', priority: 'URGENT', description: 'Dor torácica aguda — avaliação emergencial',
    status: 'FINALIZADO', scheduledAt: null, startedAt: h(24), finishedAt: h(23),
    cancelledAt: null, cancellationReason: null, durationMinutes: 60,
    notes: [
      { id: 'note-4', authorId: 'user-1', authorName: 'Dr. Carlos Silva', content: 'Descartada síndrome coronariana aguda. Provável dor musculoesquelética.', createdAt: h(23) },
    ],
    createdAt: h(24), updatedAt: h(23),
  },
  {
    id: 'apt-7', tenantId: 'tenant-1', patientId: 'pat-2', patientName: 'Fernanda Costa',
    assignedUserId: 'user-3', assignedUserName: 'João Santos',
    type: 'CONSULTATION', priority: 'NORMAL', description: 'Avaliação dermatológica — manchas na pele',
    status: 'AGUARDANDO', scheduledAt: h(-3), startedAt: null, finishedAt: null,
    cancelledAt: null, cancellationReason: null, durationMinutes: null,
    notes: [], createdAt: h(0.5), updatedAt: h(0.5),
  },
];
