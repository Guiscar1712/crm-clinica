import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { updateAppointment } from '@/api/appointments';
import { appointmentKeys } from '@/constants/query-keys';

const schema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória').max(500, 'Máximo 500 caracteres'),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  id: string;
  description: string;
  open: boolean;
  onClose: () => void;
}

export function AppointmentEditDialog({ id, description, open, onClose }: Props) {
  const queryClient = useQueryClient();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { description },
  });

  const descLength = watch('description')?.length ?? 0;

  const mutation = useMutation({
    mutationFn: (data: FormValues) => updateAppointment(id, { description: data.description! }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
      toast.success('Atendimento atualizado');
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
          <DialogTitle>Editar Atendimento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-desc">Descrição</Label>
            <Textarea id="edit-desc" {...register('description')} rows={4} />
            <div className="flex justify-between">
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
              <p className="ml-auto text-xs text-muted-foreground">{descLength}/500</p>
            </div>
          </div>
          <Button type="submit" disabled={mutation.isPending} className="w-full">
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
