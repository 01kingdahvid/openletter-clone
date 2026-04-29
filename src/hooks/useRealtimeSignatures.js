import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useRealtimeSignatures(letterId, initialCount, initialRecent) {
  const [totalSignatures, setTotalSignatures] = useState(initialCount)
  const [recentSigners, setRecentSigners] = useState(initialRecent)

  // Stable supabase client ref — never recreated across renders
  const supabaseRef = useRef(null)
  if (!supabaseRef.current) {
    supabaseRef.current = createClient()
  }
  const supabase = supabaseRef.current

  useEffect(() => {
    if (!letterId) return

    const fetchData = async () => {
      const { count } = await supabase
        .from('signatures')
        .select('*', { count: 'exact', head: true })
        .eq('letter_id', letterId)
        

      const { data: recent } = await supabase
        .from('signatures')
        .select('full_name')
        .eq('letter_id', letterId)
        .eq('verified', true)
        .order('created_at', { ascending: false })
        .limit(2)

      setTotalSignatures(count || 0)
      setRecentSigners(recent?.map(s => s.full_name) || [])
    }

    fetchData()

    // ⚠️ Supabase realtime does NOT support filtering on boolean columns
    // in the channel filter string. So we listen for ALL inserts on this
    // letter and then check verified status in the handler.
    const channel = supabase
      .channel(`realtime-signatures-${letterId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // listen to INSERT and UPDATE (verified flips on UPDATE)
          schema: 'public',
          table: 'signatures',
          filter: `letter_id=eq.${letterId}`,
        },
        async () => {
          // Re-fetch authoritative count and recent signers from DB
          const { count } = await supabase
            .from('signatures')
            .select('*', { count: 'exact', head: true })
            .eq('letter_id', letterId)
            // .eq('verified', true)

          const { data: newRecent } = await supabase
            .from('signatures')
            .select('full_name')
            .eq('letter_id', letterId)
            .eq('verified', true)
            .order('created_at', { ascending: false })
            .limit(2)

          setTotalSignatures(count || 0)
          setRecentSigners(newRecent?.map(s => s.full_name) || [])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [letterId]) // supabase is stable via ref, safe to omit

  return { totalSignatures, recentSigners }
}