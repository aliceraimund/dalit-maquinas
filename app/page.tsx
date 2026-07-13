import FilterTabs from '@/components/FilterTabs'
import Footer from '@/components/Footer'
import MaquinaCard from '@/components/MaquinaCard'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import { createClient } from '@/lib/supabase/server'
import { CATEGORIA_LABELS } from '@/lib/utils'
import type { Categoria, DisponivelPara, Maquina } from '@/types/maquina'

export const dynamic = 'force-dynamic'

const CATEGORIAS_VALIDAS: Categoria[] = ['construcao', 'industrial', 'agricola', 'transporte']
const MODALIDADES_VALIDAS: DisponivelPara[] = ['venda', 'locacao']

const ICONES_CATEGORIA: Record<Categoria, React.ReactNode> = {
  construcao: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M2 20h20M4 20V9l6-3v14M10 9h8a2 2 0 0 1 2 2v9M13 12v2m4-2v2" />
    </svg>
  ),
  industrial: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M2 20h20M4 20V10l5 4v-4l5 4v-4l6 4v6M7 7V4h3v3" />
    </svg>
  ),
  agricola: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="7" cy="17" r="4" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="M7 13V7h6l2 6M13 7h4l1.5 8M4 7h3" />
    </svg>
  ),
  transporte: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M1 8h13v8H1zM14 10h4l3 3v3h-7z" />
      <circle cx="5" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  ),
}

interface HomeProps {
  searchParams: Promise<{ categoria?: string; modalidade?: string }>
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams

  const categoria = CATEGORIAS_VALIDAS.includes(params.categoria as Categoria)
    ? (params.categoria as Categoria)
    : null
  const modalidade = MODALIDADES_VALIDAS.includes(params.modalidade as DisponivelPara)
    ? (params.modalidade as DisponivelPara)
    : null

  const supabase = await createClient()

  let query = supabase
    .from('maquinas')
    .select('*')
    .eq('publicado', true)
    .order('destaque', { ascending: false })
    .order('criado_em', { ascending: false })

  if (categoria) query = query.contains('categorias', [categoria])
  if (modalidade) query = query.in('disponivel_para', [modalidade, 'ambos'])

  const { data } = await query
  const maquinas = (data ?? []) as Maquina[]

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="bg-[var(--cor-primaria)] text-[var(--cor-primaria-texto)]">
        <div className="mx-auto max-w-6xl px-4 py-14 text-left sm:py-20">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{'GeraPeças Brasil'}</h1>
          <p className="mt-3 max-w-2xl text-lg font-medium sm:text-xl">{'Especialistas em geradores de energia — venda, locação e manutenção'}</p>
          <div className="mt-8 flex flex-wrap items-start justify-start gap-6 sm:gap-10">
            {CATEGORIAS_VALIDAS.map((cat) => (
              <div key={cat} className="flex flex-col items-center gap-1.5">
                {ICONES_CATEGORIA[cat]}
                <span className="text-xs font-semibold uppercase tracking-wide">
                  {CATEGORIA_LABELS[cat]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FilterTabs categoriaAtiva={categoria} modalidadeAtiva={modalidade} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {maquinas.length === 0 ? (
          <p className="py-16 text-center text-[var(--cor-texto-suave)]">
            Nenhuma máquina encontrada com os filtros selecionados.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {maquinas.map((maquina) => (
              <MaquinaCard key={maquina.id} maquina={maquina} />
            ))}
          </div>
        )}
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
