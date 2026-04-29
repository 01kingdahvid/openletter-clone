// app/api/social-verify/[platform]/route.js
// Server-side handler for social verification via OAuth
// In production: use Supabase OAuth provider or your own OAuth flow.
// This stub shows the upsert pattern once you have the OAuth token.
// ============================================================
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
 
export async function POST(request, { params }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
 
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
 
  const platform = params.platform
  const validPlatforms = ['twitter', 'instagram', 'facebook', 'linkedin']
 
  if (!validPlatforms.includes(platform)) {
    return NextResponse.json({ error: 'Invalid platform' }, { status: 400 })
  }
 
  const body = await request.json()
  const { platform_user_id, handle, profile_url, follower_count } = body
 
  if (!platform_user_id || !handle) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
 
  // Upsert social verification
  const { data, error } = await supabase
    .from('social_verifications')
    .upsert({
      user_id:          user.id,
      platform,
      platform_user_id,
      handle,
      profile_url:      profile_url ?? null,
      follower_count:   follower_count ?? null,
      verified_at:      new Date().toISOString()
    }, {
      onConflict: 'user_id,platform'
    })
    .select()
    .single()
 
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
 
  // Update profile handle field too (for display)
  await supabase
    .from('profiles')
    .update({ [platform]: handle })
    .eq('id', user.id)
 
  return NextResponse.json({ success: true, verification: data })
}
 
export async function DELETE(request, { params }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
 
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
 
  const platform = params.platform
 
  const { error } = await supabase
    .from('social_verifications')
    .delete()
    .eq('user_id', user.id)
    .eq('platform', platform)
 
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
 
  return NextResponse.json({ success: true })
}