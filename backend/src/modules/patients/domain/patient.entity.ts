import { Address } from './address.value-object';
import { PatientGender } from './patient-gender.enum';

export interface CreatePatientProps {
  name: string;
  cpf: string | null;
  dateOfBirth: Date | null;
  gender: PatientGender | null;
  phone: string;
  secondaryPhone: string | null;
  email: string | null;
  address: Address | null;
  healthInsurance: string | null;
  healthInsuranceNumber: string | null;
  notes: string | null;
}

export interface UpdatePatientProps {
  name?: string;
  cpf?: string | null;
  dateOfBirth?: Date | null;
  gender?: PatientGender | null;
  phone?: string;
  secondaryPhone?: string | null;
  email?: string | null;
  address?: Address | null;
  healthInsurance?: string | null;
  healthInsuranceNumber?: string | null;
  notes?: string | null;
}

export class Patient {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public name: string,
    public cpf: string | null,
    public dateOfBirth: Date | null,
    public gender: PatientGender | null,
    public phone: string,
    public secondaryPhone: string | null,
    public email: string | null,
    public address: Address | null,
    public healthInsurance: string | null,
    public healthInsuranceNumber: string | null,
    public notes: string | null,
    public isActive: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  static create(tenantId: string, props: CreatePatientProps): Patient {
    const now = new Date();
    return new Patient(
      crypto.randomUUID(),
      tenantId,
      props.name,
      props.cpf,
      props.dateOfBirth,
      props.gender,
      props.phone,
      props.secondaryPhone,
      props.email,
      props.address,
      props.healthInsurance,
      props.healthInsuranceNumber,
      props.notes,
      true,
      now,
      now,
    );
  }

  update(props: UpdatePatientProps): void {
    if (props.name !== undefined) this.name = props.name;
    if (props.cpf !== undefined) this.cpf = props.cpf;
    if (props.dateOfBirth !== undefined) this.dateOfBirth = props.dateOfBirth;
    if (props.gender !== undefined) this.gender = props.gender;
    if (props.phone !== undefined) this.phone = props.phone;
    if (props.secondaryPhone !== undefined) this.secondaryPhone = props.secondaryPhone;
    if (props.email !== undefined) this.email = props.email;
    if (props.address !== undefined) this.address = props.address;
    if (props.healthInsurance !== undefined) this.healthInsurance = props.healthInsurance;
    if (props.healthInsuranceNumber !== undefined)
      this.healthInsuranceNumber = props.healthInsuranceNumber;
    if (props.notes !== undefined) this.notes = props.notes;
    this.updatedAt = new Date();
  }

  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  get age(): number | null {
    if (!this.dateOfBirth) return null;
    const today = new Date();
    let age = today.getFullYear() - this.dateOfBirth.getFullYear();
    const m = today.getMonth() - this.dateOfBirth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < this.dateOfBirth.getDate())) {
      age--;
    }
    return age;
  }
}
