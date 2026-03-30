import { Inject, Injectable } from '@nestjs/common';
import { IUpdatePatientUseCase } from './update-patient.use-case.interface';
import { UpdatePatientInput } from '../dtos/update-patient.input';
import { PatientOutput } from '../dtos/patient.output';
import {
  IPatientRepository,
  PATIENT_REPOSITORY,
} from '../../domain/patient.repository.interface';
import { NotFoundError } from '../../../../shared/errors/not-found.error';
import { ConflictError } from '../../../../shared/errors/conflict.error';
import { Address } from '../../domain/address.value-object';

@Injectable()
export class UpdatePatientUseCase implements IUpdatePatientUseCase {
  constructor(
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: IPatientRepository,
  ) {}

  async execute(
    id: string,
    tenantId: string,
    input: UpdatePatientInput,
  ): Promise<PatientOutput> {
    const patient = await this.patientRepository.findById(id, tenantId);
    if (!patient) {
      throw new NotFoundError('Patient', id);
    }
    const cpf = input.cpf !== undefined ? input.cpf : undefined;
    if (cpf) {
      const existing = await this.patientRepository.findByCpf(cpf, tenantId);
      if (existing && existing.id !== patient.id) {
        throw new ConflictError(`Patient with CPF already exists in this tenant.`);
      }
    }
    const address =
      input.address !== undefined
        ? input.address === null
          ? null
          : Address.create({
              street: input.address.street,
              number: input.address.number,
              complement: input.address.complement ?? null,
              neighborhood: input.address.neighborhood,
              city: input.address.city,
              state: input.address.state,
              zipCode: input.address.zipCode,
            })
        : undefined;
    patient.update({
      name: input.name,
      cpf,
      dateOfBirth: input.dateOfBirth,
      gender: input.gender,
      phone: input.phone,
      secondaryPhone: input.secondaryPhone,
      email: input.email,
      address,
      healthInsurance: input.healthInsurance,
      healthInsuranceNumber: input.healthInsuranceNumber,
      notes: input.notes,
    });
    const saved = await this.patientRepository.save(patient);
    return PatientOutput.fromDomain(saved);
  }
}
