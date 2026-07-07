'use client'

import { useState } from 'react'

export default function ShareButton() {
  const [copiado, setCopiado] = useState(false)

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      // Clipboard indisponível (ex: contexto não seguro) — ignora
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--cor-texto-suave)] bg-white px-4 py-2 text-sm font-medium text-[var(--cor-texto-suave)] transition-colors hover:bg-[var(--cor-fundo-suave)]"
    >
      {copiado ? (
        'Link copiado!'
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <path d="m8.59 13.51 6.83 3.98m-.01-10.98-6.82 3.98" />
          </svg>
          Compartilhar
        </>
      )}
    </button>
  )
}
