import { notFound } from 'next/navigation'
import AdminMaquinaForm from '@/components/AdminMaquinaForm'
import { createClient } from '@/lib/supabase/server'
import type { Maquina } from '@/types/maquina'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Admin — Editar máquina',
  robots: { index: false, follow: false },
}

interface EditarMaquinaPageProps {
  params: Promise<{ id: string }>
}

export default async function EditarMaquinaPage({ params }: EditarMaquinaPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('maquinas').select('*').eq('id', id).maybeSingle()

  if (!data) notFound()

  const maquina = data as Maquina

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--cor-texto)]">Editar máquina</h1>
      <p className="mt-1 text-sm text-[var(--cor-texto-suave)]">{maquina.nome}</p>
      <div className="mt-6">
        <AdminMaquinaForm maquina={maquina} />
      </div>
    </div>
  )
}
