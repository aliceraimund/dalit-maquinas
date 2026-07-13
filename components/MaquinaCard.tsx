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

const WHATSAPP = '5511995998514'

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

  const mensagemWhatsApp = encodeURIComponent(
    `Olá! Tenho interesse na máquina "${maquina.nome}". Pode me passar mais informações?`
  )

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--cor-borda)] bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
      <Link
        href={`/maquina/${maquina.id}`}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-[var(--cor-fundo-suave)]"
        aria-label={maquina.nome}
      >
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
        <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
          {maquina.status && (
            <span className={`rounded-full px-2.5 py-1 text-xs font-bold shadow-sm ${STATUS_COLORS[maquina.status]}`}>
              {STATUS_LABELS[maquina.status]}
            </span>
          )}
          {maquina.destaque && (
            <span className="rounded-full bg-[var(--cor-primaria)] px-2.5 py-1 text-xs font-bold text-[var(--cor-primaria-texto)] shadow-sm">
              Destaque
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap gap-1.5">
          {maquina.disponivel_para && (
            <span className={`rounded px-2 py-0.5 text-xs font-semibold ${DISPONIVEL_COLORS[maquina.disponivel_para]}`}>
              {DISPONIVEL_LABELS[maquina.disponivel_para]}
            </span>
          )}
          {maquina.categorias?.map((categoria) => (
            <span
              key={categoria}
              className="rounded bg-[var(--cor-fundo-suave)] px-2 py-0.5 text-xs text-[var(--cor-texto-suave)]"
            >
              {CATEGORIA_LABELS[categoria]}
            </span>
          ))}
        </div>

        <Link href={`/maquina/${maquina.id}`}>
          <h3 className="font-semibold leading-snug text-[var(--cor-texto)] transition-colors group-hover:text-[var(--cor-primaria)]">
            {maquina.nome}
          </h3>
        </Link>

        {specs.length > 0 && (
          <p className="text-xs text-[var(--cor-texto-suave)]">{specs.join(' · ')}</p>
        )}

        <div className="mt-1">
          <PriceDisplay maquina={maquina} compact />
        </div>

        <div className="mt-auto flex items-stretch gap-2 border-t border-[var(--cor-borda)] pt-3">
          <Link
            href={`/maquina/${maquina.id}`}
            className="flex flex-1 items-center justify-center rounded-lg bg-[var(--cor-primaria)] px-3 py-2 text-sm font-semibold text-[var(--cor-primaria-texto)] transition-colors hover:bg-[var(--cor-primaria-hover)]"
          >
            Ver detalhes
          </Link>
          <a
            href={`https://wa.me/${WHATSAPP}?text=${mensagemWhatsApp}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Falar no WhatsApp sobre ${maquina.nome}`}
            className="flex w-11 items-center justify-center rounded-lg bg-[#25D366] text-white transition-colors hover:bg-[#1FB955]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  )
}
