import UserDashboardClient from '@/components/dashboard/UserDashboardClient'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

 
export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')
 
  const [{ data: profile }, { data: signatures }, { data: socialVerifications }, { data: reviewsGiven }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('signatures').select('*, letters(title, slug)').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('social_verifications').select('*').eq('user_id', user.id),
    supabase.from('peer_reviews').select('id, created_at').eq('reviewer_id', user.id)
  ])
 
  return <UserDashboardClient
    user={user}
    profile={profile}
    signatures={signatures ?? []}
    socialVerifications={socialVerifications ?? []}
    reviewCount={reviewsGiven?.length ?? 0}
  />
}