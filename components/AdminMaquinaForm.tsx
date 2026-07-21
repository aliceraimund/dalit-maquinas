'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import RetryImage from '@/components/RetryImage'
import { createClient } from '@/lib/supabase/client'
import { DISPONIVEL_LABELS, STATUS_LABELS } from '@/lib/utils'
import type { Categoria, DisponivelPara, Maquina, Status } from '@/types/maquina'

const TIPOS_ACEITOS = ['image/jpeg', 'image/png', 'image/webp']

const EXTENSOES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

interface AdminMaquinaFormProps {
  maquina?: Maquina
}

interface FormState {
  nome: string
  tipo: string
  categorias: Categoria[]
  marca: string
  modelo: string
  ano: string
  horas_uso: string
  potencia: string
  motor: string
  alternador: string
  capacidade: string
  peso_kg: string
  disponivel_para: DisponivelPara | ''
  preco_venda: string
  preco_locacao: string
  venda_sob_consulta: boolean
  locacao_sob_consulta: boolean
  status: Status | ''
  destaque: boolean
  publicado: boolean
  descricao: string
}

const inputClass =
  'w-full rounded-lg border border-[var(--cor-borda)] bg-white px-3 py-2 text-sm text-[var(--cor-texto)] outline-none transition-colors focus:border-[var(--cor-primaria)]'

const labelClass = 'mb-1 block text-sm font-medium text-[var(--cor-texto-suave)]'

