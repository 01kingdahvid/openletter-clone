import { createAdminClient } from '@/lib/supabase/server'
import { resend } from '@/lib/resend'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const body = await request.json()

  const {
    full_name,
    email,
    gender,
    job_title,
    organization,
    honors,
    country,
  } = body

  if (!full_name || !email) {
    return NextResponse.json(
      { error: 'Name and email are required.' },
      { status: 400 }
    )
  }

  const supabase = createAdminClient()

  // Check existing
  const { data: existing } = await supabase
    .from('signatures')
    .select('id, verified')
    .eq('email', email)
    .maybeSingle()

  if (existing?.verified) {
    return NextResponse.json(
      { error: 'Already signed & verified.' },
      { status: 409 }
    )
  }

  // Save signature
  const { error: sigError } = await supabase
    .from('signatures')
    .upsert(
      {
        full_name,
        email,
        gender,
        job_title,
        organization,
        honors,
        country,
        verified: false,
      },
      { onConflict: 'email' }
    )

  if (sigError) {
    console.log(sigError)
    return NextResponse.json(
      { error: 'Failed to save signature.' },
      { status: 500 }
    )
  }

  // ✅ GENERATE MAGIC LINK
  const { data: linkData, error: authError } =
    await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
      },
    })

  if (authError) {
    console.log(authError)
    return NextResponse.json(
      { error: 'Failed to generate magic link.' },
      { status: 500 }
    )
  }

  const magicLink = linkData?.properties?.action_link

  // ✅ SEND EMAIL WITH LINK
  const emailRes = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Verify your signature',
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto">
        <h2>Almost done, ${full_name}!</h2>
        <p>Click below to verify your signature:</p>
        <a href="${magicLink}" style="padding:10px 16px;background:#000;color:#fff;text-decoration:none;border-radius:6px">
          Verify & Continue
        </a>
      </div>
    `,
  })

  console.log(emailRes)

  // Notify owner
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: process.env.OWNER_EMAIL,
    subject: `New signature from ${full_name}`,
    html: `<p>${full_name} (${email}) just signed.</p>`,
  })

  return NextResponse.json({ success: true })
}