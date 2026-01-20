type EmailPreviewPayload = {
  to: string;
  cc?: string;
  subject: string;
  html: string;
};

function escapeHtml(text: string) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function openEmailPreviewWindow(payload: EmailPreviewPayload): boolean {
  // Must be called directly from a user gesture (button click) to avoid popup blockers.
  const w = window.open('', '_blank', 'noopener,noreferrer');
  if (!w) return false;

  const { to, cc, subject, html } = payload;
  const safeTo = escapeHtml(to || '');
  const safeCc = escapeHtml(cc || '');
  const safeSubject = escapeHtml(subject || '');

  const doc = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Email preview</title>
    <style>
      :root { color-scheme: light; }
      body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"; }
      .wrap { max-width: 980px; margin: 0 auto; padding: 24px; }
      .meta { border: 1px solid #e5e7eb; border-radius: 10px; padding: 12px 14px; background: #f9fafb; }
      .row { display: grid; grid-template-columns: 80px 1fr; gap: 10px; padding: 6px 0; }
      .k { color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: .06em; }
      .v { font-size: 14px; color: #111827; word-break: break-word; }
      .divider { height: 1px; background: #e5e7eb; margin: 18px 0; }
      .body { border: 1px solid #e5e7eb; border-radius: 10px; padding: 18px; }
    </style>
  </head>
  <body>
    <div class="wrap">
      <h2 style="margin: 0 0 14px; font-size: 18px; font-weight: 700; color: #111827;">Email preview (internal only)</h2>
      <div class="meta">
        <div class="row"><div class="k">To</div><div class="v">${safeTo}</div></div>
        ${cc ? `<div class="row"><div class="k">CC</div><div class="v">${safeCc}</div></div>` : ''}
        <div class="row"><div class="k">Subject</div><div class="v">${safeSubject}</div></div>
      </div>
      <div class="divider"></div>
      <div class="body">
        ${html || ''}
      </div>
    </div>
  </body>
</html>`;

  w.document.open();
  w.document.write(doc);
  w.document.close();
  return true;
}

