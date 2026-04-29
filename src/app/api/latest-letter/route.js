import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()

  const { data: letter } = await supabase
    .from('letters')
    .select('id, slug, title, subtitle, published_date, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!letter) {
    return NextResponse.json({ error: 'No letter found' }, { status: 404 })
  }

  const { count: signatureCount } = await supabase
    .from('signatures')
    .select('*', { count: 'exact', head: true })
    .eq('letter_id', letter.id)

  const { data: recentSigners } = await supabase
    .from('signatures')
    .select('full_name')
    .eq('letter_id', letter.id)
    .eq('verified', true)
    .order('created_at', { ascending: false })
    .limit(2)

  return NextResponse.json({
    ...letter,
    signatureCount,
    recentSigners: recentSigners?.map(s => s.full_name).join(' and ') || '',
  })
}