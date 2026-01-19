import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

export function parseCookies(req: VercelRequest): Record<string, string> {
  const header = req.headers.cookie || '';
  const out: Record<string, string> = {};
  header.split(';').forEach((part) => {
    const s = part.trim();
    if (!s) return;
    const idx = s.indexOf('=');
    if (idx === -1) return;
    const k = s.slice(0, idx).trim();
    const v = s.slice(idx + 1).trim();
    out[k] = decodeURIComponent(v);
  });
  return out;
}

export function setCookie(res: VercelResponse, cookie: string) {
  const existing = res.getHeader('Set-Cookie');
  const arr = Array.isArray(existing) ? existing : existing ? [String(existing)] : [];
  res.setHeader('Set-Cookie', [...arr, cookie]);
}

export function cookieString(opts: {
  name: string;
  value: string;
  path?: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'Lax' | 'Strict' | 'None';
  maxAgeSeconds?: number;
}) {
  const parts = [`${opts.name}=${encodeURIComponent(opts.value)}`];
  parts.push(`Path=${opts.path || '/'}`);
  if (opts.httpOnly !== false) parts.push('HttpOnly');
  if (opts.secure) parts.push('Secure');
  if (opts.sameSite) parts.push(`SameSite=${opts.sameSite}`);
  if (typeof opts.maxAgeSeconds === 'number') parts.push(`Max-Age=${Math.floor(opts.maxAgeSeconds)}`);
  return parts.join('; ');
}

export function ensureSessionId(req: VercelRequest, res: VercelResponse) {
  const cookies = parseCookies(req);
  const existing = cookies.pc_session;
  if (existing) return existing;
  const id = crypto.randomBytes(24).toString('hex');
  setCookie(
    res,
    cookieString({
      name: 'pc_session',
      value: id,
      secure: (req.headers['x-forwarded-proto'] || '').toString().includes('https'),
      sameSite: 'Lax',
      httpOnly: true,
      path: '/',
      maxAgeSeconds: 60 * 60 * 24 * 30, // 30d
    })
  );
  return id;
}

