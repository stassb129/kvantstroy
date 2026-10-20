import nodemailer from 'nodemailer'
import { site } from '@/lib/site'

/** Recipient for lead emails. Override with LEAD_TO_EMAIL when needed. */
export function getLeadToEmail() {
  if (process.env.LEAD_TO_EMAIL?.trim()) return process.env.LEAD_TO_EMAIL.trim()
  // Local / non-production: test inbox. Production: public site email.
  if (process.env.NODE_ENV !== 'production') return 'stassb129@gmail.com'
  return site.email
}

export function isSmtpConfigured() {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.trim(),
  )
}

export function createMailTransport() {
  const host = process.env.SMTP_HOST?.trim()
  const user = process.env.SMTP_USER?.trim()
  const pass = process.env.SMTP_PASS?.trim()
  if (!host || !user || !pass) {
    throw new Error('SMTP is not configured')
  }

  const port = Number(process.env.SMTP_PORT || 465)
  const secure =
    process.env.SMTP_SECURE === 'false' ? false : process.env.SMTP_SECURE === 'true' ? true : port === 465

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  })
}

export function getMailFrom() {
  return process.env.SMTP_FROM?.trim() || process.env.SMTP_USER?.trim() || site.email
}
