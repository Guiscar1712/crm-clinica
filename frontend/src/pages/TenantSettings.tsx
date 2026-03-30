import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTenant, updateTenant } from '@/api/tenants';
import { tenantKeys } from '@/constants/query-keys';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

const schema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido').nullable().or(z.literal('')),
  phone: z.string().max(20).nullable().or(z.literal('')),
  primaryColor: z.string().nullable().or(z.literal('')),
});

type FormValues = z.infer<typeof schema>;

export default function TenantSettings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const tenantId = user?.tenantId ?? '';

  const { data: tenant, isLoading } = useQuery({
    queryKey: tenantKeys.detail(tenantId),
    queryFn: () => getTenant(tenantId),
    enabled: !!tenantId,
  });

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: tenant ? {
      name: tenant.name,
      email: tenant.email ?? '',
      phone: tenant.phone ?? '',
      primaryColor: tenant.primaryColor ?? '#4f46e5',
    } : undefined,
  });

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      updateTenant(tenantId, {
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        primaryColor: data.primaryColor || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.detail(tenantId) });
      toast.success('Configurações salvas');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Configurações</h1>
      <Card>
        <CardHeader>
          <CardTitle>Dados da Clínica</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" {...register('phone')} />
            </div>
            <Button type="submit" disabled={mutation.isPending} className="w-full">
              {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Configurações
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
