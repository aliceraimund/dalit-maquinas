'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface AdminNavProps {
  email: string
}

export default function AdminNav({ email }: AdminNavProps) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <header className="bg-[var(--cor-nav-fundo)] text-[var(--cor-nav-texto)]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="text-lg font-bold">
            {'{{NOME_EMPRESA}}'}
          </Link>
          <Link
            href="/admin"
            className="text-sm text-gray-300 transition-colors hover:text-[var(--cor-primaria)]"
          >
            Máquinas
          </Link>
          <Link
            href="/"
            target="_blank"
            className="text-sm text-gray-300 transition-colors hover:text-[var(--cor-primaria)]"
          >
            Ver site
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-gray-400 sm:inline">{email}</span>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-gray-600 px-3 py-1.5 text-sm text-gray-300 transition-colors hover:border-[var(--cor-primaria)] hover:text-[var(--cor-primaria)]"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  )
}
