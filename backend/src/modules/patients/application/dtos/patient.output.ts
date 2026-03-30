import { Patient } from '../../domain/patient.entity';
import { PatientGender } from '../../domain/patient-gender.enum';

export class PatientAddressOutput {
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export class PatientOutput {
  id: string;
  tenantId: string;
  name: string;
  cpf: string | null;
  dateOfBirth: Date | null;
  gender: PatientGender | null;
  phone: string;
  secondaryPhone: string | null;
  email: string | null;
  address: PatientAddressOutput | null;
  healthInsurance: string | null;
  healthInsuranceNumber: string | null;
  notes: string | null;
  isActive: boolean;
  age: number | null;
  createdAt: Date;
  updatedAt: Date;

  static fromDomain(patient: Patient): PatientOutput {
    const o = new PatientOutput();
    o.id = patient.id;
    o.tenantId = patient.tenantId;
    o.name = patient.name;
    o.cpf = patient.cpf;
    o.dateOfBirth = patient.dateOfBirth;
    o.gender = patient.gender;
    o.phone = patient.phone;
    o.secondaryPhone = patient.secondaryPhone;
    o.email = patient.email;
    o.address = patient.address
      ? {
          street: patient.address.street,
          number: patient.address.number,
          complement: patient.address.complement,
          neighborhood: patient.address.neighborhood,
          city: patient.address.city,
          state: patient.address.state,
          zipCode: patient.address.zipCode,
        }
      : null;
    o.healthInsurance = patient.healthInsurance;
    o.healthInsuranceNumber = patient.healthInsuranceNumber;
    o.notes = patient.notes;
    o.isActive = patient.isActive;
    o.age = patient.age;
    o.createdAt = patient.createdAt;
    o.updatedAt = patient.updatedAt;
    return o;
  }
}
