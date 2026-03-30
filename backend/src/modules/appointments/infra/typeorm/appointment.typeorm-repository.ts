import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  IAppointmentRepository,
  ListAppointmentsFilter,
} from '../../domain/appointment.repository.interface';
import { Appointment } from '../../domain/appointment.entity';
import { AppointmentTypeOrmEntity } from './appointment.typeorm-entity';
import { AppointmentNoteTypeOrmEntity } from './appointment-note.typeorm-entity';
import { AppointmentStatus } from '../../domain/appointment-status.enum';
import { AppointmentType } from '../../domain/appointment-type.enum';
import { AppointmentPriority } from '../../domain/appointment-priority.enum';
import { AppointmentNote } from '../../domain/appointment-note.value-object';
import { PaginationInput, PaginatedOutput } from '../../../../shared/types/pagination';

@Injectable()
export class AppointmentTypeOrmRepository implements IAppointmentRepository {
  constructor(
    @InjectRepository(AppointmentTypeOrmEntity)
    private readonly repo: Repository<AppointmentTypeOrmEntity>,
    @InjectRepository(AppointmentNoteTypeOrmEntity)
    private readonly noteRepo: Repository<AppointmentNoteTypeOrmEntity>,
  ) {}

  private notesToDomain(rows: AppointmentNoteTypeOrmEntity[]): AppointmentNote[] {
    const sorted = [...rows].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    return sorted.map(
      (r) => new AppointmentNote(r.id, r.authorId, r.content, r.createdAt),
    );
  }

  private toDomain(entity: AppointmentTypeOrmEntity, notesRows: AppointmentNoteTypeOrmEntity[]): Appointment {
    return new Appointment(
      entity.id,
      entity.tenantId,
      entity.patientId,
      entity.assignedUserId,
      entity.type as AppointmentType,
      entity.priority as AppointmentPriority,
      entity.description,
      entity.status as AppointmentStatus,
      entity.scheduledAt,
      entity.startedAt,
      entity.finishedAt,
      entity.cancelledAt,
      entity.cancellationReason,
      this.notesToDomain(notesRows),
      entity.createdAt,
      entity.updatedAt,
    );
  }

  private mainToOrm(appointment: Appointment): AppointmentTypeOrmEntity {
    const e = new AppointmentTypeOrmEntity();
    e.id = appointment.id;
    e.tenantId = appointment.tenantId;
    e.patientId = appointment.patientId;
    e.assignedUserId = appointment.assignedUserId;
    e.type = appointment.type;
    e.priority = appointment.priority;
    e.description = appointment.description;
    e.status = appointment.status;
    e.scheduledAt = appointment.scheduledAt;
    e.startedAt = appointment.startedAt;
    e.finishedAt = appointment.finishedAt;
    e.cancelledAt = appointment.cancelledAt;
    e.cancellationReason = appointment.cancellationReason;
    e.createdAt = appointment.createdAt;
    e.updatedAt = appointment.updatedAt;
    return e;
  }

  async save(appointment: Appointment): Promise<Appointment> {
    await this.repo.manager.transaction(async (em) => {
      await em.save(AppointmentTypeOrmEntity, this.mainToOrm(appointment));
      await em.delete(AppointmentNoteTypeOrmEntity, { appointmentId: appointment.id });
      for (const n of appointment.notes) {
        const ne = new AppointmentNoteTypeOrmEntity();
        ne.id = n.id;
        ne.appointmentId = appointment.id;
        ne.authorId = n.authorId;
        ne.content = n.content;
        ne.createdAt = n.createdAt;
        await em.save(AppointmentNoteTypeOrmEntity, ne);
      }
    });
    const loaded = await this.findById(appointment.id, appointment.tenantId);
    return loaded!;
  }

  async findById(id: string, tenantId: string): Promise<Appointment | null> {
    const orm = await this.repo.findOne({ where: { id, tenantId } });
    if (!orm) return null;
    const notes = await this.noteRepo.find({
      where: { appointmentId: id },
      order: { createdAt: 'ASC' },
    });
    return this.toDomain(orm, notes);
  }

  async findAll(
    filter: ListAppointmentsFilter,
    pagination: PaginationInput,
  ): Promise<PaginatedOutput<Appointment>> {
    const qb = this.repo.createQueryBuilder('a');
    qb.where('a.tenantId = :tenantId', { tenantId: filter.tenantId });
    if (filter.status !== undefined) {
      qb.andWhere('a.status = :status', { status: filter.status });
    }
    if (filter.patientId !== undefined) {
      qb.andWhere('a.patientId = :patientId', { patientId: filter.patientId });
    }
    if (filter.assignedUserId !== undefined) {
      qb.andWhere('a.assignedUserId = :assignedUserId', {
        assignedUserId: filter.assignedUserId,
      });
    }
    if (filter.type !== undefined) {
      qb.andWhere('a.type = :type', { type: filter.type });
    }
    if (filter.priority !== undefined) {
      qb.andWhere('a.priority = :priority', { priority: filter.priority });
    }
    if (filter.scheduledFrom !== undefined) {
      qb.andWhere('a.scheduledAt >= :scheduledFrom', {
        scheduledFrom: filter.scheduledFrom,
      });
    }
    if (filter.scheduledTo !== undefined) {
      qb.andWhere('a.scheduledAt <= :scheduledTo', { scheduledTo: filter.scheduledTo });
    }
    qb.orderBy('a.createdAt', 'DESC');
    qb.skip((pagination.page - 1) * pagination.limit);
    qb.take(pagination.limit);
    const [orms, total] = await qb.getManyAndCount();
    const limit = pagination.limit;
    const totalPages = limit > 0 ? Math.ceil(total / limit) : 0;
    const data: Appointment[] = [];
    for (const orm of orms) {
      const notes = await this.noteRepo.find({
        where: { appointmentId: orm.id },
        order: { createdAt: 'ASC' },
      });
      data.push(this.toDomain(orm, notes));
    }
    return {
      data,
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
