import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import LetterContent from '@/components/letter/LetterContent'

export default async function LetterPage({ params }) {
  // ✅ 1. Await the params Promise (Next.js 15+)
  const { slug } = await params

  // ✅ 2. Await the server client (it returns a Promise)
  const supabase = await createClient()

  // Fetch the letter
  const { data: letter, error } = await supabase
    .from('letters')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error || !letter) {
    notFound()
  }

  // Count verified signatures for this letter
  const { count: totalSignatures } = await supabase
    .from('signatures')
    .select('*', { count: 'exact', head: true })
    .eq('letter_id', letter.id)
    .eq('verified', true)

  // Fetch first 12 verified signatures
  const { data: initialSignatures } = await supabase
    .from('signatures')
    .select('id, full_name, country, honors, verified, email')
    .eq('letter_id', letter.id)
    .eq('verified', true)
    .order('created_at', { ascending: false })
    .limit(12)

  return (
    <LetterContent
      letter={letter}
      totalSignatures={totalSignatures || 0}
      initialSignatures={initialSignatures || []}
    />
  )
}