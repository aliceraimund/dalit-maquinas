import Link from 'next/link'
import FilterTabs from '@/components/FilterTabs'
import Footer from '@/components/Footer'
import MaquinaCard from '@/components/MaquinaCard'
import RetryImage from '@/components/RetryImage'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import { createClient } from '@/lib/supabase/server'
import { CATEGORIA_LABELS } from '@/lib/utils'
import type { Categoria, DisponivelPara, Maquina } from '@/types/maquina'

export const dynamic = 'force-dynamic'

const WHATSAPP = '5511995998514'
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

const DIFERENCIAIS = [
  {
    titulo: 'Frete para todo o Brasil',
    texto: 'Bons preços de frete com seguro para qualquer região do país.',
    icone: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M1 8h13v8H1zM14 10h4l3 3v3h-7z" />
        <circle cx="5" cy="18" r="2" />
        <circle cx="17" cy="18" r="2" />
      </svg>
    ),
  },
  {
    titulo: 'Vistoria técnica presencial',
    texto: 'Inspecione o equipamento no local ou envie uma assistência técnica de sua confiança.',
    icone: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35M8 11h6M11 8v6" />
      </svg>
    ),
  },
  {
    titulo: 'Serviços especializados',
    texto: 'Revisão, instalação, start-up e contrato de manutenção preventiva.',
    icone: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    titulo: 'Negociação direta',
    texto: 'Atendimento rápido pelo WhatsApp para venda e locação, sem intermediários.',
    icone: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  },
]

interface HomeProps {
  searchParams: Promise<{ categoria?: string; modalidade?: string; q?: string }>
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams

  const categoria = CATEGORIAS_VALIDAS.includes(params.categoria as Categoria)
    ? (params.categoria as Categoria)
    : null
  const modalidade = MODALIDADES_VALIDAS.includes(params.modalidade as DisponivelPara)
    ? (params.modalidade as DisponivelPara)
    : null
  // Sanitiza a busca: caracteres com significado na sintaxe .or() do PostgREST
  const busca = (params.q ?? '').replace(/[,()%\\]/g, '').trim().slice(0, 80)

  const supabase = await createClient()

  let query = supabase
    .from('maquinas')
    .select('*')
    .eq('publicado', true)
    .order('destaque', { ascending: false })
    .order('criado_em', { ascending: false })

  if (categoria) query = query.contains('categorias', [categoria])
  if (modalidade) query = query.in('disponivel_para', [modalidade, 'ambos'])
  if (busca) {
    query = query.or(
      `nome.ilike.%${busca}%,tipo.ilike.%${busca}%,marca.ilike.%${busca}%,modelo.ilike.%${busca}%`
    )
  }

  const { data } = await query
  const maquinas = (data ?? []) as Maquina[]

  const filtrosAtivos = Boolean(categoria || modalidade || busca)

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="hero-bg text-white">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-14 sm:pt-20">
          <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-[var(--cor-acento)]">
                Gera Brasil
              </p>
              <h1 className="mt-3 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                Quando tudo para, você precisa de uma
                <span className="block text-[#A9D6F5] [text-shadow:0_0_28px_rgba(147,197,253,0.55)]">
                  Solução que Funciona
                </span>
              </h1>
              <p className="mt-4 text-lg font-medium text-white/90 sm:text-xl">
                Soluções em grupos <strong className="font-bold text-white">geradores de alta capacidade</strong> para
                hospitais, indústrias e condomínios.
              </p>

              <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/80">
                {[
                  'Atendimento em todo o Brasil',
                  'Frete com seguro',
                  'Vistoria técnica presencial',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-1.5">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--cor-acento)" strokeWidth="3" aria-hidden="true">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#catalogo"
                  className="rounded-lg bg-[var(--cor-acento)] px-6 py-3 font-bold text-[var(--cor-acento-texto)] shadow-lg transition-colors hover:bg-[var(--cor-acento-hover)]"
                >
                  Ver equipamentos
                </a>
                <a
                  href={`https://wa.me/${WHATSAPP}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-[var(--cor-primaria)] shadow-lg transition-colors hover:bg-gray-100"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                  </svg>
                  Falar no WhatsApp
                </a>
              </div>
            </div>

            <div className="shrink-0 self-center md:self-auto">
              {/* Brilho branco acompanhando o contorno da logo (a escrita é azul,
                  da cor do fundo) — sem balão, integrado ao gradiente do hero */}
              <RetryImage
                src="/logo.png"
                alt="GeraBrasil"
                width={420}
                height={280}
                unoptimized
                priority
                className="h-auto w-72 sm:w-96 [filter:drop-shadow(0_0_10px_rgba(255,255,255,0.9))_drop-shadow(0_2px_30px_rgba(255,255,255,0.55))]"
                fallback={
                  <span className="block py-6 text-center text-2xl font-black tracking-tight text-white">
                    GERA BRASIL
                  </span>
                }
              />
            </div>
          </div>

          {/* Cards das áreas atendidas (filtro rápido) — claros, pois ficam
              na zona esmaecida do hero */}
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {CATEGORIAS_VALIDAS.map((cat) => (
              <Link
                key={cat}
                href={`/?categoria=${cat}#catalogo`}
                className="group flex items-center gap-3 rounded-xl border border-[var(--cor-borda)] bg-white/90 p-4 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-[var(--cor-primaria)] hover:shadow-md"
              >
                <span className="text-[var(--cor-primaria)]">{ICONES_CATEGORIA[cat]}</span>
                <p className="font-bold text-[var(--cor-texto)]">{CATEGORIA_LABELS[cat]}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FilterTabs categoriaAtiva={categoria} modalidadeAtiva={modalidade} busca={busca} />

      <main id="catalogo" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {maquinas.length === 0 ? (
          <div className="mx-auto my-10 max-w-md rounded-2xl border border-dashed border-[var(--cor-borda)] bg-[var(--cor-fundo-suave)] p-10 text-center">
            <svg className="mx-auto text-[var(--cor-texto-suave)]" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
            <p className="mt-4 font-bold text-[var(--cor-texto)]">
              {busca
                ? 'Nenhum equipamento encontrado para esta busca'
                : 'Em breve novos equipamentos nesta categoria'}
            </p>
            <p className="mt-1 text-sm text-[var(--cor-texto-suave)]">
              Fale com a gente — podemos encontrar o equipamento certo para a sua necessidade.
            </p>
            <div className="mt-5 flex flex-col items-center gap-2">
              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1FB955]"
              >
                Falar no WhatsApp
              </a>
              {filtrosAtivos && (
                <Link href="/" className="text-sm text-[var(--cor-texto-suave)] underline hover:text-[var(--cor-texto)]">
                  Limpar filtros
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {maquinas.map((maquina) => (
              <MaquinaCard key={maquina.id} maquina={maquina} />
            ))}
          </div>
        )}
      </main>

      {/* Diferenciais */}
      <section className="border-t border-[var(--cor-borda)] bg-[var(--cor-fundo-suave)]">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-center text-2xl font-extrabold tracking-tight text-[var(--cor-texto)]">
            Por que comprar com a Gera Brasil?
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {DIFERENCIAIS.map(({ titulo, texto, icone }) => (
              <div key={titulo} className="rounded-2xl border border-[var(--cor-borda)] bg-white p-5 shadow-sm">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--cor-acento)] text-[var(--cor-acento-texto)]">
                  {icone}
                </span>
                <p className="mt-3 font-bold text-[var(--cor-texto)]">{titulo}</p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--cor-texto-suave)]">{texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