export default function AdminMaquinaForm({ maquina }: AdminMaquinaFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragIndexRef = useRef<number | null>(null)

  const [form, setForm] = useState<FormState>({
    nome: maquina?.nome ?? '',
    tipo: maquina?.tipo ?? '',
    categorias: maquina?.categorias ?? [],
    marca: maquina?.marca ?? '',
    modelo: maquina?.modelo ?? '',
    ano: maquina?.ano != null ? String(maquina.ano) : '',
    horas_uso: maquina?.horas_uso != null ? String(maquina.horas_uso) : '',
    potencia: maquina?.potencia ?? '',
    motor: maquina?.motor ?? '',
    alternador: maquina?.alternador ?? '',
    capacidade: maquina?.capacidade ?? '',
    peso_kg: maquina?.peso_kg != null ? String(maquina.peso_kg) : '',
    disponivel_para: maquina?.disponivel_para ?? '',
    preco_venda: maquina?.preco_venda != null ? String(maquina.preco_venda) : '',
    preco_locacao: maquina?.preco_locacao != null ? String(maquina.preco_locacao) : '',
    venda_sob_consulta: maquina?.venda_sob_consulta ?? false,
    locacao_sob_consulta: maquina?.locacao_sob_consulta ?? false,
    status: maquina?.status ?? 'disponivel',
    destaque: maquina?.destaque ?? false,
    publicado: maquina?.publicado ?? true,
    descricao: maquina?.descricao ?? '',
  })
  const [fotos, setFotos] = useState<string[]>(maquina?.fotos ?? [])
  const [enviandoFotos, setEnviandoFotos] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  function set<K extends keyof FormState>(campo: K, valor: FormState[K]) {
    setForm((f) => ({ ...f, [campo]: valor }))
  }

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return

    const invalidos = files.filter((f) => !TIPOS_ACEITOS.includes(f.type))
    if (invalidos.length > 0) {
      setErro(
        `Formato não aceito: ${invalidos.map((f) => f.name).join(', ')}. Envie apenas imagens JPEG, PNG ou WebP.`
      )
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    setErro(null)
    setEnviandoFotos(true)
    const supabase = createClient()

    try {
      const urls: string[] = []
      for (const file of files) {
        const ext = EXTENSOES[file.type]
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
        const { error } = await supabase.storage.from('maquinas').upload(path, file)
        if (error) throw new Error(`Falha ao enviar ${file.name}: ${error.message}`)
        const { data } = supabase.storage.from('maquinas').getPublicUrl(path)
        urls.push(data.publicUrl)
      }
      setFotos((f) => [...f, ...urls])
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao enviar fotos.')
    } finally {
      setEnviandoFotos(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function moverFoto(de: number, para: number) {
    if (para < 0 || para >= fotos.length) return
    setFotos((f) => {
      const novo = [...f]
      const [item] = novo.splice(de, 1)
      novo.splice(para, 0, item)
      return novo
    })
  }

  function tornarPrincipal(index: number) {
    moverFoto(index, 0)
  }

  async function removerFoto(index: number) {
    const url = fotos[index]
    setFotos((f) => f.filter((_, i) => i !== index))

    // Remove do storage imediatamente (foto ainda não referenciada é órfã)
    const marcador = '/storage/v1/object/public/maquinas/'
    const pos = url.indexOf(marcador)
    if (pos !== -1) {
      const path = decodeURIComponent(url.slice(pos + marcador.length).split('?')[0])
      const supabase = createClient()
      await supabase.storage.from('maquinas').remove([path])
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErro(null)

    if (!form.nome.trim() || !form.tipo.trim()) {
      setErro('Preencha os campos obrigatórios: nome e tipo.')
      return
    }

    setSalvando(true)
    const supabase = createClient()

    const payload = {
      nome: form.nome.trim(),
      tipo: form.tipo.trim(),
      categorias: form.categorias.length > 0 ? form.categorias : null,
      marca: form.marca.trim() || null,
      modelo: form.modelo.trim() || null,
      ano: form.ano ? parseInt(form.ano, 10) : null,
      horas_uso: form.horas_uso ? parseFloat(form.horas_uso) : null,
      potencia: form.potencia.trim() || null,
      motor: form.motor.trim() || null,
      alternador: form.alternador.trim() || null,
      capacidade: form.capacidade.trim() || null,
      peso_kg: form.peso_kg ? parseFloat(form.peso_kg) : null,
      disponivel_para: form.disponivel_para || null,
      preco_venda: form.preco_venda ? parseFloat(form.preco_venda) : null,
      preco_locacao: form.preco_locacao ? parseFloat(form.preco_locacao) : null,
      venda_sob_consulta: form.venda_sob_consulta,
      locacao_sob_consulta: form.locacao_sob_consulta,
      status: form.status || null,
      destaque: form.destaque,
      publicado: form.publicado,
      fotos,
      descricao: form.descricao.trim() || null,
    }

    const { error } = maquina
      ? await supabase.from('maquinas').update(payload).eq('id', maquina.id)
      : await supabase.from('maquinas').insert(payload)

    setSalvando(false)

    if (error) {
      setErro(`Erro ao salvar: ${error.message}`)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {erro && (
        <p className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {erro}
        </p>
      )}

      {/* Identificação */}
      <fieldset className="rounded-xl border border-[var(--cor-borda)] bg-white p-5">
        <legend className="px-2 text-sm font-semibold text-[var(--cor-texto)]">Identificação</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="nome" className={labelClass}>Nome *</label>
            <input id="nome" type="text" required value={form.nome} onChange={(e) => set('nome', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="tipo" className={labelClass}>Tipo *</label>
            <input id="tipo" type="text" required placeholder="Ex: Escavadeira, Empilhadeira" value={form.tipo} onChange={(e) => set('tipo', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="marca" className={labelClass}>Marca</label>
            <input id="marca" type="text" value={form.marca} onChange={(e) => set('marca', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="modelo" className={labelClass}>Modelo</label>
            <input id="modelo" type="text" value={form.modelo} onChange={(e) => set('modelo', e.target.value)} className={inputClass} />
          </div>
        </div>
      </fieldset>

      {/* Especificações */}
      <fieldset className="rounded-xl border border-[var(--cor-borda)] bg-white p-5">
        <legend className="px-2 text-sm font-semibold text-[var(--cor-texto)]">Especificações</legend>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label htmlFor="ano" className={labelClass}>Ano</label>
            <input id="ano" type="number" min="1900" max="2100" value={form.ano} onChange={(e) => set('ano', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="horas_uso" className={labelClass}>Horas de uso</label>
            <input id="horas_uso" type="number" min="0" step="0.1" value={form.horas_uso} onChange={(e) => set('horas_uso', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="peso_kg" className={labelClass}>Peso (kg)</label>
            <input id="peso_kg" type="number" min="0" step="0.01" value={form.peso_kg} onChange={(e) => set('peso_kg', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="potencia" className={labelClass}>Potência</label>
            <input id="potencia" type="text" placeholder="Ex: 240 kVA, 150 cv" value={form.potencia} onChange={(e) => set('potencia', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="motor" className={labelClass}>Motor</label>
            <input id="motor" type="text" placeholder="Ex: FPT Iveco, Cummins QST30-G2" value={form.motor} onChange={(e) => set('motor', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="alternador" className={labelClass}>Alternador</label>
            <input id="alternador" type="text" placeholder="Ex: WEG brushless" value={form.alternador} onChange={(e) => set('alternador', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="capacidade" className={labelClass}>Capacidade</label>
            <input id="capacidade" type="text" placeholder="Ex: 2,5 toneladas" value={form.capacidade} onChange={(e) => set('capacidade', e.target.value)} className={inputClass} />
          </div>
        </div>
      </fieldset>

      {/* Comercial */}
      <fieldset className="rounded-xl border border-[var(--cor-borda)] bg-white p-5">
        <legend className="px-2 text-sm font-semibold text-[var(--cor-texto)]">Comercial</legend>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label htmlFor="disponivel_para" className={labelClass}>Modalidade</label>
            <select id="disponivel_para" value={form.disponivel_para} onChange={(e) => set('disponivel_para', e.target.value as DisponivelPara | '')} className={inputClass}>
              <option value="">Selecione</option>
              {(Object.keys(DISPONIVEL_LABELS) as DisponivelPara[]).map((d) => (
                <option key={d} value={d}>{DISPONIVEL_LABELS[d]}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="preco_venda" className={labelClass}>Preço de venda (R$)</label>
            <input id="preco_venda" type="number" min="0" step="0.01" value={form.preco_venda} onChange={(e) => set('preco_venda', e.target.value)} className={inputClass} disabled={form.venda_sob_consulta} />
            <label className="mt-1.5 flex items-center gap-2 text-xs text-[var(--cor-texto-suave)]">
              <input type="checkbox" checked={form.venda_sob_consulta} onChange={(e) => set('venda_sob_consulta', e.target.checked)} className="h-3.5 w-3.5 accent-[var(--cor-primaria)]" />
              Sob consulta (não exibe o valor de venda)
            </label>
          </div>
          <div>
            <label htmlFor="preco_locacao" className={labelClass}>Preço de locação (R$)</label>
            <input id="preco_locacao" type="number" min="0" step="0.01" value={form.preco_locacao} onChange={(e) => set('preco_locacao', e.target.value)} className={inputClass} disabled={form.locacao_sob_consulta} />
            <label className="mt-1.5 flex items-center gap-2 text-xs text-[var(--cor-texto-suave)]">
              <input type="checkbox" checked={form.locacao_sob_consulta} onChange={(e) => set('locacao_sob_consulta', e.target.checked)} className="h-3.5 w-3.5 accent-[var(--cor-primaria)]" />
              Sob consulta (não exibe o valor de locação)
            </label>
          </div>
          <div>
            <label htmlFor="status" className={labelClass}>Status</label>
            <select id="status" value={form.status} onChange={(e) => set('status', e.target.value as Status | '')} className={inputClass}>
              {(Object.keys(STATUS_LABELS) as Status[]).map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col justify-end gap-2 sm:col-span-2">
            <label className="flex items-center gap-2 text-sm text-[var(--cor-texto)]">
              <input type="checkbox" checked={form.destaque} onChange={(e) => set('destaque', e.target.checked)} className="h-4 w-4 accent-[var(--cor-primaria)]" />
              Destaque na homepage
            </label>
            <label className="flex items-center gap-2 text-sm text-[var(--cor-texto)]">
              <input type="checkbox" checked={form.publicado} onChange={(e) => set('publicado', e.target.checked)} className="h-4 w-4 accent-[var(--cor-primaria)]" />
              Publicado (visível no site)
            </label>
          </div>
        </div>
      </fieldset>

      {/* Fotos */}
      <fieldset className="rounded-xl border border-[var(--cor-borda)] bg-white p-5">
        <legend className="px-2 text-sm font-semibold text-[var(--cor-texto)]">Fotos</legend>
        <p className="mb-3 text-xs text-[var(--cor-texto-suave)]">
          JPEG, PNG ou WebP. A primeira foto é a principal. Arraste para reordenar (ou use as setas no celular).
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleUpload}
          disabled={enviandoFotos}
          className="mb-4 block w-full text-sm text-[var(--cor-texto-suave)] file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-[var(--cor-primaria)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[var(--cor-primaria-texto)] hover:file:bg-[var(--cor-primaria-hover)]"
        />
        {enviandoFotos && <p className="mb-3 text-sm text-[var(--cor-texto-suave)]">Enviando fotos…</p>}

        {fotos.length > 0 && (
          <ul className="grid grid-cols-3 gap-3 md:grid-cols-6">
            {fotos.map((foto, i) => (
              <li
                key={foto}
                draggable
                onDragStart={() => {
                  dragIndexRef.current = i
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  if (dragIndexRef.current != null && dragIndexRef.current !== i) {
                    moverFoto(dragIndexRef.current, i)
                  }
                  dragIndexRef.current = null
                }}
                className="group relative aspect-square cursor-grab overflow-hidden rounded-lg border border-[var(--cor-borda)] bg-[var(--cor-fundo-suave)] active:cursor-grabbing"
              >
                <RetryImage src={foto} alt={`Foto ${i + 1}`} fill unoptimized sizes="150px" className="object-cover" />

                {i === 0 && (
                  <span className="absolute left-1 top-1 rounded bg-[var(--cor-primaria)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--cor-primaria-texto)]">
                    Principal
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => removerFoto(i)}
                  aria-label={`Excluir foto ${i + 1}`}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white transition-opacity md:opacity-0 md:group-hover:opacity-100"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>

                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => tornarPrincipal(i)}
                    className="absolute bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white transition-opacity md:opacity-0 md:group-hover:opacity-100"
                  >
                    Principal
                  </button>
                )}

                <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 gap-1 md:hidden">
                  <button
                    type="button"
                    onClick={() => moverFoto(i, i - 1)}
                    disabled={i === 0}
                    aria-label="Mover para a esquerda"
                    className="flex h-6 w-6 items-center justify-center rounded bg-black/70 text-white disabled:opacity-30"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => moverFoto(i, i + 1)}
                    disabled={i === fotos.length - 1}
                    aria-label="Mover para a direita"
                    className="flex h-6 w-6 items-center justify-center rounded bg-black/70 text-white disabled:opacity-30"
                  >
                    →
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </fieldset>

      {/* Descrição */}
      <fieldset className="rounded-xl border border-[var(--cor-borda)] bg-white p-5">
        <legend className="px-2 text-sm font-semibold text-[var(--cor-texto)]">Descrição</legend>
        <textarea
          value={form.descricao}
          onChange={(e) => set('descricao', e.target.value)}
          rows={6}
          placeholder="Detalhes sobre a máquina, estado de conservação, opcionais…"
          className={inputClass}
        />
      </fieldset>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={salvando || enviandoFotos}
          className="rounded-lg bg-[var(--cor-primaria)] px-6 py-2.5 text-sm font-semibold text-[var(--cor-primaria-texto)] transition-colors hover:bg-[var(--cor-primaria-hover)] disabled:opacity-60"
        >
          {salvando ? 'Salvando…' : maquina ? 'Salvar alterações' : 'Cadastrar máquina'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="rounded-lg border border-[var(--cor-texto-suave)] bg-white px-6 py-2.5 text-sm font-medium text-[var(--cor-texto-suave)] transition-colors hover:bg-[var(--cor-fundo-suave)]"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
