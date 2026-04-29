'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import styles from './LetterContent.module.css'
import SignatureForm from '@/components/letter/SignatureForm'
import { useRealtimeSignatures } from '@/hooks/useRealtimeSignatures'

const obfuscateEmail = email => {
  const [localPart, domain] = email.split('@')
  if (!domain) return email
  const obfuscatedLocal = '*'.repeat(Math.min(localPart.length, 8))
  return `${obfuscatedLocal}@${domain}`
}

export default function LetterContent ({
  letter,
  totalSignatures: initialTotal,
  initialSignatures
}) {
  const supabase = createClient()

  // Real-time signature count & recent signers
  const { totalSignatures: realtimeTotal, recentSigners } =
    useRealtimeSignatures(
      letter.id,
      initialTotal,
      initialSignatures.slice(0, 2).map(s => s.full_name)
    )

  // Rest of your state...
  const [signatures, setSignatures] = useState(initialSignatures)
  const [filteredSignatures, setFilteredSignatures] = useState([])
  const [visibleCount, setVisibleCount] = useState(12)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [selectedSignature, setSelectedSignature] = useState(null)
  const [showSignForm, setShowSignForm] = useState(false)
  const [showStickyBar, setShowStickyBar] = useState(false)
  const imageCardRef = useRef(null)

  // Fetch signatures (unchanged)...
  const fetchSignatures = useCallback(
    async (search, filter, pageNum) => {
      let query = supabase
        .from('signatures')
        .select('id, full_name, country, honors, verified, email')
        .eq('letter_id', letter.id)
        .eq('verified', true)

      if (filter === 'verified') query = query.eq('verified', true)
      if (search.trim()) query = query.ilike('full_name', `%${search}%`)

      const from = (pageNum - 1) * 12
      const to = from + 11
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to)

      if (error) {
        console.error('Error fetching signatures:', error)
        return { data: [], count: 0 }
      }
      return { data, count: count || 0 }
    },
    [supabase, letter.id]
  )

  // Filter/search effect (unchanged)...
  useEffect(() => {
    const loadFiltered = async () => {
      setIsLoadingMore(true)
      const { data } = await fetchSignatures(searchTerm, filterType, 1)
      setSignatures(data)
      setFilteredSignatures(data)
      setVisibleCount(12)
      setPage(1)
      setHasMore(data.length === 12)
      setIsLoadingMore(false)
    }
    loadFiltered()
  }, [searchTerm, filterType, fetchSignatures])

  const visibleSignatures = signatures.slice(0, visibleCount)

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return
    setIsLoadingMore(true)
    const nextPage = page + 1
    const { data: newSigs } = await fetchSignatures(
      searchTerm,
      filterType,
      nextPage
    )
    if (newSigs.length > 0) {
      setSignatures(prev => [...prev, ...newSigs])
      setPage(nextPage)
      setVisibleCount(prev => prev + newSigs.length)
      setHasMore(newSigs.length === 12)
    } else {
      setHasMore(false)
    }
    setIsLoadingMore(false)
  }, [isLoadingMore, hasMore, page, searchTerm, filterType, fetchSignatures])

  const observerRef = useRef(null)
  const lastSignatureElementRef = useCallback(
    node => {
      if (isLoadingMore) return
      if (observerRef.current) observerRef.current.disconnect()
      observerRef.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) loadMore()
      })
      if (node) observerRef.current.observe(node)
    },
    [isLoadingMore, hasMore, loadMore]
  )

  useEffect(() => {
    const currentCard = imageCardRef.current
    if (!currentCard) return
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-48px 0px 0px 0px' }
    )
    observer.observe(currentCard)
    return () => observer.disconnect()
  }, [])

  const displayDate = letter.published_date
    ? new Date(letter.published_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : new Date(letter.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })

  const reasonsList = Array.isArray(letter.reasons) ? letter.reasons : []

  return (
    <main className={styles.container}>
      {/* Image Card */}
      <div className={styles.imageCard} ref={imageCardRef}>
        <div className={styles.mapImageWrapper}>
          <img
            src='/map-placeholder.jpg'
            alt='World map'
            className={styles.mapImage}
            onError={e =>
              (e.target.src =
                'https://placehold.co/1200x600/2c3e50/ffffff?text=World+Map')
            }
          />
        </div>
        <div className={styles.signatureOverlay}>
          <div className={styles.signatureStats}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <span className={styles.signatureCount}>
                {realtimeTotal.toLocaleString()} signatures {/* ✅ fixed */}
              </span>
              <button
                onClick={() => setShowSignForm(true)}
                className={styles.signButtonSmall}
              >
                Sign this letter
              </button>
            </div>
            <div className={styles.notableSigners}>
              {recentSigners.join(' and ')} have signed {/* ✅ fixed */}
            </div>
          </div>
        </div>
      </div>

      {/* Context Section */}
      <div className={styles.contextSection}>
        <div className={styles.date}>{displayDate}</div>
        <h1 className={styles.title}>{letter.title}</h1>
        <h2 className={styles.subtitle}>{letter.subtitle}</h2>
        <p className={styles.contextText}>
          <strong>Context:</strong> {letter.context_text}
        </p>
      </div>

      {/* Statement Container */}
      <div className={styles.statementContainer}>
        <div className={styles.statementHeading}>Statement</div>
        <div className={styles.statementContent}>
          <p className={styles.statementText}>{letter.statement_text}</p>
        </div>
      </div>

      {/* Reasons Container */}
      <div className={styles.reasonsContainer}>
        <p className={styles.reasonsIntro}>
          <strong>Reasons:</strong> {letter.reasons_intro}
        </p>
        <ul className={styles.reasonsList}>
          {reasonsList.length > 0 ? (
            reasonsList.map((reason, idx) => (
              <li key={idx}>
                <strong>{reason?.title || '—'}:</strong>{' '}
                {reason?.description || ''}
              </li>
            ))
          ) : (
            <li>No reasons available</li>
          )}
        </ul>
      </div>

      {/* Signature Section */}
      <div className={styles.signaturesSection}>
        <div className={styles.signaturesHeader}>
          <div className={styles.totalSignatures}>
            {realtimeTotal.toLocaleString()} signatures {/* ✅ fixed */}
          </div>
          <div className={styles.controlsRow}>
            <input
              type='text'
              placeholder='Search by name...'
              className={styles.searchInput}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <select
              className={styles.filterSelect}
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
            >
              <option value='all'>All signers</option>
              <option value='verified'>Verified only</option>
            </select>
          </div>
        </div>

        <div className={styles.signaturesList}>
          {visibleSignatures.map((sig, idx) => {
            const isLast = idx === visibleSignatures.length - 1
            return (
              <div
                key={sig.id}
                className={styles.signatureCard}
                ref={isLast ? lastSignatureElementRef : null}
                onClick={() => setSelectedSignature(sig)}
              >
                <div className={styles.signatureAvatar}>
                  {sig.verified && (
                    <span className={styles.verifiedBadge} title='Verified'>
                      ✓
                    </span>
                  )}
                  {!sig.verified && (
                    <span className={styles.unverifiedBadge}></span>
                  )}
                </div>
                <div className={styles.signatureInfo}>
                  <div className={styles.signatureName}>{sig.full_name}</div>
                  <div className={styles.signatureCountry}>
                    {sig.country || '—'}
                  </div>
                  <div className={styles.signatureHonors}>
                    {sig.honors || '—'}
                  </div>
                </div>
              </div>
            )
          })}
          {isLoadingMore && (
            <div className={styles.loadingSpinner}>
              <div className={styles.spinner}></div>
              <span>Loading more signatures...</span>
            </div>
          )}
          {!hasMore && signatures.length > 0 && (
            <div className={styles.endMessage}>— End of signatures —</div>
          )}
          {signatures.length === 0 && !isLoadingMore && (
            <div className={styles.noResults}>No matching signatures found</div>
          )}
        </div>
      </div>

      {/* Sticky Bar */}
      {showStickyBar && (
        <div className={styles.stickyBar}>
          <div className={styles.stickyLeft}>
            <span className={styles.stickyCount}>
              {realtimeTotal.toLocaleString()} <br /> signatures{' '}
              {/* ✅ fixed */}
            </span>
            <div className={styles.stickyBorder}></div>
          </div>
          <button
            onClick={() => setShowSignForm(true)}
            className={styles.stickySignButton}
          >
            Sign this letter
          </button>
        </div>
      )}

      {/* Signature Form Modal */}
      {showSignForm && (
        <SignatureForm
          open={showSignForm}
          onClose={() => setShowSignForm(false)}
          letterId={letter.id}
        />
      )}

      {/* Signature Detail Modal */}
      {selectedSignature && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedSignature(null)}
        >
          <div
            className={styles.modalContent}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div className={styles.modalVerified}>
                {selectedSignature.verified && (
                  <span className={styles.verifiedBadgeLarge}>✓</span>
                )}
                <span className={styles.modalName}>
                  {selectedSignature.full_name}
                </span>
              </div>
              <button
                className={styles.modalClose}
                onClick={() => setSelectedSignature(null)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalDetail}>
                <strong>Country:</strong> {selectedSignature.country || '—'}
              </div>
              <div className={styles.modalDetail}>
                <strong>Honors / Affiliation:</strong>{' '}
                {selectedSignature.honors || '—'}
              </div>
            </div>
            <div className={styles.modalFooter}>
              <span>Verified email</span>
              <span className={styles.modalEmail}>
                {obfuscateEmail(selectedSignature.email)}
              </span>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
