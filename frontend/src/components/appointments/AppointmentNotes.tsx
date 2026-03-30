import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { addAppointmentNote } from '@/api/appointments';
import { appointmentKeys } from '@/constants/query-keys';
import { PermissionGate } from '@/components/auth/PermissionGate';
import type { AppointmentNote } from '@/types';

interface Props {
  appointmentId: string;
  notes: AppointmentNote[];
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n.charAt(0).toUpperCase())
    .join('');
}

export function AppointmentNotes({ appointmentId, notes }: Props) {
  const queryClient = useQueryClient();
  const [content, setContent] = useState('');

  const mutation = useMutation({
    mutationFn: () => addAppointmentNote(appointmentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.detail(appointmentId) });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
      toast.success('Nota adicionada');
      setContent('');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const sorted = [...notes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Notas</h3>

      <PermissionGate permission="appointments:notes">
        <div className="space-y-2">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            placeholder="Adicionar uma nota..."
          />
          <Button
            size="sm"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || !content.trim()}
          >
            {mutation.isPending && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
            Adicionar Nota
          </Button>
        </div>
      </PermissionGate>

      {sorted.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhuma nota ainda.</p>
      ) : (
        <div className="space-y-3">
          {sorted.map((note) => (
            <div key={note.id} className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {getInitials(note.authorName ?? 'U')}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{note.authorName ?? 'Usuário'}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true, locale: ptBR })}
                  </span>
                </div>
                <p className="text-sm text-foreground">{note.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
