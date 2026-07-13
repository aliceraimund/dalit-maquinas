import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[var(--cor-nav-fundo)] text-[var(--cor-nav-texto)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="text-lg font-bold">{'GeraPeças Brasil'}</p>
          <p className="mt-1 text-sm text-gray-400">
            Tel: {'(11) 2668-0200'} · E-mail: {'contato@gerabrasil.com'}
          </p>
        </div>
        <div className="text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} {'GeraPeças Brasil'}. Todos os direitos reservados.
          </p>
          <p className="mt-1">
            <Link href="/admin/login" className="text-gray-500 transition-colors hover:text-white">
              Área administrativa
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
