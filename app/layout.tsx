import type { Metadata } from 'next'
import './globals.css'

const SITE_URL = '{{SITE_URL}}'
const NOME_EMPRESA = '{{NOME_EMPRESA}}'
const DESCRICAO =
  'Venda e locação de máquinas e equipamentos para construção, indústria, agricultura e transporte. Qualidade e confiança para o seu negócio.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL.startsWith('http') ? SITE_URL : 'http://localhost:3000'),
  title: {
    default: NOME_EMPRESA,
    template: `%s | ${NOME_EMPRESA}`,
  },
  description: DESCRICAO,
  openGraph: {
    type: 'website',
    siteName: NOME_EMPRESA,
    title: NOME_EMPRESA,
    description: DESCRICAO,
    url: SITE_URL,
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: NOME_EMPRESA,
    description: DESCRICAO,
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: NOME_EMPRESA,
  url: SITE_URL,
  telephone: '{{TELEFONE}}',
  email: '{{EMAIL}}',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
      </body>
    </html>
  )
}
