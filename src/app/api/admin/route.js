import { createAdminClient, createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

async function checkAdmin(supabase) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  const adminClient = createAdminClient()
  const { data } = await adminClient.from('admin_users').select('user_id').eq('user_id', user.id).single()
  return !!data
}

export async function GET(request) {
  const supabase = createClient()
  const isAdmin = await checkAdmin(supabase)
  if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const adminClient = createAdminClient()
  const { data: signatures } = await adminClient.from('signatures').select('*').order('created_at', { ascending: false })
  return NextResponse.json({ signatures })
}

export async function DELETE(request) {
  const supabase = createClient()
  const isAdmin = await checkAdmin(supabase)
  if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await request.json()
  const adminClient = createAdminClient()
  await adminClient.from('signatures').delete().eq('id', id)
  return NextResponse.json({ success: true })
}