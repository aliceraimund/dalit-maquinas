'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import RetryImage from '@/components/RetryImage'
import { createClient } from '@/lib/supabase/client'
import {
  CATEGORIA_LABELS,
  DISPONIVEL_LABELS,
  STATUS_COLORS,
  STATUS_LABELS,
  formatDate,
} from '@/lib/utils'
import type { Maquina } from '@/types/maquina'

interface AdminMaquinaListProps {
  maquinas: Maquina[]
}

const STORAGE_MARKER = '/storage/v1/object/public/maquinas/'

function storagePathFromUrl(url: string): string | null {
  const pos = url.indexOf(STORAGE_MARKER)
  if (pos === -1) return null
  return decodeURIComponent(url.slice(pos + STORAGE_MARKER.length).split('?')[0])
}

export default function AdminMaquinaList({ maquinas }: AdminMaquinaListProps) {
  const router = useRouter()
  const [ocupado, setOcupado] = useState<string | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  async function togglePublicado(maquina: Maquina) {
    setOcupado(maquina.id)
    setErro(null)
    const supabase = createClient()
    const { error } = await supabase
      .from('maquinas')
      .update({ publicado: !maquina.publicado })
      .eq('id', maquina.id)
    setOcupado(null)
    if (error) {
      setErro(`Erro ao atualizar: ${error.message}`)
      return
    }
    router.refresh()
  }

  async function duplicar(maquina: Maquina) {
    setOcupado(maquina.id)
    setErro(null)
    const supabase = createClient()
    const { id: _id, criado_em: _criado, ...resto } = maquina
    const { error } = await supabase.from('maquinas').insert({
      ...resto,
      nome: `${maquina.nome} (cópia)`,
      publicado: false,
    })
    setOcupado(null)
    if (error) {
      setErro(`Erro ao duplicar: ${error.message}`)
      return
    }
    router.refresh()
  }

  async function excluir(maquina: Maquina) {
    const confirmado = window.confirm(
      `Excluir "${maquina.nome}"? As fotos também serão removidas. Esta ação não pode ser desfeita.`
    )
    if (!confirmado) return

    setOcupado(maquina.id)
    setErro(null)
    const supabase = createClient()

    // Remove as fotos do storage antes de apagar o registro
    const paths = (maquina.fotos ?? [])
      .map(storagePathFromUrl)
      .filter((p): p is string => p !== null)
    if (paths.length > 0) {
      await supabase.storage.from('maquinas').remove(paths)
    }

    const { error } = await supabase.from('maquinas').delete().eq('id', maquina.id)
    setOcupado(null)
    if (error) {
      setErro(`Erro ao excluir: ${error.message}`)
      return
    }
    router.refresh()
  }

  if (maquinas.length === 0) {
    return (
      <p className="rounded-xl border border-[var(--cor-borda)] bg-white p-10 text-center text-[var(--cor-texto-suave)]">
        Nenhuma máquina cadastrada ainda. Clique em “+ Nova máquina” para começar.
      </p>
    )
  }

  const acaoClass =
    'rounded px-2.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-50'

  return (
    <div>
      {erro && (
        <p className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {erro}
        </p>
      )}

      <ul className="space-y-3">
        {maquinas.map((maquina) => {
          const emAcao = ocupado === maquina.id
          return (
            <li
              key={maquina.id}
              className={`flex flex-col gap-3 rounded-xl border border-[var(--cor-borda)] bg-white p-4 shadow-sm sm:flex-row sm:items-center ${
                !maquina.publicado ? 'opacity-70' : ''
              }`}
            >
              <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-[var(--cor-fundo-suave)]">
                {maquina.fotos?.[0] ? (
                  <RetryImage
                    src={maquina.fotos[0]}
                    alt={maquina.nome}
                    fill
                    unoptimized
                    sizes="112px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[var(--cor-texto-suave)]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="m21 15-5-5L5 21" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-[var(--cor-texto)]">{maquina.nome}</p>
                  {maquina.destaque && (
                    <span className="rounded-full bg-[var(--cor-primaria)] px-2 py-0.5 text-[10px] font-semibold text-[var(--cor-texto)]">
                      Destaque
                    </span>
                  )}
                  {maquina.status && (
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_COLORS[maquina.status]}`}>
                      {STATUS_LABELS[maquina.status]}
                    </span>
                  )}
                  {!maquina.publicado && (
                    <span className="rounded-full border border-[var(--cor-borda)] px-2 py-0.5 text-[10px] font-medium text-[var(--cor-texto-suave)]">
                      Oculta
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-[var(--cor-texto-suave)]">
                  {[
                    maquina.tipo,
                    maquina.categoria ? CATEGORIA_LABELS[maquina.categoria] : null,
                    maquina.disponivel_para ? DISPONIVEL_LABELS[maquina.disponivel_para] : null,
                    `Criada em ${formatDate(maquina.criado_em)}`,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => togglePublicado(maquina)}
                  disabled={emAcao}
                  className={`${acaoClass} border border-[var(--cor-borda)] text-[var(--cor-texto-suave)] hover:bg-[var(--cor-fundo-suave)]`}
                >
                  {maquina.publicado ? 'Ocultar' : 'Publicar'}
                </button>
                <Link
                  href={`/maquina/${maquina.id}`}
                  target="_blank"
                  className={`${acaoClass} border border-[var(--cor-borda)] text-[var(--cor-texto-suave)] hover:bg-[var(--cor-fundo-suave)]`}
                >
                  Visualizar
                </Link>
                <Link
                  href={`/admin/maquinas/${maquina.id}/editar`}
                  className={`${acaoClass} bg-[var(--cor-primaria)] font-semibold text-[var(--cor-texto)] hover:bg-[var(--cor-primaria-hover)]`}
                >
                  Editar
                </Link>
                <button
                  type="button"
                  onClick={() => duplicar(maquina)}
                  disabled={emAcao}
                  className={`${acaoClass} border border-[var(--cor-borda)] text-[var(--cor-texto-suave)] hover:bg-[var(--cor-fundo-suave)]`}
                >
                  Duplicar
                </button>
                <button
                  type="button"
                  onClick={() => excluir(maquina)}
                  disabled={emAcao}
                  className={`${acaoClass} border border-red-200 text-red-700 hover:bg-red-50`}
                >
                  Excluir
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
