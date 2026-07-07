'use client'

import Image, { type ImageProps } from 'next/image'
import { useEffect, useRef, useState, type ReactNode } from 'react'

const RETRY_DELAYS_MS = [800, 2000, 4000]

interface RetryImageProps extends Omit<ImageProps, 'onError' | 'src'> {
  src: string
  fallback?: ReactNode
}

/**
 * Wrapper do next/image com retry automático em caso de falha de
 * carregamento (800ms, 2000ms, 4000ms). Após esgotar as tentativas,
 * renderiza o `fallback`.
 */
export default function RetryImage({ src, fallback, alt, ...props }: RetryImageProps) {
  const [attempt, setAttempt] = useState(0)
  const [failed, setFailed] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setAttempt(0)
    setFailed(false)
  }, [src])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  function handleError() {
    if (attempt >= RETRY_DELAYS_MS.length) {
      setFailed(true)
      return
    }
    timerRef.current = setTimeout(() => {
      setAttempt((a) => a + 1)
    }, RETRY_DELAYS_MS[attempt])
  }

  if (failed) {
    return (
      <>
        {fallback ?? (
          <div className="flex h-full w-full items-center justify-center bg-[var(--cor-fundo-suave)] text-[var(--cor-texto-suave)]">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
        )}
      </>
    )
  }

  const retrySrc = attempt === 0 ? src : `${src}${src.includes('?') ? '&' : '?'}retry=${attempt}`

  return <Image key={retrySrc} src={retrySrc} alt={alt} onError={handleError} {...props} />
}
