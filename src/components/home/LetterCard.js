// components/home/LetterCard.js
import { createClient } from '@/lib/supabase/server'
import LetterCardClient from './LetterCardClient'

export default async function LetterCard() {
  const supabase = await createClient()

  const { data: letter, error } = await supabase
    .from('letters')
    .select('id, slug, title, subtitle, context_text, published_date, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error('Supabase error in LetterCard:', error)
    return <div>Error loading letter</div>
  }

  if (!letter) {
    return <div>No published letter found</div>
  }

  // Fetch total verified signatures for this letter
  const { count: signatureCount } = await supabase
    .from('signatures')
    .select('*', { count: 'exact', head: true })
    .eq('letter_id', letter.id)
    .eq('verified', true)

  // Fetch two most recent signers for the "recent" line
  const { data: recentSigners } = await supabase
    .from('signatures')
    .select('full_name')
    .eq('letter_id', letter.id)
    .eq('verified', true)
    .order('created_at', { ascending: false })
    .limit(2)

  const recentNames = recentSigners?.map(s => s.full_name).join(' and ') || ''

  // Format date
  const displayDate = letter.published_date
    ? new Date(letter.published_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date(letter.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

  // Create a short excerpt (first 250–300 characters)
  const contextExcerpt = letter.context_text
    ? letter.context_text.slice(0, 260) + '…'
    : ''

  return (
    <LetterCardClient
      letterId={letter.id}
      letterSlug={letter.slug}
      letterTitle={letter.title}
      letterSubtitle={letter.subtitle}
      displayDate={displayDate}
      signatureCount={signatureCount || 0}
      recentSigners={recentNames}
      contextExcerpt={contextExcerpt}
    />
  )
}