import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPatientRepository, ListPatientsFilter } from '../../domain/patient.repository.interface';
import { Patient } from '../../domain/patient.entity';
import { PatientTypeOrmEntity } from './patient.typeorm-entity';
import { Address } from '../../domain/address.value-object';
import { PatientGender } from '../../domain/patient-gender.enum';
import { PaginationInput, PaginatedOutput } from '../../../../shared/types/pagination';

@Injectable()
export class PatientTypeOrmRepository implements IPatientRepository {
  constructor(
    @InjectRepository(PatientTypeOrmEntity)
    private readonly repo: Repository<PatientTypeOrmEntity>,
  ) {}

  private addressFromOrm(e: PatientTypeOrmEntity): Address | null {
    if (
      e.addressStreet &&
      e.addressNumber &&
      e.addressNeighborhood &&
      e.addressCity &&
      e.addressState &&
      e.addressZipCode
    ) {
      return Address.create({
        street: e.addressStreet,
        number: e.addressNumber,
        complement: e.addressComplement,
        neighborhood: e.addressNeighborhood,
        city: e.addressCity,
        state: e.addressState,
        zipCode: e.addressZipCode,
      });
    }
    return null;
  }

  private applyAddressToOrm(entity: PatientTypeOrmEntity, address: Address | null): void {
    if (!address) {
      entity.addressStreet = null;
      entity.addressNumber = null;
      entity.addressComplement = null;
      entity.addressNeighborhood = null;
      entity.addressCity = null;
      entity.addressState = null;
      entity.addressZipCode = null;
      return;
    }
    entity.addressStreet = address.street;
    entity.addressNumber = address.number;
    entity.addressComplement = address.complement;
    entity.addressNeighborhood = address.neighborhood;
    entity.addressCity = address.city;
    entity.addressState = address.state;
    entity.addressZipCode = address.zipCode;
  }

  private toOrm(patient: Patient): PatientTypeOrmEntity {
    const e = new PatientTypeOrmEntity();
    e.id = patient.id;
    e.tenantId = patient.tenantId;
    e.name = patient.name;
    e.cpf = patient.cpf;
    e.dateOfBirth = patient.dateOfBirth;
    e.gender = patient.gender;
    e.phone = patient.phone;
    e.secondaryPhone = patient.secondaryPhone;
    e.email = patient.email;
    this.applyAddressToOrm(e, patient.address);
    e.healthInsurance = patient.healthInsurance;
    e.healthInsuranceNumber = patient.healthInsuranceNumber;
    e.notes = patient.notes;
    e.isActive = patient.isActive;
    e.createdAt = patient.createdAt;
    e.updatedAt = patient.updatedAt;
    return e;
  }

  private coerceDate(value: Date | string | null): Date | null {
    if (value == null) return null;
    return value instanceof Date ? value : new Date(value);
  }

  private toDomain(e: PatientTypeOrmEntity): Patient {
    return new Patient(
      e.id,
      e.tenantId,
      e.name,
      e.cpf,
      this.coerceDate(e.dateOfBirth),
      e.gender as PatientGender | null,
      e.phone,
      e.secondaryPhone,
      e.email,
      this.addressFromOrm(e),
      e.healthInsurance,
      e.healthInsuranceNumber,
      e.notes,
      e.isActive,
      this.coerceDate(e.createdAt) as Date,
      this.coerceDate(e.updatedAt) as Date,
    );
  }

  async save(patient: Patient): Promise<Patient> {
    const saved = await this.repo.save(this.toOrm(patient));
    return this.toDomain(saved);
  }

  async findById(id: string, tenantId: string): Promise<Patient | null> {
    const e = await this.repo.findOneBy({ id, tenantId });
    return e ? this.toDomain(e) : null;
  }

  async findByCpf(cpf: string, tenantId: string): Promise<Patient | null> {
    const e = await this.repo.findOneBy({ cpf, tenantId });
    return e ? this.toDomain(e) : null;
  }

  async findAll(
    filter: ListPatientsFilter,
    pagination: PaginationInput,
  ): Promise<PaginatedOutput<Patient>> {
    const qb = this.repo.createQueryBuilder('p');
    qb.where('p.tenantId = :tenantId', { tenantId: filter.tenantId });
    if (filter.search !== undefined && filter.search.trim() !== '') {
      const term = `%${filter.search.trim()}%`;
      qb.andWhere(
        '(p.name ILIKE :term OR p.cpf ILIKE :term OR p.email ILIKE :term)',
        { term },
      );
    }
    if (filter.isActive !== undefined) {
      qb.andWhere('p.isActive = :isActive', { isActive: filter.isActive });
    }
    qb.orderBy('p.createdAt', 'DESC');
    qb.skip((pagination.page - 1) * pagination.limit);
    qb.take(pagination.limit);
    const [rows, total] = await qb.getManyAndCount();
    const limit = pagination.limit;
    const totalPages = limit > 0 ? Math.ceil(total / limit) : 0;
    return {
      data: rows.map((r) => this.toDomain(r)),
      total,
      page: pagination.page,
      limit,
      totalPages,
    };
  }

  async delete(id: string, tenantId: string): Promise<void> {
    await this.repo.delete({ id, tenantId });
  }
}
