import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Footer from '@/components/Footer'
import ImageGallery from '@/components/ImageGallery'
import PriceDisplay from '@/components/PriceDisplay'
import ShareButton from '@/components/ShareButton'
import { createClient } from '@/lib/supabase/server'
import {
  CATEGORIA_LABELS,
  DISPONIVEL_COLORS,
  DISPONIVEL_LABELS,
  STATUS_COLORS,
  STATUS_LABELS,
  formatDate,
} from '@/lib/utils'
import type { Maquina } from '@/types/maquina'

const SITE_URL = 'https://gerapecas.vercel.app'
const WHATSAPP = '5511995998514'

interface MaquinaPageProps {
  params: Promise<{ id: string }>
}

async function getMaquina(id: string): Promise<Maquina | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('maquinas')
    .select('*')
    .eq('id', id)
    .eq('publicado', true)
    .maybeSingle()
  return data as Maquina | null
}

export async function generateMetadata({ params }: MaquinaPageProps): Promise<Metadata> {
  const { id } = await params
  const maquina = await getMaquina(id)
  if (!maquina) return { title: 'Máquina não encontrada' }

  const descricao =
    maquina.descricao?.slice(0, 160) ??
    `${maquina.tipo}${maquina.marca ? ` ${maquina.marca}` : ''}${maquina.modelo ? ` ${maquina.modelo}` : ''} — Gera Brasil`

  return {
    title: maquina.nome,
    description: descricao,
    openGraph: {
      title: maquina.nome,
      description: descricao,
      url: `${SITE_URL}/maquina/${maquina.id}`,
      type: 'website',
      images: maquina.fotos?.[0] ? [{ url: maquina.fotos[0] }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: maquina.nome,
      description: descricao,
      images: maquina.fotos?.[0] ? [maquina.fotos[0]] : undefined,
    },
  }
}

export default async function MaquinaPage({ params }: MaquinaPageProps) {
  const { id } = await params
  const maquina = await getMaquina(id)
  if (!maquina) notFound()

  const especificacoes: { label: string; valor: string }[] = [
    { label: 'Tipo', valor: maquina.tipo },
    maquina.categorias?.length
      ? {
          label: maquina.categorias.length > 1 ? 'Categorias' : 'Categoria',
          valor: maquina.categorias.map((c) => CATEGORIA_LABELS[c]).join(', '),
        }
      : null,
    maquina.marca ? { label: 'Marca', valor: maquina.marca } : null,
    maquina.modelo ? { label: 'Modelo', valor: maquina.modelo } : null,
    maquina.ano ? { label: 'Ano', valor: String(maquina.ano) } : null,
    maquina.horas_uso != null
      ? { label: 'Horas de uso', valor: `${new Intl.NumberFormat('pt-BR').format(maquina.horas_uso)} h` }
      : null,
    maquina.potencia ? { label: 'Potência', valor: maquina.potencia } : null,
    maquina.motor ? { label: 'Motor', valor: maquina.motor } : null,
    maquina.alternador ? { label: 'Alternador', valor: maquina.alternador } : null,
    maquina.capacidade ? { label: 'Capacidade', valor: maquina.capacidade } : null,
    maquina.peso_kg != null
      ? { label: 'Peso', valor: `${new Intl.NumberFormat('pt-BR').format(maquina.peso_kg)} kg` }
      : null,
    { label: 'Anunciado em', valor: formatDate(maquina.criado_em) },
  ].filter((e): e is { label: string; valor: string } => e !== null)

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: maquina.nome,
    description: maquina.descricao ?? maquina.tipo,
    image: maquina.fotos ?? [],
    brand: maquina.marca ? { '@type': 'Brand', name: maquina.marca } : undefined,
    model: maquina.modelo ?? undefined,
    offers:
      !maquina.venda_sob_consulta && maquina.preco_venda != null
        ? {
            '@type': 'Offer',
            price: maquina.preco_venda,
            priceCurrency: 'BRL',
            availability:
              maquina.status === 'disponivel'
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            url: `${SITE_URL}/maquina/${maquina.id}`,
          }
        : undefined,
  }

  const mensagemWhatsApp = encodeURIComponent(
    `Olá! Tenho interesse na máquina "${maquina.nome}" (${SITE_URL}/maquina/${maquina.id})`
  )

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <header className="bg-[var(--cor-nav-fundo)] text-[var(--cor-nav-texto)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-lg font-bold">
            {'Gera Brasil'}
          </Link>
          <Link
            href="/"
            className="text-sm text-gray-300 transition-colors hover:text-white"
          >
            ← Ver todas as máquinas
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Coluna esquerda */}
          <div>
            <ImageGallery fotos={maquina.fotos ?? []} alt={maquina.nome} />

            <div className="mt-6 flex flex-wrap gap-2">
              {maquina.destaque && (
                <span className="rounded-full bg-[var(--cor-primaria)] px-3 py-1 text-sm font-semibold text-[var(--cor-primaria-texto)]">
                  Destaque
                </span>
              )}
              {maquina.status && (
                <span className={`rounded-full px-3 py-1 text-sm font-semibold ${STATUS_COLORS[maquina.status]}`}>
                  {STATUS_LABELS[maquina.status]}
                </span>
              )}
              {maquina.disponivel_para && (
                <span className={`rounded-full px-3 py-1 text-sm font-semibold ${DISPONIVEL_COLORS[maquina.disponivel_para]}`}>
                  {DISPONIVEL_LABELS[maquina.disponivel_para]}
                </span>
              )}
            </div>

            <h1 className="mt-4 text-3xl font-bold text-[var(--cor-texto)]">{maquina.nome}</h1>

            <section className="mt-6">
              <h2 className="text-lg font-semibold text-[var(--cor-texto)]">Especificações</h2>
              <dl className="mt-3">
                {especificacoes.map(({ label, valor }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-4 border-b border-[var(--cor-borda)] py-2.5 text-sm"
                  >
                    <dt className="shrink-0 text-[var(--cor-texto-suave)]">{label}</dt>
                    <dd className="rounded-md bg-[var(--cor-fundo-suave)] px-2.5 py-1 text-right font-medium text-[var(--cor-texto)]">
                      {valor}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            {maquina.descricao && (
              <section className="mt-6">
                <h2 className="text-lg font-semibold text-[var(--cor-texto)]">Descrição</h2>
                <div className="mt-3 rounded-xl border border-[var(--cor-borda)] bg-[var(--cor-fundo-suave)] p-4 sm:p-5">
                  <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--cor-texto-suave)]">
                    {maquina.descricao}
                  </p>
                </div>
              </section>
            )}
          </div>

          {/* Coluna direita (sticky) */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="space-y-4 rounded-xl border border-[var(--cor-borda)] bg-white p-5 shadow-sm">
              <ShareButton />

              <div className="rounded-lg bg-[var(--cor-fundo-suave)] p-4">
                <PriceDisplay maquina={maquina} />
              </div>

              <a
                href={`https://wa.me/${WHATSAPP}?text=${mensagemWhatsApp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-3 font-semibold text-white transition-colors hover:bg-[#1FB955]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
                Falar no WhatsApp
              </a>

              <p className="text-center text-sm font-bold text-[var(--cor-texto)]">
                {'Gera Brasil'}
              </p>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}
