'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErro(null)
    setCarregando(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })

    setCarregando(false)

    if (error) {
      setErro('E-mail ou senha inválidos.')
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--cor-fundo-suave)] px-4">
      <div className="w-full max-w-sm rounded-xl border border-[var(--cor-borda)] bg-white p-8 shadow-sm">
        <h1 className="text-center text-2xl font-bold text-[var(--cor-texto)]">
          {'Gera Brasil'}
        </h1>
        <p className="mt-1 text-center text-sm text-[var(--cor-texto-suave)]">Área administrativa</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {erro && (
            <p className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
              {erro}
            </p>
          )}
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-[var(--cor-texto-suave)]">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-[var(--cor-borda)] px-3 py-2 text-sm outline-none transition-colors focus:border-[var(--cor-primaria)]"
            />
          </div>
          <div>
            <label htmlFor="senha" className="mb-1 block text-sm font-medium text-[var(--cor-texto-suave)]">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              required
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full rounded-lg border border-[var(--cor-borda)] px-3 py-2 text-sm outline-none transition-colors focus:border-[var(--cor-primaria)]"
            />
          </div>
          <button
            type="submit"
            disabled={carregando}
            className="w-full rounded-lg bg-[var(--cor-primaria)] px-4 py-2.5 font-semibold text-[var(--cor-primaria-texto)] transition-colors hover:bg-[var(--cor-primaria-hover)] disabled:opacity-60"
          >
            {carregando ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <p className="mt-6 text-center">
          <Link href="/" className="text-sm text-[var(--cor-texto-suave)] hover:underline">
            ← Voltar ao site
          </Link>
        </p>
      </div>
    </div>
  )
}
