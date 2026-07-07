import { redirect } from 'next/navigation'
import AdminNav from '@/components/AdminNav'
import { createClient } from '@/lib/supabase/server'

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[var(--cor-fundo-suave)]">
      <AdminNav email={user.email ?? ''} />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  )
}
