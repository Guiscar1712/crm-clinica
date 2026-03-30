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
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { TokenPayload } from '../../../auth/domain/token-payload.interface';
import {
  ICreateAppointmentUseCase,
  CREATE_APPOINTMENT_USE_CASE,
} from '../../application/use-cases/create-appointment.use-case.interface';
import {
  IListAppointmentsUseCase,
  LIST_APPOINTMENTS_USE_CASE,
} from '../../application/use-cases/list-appointments.use-case.interface';
import {
  IGetAppointmentUseCase,
  GET_APPOINTMENT_USE_CASE,
} from '../../application/use-cases/get-appointment.use-case.interface';
import {
  IUpdateAppointmentUseCase,
  UPDATE_APPOINTMENT_USE_CASE,
} from '../../application/use-cases/update-appointment.use-case.interface';
import {
  IAdvanceStatusUseCase,
  ADVANCE_STATUS_USE_CASE,
} from '../../application/use-cases/advance-status.use-case.interface';
import {
  IDeleteAppointmentUseCase,
  DELETE_APPOINTMENT_USE_CASE,
} from '../../application/use-cases/delete-appointment.use-case.interface';
import {
  ICancelAppointmentUseCase,
  CANCEL_APPOINTMENT_USE_CASE,
} from '../../application/use-cases/cancel-appointment.use-case.interface';
import {
  IAddNoteUseCase,
  ADD_NOTE_USE_CASE,
} from '../../application/use-cases/add-note.use-case.interface';
import { CreateAppointmentInput } from '../../application/dtos/create-appointment.input';
import { UpdateAppointmentInput } from '../../application/dtos/update-appointment.input';
import { AdvanceStatusInput } from '../../application/dtos/advance-status.input';
import { ListAppointmentsInput } from '../../application/dtos/list-appointments.input';
import { CancelAppointmentInput } from '../../application/dtos/cancel-appointment.input';
import { AddNoteInput } from '../../application/dtos/add-note.input';

@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(
    @Inject(CREATE_APPOINTMENT_USE_CASE)
    private readonly createAppointment: ICreateAppointmentUseCase,
    @Inject(LIST_APPOINTMENTS_USE_CASE)
    private readonly listAppointments: IListAppointmentsUseCase,
    @Inject(GET_APPOINTMENT_USE_CASE)
    private readonly getAppointment: IGetAppointmentUseCase,
    @Inject(UPDATE_APPOINTMENT_USE_CASE)
    private readonly updateAppointment: IUpdateAppointmentUseCase,
    @Inject(ADVANCE_STATUS_USE_CASE)
    private readonly advanceStatusUseCase: IAdvanceStatusUseCase,
    @Inject(CANCEL_APPOINTMENT_USE_CASE)
    private readonly cancelAppointmentUseCase: ICancelAppointmentUseCase,
    @Inject(ADD_NOTE_USE_CASE)
    private readonly addNoteUseCase: IAddNoteUseCase,
    @Inject(DELETE_APPOINTMENT_USE_CASE)
    private readonly deleteAppointment: IDeleteAppointmentUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @Roles(UserRole.ATTENDANT, UserRole.MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  create(@Body() body: CreateAppointmentInput, @CurrentTenant() tenantId: string) {
    return this.createAppointment.execute(body, tenantId);
  }

  @Get()
  @Roles(
    UserRole.VIEWER,
    UserRole.ATTENDANT,
    UserRole.MANAGER,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  )
  list(@CurrentTenant() tenantId: string, @Query() query: ListAppointmentsInput) {
    return this.listAppointments.execute(tenantId, query);
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
    return this.getAppointment.execute(id, tenantId);
  }

  @Patch(':id/status')
  @Roles(UserRole.ATTENDANT, UserRole.MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  advanceStatus(@Param('id') id: string, @Body() body: AdvanceStatusInput, @CurrentTenant() tenantId: string) {
    return this.advanceStatusUseCase.execute(id, tenantId, body);
  }

  @Patch(':id/cancel')
  @Roles(UserRole.ATTENDANT, UserRole.MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  cancel(
    @Param('id') id: string,
    @Body() body: CancelAppointmentInput,
    @CurrentTenant() tenantId: string,
  ) {
    return this.cancelAppointmentUseCase.execute(id, tenantId, body);
  }

  @Post(':id/notes')
  @HttpCode(201)
  @Roles(UserRole.ATTENDANT, UserRole.MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  addNote(
    @Param('id') id: string,
    @Body() body: AddNoteInput,
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.addNoteUseCase.execute(id, tenantId, user.sub, body);
  }

  @Patch(':id')
  @Roles(UserRole.MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  update(
    @Param('id') id: string,
    @Body() body: UpdateAppointmentInput,
    @CurrentTenant() tenantId: string,
  ) {
    return this.updateAppointment.execute(id, tenantId, body);
  }

  @Delete(':id')
  @HttpCode(204)
  @Roles(UserRole.MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  delete(@Param('id') id: string, @CurrentTenant() tenantId: string) {
    return this.deleteAppointment.execute(id, tenantId);
  }
}
