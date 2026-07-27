import Link from 'next/link'
import { CATEGORIA_LABELS } from '@/lib/utils'
import type { Categoria } from '@/types/maquina'

const WHATSAPP = '5511995998514'
const CATEGORIAS: Categoria[] = ['construcao', 'industrial', 'agricola', 'transporte']

export default function Footer() {
  return (
    <footer className="bg-[var(--cor-nav-fundo)] text-[var(--cor-nav-texto)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="text-xl font-extrabold tracking-tight">Gera Peças</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-400">
            Especialistas em geradores de energia e máquinas pesadas. Venda, locação, revisão,
            instalação e manutenção, com frete para todo o Brasil.
          </p>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-gray-300">Contato</p>
          <ul className="mt-3 space-y-2 text-sm text-gray-400">
            <li>
              <a href="tel:+5511968278192" className="transition-colors hover:text-white">
                (11) 96827-8192
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
              >
                WhatsApp: (11) 99599-8514
              </a>
            </li>
            <li>
              <a href="mailto:talita@gerapecasbrasil.com.br" className="transition-colors hover:text-white">
                talita@gerapecasbrasil.com.br
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-gray-300">Equipamentos</p>
          <ul className="mt-3 space-y-2 text-sm text-gray-400">
            {CATEGORIAS.map((cat) => (
              <li key={cat}>
                <Link href={`/?categoria=${cat}`} className="transition-colors hover:text-white">
                  {CATEGORIA_LABELS[cat]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-5 text-center text-xs text-gray-500 sm:flex-row sm:justify-between sm:text-left">
          <p>© {new Date().getFullYear()} Gera Peças. Todos os direitos reservados.</p>
          <Link href="/admin/login" className="transition-colors hover:text-white">
            Área administrativa
          </Link>
        </div>
      </div>
    </footer>
  )
}
