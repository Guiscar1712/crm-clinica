import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { listUsers } from '@/api/users';
import { userKeys } from '@/constants/query-keys';
import { ROLE_LABELS } from '@/constants/user-roles';
import { PermissionGate } from '@/components/auth/PermissionGate';
import { UserForm } from '@/components/users/UserForm';
import { ChangeRoleDialog } from '@/components/users/ChangeRoleDialog';
import { DeactivateUserDialog } from '@/components/users/DeactivateUserDialog';
import type { User, UserRole } from '@/types';

export default function Users() {
  const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL');
  const [createOpen, setCreateOpen] = useState(false);
  const [roleTarget, setRoleTarget] = useState<User | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<User | null>(null);

  const { data: users, isLoading } = useQuery({
    queryKey: userKeys.list(),
    queryFn: listUsers,
  });

  const filtered = users?.filter((u) => roleFilter === 'ALL' || u.role === roleFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Usuários</h1>
        <PermissionGate permission="users:write">
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Novo Usuário
          </Button>
        </PermissionGate>
      </div>

      <div className="flex items-center gap-3">
        <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as UserRole | 'ALL')}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todas as roles</SelectItem>
            {(Object.keys(ROLE_LABELS) as UserRole[]).map((role) => (
              <SelectItem key={role} value={role}>{ROLE_LABELS[role]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !filtered || filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <p className="text-lg font-medium">Nenhum usuário encontrado</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((u) => (
                  <TableRow key={u.id} className={!u.isActive ? 'opacity-50' : ''}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                        {ROLE_LABELS[u.role]}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${u.isActive ? 'bg-status-finalizado-bg text-status-finalizado-text' : 'bg-red-100 text-red-700'}`}>
                        {u.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <PermissionGate permission="users:write">
                          <Button size="sm" variant="ghost" onClick={() => setRoleTarget(u)}>Alterar Role</Button>
                          {u.isActive && (
                            <Button size="sm" variant="ghost" onClick={() => setDeactivateTarget(u)}>Desativar</Button>
                          )}
                        </PermissionGate>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Usuário</DialogTitle>
          </DialogHeader>
          <UserForm onSuccess={() => setCreateOpen(false)} />
        </DialogContent>
      </Dialog>

      {roleTarget && (
        <ChangeRoleDialog user={roleTarget} open={!!roleTarget} onClose={() => setRoleTarget(null)} />
      )}

      {deactivateTarget && (
        <DeactivateUserDialog user={deactivateTarget} open={!!deactivateTarget} onClose={() => setDeactivateTarget(null)} />
      )}
    </div>
  );
}
