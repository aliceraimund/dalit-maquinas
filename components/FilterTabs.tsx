'use client'

import Link from 'next/link'
import { CATEGORIA_LABELS } from '@/lib/utils'
import type { Categoria, DisponivelPara } from '@/types/maquina'

interface FilterTabsProps {
  categoriaAtiva: Categoria | null
  modalidadeAtiva: DisponivelPara | null
  busca: string
  contagens: Record<Categoria, number>
  total: number
}

const CATEGORIAS: (Categoria | null)[] = [null, 'construcao', 'industrial', 'agricola', 'transporte']

const MODALIDADES: { valor: DisponivelPara | null; label: string }[] = [
  { valor: null, label: 'Todas' },
  { valor: 'venda', label: 'Venda' },
  { valor: 'locacao', label: 'Locação' },
]

function buildHref(
  categoria: Categoria | null,
  modalidade: DisponivelPara | null,
  busca: string
): string {
  const params = new URLSearchParams()
  if (categoria) params.set('categoria', categoria)
  if (modalidade) params.set('modalidade', modalidade)
  if (busca) params.set('q', busca)
  const qs = params.toString()
  return qs ? `/?${qs}` : '/'
}

function pillClass(ativa: boolean): string {
  return `whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
    ativa
      ? 'border-[var(--cor-primaria)] bg-[var(--cor-primaria)] text-[var(--cor-primaria-texto)]'
      : 'border-[var(--cor-borda)] bg-white text-[var(--cor-texto-suave)] hover:border-[var(--cor-primaria)] hover:text-[var(--cor-texto)]'
  }`
}

export default function FilterTabs({
  categoriaAtiva,
  modalidadeAtiva,
  busca,
  contagens,
  total,
}: FilterTabsProps) {
  return (
    <div className="sticky top-0 z-40 border-b border-[var(--cor-borda)] bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <form action="/" className="flex min-w-0 flex-1 items-center gap-2 sm:max-w-sm">
            {categoriaAtiva && <input type="hidden" name="categoria" value={categoriaAtiva} />}
            {modalidadeAtiva && <input type="hidden" name="modalidade" value={modalidadeAtiva} />}
            <div className="relative min-w-0 flex-1">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--cor-texto-suave)]"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="search"
                name="q"
                defaultValue={busca}
                placeholder="Buscar por nome, marca, modelo…"
                aria-label="Buscar equipamentos"
                className="w-full rounded-full border border-[var(--cor-borda)] bg-white py-1.5 pl-9 pr-3 text-sm outline-none transition-colors focus:border-[var(--cor-primaria)]"
              />
            </div>
            <button
              type="submit"
              className="rounded-full bg-[var(--cor-primaria)] px-4 py-1.5 text-sm font-semibold text-[var(--cor-primaria-texto)] transition-colors hover:bg-[var(--cor-primaria-hover)]"
            >
              Buscar
            </button>
          </form>

          <nav className="flex gap-1.5 overflow-x-auto" aria-label="Filtrar por modalidade">
            {MODALIDADES.map(({ valor, label }) => (
              <Link
                key={valor ?? 'todas'}
                href={buildHref(categoriaAtiva, valor, busca)}
                scroll={false}
                className={pillClass(modalidadeAtiva === valor)}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <nav className="flex gap-1.5 overflow-x-auto pb-0.5" aria-label="Filtrar por categoria">
          {CATEGORIAS.map((cat) => (
            <Link
              key={cat ?? 'todas'}
              href={buildHref(cat, modalidadeAtiva, busca)}
              scroll={false}
              className={pillClass(categoriaAtiva === cat)}
            >
              {cat ? CATEGORIA_LABELS[cat] : 'Todas'}
              <span className="ml-1.5 text-xs opacity-70">{cat ? contagens[cat] : total}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
