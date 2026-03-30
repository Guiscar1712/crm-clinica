import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cancelAppointment } from '@/api/appointments';
import { appointmentKeys } from '@/constants/query-keys';

const schema = z.object({
  reason: z.string().min(1, 'Motivo é obrigatório').max(500, 'Máximo 500 caracteres'),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  appointmentId: string;
  open: boolean;
  onClose: () => void;
}

export function CancelAppointmentDialog({ appointmentId, open, onClose }: Props) {
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (data: FormValues) => cancelAppointment(appointmentId, data.reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
      toast.success('Atendimento cancelado');
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancelar Atendimento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Motivo do Cancelamento *</Label>
            <Textarea id="reason" {...register('reason')} rows={4} placeholder="Descreva o motivo..." />
            {errors.reason && <p className="text-sm text-destructive">{errors.reason.message}</p>}
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={mutation.isPending}>Voltar</Button>
            <Button type="submit" variant="destructive" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Cancelar Atendimento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
