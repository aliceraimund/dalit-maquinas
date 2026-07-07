'use client'

import Link from 'next/link'
import { CATEGORIA_LABELS } from '@/lib/utils'
import type { Categoria, DisponivelPara } from '@/types/maquina'

interface FilterTabsProps {
  categoriaAtiva: Categoria | null
  modalidadeAtiva: DisponivelPara | null
}

const CATEGORIAS: (Categoria | null)[] = [null, 'construcao', 'industrial', 'agricola', 'transporte']

const MODALIDADES: { valor: DisponivelPara | null; label: string }[] = [
  { valor: null, label: 'Todas' },
  { valor: 'venda', label: 'Venda' },
  { valor: 'locacao', label: 'Locação' },
]

function buildHref(categoria: Categoria | null, modalidade: DisponivelPara | null): string {
  const params = new URLSearchParams()
  if (categoria) params.set('categoria', categoria)
  if (modalidade) params.set('modalidade', modalidade)
  const qs = params.toString()
  return qs ? `/?${qs}` : '/'
}

function tabClass(ativa: boolean): string {
  return `whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${
    ativa
      ? 'border-[var(--cor-primaria)] text-[var(--cor-texto)]'
      : 'border-transparent text-[var(--cor-texto-suave)] hover:border-[var(--cor-borda)] hover:text-[var(--cor-texto)]'
  }`
}

export default function FilterTabs({ categoriaAtiva, modalidadeAtiva }: FilterTabsProps) {
  return (
    <div className="sticky top-0 z-40 border-b border-[var(--cor-borda)] bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <nav className="flex gap-1 overflow-x-auto" aria-label="Filtrar por categoria">
          {CATEGORIAS.map((cat) => (
            <Link
              key={cat ?? 'todas'}
              href={buildHref(cat, modalidadeAtiva)}
              scroll={false}
              className={tabClass(categoriaAtiva === cat)}
            >
              {cat ? CATEGORIA_LABELS[cat] : 'Todas'}
            </Link>
          ))}
        </nav>
        <nav
          className="flex gap-1 overflow-x-auto border-t border-[var(--cor-borda)]"
          aria-label="Filtrar por modalidade"
        >
          {MODALIDADES.map(({ valor, label }) => (
            <Link
              key={valor ?? 'todas'}
              href={buildHref(categoriaAtiva, valor)}
              scroll={false}
              className={tabClass(modalidadeAtiva === valor)}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
