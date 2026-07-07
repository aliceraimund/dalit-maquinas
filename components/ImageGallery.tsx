'use client'

import { useCallback, useEffect, useState } from 'react'
import RetryImage from '@/components/RetryImage'

interface ImageGalleryProps {
  fotos: string[]
  alt: string
}

export default function ImageGallery({ fotos, alt }: ImageGalleryProps) {
  const [atual, setAtual] = useState(0)
  const [lightboxAberto, setLightboxAberto] = useState(false)

  const anterior = useCallback(() => {
    setAtual((i) => (i - 1 + fotos.length) % fotos.length)
  }, [fotos.length])

  const proxima = useCallback(() => {
    setAtual((i) => (i + 1) % fotos.length)
  }, [fotos.length])

  useEffect(() => {
    if (!lightboxAberto) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setLightboxAberto(false)
      if (e.key === 'ArrowLeft') anterior()
      if (e.key === 'ArrowRight') proxima()
    }

    window.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [lightboxAberto, anterior, proxima])

  if (fotos.length === 0) {
    return (
      <div className="flex aspect-[4/3] w-full items-center justify-center rounded-xl border border-[var(--cor-borda)] bg-[var(--cor-fundo-suave)] text-[var(--cor-texto-suave)]">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
      </div>
    )
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setLightboxAberto(true)}
        className="relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-xl border border-[var(--cor-borda)] bg-[var(--cor-fundo-suave)]"
        aria-label="Ampliar foto"
      >
        <RetryImage
          src={fotos[atual]}
          alt={`${alt} — foto ${atual + 1} de ${fotos.length}`}
          fill
          unoptimized
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
          priority
        />
      </button>

      {fotos.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6">
          {fotos.map((foto, i) => (
            <button
              key={foto}
              type="button"
              onClick={() => setAtual(i)}
              className={`relative aspect-square overflow-hidden rounded-lg border-2 bg-[var(--cor-fundo-suave)] transition-colors ${
                i === atual ? 'border-[var(--cor-primaria)]' : 'border-transparent hover:border-[var(--cor-borda)]'
              }`}
              aria-label={`Ver foto ${i + 1}`}
            >
              <RetryImage
                src={foto}
                alt=""
                fill
                unoptimized
                sizes="100px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {lightboxAberto && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxAberto(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxAberto(false)}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Fechar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          {fotos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  anterior()
                }}
                className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label="Foto anterior"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  proxima()
                }}
                className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label="Próxima foto"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </>
          )}

          <div
            className="relative h-[85vh] w-[92vw] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <RetryImage
              src={fotos[atual]}
              alt={`${alt} — foto ${atual + 1} de ${fotos.length}`}
              fill
              unoptimized
              sizes="92vw"
              className="object-contain"
            />
          </div>

          {fotos.length > 1 && (
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm text-white">
              {atual + 1} / {fotos.length}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
