import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { changeRole } from '@/api/users';
import { userKeys } from '@/constants/query-keys';
import { ROLE_LABELS } from '@/constants/user-roles';
import type { User, UserRole } from '@/types';

interface Props {
  user: User;
  open: boolean;
  onClose: () => void;
}

export function ChangeRoleDialog({ user, open, onClose }: Props) {
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState<UserRole>(user.role);

  const mutation = useMutation({
    mutationFn: () => changeRole(user.id, selectedRole),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success('Role alterada com sucesso');
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const availableRoles = (Object.keys(ROLE_LABELS) as UserRole[]).filter((r) => r !== 'SUPER_ADMIN');

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Alterar Role</DialogTitle>
          <DialogDescription>
            Alterando a role de <strong>{user.name}</strong>. Esta ação altera as permissões do usuário no sistema.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <Label>Nova Role</Label>
          <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as UserRole)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableRoles.map((r) => (
                <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={mutation.isPending}>Cancelar</Button>
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
