import AdminMaquinaForm from '@/components/AdminMaquinaForm'

export const metadata = {
  title: 'Admin | Nova máquina',
  robots: { index: false, follow: false },
}

export default function NovaMaquinaPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--cor-texto)]">Nova máquina</h1>
      <div className="mt-6">
        <AdminMaquinaForm />
      </div>
    </div>
  )
}
