/**
 * downloadResume
 * ──────────────
 * Generates a self-contained HTML file of the resume and
 * triggers a real file download (no print dialog).
 *
 * Works on:
 *  • Desktop Chrome / Firefox / Edge  → <a download> blob URL
 *  • Android Chrome                   → same
 *  • iOS Safari (14+)                 → same (blob URLs supported)
 *  • Older iOS                        → opens in new tab as fallback
 *
 * The downloaded .html file can then be:
 *  1. Opened in any browser
 *  2. File → Print → Save as PDF
 */
export function downloadResume(previewEl, name = "Resume") {
  if (!previewEl) return;

  // ── 1. Collect all inline CSS from the document ─────────────────────
  const styleText = Array.from(document.styleSheets)
    .flatMap((sheet) => {
      try {
        return Array.from(sheet.cssRules).map((r) => r.cssText);
      } catch {
        return [];
      }
    })
    .join("\n");

  // ── 2. Build a fully self-contained HTML page ────────────────────────
  const safeFilename = (name || "Resume").replace(/\s+/g, "_");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeFilename} — Resume</title>
  <style>
    *, *::before, *::after {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
      box-sizing: border-box;
    }
    html, body {
      margin: 0;
      padding: 0;
      background: #fff;
      font-size: 12px;
    }
    @page { margin: 0; size: A4; }
    @media print {
      html, body { margin: 0; }
      .no-print { display: none !important; }
    }
    ${styleText}
  </style>
</head>
<body>
  <!-- Print tip banner – hidden when printing -->
  <div class="no-print" style="
    background:#0d9488;color:#fff;text-align:center;
    padding:10px 16px;font-family:sans-serif;font-size:13px;
    position:sticky;top:0;z-index:999;
  ">
    📄 To save as PDF: press <strong>Ctrl+P</strong> (or ⌘P on Mac) → choose <strong>"Save as PDF"</strong>
    &nbsp;|&nbsp; On mobile: tap the share icon → <strong>Print</strong> → Save as PDF
  </div>

  <div style="max-width:800px;margin:0 auto;">
    ${previewEl.innerHTML}
  </div>
</body>
</html>`;

  // ── 3. Create Blob and trigger download ──────────────────────────────
  try {
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `${safeFilename}_Resume.html`;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();

    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 3000);

  } catch {
    // Fallback for very old browsers / strict CSP: open in new tab
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(html);
      w.document.close();
    } else {
      alert("Please allow pop-ups to download your resume, or try a different browser.");
    }
  }
}