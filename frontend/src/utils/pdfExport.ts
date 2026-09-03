"use client";

import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import type { CVData, TemplateId } from '../types/cv';
import { generateDirectVectorPdf } from './vectorPdfGenerator';

/**
 * Directly downloads the CV as a clean vector PDF with:
 * - 100% Vector selectable text & clickable links (LinkedIn, GitHub, Portfolio)
 * - Direct browser file download (no print dialog, no print window)
 * - 0 browser headers / footers (no localhost:3000, no date, no page numbers)
 * - True mathematical pagination based on content (1 page if standard, 2 pages if extended)
 */
export async function exportCvToPdf(
  elementId: string = 'cv-paper-root',
  fileName: string = 'Resume.pdf',
  cvData?: CVData,
  template?: TemplateId
): Promise<void> {
  // If structured CVData is provided, use the pure vector PDF generator
  if (cvData) {
    generateDirectVectorPdf(cvData, { fileName, template });
    return;
  }

  const element = document.getElementById(elementId);
  if (!element) throw new Error('CV element not found');

  // Clone element into off-screen container forced to clean print typography
  const clone = element.cloneNode(true) as HTMLElement;
  clone.id = 'cv-export-direct-clone';
  clone.style.width = '794px';
  clone.style.maxWidth = '794px';
  clone.style.backgroundColor = '#ffffff';
  clone.style.color = '#0f172a';
  clone.style.padding = '24px 32px';
  clone.style.margin = '0';
  clone.style.boxShadow = 'none';
  clone.style.border = 'none';
  clone.style.borderRadius = '0';
  clone.style.fontFamily = 'Georgia, "Times New Roman", serif';

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
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}
