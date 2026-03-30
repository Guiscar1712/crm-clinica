import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AppointmentTypeOrmEntity } from './appointment.typeorm-entity';

@Entity('appointment_notes')
export class AppointmentNoteTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  appointmentId: string;

  @ManyToOne(() => AppointmentTypeOrmEntity, (a) => a.notes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'appointmentId' })
  appointment: AppointmentTypeOrmEntity;

  @Column('uuid')
  authorId: string;

  @Column('text')
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
