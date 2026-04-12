import { createAdminClient } from '@/lib/supabase/server'
import { resend } from '@/lib/resend'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const body = await request.json()
  const { name, email, subject, message } = body

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 })
  }

  const supabase = createAdminClient()
  await supabase.from('contact_messages').insert({ name, email, subject, message })

  // Send to owner
  await resend.emails.send({
    from: 'OpenLetter <noreply@yourdomain.com>',
    to: process.env.OWNER_EMAIL,
    subject: `Contact: ${subject || 'No subject'}`,
    html: `<div style="font-family:sans-serif"><h3>From: ${name} (${email})</h3><p>${message}</p></div>`,
  })

  // Auto-reply
  await resend.emails.send({
    from: 'OpenLetter <noreply@yourdomain.com>',
    to: email,
    subject: 'We received your message',
    html: `<div style="font-family:sans-serif"><h3>Hi ${name},</h3><p>Thank you for reaching out. We'll get back to you shortly.</p></div>`,
  })

  return NextResponse.json({ success: true })
}