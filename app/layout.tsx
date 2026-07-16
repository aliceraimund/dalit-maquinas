import type { Metadata } from 'next'
import './globals.css'

const SITE_URL = 'https://gerapecas.vercel.app'
const NOME_EMPRESA = 'Gera Peças'
const DESCRICAO =
  'Quando tudo para, você precisa de uma solução que funciona. Grupos geradores de alta capacidade para hospitais, indústrias e condomínios: venda, locação e manutenção.'

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
  telephone: '(11) 2668-0200',
  email: 'contato@gerabrasil.com',
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
