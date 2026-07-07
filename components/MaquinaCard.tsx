import Link from 'next/link'
import PriceDisplay from '@/components/PriceDisplay'
import RetryImage from '@/components/RetryImage'
import {
  CATEGORIA_LABELS,
  DISPONIVEL_COLORS,
  DISPONIVEL_LABELS,
  STATUS_COLORS,
  STATUS_LABELS,
} from '@/lib/utils'
import type { Maquina } from '@/types/maquina'

interface MaquinaCardProps {
  maquina: Maquina
}

export default function MaquinaCard({ maquina }: MaquinaCardProps) {
  const foto = maquina.fotos?.[0]

  const specs = [
    maquina.marca,
    maquina.modelo,
    maquina.ano ? `Ano ${maquina.ano}` : null,
    maquina.horas_uso != null ? `${new Intl.NumberFormat('pt-BR').format(maquina.horas_uso)} h` : null,
  ].filter(Boolean)

  return (
    <Link
      href={`/maquina/${maquina.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-[var(--cor-borda)] bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--cor-fundo-suave)]">
        {foto ? (
          <RetryImage
            src={foto}
            alt={maquina.nome}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--cor-texto-suave)]">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
        )}
        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          {maquina.destaque && (
            <span className="rounded-full bg-[var(--cor-primaria)] px-2 py-0.5 text-xs font-semibold text-[var(--cor-texto)]">
              Destaque
            </span>
          )}
          {maquina.status && (
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[maquina.status]}`}>
              {STATUS_LABELS[maquina.status]}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap gap-1">
          {maquina.disponivel_para && (
            <span className={`rounded px-2 py-0.5 text-xs font-medium ${DISPONIVEL_COLORS[maquina.disponivel_para]}`}>
              {DISPONIVEL_LABELS[maquina.disponivel_para]}
            </span>
          )}
          {maquina.categoria && (
            <span className="rounded bg-[var(--cor-fundo-suave)] px-2 py-0.5 text-xs text-[var(--cor-texto-suave)]">
              {CATEGORIA_LABELS[maquina.categoria]}
            </span>
          )}
        </div>

        <h3 className="font-semibold leading-snug text-[var(--cor-texto)]">{maquina.nome}</h3>

        {specs.length > 0 && (
          <p className="text-xs text-[var(--cor-texto-suave)]">{specs.join(' · ')}</p>
        )}

        <div className="mt-auto border-t border-[var(--cor-borda)] pt-2">
          <PriceDisplay maquina={maquina} compact />
        </div>
      </div>
    </Link>
  )
}
