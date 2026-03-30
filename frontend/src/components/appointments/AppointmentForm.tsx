import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createAppointment } from '@/api/appointments';
import { fetchPatients } from '@/api/patients';
import { listUsers } from '@/api/users';
import { appointmentKeys, patientKeys, userKeys } from '@/constants/query-keys';
import { TYPE_LABELS } from '@/constants/appointment-type';
import { PRIORITY_LABELS } from '@/constants/appointment-priority';
import type { AppointmentType, AppointmentPriority } from '@/types';

const schema = z.object({
  patientId: z.string().min(1, 'Selecione um paciente'),
  description: z.string().min(1, 'Descrição é obrigatória').max(500, 'Máximo 500 caracteres'),
  type: z.string().min(1, 'Selecione um tipo'),
  priority: z.string().min(1, 'Selecione a prioridade'),
  scheduledAt: z.string().optional().or(z.literal('')),
  assignedUserId: z.string().optional().or(z.literal('')),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  defaultPatientId?: string;
  onSuccess: () => void;
}

export function AppointmentForm({ defaultPatientId, onSuccess }: Props) {
  const queryClient = useQueryClient();

  const { data: patients, isLoading: patientsLoading } = useQuery({
    queryKey: patientKeys.all,
    queryFn: fetchPatients,
  });

  const { data: users } = useQuery({
    queryKey: userKeys.list(),
    queryFn: listUsers,
  });

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      patientId: defaultPatientId ?? '',
      description: '',
      type: 'CONSULTATION',
      priority: 'NORMAL',
      scheduledAt: '',
      assignedUserId: '',
    },
  });

  const descLength = watch('description')?.length ?? 0;

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      createAppointment({
        patientId: data.patientId,
        description: data.description,
        type: data.type,
        priority: data.priority,
        scheduledAt: data.scheduledAt || null,
        assignedUserId: data.assignedUserId || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
      toast.success('Atendimento criado com sucesso');
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
      <div className="space-y-2">
        <Label>Paciente *</Label>
        <Select
          value={watch('patientId')}
          onValueChange={(val) => setValue('patientId', val, { shouldValidate: true })}
          disabled={patientsLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um paciente" />
          </SelectTrigger>
          <SelectContent>
            {patients?.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.patientId && <p className="text-sm text-destructive">{errors.patientId.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Tipo *</Label>
          <Select value={watch('type')} onValueChange={(v) => setValue('type', v, { shouldValidate: true })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(TYPE_LABELS) as AppointmentType[]).map((t) => (
                <SelectItem key={t} value={t}>{TYPE_LABELS[t]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Prioridade *</Label>
          <Select value={watch('priority')} onValueChange={(v) => setValue('priority', v, { shouldValidate: true })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(PRIORITY_LABELS) as AppointmentPriority[]).map((p) => (
                <SelectItem key={p} value={p}>{PRIORITY_LABELS[p]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.priority && <p className="text-sm text-destructive">{errors.priority.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="scheduledAt">Data/Hora Agendada</Label>
        <Input id="scheduledAt" type="datetime-local" {...register('scheduledAt')} />
      </div>

      <div className="space-y-2">
        <Label>Responsável</Label>
        <Select value={watch('assignedUserId')} onValueChange={(v) => setValue('assignedUserId', v === 'none' ? '' : v)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione (opcional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Nenhum</SelectItem>
            {users?.map((u) => (
              <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição *</Label>
        <Textarea id="description" {...register('description')} rows={4} placeholder="Descreva o atendimento..." />
        <div className="flex justify-between">
          {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          <p className="ml-auto text-xs text-muted-foreground">{descLength}/500</p>
        </div>
      </div>

      <Button type="submit" disabled={mutation.isPending} className="w-full">
        {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Criar Atendimento
      </Button>
    </form>
  );
}
