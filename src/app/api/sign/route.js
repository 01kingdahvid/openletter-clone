// app/api/sign/route.js
import { createAdminClient } from '@/lib/supabase/server'
import { resend } from '@/lib/resend'
import { NextResponse } from 'next/server'

export async function POST (request) {
  const body = await request.json()

  const {
    full_name,
    email,
    gender,
    job_title,
    organization,
    honors,
    country,
    letter_id
  } = body

  if (!full_name || !email) {
    return NextResponse.json(
      { error: 'Name and email are required.' },
      { status: 400 }
    )
  }

  if (!letter_id) {
    return NextResponse.json(
      { error: 'Letter ID is required.' },
      { status: 400 }
    )
  }

  const supabase = createAdminClient()

  // Check if already signed & verified for this specific letter
  const { data: existing } = await supabase
    .from('signatures')
    .select('id, verified')
    .eq('email', email)
    .eq('letter_id', letter_id)
    .maybeSingle()

  if (existing?.verified) {
    return NextResponse.json(
      { error: 'You have already signed and verified this letter.' },
      { status: 409 }
    )
  }

  // Avoid upsert (no unique constraint on email alone) — use insert or update
  let sigError = null

  if (existing) {
    // Re-submission: update existing unverified row
    const { error } = await supabase
      .from('signatures')
      .update({
        full_name,
        gender,
        job_title,
        organization,
        honors,
        country,
        verified: false
      })
      .eq('id', existing.id)
    sigError = error
  } else {
    // New signature
    const { error } = await supabase.from('signatures').insert({
      full_name,
      email,
      gender,
      job_title,
      organization,
      honors,
      country,
      letter_id,
      verified: false
    })
    sigError = error
  }

  if (sigError) {
    console.error('Signature save error:', sigError)
    return NextResponse.json(
      { error: 'Failed to save signature.' },
      { status: 500 }
    )
  }

  // Generate magic link using admin API (fixes the missing magicLink variable bug)
  const { data: otpData, error: authError } =
    await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/verify`,
        data: { full_name }
      }
    })

  if (authError) {
    console.error('Magic link error:', authError)
    return NextResponse.json(
      { error: 'Failed to generate magic link.' },
      { status: 500 }
    )
  }

  const magicLink = otpData?.properties?.action_link

  if (!magicLink) {
    return NextResponse.json(
      { error: 'Failed to retrieve magic link.' },
      { status: 500 }
    )
  }

  // Send verification email
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Verify your signature — Disrupting the Deepfake Supply Chain',
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto;padding:24px">
        <h2 style="margin-bottom:8px">Almost done, ${full_name}!</h2>
        <p style="color:#555">Click below to verify your signature on <strong>Disrupting the Deepfake Supply Chain</strong>:</p>
        <a href="${magicLink}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#111;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px">
          Verify my signature →
        </a>
        <p style="margin-top:32px;font-size:12px;color:#aaa">
          If you didn't sign this letter, you can safely ignore this email.
        </p>
      </div>
    `
  })

  // Notify owner
  if (process.env.OWNER_EMAIL) {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: process.env.OWNER_EMAIL,
      subject: `New signature from ${full_name}`,
      html: `<p><strong>${full_name}</strong> (${email}) just signed the Disrupting Deepfakes letter.</p>`
    })
  }

  return NextResponse.json({ success: true })
}
