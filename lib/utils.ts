import type { Categoria, DisponivelPara, Status } from '@/types/maquina'

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDate(value: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(typeof value === 'string' ? new Date(value) : value)
}

export const STATUS_LABELS: Record<Status, string> = {
  disponivel: 'Disponível',
  reservado: 'Reservado',
  vendido: 'Vendido',
  em_manutencao: 'Em manutenção',
}

export const STATUS_COLORS: Record<Status, string> = {
  disponivel: 'bg-[var(--cor-acento)] text-[var(--cor-acento-texto)]',
  reservado: 'bg-[var(--cor-borda)] text-[var(--cor-texto-suave)]',
  vendido: 'bg-[var(--cor-texto)] text-white',
  em_manutencao: 'bg-[var(--cor-fundo-suave)] text-[var(--cor-texto-suave)] border border-[var(--cor-borda)]',
}

export const DISPONIVEL_LABELS: Record<DisponivelPara, string> = {
  venda: 'Venda',
  locacao: 'Locação',
  ambos: 'Venda e Locação',
}

export const DISPONIVEL_COLORS: Record<DisponivelPara, string> = {
  venda: 'bg-[var(--cor-primaria)] text-[var(--cor-primaria-texto)]',
  locacao: 'bg-[#DCE9F5] text-[#1D3A4F]',
  ambos: 'bg-[var(--cor-primaria)] text-[var(--cor-primaria-texto)]',
}

export const CATEGORIA_LABELS: Record<Categoria, string> = {
  construcao: 'Construção',
  industrial: 'Industrial',
  agricola: 'Agrícola',
  transporte: 'Transporte',
}

export const CATEGORIA_COLORS: Record<Categoria, string> = {
  construcao: 'bg-[var(--cor-fundo-suave)] text-[var(--cor-texto-suave)] border border-[var(--cor-borda)]',
  industrial: 'bg-[var(--cor-fundo-suave)] text-[var(--cor-texto-suave)] border border-[var(--cor-borda)]',
  agricola: 'bg-[var(--cor-fundo-suave)] text-[var(--cor-texto-suave)] border border-[var(--cor-borda)]',
  transporte: 'bg-[var(--cor-fundo-suave)] text-[var(--cor-texto-suave)] border border-[var(--cor-borda)]',
}
