import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { createPatient, updatePatient } from '@/api/patients';
import { patientKeys } from '@/constants/query-keys';
import { GENDER_LABELS } from '@/constants/patient-enums';
import { BRAZILIAN_STATES } from '@/constants/brazilian-states';
import type { Patient, PatientGender } from '@/types';

const schema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Máximo 100 caracteres'),
  phone: z.string().min(1, 'Telefone é obrigatório').max(20, 'Máximo 20 caracteres'),
  cpf: z.string().max(14).optional().or(z.literal('')),
  dateOfBirth: z.string().optional().or(z.literal('')),
  gender: z.string().optional().or(z.literal('')),
  secondaryPhone: z.string().max(20).optional().or(z.literal('')),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  zipCode: z.string().max(9).optional().or(z.literal('')),
  street: z.string().optional().or(z.literal('')),
  number: z.string().optional().or(z.literal('')),
  complement: z.string().optional().or(z.literal('')),
  neighborhood: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  state: z.string().optional().or(z.literal('')),
  healthInsurance: z.string().optional().or(z.literal('')),
  healthInsuranceNumber: z.string().optional().or(z.literal('')),
  notes: z.string().max(1000).optional().or(z.literal('')),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  patient?: Patient;
  onSuccess: () => void;
}

function formatCpf(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function formatCep(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export function PatientForm({ patient, onSuccess }: Props) {
  const queryClient = useQueryClient();
  const isEditing = !!patient;
  const [cepLoading, setCepLoading] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: patient?.name ?? '',
      phone: patient?.phone ?? '',
      cpf: patient?.cpf ? formatCpf(patient.cpf) : '',
      dateOfBirth: patient?.dateOfBirth ?? '',
      gender: patient?.gender ?? '',
      secondaryPhone: patient?.secondaryPhone ?? '',
      email: patient?.email ?? '',
      zipCode: patient?.address?.zipCode ? formatCep(patient.address.zipCode) : '',
      street: patient?.address?.street ?? '',
      number: patient?.address?.number ?? '',
      complement: patient?.address?.complement ?? '',
      neighborhood: patient?.address?.neighborhood ?? '',
      city: patient?.address?.city ?? '',
      state: patient?.address?.state ?? '',
      healthInsurance: patient?.healthInsurance ?? '',
      healthInsuranceNumber: patient?.healthInsuranceNumber ?? '',
      notes: patient?.notes ?? '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormValues) => {
      const payload = {
        name: data.name,
        phone: data.phone,
        cpf: data.cpf ? data.cpf.replace(/\D/g, '') : null,
        dateOfBirth: data.dateOfBirth || null,
        gender: data.gender || null,
        secondaryPhone: data.secondaryPhone || null,
        email: data.email || null,
        address: data.street ? {
          street: data.street,
          number: data.number ?? '',
          complement: data.complement || null,
          neighborhood: data.neighborhood ?? '',
          city: data.city ?? '',
          state: data.state ?? '',
          zipCode: data.zipCode ? data.zipCode.replace(/\D/g, '') : '',
        } : null,
        healthInsurance: data.healthInsurance || null,
        healthInsuranceNumber: data.healthInsuranceNumber || null,
        notes: data.notes || null,
      };
      return isEditing ? updatePatient(patient.id, payload) : createPatient(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientKeys.all });
      toast.success(isEditing ? 'Paciente atualizado' : 'Paciente criado com sucesso');
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleCepLookup = async () => {
    const cep = watch('zipCode')?.replace(/\D/g, '');
    if (!cep || cep.length !== 8) {
      toast.error('CEP inválido');
      return;
    }
    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (data.erro) {
        toast.error('CEP não encontrado');
        return;
      }
      setValue('street', data.logradouro ?? '');
      setValue('neighborhood', data.bairro ?? '');
      setValue('city', data.localidade ?? '');
      setValue('state', data.uf ?? '');
    } catch {
      toast.error('Erro ao buscar CEP');
    } finally {
      setCepLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md bg-muted px-3 py-2 text-sm font-semibold">
          Dados Pessoais <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-3">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input id="name" {...register('name')} placeholder="Nome do paciente" />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                {...register('cpf')}
                placeholder="000.000.000-00"
                onChange={(e) => setValue('cpf', formatCpf(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Data de Nascimento</Label>
              <Input id="dateOfBirth" type="date" {...register('dateOfBirth')} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Gênero</Label>
            <Select value={watch('gender')} onValueChange={(v) => setValue('gender', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(GENDER_LABELS) as PatientGender[]).map((g) => (
                  <SelectItem key={g} value={g}>{GENDER_LABELS[g]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md bg-muted px-3 py-2 text-sm font-semibold">
          Contato <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-3">
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone Principal *</Label>
            <Input id="phone" {...register('phone')} placeholder="(00) 00000-0000" />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="secondaryPhone">Telefone Secundário</Label>
            <Input id="secondaryPhone" {...register('secondaryPhone')} placeholder="(00) 00000-0000" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" {...register('email')} placeholder="paciente@email.com" />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible>
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md bg-muted px-3 py-2 text-sm font-semibold">
          Endereço <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-3">
          <div className="flex gap-2">
            <div className="flex-1 space-y-2">
              <Label htmlFor="zipCode">CEP</Label>
              <Input
                id="zipCode"
                {...register('zipCode')}
                placeholder="00000-000"
                onChange={(e) => setValue('zipCode', formatCep(e.target.value))}
              />
            </div>
            <Button type="button" variant="outline" onClick={handleCepLookup} disabled={cepLoading} className="mt-7">
              {cepLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Buscar'}
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="street">Rua</Label>
              <Input id="street" {...register('street')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="number">Número</Label>
              <Input id="number" {...register('number')} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="complement">Complemento</Label>
            <Input id="complement" {...register('complement')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="neighborhood">Bairro</Label>
            <Input id="neighborhood" {...register('neighborhood')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input id="city" {...register('city')} />
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={watch('state')} onValueChange={(v) => setValue('state', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="UF" />
                </SelectTrigger>
                <SelectContent>
                  {BRAZILIAN_STATES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible>
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md bg-muted px-3 py-2 text-sm font-semibold">
          Plano de Saúde <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-3">
          <div className="space-y-2">
            <Label htmlFor="healthInsurance">Plano</Label>
            <Input id="healthInsurance" {...register('healthInsurance')} placeholder="Nome do plano" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="healthInsuranceNumber">Número do Plano</Label>
            <Input id="healthInsuranceNumber" {...register('healthInsuranceNumber')} />
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible>
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md bg-muted px-3 py-2 text-sm font-semibold">
          Observações <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3">
          <Textarea id="notes" {...register('notes')} rows={4} placeholder="Observações sobre o paciente..." />
        </CollapsibleContent>
      </Collapsible>

      <Button type="submit" disabled={mutation.isPending} className="w-full">
        {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isEditing ? 'Salvar Alterações' : 'Criar Paciente'}
      </Button>
    </form>
  );
}
