import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { AppointmentNoteTypeOrmEntity } from './appointment-note.typeorm-entity';
import { AppointmentPriority } from '../../domain/appointment-priority.enum';

@Entity('appointments')
@Index(['tenantId', 'status'])
@Index(['tenantId', 'patientId'])
@Index(['tenantId', 'scheduledAt'])
export class AppointmentTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  tenantId: string;

  @Column('uuid')
  patientId: string;

  @Column('uuid', { nullable: true })
  assignedUserId: string | null;

  @Column({ type: 'varchar', length: 30 })
  type: string;

  @Column({ type: 'varchar', length: 20, default: AppointmentPriority.NORMAL })
  priority: string;

  @Column('text')
  description: string;

  @Column({ type: 'varchar', length: 20 })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  scheduledAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  finishedAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date | null;

  @Column({ type: 'text', nullable: true })
  cancellationReason: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => AppointmentNoteTypeOrmEntity, (n) => n.appointment, { cascade: false })
  notes: AppointmentNoteTypeOrmEntity[];
}
