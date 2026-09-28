import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Edge runtime doesn't work well with resend's Node.js SDK — use Node runtime
export const runtime = 'nodejs';

const resend = new Resend(process.env.RESEND_API_KEY);

// Simple in-memory rate limit (per IP, resets on cold start)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 }); // 1h window
    return true;
  }
  if (entry.count >= 3) return false; // max 3 per hour
  entry.count++;
  return true;
}

// Honeypot + basic spam checks
function isSpam(body: Record<string, string>): boolean {
  // Honeypot field must be empty
  if (body.website && body.website.trim() !== '') return true;
  // Message too short
  if ((body.message ?? '').trim().length < 20) return true;
  // URL spam patterns
  const urlCount = (body.message.match(/https?:\/\//g) ?? []).length;
  if (urlCount > 2) return true;
  return false;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Zu viele Anfragen. Bitte warten Sie eine Stunde.' },
      { status: 429 }
    );
  }

  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage' }, { status: 400 });
  }

  const { name, email, subject, message, website } = body;

  // Validate required fields
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Bitte alle Pflichtfelder ausfüllen.' }, { status: 400 });
  }

  // Email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Ungültige E-Mail-Adresse.' }, { status: 400 });
  }

  // Spam check (honeypot + heuristics)
  if (isSpam({ name, email, subject: subject ?? '', message, website: website ?? '' })) {
    // Silent success to not reveal detection
    return NextResponse.json({ ok: true });
  }

  try {
    await resend.emails.send({
      from: 'BFSG-Checken <bfsg@pan21.com>',
      to: ['bfsg@pan21.com'],
      replyTo: email,
      subject: `[bfsg-checken.de] ${subject?.trim() || 'Kontaktanfrage'} — ${name}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f8fafc;border-radius:8px;">
          <h2 style="color:#1e293b;margin:0 0 20px;">Neue Kontaktanfrage — bfsg-checken.de</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#64748b;width:120px;vertical-align:top;"><strong>Name</strong></td><td style="padding:8px 0;color:#1e293b;">${escHtml(name)}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;vertical-align:top;"><strong>E-Mail</strong></td><td style="padding:8px 0;"><a href="mailto:${escHtml(email)}" style="color:#8b5cf6;">${escHtml(email)}</a></td></tr>
            ${subject ? `<tr><td style="padding:8px 0;color:#64748b;vertical-align:top;"><strong>Betreff</strong></td><td style="padding:8px 0;color:#1e293b;">${escHtml(subject)}</td></tr>` : ''}
            <tr><td style="padding:8px 0;color:#64748b;vertical-align:top;"><strong>Nachricht</strong></td><td style="padding:8px 0;color:#1e293b;white-space:pre-wrap;">${escHtml(message)}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;">
          <p style="color:#94a3b8;font-size:12px;margin:0;">Gesendet über bfsg-checken.de · IP: ${ip}</p>
        </div>
      `,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Resend error:', err);
    return NextResponse.json(
      { error: 'E-Mail konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.' },
      { status: 500 }
    );
  }
}

function escHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
