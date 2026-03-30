import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '../../../users/domain/user-role.enum';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { CurrentTenant } from '../../../../shared/decorators/current-tenant.decorator';
import { ICreatePatientUseCase, CREATE_PATIENT_USE_CASE } from '../../application/use-cases/create-patient.use-case.interface';
import { IListPatientsUseCase, LIST_PATIENTS_USE_CASE } from '../../application/use-cases/list-patients.use-case.interface';
import { IGetPatientUseCase, GET_PATIENT_USE_CASE } from '../../application/use-cases/get-patient.use-case.interface';
import { IUpdatePatientUseCase, UPDATE_PATIENT_USE_CASE } from '../../application/use-cases/update-patient.use-case.interface';
import { IDeletePatientUseCase, DELETE_PATIENT_USE_CASE } from '../../application/use-cases/delete-patient.use-case.interface';
import { IActivatePatientUseCase, ACTIVATE_PATIENT_USE_CASE } from '../../application/use-cases/activate-patient.use-case.interface';
import { IDeactivatePatientUseCase, DEACTIVATE_PATIENT_USE_CASE } from '../../application/use-cases/deactivate-patient.use-case.interface';
import { CreatePatientInput } from '../../application/dtos/create-patient.input';
import { UpdatePatientInput } from '../../application/dtos/update-patient.input';
import { ListPatientsInput } from '../../application/dtos/list-patients.input';

@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PatientsController {
  constructor(
    @Inject(CREATE_PATIENT_USE_CASE)
    private readonly createPatient: ICreatePatientUseCase,
    @Inject(LIST_PATIENTS_USE_CASE)
    private readonly listPatients: IListPatientsUseCase,
    @Inject(GET_PATIENT_USE_CASE)
    private readonly getPatient: IGetPatientUseCase,
    @Inject(UPDATE_PATIENT_USE_CASE)
    private readonly updatePatient: IUpdatePatientUseCase,
    @Inject(DELETE_PATIENT_USE_CASE)
    private readonly deletePatient: IDeletePatientUseCase,
    @Inject(ACTIVATE_PATIENT_USE_CASE)
    private readonly activatePatient: IActivatePatientUseCase,
    @Inject(DEACTIVATE_PATIENT_USE_CASE)
    private readonly deactivatePatient: IDeactivatePatientUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @Roles(UserRole.ATTENDANT, UserRole.MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  create(@Body() body: CreatePatientInput, @CurrentTenant() tenantId: string) {
    return this.createPatient.execute(body, tenantId);
  }

  @Get()
  @Roles(
    UserRole.VIEWER,
    UserRole.ATTENDANT,
    UserRole.MANAGER,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  )
  list(@CurrentTenant() tenantId: string, @Query() query: ListPatientsInput) {
    return this.listPatients.execute(tenantId, query);
  }

  @Get(':id')
  @Roles(
    UserRole.VIEWER,
    UserRole.ATTENDANT,
    UserRole.MANAGER,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  )
  get(@Param('id') id: string, @CurrentTenant() tenantId: string) {
    return this.getPatient.execute(id, tenantId);
  }

  @Patch(':id/activate')
  @Roles(UserRole.MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  activate(@Param('id') id: string, @CurrentTenant() tenantId: string) {
    return this.activatePatient.execute(id, tenantId);
  }

  @Patch(':id/deactivate')
  @Roles(UserRole.MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  deactivate(@Param('id') id: string, @CurrentTenant() tenantId: string) {
    return this.deactivatePatient.execute(id, tenantId);
  }

  @Patch(':id')
  @Roles(UserRole.ATTENDANT, UserRole.MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  update(
    @Param('id') id: string,
    @Body() body: UpdatePatientInput,
    @CurrentTenant() tenantId: string,
  ) {
    return this.updatePatient.execute(id, tenantId, body);
  }

  @Delete(':id')
  @HttpCode(204)
  @Roles(UserRole.MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  delete(@Param('id') id: string, @CurrentTenant() tenantId: string) {
    return this.deletePatient.execute(id, tenantId);
  }
}
