import ProfileCard from '@/components/dashboard/ProileCard'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
// import ProfileCard from '@/components/dashboard/ProfileCard'

export const metadata = { title: 'Dashboard | OpenLetter' }

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: signature } = await supabase
    .from('signatures')
    .select('*')
    .eq('email', user.email)
    .single()

  return <ProfileCard user={user} profile={profile} signature={signature} />
}