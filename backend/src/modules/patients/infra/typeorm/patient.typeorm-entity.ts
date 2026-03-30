import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
@Entity('patients')
@Index(['tenantId', 'cpf'])
@Index(['tenantId', 'isActive'])
export class PatientTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  tenantId: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 11, nullable: true })
  cpf: string | null;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date | null;

  @Column({ type: 'varchar', length: 24, nullable: true })
  gender: string | null;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  secondaryPhone: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  addressStreet: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  addressNumber: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  addressComplement: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  addressNeighborhood: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  addressCity: string | null;

  @Column({ type: 'varchar', length: 2, nullable: true })
  addressState: string | null;

  @Column({ type: 'varchar', length: 8, nullable: true })
  addressZipCode: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  healthInsurance: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  healthInsuranceNumber: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
