/**
 * downloadResume
 * ──────────────
 * Captures the resume preview as a canvas image via html2canvas,
 * then generates a real PDF using jsPDF.
 *
 * This approach works on ALL devices including mobile because:
 * - No print dialog
 * - No blank page issue (we screenshot the live DOM)
 * - Downloads as a proper .pdf file
 * - Works on Android Chrome, iOS Safari, desktop browsers
 */
export async function downloadResume(previewEl, name = "Resume") {
  if (!previewEl) return;

  // ── Load html2canvas ────────────────────────────────────────────────
  if (!window.html2canvas) {
    await loadScript(
      "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
    );
  }

  // ── Load jsPDF ──────────────────────────────────────────────────────
  if (!window.jspdf) {
    await loadScript(
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
    );
  }

  const safeFilename = (name || "Resume").replace(/\s+/g, "_");

  // ── Capture the element ─────────────────────────────────────────────
  const canvas = await window.html2canvas(previewEl, {
    scale: 2,            // 2x resolution for crisp text
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff",
    logging: false,
    // Ensure backgrounds are captured
    onclone: (doc) => {
      const el = doc.querySelector("[data-resume-root]");
      if (el) el.style.width = "794px"; // A4 at 96dpi
    },
  });

  // ── Build PDF ───────────────────────────────────────────────────────
  const { jsPDF } = window.jspdf;

  const imgData   = canvas.toDataURL("image/jpeg", 0.95);
  const pdfWidth  = 210; // A4 mm
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  const pdf = new jsPDF({
    orientation: pdfHeight > pdfWidth ? "portrait" : "landscape",
    unit: "mm",
    format: [pdfWidth, pdfHeight],
  });

  pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(`${safeFilename}_Resume.pdf`);
}

// ── Script loader ──────────────────────────────────────────────────────────
function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const s    = document.createElement("script");
    s.src      = src;
    s.onload   = resolve;
    s.onerror  = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}