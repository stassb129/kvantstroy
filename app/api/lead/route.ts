import { NextResponse } from 'next/server'
import { isValidRuPhone } from '@/lib/phone'
import { createMailTransport, getLeadToEmail, getMailFrom, isSmtpConfigured } from '@/lib/mail'
import { site } from '@/lib/site'

export const dynamic = 'force-dynamic'

type LeadBody = {
  name?: string
  phone?: string
  source?: string
}

export async function POST(request: Request) {
  let body: LeadBody
  try {
    body = (await request.json()) as LeadBody
  } catch {
    return NextResponse.json({ ok: false, error: 'Некорректный запрос' }, { status: 400 })
  }

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
  const source =
    typeof body.source === 'string' && body.source.trim()
      ? body.source.trim().slice(0, 120)
      : 'Заявка с сайта'

  if (name.length < 2) {
    return NextResponse.json({ ok: false, error: 'Укажите имя' }, { status: 400 })
  }
  if (!isValidRuPhone(phone)) {
    return NextResponse.json({ ok: false, error: 'Введите номер полностью' }, { status: 400 })
  }

  if (!isSmtpConfigured()) {
    console.error('[lead] SMTP is not configured')
    return NextResponse.json(
      { ok: false, error: 'Отправка временно недоступна. Позвоните нам.' },
      { status: 503 },
    )
  }

  const to = getLeadToEmail()
  const from = getMailFrom()
  const submittedAt = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })

  const text = [
    `Новая заявка с сайта ${site.name}`,
    '',
    `Имя: ${name}`,
    `Телефон: ${phone}`,
    `Источник: ${source}`,
    `Время (МСК): ${submittedAt}`,
  ].join('\n')

  const html = `
    <h2 style="margin:0 0 12px;font-family:sans-serif;">Новая заявка — ${escapeHtml(site.name)}</h2>
    <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
      <tr><td style="padding:6px 12px 6px 0;color:#666;">Имя</td><td style="padding:6px 0;"><strong>${escapeHtml(name)}</strong></td></tr>
      <tr><td style="padding:6px 12px 6px 0;color:#666;">Телефон</td><td style="padding:6px 0;"><a href="tel:+${phone.replace(/\D/g, '').replace(/^8/, '7')}">${escapeHtml(phone)}</a></td></tr>
      <tr><td style="padding:6px 12px 6px 0;color:#666;">Источник</td><td style="padding:6px 0;">${escapeHtml(source)}</td></tr>
      <tr><td style="padding:6px 12px 6px 0;color:#666;">Время (МСК)</td><td style="padding:6px 0;">${escapeHtml(submittedAt)}</td></tr>
    </table>
  `

  try {
    const transport = createMailTransport()
    await transport.sendMail({
      from: `"${site.name}" <${from}>`,
      to,
      replyTo: from,
      subject: `Заявка: ${name} · ${phone}`,
      text,
      html,
    })
  } catch (error) {
    console.error('[lead] send failed', error)
    return NextResponse.json(
      { ok: false, error: 'Не удалось отправить заявку. Попробуйте позже или позвоните нам.' },
      { status: 502 },
    )
  }

  return NextResponse.json({ ok: true })
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
