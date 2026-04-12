import { createClient, createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import UserTable from '@/components/admin/UserTable'

export const metadata = { title: 'Admin | OpenLetter' }

export default async function AdminPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const adminClient = createAdminClient()
  const { data: adminCheck } = await adminClient
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .single()

  if (!adminCheck) redirect('/')

  const { data: signatures } = await adminClient
    .from('signatures')
    .select('*')
    .order('created_at', { ascending: false })

  return <UserTable signatures={signatures} />
}