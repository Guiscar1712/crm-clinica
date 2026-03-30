import { Inject, Injectable } from '@nestjs/common';
import { ICreatePatientUseCase } from './create-patient.use-case.interface';
import { CreatePatientInput } from '../dtos/create-patient.input';
import { PatientOutput } from '../dtos/patient.output';
import {
  IPatientRepository,
  PATIENT_REPOSITORY,
} from '../../domain/patient.repository.interface';
import { Patient } from '../../domain/patient.entity';
import { Address } from '../../domain/address.value-object';
import { ConflictError } from '../../../../shared/errors/conflict.error';

@Injectable()
export class CreatePatientUseCase implements ICreatePatientUseCase {
  constructor(
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: IPatientRepository,
  ) {}

  async execute(input: CreatePatientInput, tenantId: string): Promise<PatientOutput> {
    const cpf = input.cpf ?? null;
    if (cpf) {
      const existing = await this.patientRepository.findByCpf(cpf, tenantId);
      if (existing) {
        throw new ConflictError(`Patient with CPF already exists in this tenant.`);
      }
    }
    const address =
      input.address !== undefined && input.address !== null
        ? Address.create({
            street: input.address.street,
            number: input.address.number,
            complement: input.address.complement ?? null,
            neighborhood: input.address.neighborhood,
            city: input.address.city,
            state: input.address.state,
            zipCode: input.address.zipCode,
          })
        : null;
    const patient = Patient.create(tenantId, {
      name: input.name,
      cpf,
      dateOfBirth: input.dateOfBirth ?? null,
      gender: input.gender ?? null,
      phone: input.phone,
      secondaryPhone: input.secondaryPhone ?? null,
      email: input.email ?? null,
      address,
      healthInsurance: input.healthInsurance ?? null,
      healthInsuranceNumber: input.healthInsuranceNumber ?? null,
      notes: input.notes ?? null,
    });
    const saved = await this.patientRepository.save(patient);
    return PatientOutput.fromDomain(saved);
  }
}
