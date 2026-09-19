"use client";

import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import type { CVData, TemplateId } from '../types/cv';
import { generateDirectVectorPdf } from './vectorPdfGenerator';

/**
 * Directly downloads the CV as a clean high-fidelity PDF with:
 * - Exact active template layout (Single Column, Two Column, Compact, etc.)
 * - Official platform SVG icons (LinkedIn, GitHub, Portfolio, etc.)
 * - All certifications and customized platform names
 * - True-to-preview font family, margins, and hierarchy
 * - 100% Vector clickable hyperlinks embedded into the PDF coordinates
 */
export async function exportCvToPdf(
  elementId: string = 'cv-paper-root',
  fileName: string = 'Resume.pdf',
  cvData?: CVData,
  template?: TemplateId
): Promise<void> {
  const element = typeof document !== 'undefined' ? document.getElementById(elementId) : null;

  // Fallback to direct vector generator if DOM element is not mounted
  if (!element) {
    if (cvData) {
      generateDirectVectorPdf(cvData, { fileName, template });
      return;
    }
    throw new Error('CV element not found');
  }

  // Clone element into off-screen container matching A4 dimensions
  const clone = element.cloneNode(true) as HTMLElement;
  clone.id = 'cv-export-direct-clone';
  clone.style.width = '794px';
  clone.style.maxWidth = '794px';
  clone.style.backgroundColor = '#ffffff';
  clone.style.color = '#0f172a';
  clone.style.margin = '0';
  clone.style.boxShadow = 'none';
  clone.style.border = 'none';
  clone.style.borderRadius = '0';
  
  // Preserve template's font family
  const computedFont = element.style.fontFamily || window.getComputedStyle(element).fontFamily;
  if (computedFont) {
    clone.style.fontFamily = computedFont;
  }

  // Strip dark mode class overrides
  clone.classList.remove('dark', 'shadow-2xl', 'border', 'rounded-xl', 'rounded-2xl');
  const allChildren = clone.querySelectorAll('*');
  allChildren.forEach((child) => {
    const el = child as HTMLElement;
    const darkClasses: string[] = [];
    el.classList.forEach((c) => {
      if (c.startsWith('dark:')) darkClasses.push(c);
    });
    darkClasses.forEach((c) => el.classList.remove(c));

    if (el.tagName === 'H1' || el.tagName === 'H2') {
      el.style.color = '#0f172a';
    }

    // Force SVG icons to be solid black in export
    if (el.tagName.toLowerCase() === 'svg') {
      el.style.color = '#000000';
      el.style.fill = 'currentColor';
    }
  });

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '-99999px';
  container.style.left = '-99999px';
  container.style.width = '794px';
  container.style.backgroundColor = '#ffffff';
  container.style.zIndex = '-99999';
  container.appendChild(clone);
  document.body.appendChild(container);

  try {
    const imgData = await toPng(clone, {
      quality: 1.0,
      pixelRatio: 3.0,
      backgroundColor: '#ffffff',
      width: 794,
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pdfWidth = 210;
    const pdfHeight = 297;

    const img = new Image();
    img.src = imgData;
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const naturalHeightMm = (img.height * pdfWidth) / img.width;

    const finalWidth = naturalHeightMm > pdfHeight ? (pdfHeight / naturalHeightMm) * pdfWidth : pdfWidth;
    const finalHeight = naturalHeightMm > pdfHeight ? pdfHeight : naturalHeightMm;
    const xOffset = (pdfWidth - finalWidth) / 2;

    pdf.addImage(imgData, 'PNG', xOffset, 0, finalWidth, finalHeight, undefined, 'FAST');

    // Embed genuine clickable vector links on top of the PDF coordinates
    const links = clone.querySelectorAll('a[href]');
    const cloneRect = clone.getBoundingClientRect();
    const scaleFactor = finalWidth / 794;

    links.forEach((linkNode) => {
      const a = linkNode as HTMLAnchorElement;
      const href = a.getAttribute('href');
      if (href && !href.startsWith('#')) {
        const linkRect = a.getBoundingClientRect();
        const linkX = xOffset + (linkRect.left - cloneRect.left) * scaleFactor;
        const linkY = (linkRect.top - cloneRect.top) * scaleFactor;
        const linkW = linkRect.width * scaleFactor;
        const linkH = linkRect.height * scaleFactor;

        pdf.link(linkX, linkY, linkW, linkH, { url: href });
      }
    });

    const cleanName = fileName.replace(/[/\\?%*:|"<>]/g, '_').trim() || 'Resume';
    pdf.save(cleanName.endsWith('.pdf') ? cleanName : `${cleanName}.pdf`);
  } catch (domExportErr) {
    console.warn('DOM-based PDF export encountered an issue, falling back to pure vector PDF:', domExportErr);
    if (cvData) {
      generateDirectVectorPdf(cvData, { fileName, template });
    } else {
      throw domExportErr;
    }
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}

/**
 * 100% Isolated Direct CV Print:
 * Spawns an isolated invisible iframe containing ONLY the cleaned CV paper root,
 * ensuring ZERO dashboard UI, sidebars, headers, or backgrounds can ever leak into the print dialog.
 */
export async function printCv(elementId: string = 'cv-paper-root'): Promise<void> {
  const element = typeof document !== 'undefined' ? document.getElementById(elementId) : null;
  if (!element) {
    if (typeof window !== 'undefined') window.print();
    return;
  }

  // Clone element into clean printable DOM
  const clone = element.cloneNode(true) as HTMLElement;
  clone.id = 'cv-print-isolated-root';
  clone.style.width = '100%';
  clone.style.maxWidth = '800px';
  clone.style.backgroundColor = '#ffffff';
  clone.style.color = '#0f172a';
  clone.style.margin = '0 auto';
  clone.style.padding = '16px 28px';
  clone.style.boxShadow = 'none';
  clone.style.border = 'none';
  clone.style.borderRadius = '0';
  clone.style.minHeight = '0';

  // Preserve template font
  const computedFont = element.style.fontFamily || window.getComputedStyle(element).fontFamily;
  if (computedFont) {
    clone.style.fontFamily = computedFont;
  }

  // Strip dark mode classes & clean styling
  clone.classList.remove('dark', 'shadow-2xl', 'border', 'rounded-sm', 'rounded-xl', 'rounded-2xl');
  const allChildren = clone.querySelectorAll('*');
  allChildren.forEach((child) => {
    const el = child as HTMLElement;
    const darkClasses: string[] = [];
    el.classList.forEach((c) => {
      if (c.startsWith('dark:')) darkClasses.push(c);
    });
    darkClasses.forEach((c) => el.classList.remove(c));

    if (['H1', 'H2', 'H3', 'H4', 'P', 'SPAN', 'DIV', 'LI'].includes(el.tagName)) {
      el.style.color = '#0f172a';
    }

    if (el.tagName.toLowerCase() === 'svg') {
      el.style.color = '#000000';
      el.style.fill = 'currentColor';
    }
  });

  // Extract all stylesheets and style tags to preserve Tailwind & Google fonts in iframe
  const styleElements = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map((el) => el.outerHTML)
    .join('\n');

  // Create isolated hidden iframe
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.top = '-99999px';
  iframe.style.left = '-99999px';
  iframe.style.width = '1000px';
  iframe.style.height = '1200px';
  iframe.style.border = 'none';
  iframe.style.zIndex = '-99999';
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!iframeDoc) {
    if (document.body.contains(iframe)) document.body.removeChild(iframe);
    window.print();
    return;
  }

  iframeDoc.open();
  iframeDoc.write(`<!DOCTYPE html>
<html lang="en" dir="ltr" class="light">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Resume</title>
  ${styleElements}
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 12mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    html, body {
      background: #ffffff !important;
      background-color: #ffffff !important;
      background-image: none !important;
      color: #0f172a !important;
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      height: auto !important;
      overflow: visible !important;
    }
    #cv-print-isolated-root {
      background: #ffffff !important;
      background-color: #ffffff !important;
      background-image: none !important;
      color: #0f172a !important;
      box-shadow: none !important;
      border: none !important;
      width: 100% !important;
      max-width: 100% !important;
      min-height: 0 !important;
      margin: 0 auto !important;
      padding: 0 !important;
    }
    #cv-print-isolated-root * {
      color: #0f172a !important;
    }
    svg {
      display: inline-block !important;
      color: #000000 !important;
      fill: currentColor !important;
      vertical-align: middle !important;
    }
    a {
      color: #1d4ed8 !important;
      text-decoration: none !important;
    }
    a[href]:after {
      content: none !important;
    }
    @media print {
      body {
        background: #ffffff !important;
        margin: 0 !important;
        padding: 0 !important;
      }
    }
  </style>
</head>
<body style="background: #ffffff; color: #0f172a; margin: 0; padding: 0;">
  ${clone.outerHTML}
</body>
</html>`);
  iframeDoc.close();

  // Allow fonts & styles to settle
  await new Promise((r) => setTimeout(r, 250));

  try {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
  } catch (e) {
    console.error('Print iframe error:', e);
    window.print();
  } finally {
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 1500);
  }
}

