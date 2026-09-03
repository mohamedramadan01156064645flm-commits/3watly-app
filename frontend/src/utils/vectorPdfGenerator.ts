import { jsPDF } from 'jspdf';
import type { CVData, TemplateId } from '../types/cv';

interface VectorPdfOptions {
  fileName?: string;
  template?: TemplateId;
}

/**
 * Format any raw URL/handle into a valid web hyperlink.
 */
function formatUrl(rawUrl?: string): string {
  if (!rawUrl) return '';
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) return trimmed;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `https://${trimmed}`;
}

/**
 * Pure Vector PDF Generator:
 * - 100% Vector selectable text (ATS compliant)
 * - 100% Clickable hyperlinks for Email (mailto:), Phone (tel:), LinkedIn, GitHub, Portfolio, Projects (Live & Repo), and URLs in text
 * - True mathematical pagination (1 or 2 pages based on content)
 * - Direct file download straight to browser
 */
export function generateDirectVectorPdf(cv: CVData, options: VectorPdfOptions = {}): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
    compress: true
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 595.28 pt
  const pageHeight = doc.internal.pageSize.getHeight(); // 841.89 pt

  const marginX = 38;
  const marginTop = 36;
  const marginBottom = 36;
  const contentWidth = pageWidth - marginX * 2;

  let cursorY = marginTop;

  // Choose font family based on template
  const isSerif = options.template === 'ats-classic' || options.template === 'simple' || !options.template;
  const fontRegular = isSerif ? 'times' : 'helvetica';
  const fontBold = isSerif ? 'times' : 'helvetica';

  const checkPageBreak = (neededHeight: number) => {
    if (cursorY + neededHeight > pageHeight - marginBottom) {
      doc.addPage();
      cursorY = marginTop;
      return true;
    }
    return false;
  };

  // 1. Header: Name
  const fullName = cv.contact.fullName?.trim() || 'Candidate Name';
  doc.setFont(fontBold, 'bold');
  doc.setFontSize(19);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(fullName, pageWidth / 2, cursorY, { align: 'center' });
  cursorY += 16;

  // Header: Headline / Job Title
  if (cv.contact.jobTitle?.trim()) {
    doc.setFont(fontRegular, isSerif ? 'italic' : 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(29, 78, 216); // blue-700
    doc.text(cv.contact.jobTitle.trim(), pageWidth / 2, cursorY, { align: 'center' });
    cursorY += 14;
  }

  // Header: Contact Row 1 (Email [Clickable mailto:] • Phone [Clickable tel:] • Location)
  const email = cv.contact.email?.trim() || '';
  const phone = cv.contact.phone?.trim() || '';
  const location = cv.contact.location?.trim() || '';

  const contactItems: Array<{ text: string; url?: string }> = [];
  if (email) {
    contactItems.push({ text: email, url: `mailto:${email}` });
  }
  if (phone) {
    contactItems.push({ text: phone, url: `tel:${phone.replace(/[^\d+]/g, '')}` });
  }
  if (location) {
    contactItems.push({ text: location });
  }

  if (contactItems.length > 0) {
    doc.setFont(fontRegular, 'normal');
    doc.setFontSize(9);

    const dotStr = '  •  ';
    const dotWidth = doc.getTextWidth(dotStr);

    let totalWidth = 0;
    contactItems.forEach((item, idx) => {
      totalWidth += doc.getTextWidth(item.text);
      if (idx < contactItems.length - 1) totalWidth += dotWidth;
    });

    let currentX = (pageWidth - totalWidth) / 2;
    contactItems.forEach((item, idx) => {
      const itemWidth = doc.getTextWidth(item.text);
      if (item.url) {
        doc.setTextColor(29, 78, 216); // blue-700
        doc.textWithLink(item.text, currentX, cursorY, { url: item.url });
      } else {
        doc.setTextColor(71, 85, 105); // slate-600
        doc.text(item.text, currentX, cursorY);
      }
      currentX += itemWidth;

      if (idx < contactItems.length - 1) {
        doc.setTextColor(148, 163, 184); // slate-400
        doc.text(dotStr, currentX, cursorY);
        currentX += dotWidth;
      }
    });

    cursorY += 13;
  }

  // Header: Contact Row 2 (Clickable Social & Portfolio Links)
  const activeLinks = (Array.isArray(cv.contact.socialLinks) && cv.contact.socialLinks.length > 0)
    ? cv.contact.socialLinks.filter(l => Boolean(l.url && l.url.trim()))
    : [
        cv.contact.linkedin?.trim() ? { platform: 'LinkedIn', url: cv.contact.linkedin.trim() } : null,
        cv.contact.github?.trim() ? { platform: 'GitHub', url: cv.contact.github.trim() } : null,
        cv.contact.portfolio?.trim() ? { platform: 'Portfolio', url: cv.contact.portfolio.trim() } : null,
      ].filter(Boolean) as Array<{ platform: string; url: string }>;

  if (activeLinks.length > 0) {
    doc.setFont(fontRegular, 'normal');
    doc.setFontSize(9);
    doc.setTextColor(29, 78, 216); // blue-700

    const dotStr = '  •  ';
    const dotWidth = doc.getTextWidth(dotStr);
    let totalWidth = 0;
    activeLinks.forEach((link, idx) => {
      totalWidth += doc.getTextWidth(link.platform || 'Link');
      if (idx < activeLinks.length - 1) totalWidth += dotWidth;
    });

    let currentX = (pageWidth - totalWidth) / 2;
    activeLinks.forEach((link, idx) => {
      const label = link.platform || 'Link';
      const labelWidth = doc.getTextWidth(label);
      const targetUrl = formatUrl(link.url);

      doc.textWithLink(label, currentX, cursorY, { url: targetUrl });
      currentX += labelWidth;

      if (idx < activeLinks.length - 1) {
        doc.setTextColor(148, 163, 184); // slate-400
        doc.text(dotStr, currentX, cursorY);
        currentX += dotWidth;
        doc.setTextColor(29, 78, 216);
      }
    });

    cursorY += 15;
  }

  // Section Header Macro
  const renderSectionHeading = (title: string) => {
    checkPageBreak(35);
    cursorY += 7;
    doc.setFont(fontBold, 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(title.toUpperCase(), marginX, cursorY);
    cursorY += 4;
    doc.setDrawColor(203, 213, 225); // slate-300
    doc.setLineWidth(0.75);
    doc.line(marginX, cursorY, marginX + contentWidth, cursorY);
    cursorY += 10;
  };

  // Helper to render text with auto-detected inline hyperlinks
  const renderTextWithInlineLinks = (text: string, x: number, maxWidth: number) => {
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|github\.com\/[^\s]+|linkedin\.com\/[^\s]+)/gi;
    const lines = doc.splitTextToSize(text, maxWidth);

    lines.forEach((line: string) => {
      checkPageBreak(12.5);

      if (!urlRegex.test(line)) {
        doc.setTextColor(30, 41, 59);
        doc.text(line, x, cursorY);
      } else {
        // Line contains link, match and render segments
        let lineX = x;
        const words = line.split(' ');
        words.forEach((word, wIdx) => {
          const isLink = /^(https?:\/\/|www\.|github\.com\/|linkedin\.com\/)/i.test(word);
          const wordWithSpace = wIdx < words.length - 1 ? `${word} ` : word;
          const wordWidth = doc.getTextWidth(wordWithSpace);

          if (isLink) {
            doc.setTextColor(29, 78, 216);
            doc.textWithLink(wordWithSpace, lineX, cursorY, { url: formatUrl(word) });
          } else {
            doc.setTextColor(30, 41, 59);
            doc.text(wordWithSpace, lineX, cursorY);
          }
          lineX += wordWidth;
        });
      }
      cursorY += 12;
    });
  };

  // Section Ordering
  const order = cv.sectionOrder || ['summary', 'experience', 'education', 'skills', 'projects'];

  order.forEach((sectionId) => {
    if (sectionId === 'contact') return;

    if (sectionId === 'summary' && cv.summary?.trim()) {
      renderSectionHeading('Professional Summary');
      doc.setFont(fontRegular, 'normal');
      doc.setFontSize(9.2);
      renderTextWithInlineLinks(cv.summary.trim(), marginX, contentWidth);
      cursorY += 3;
    }

    if (sectionId === 'experience' && cv.experience && cv.experience.length > 0) {
      renderSectionHeading('Experience');
      cv.experience.forEach((item) => {
        checkPageBreak(36);
        // Top line: Role (Bold) & Dates
        doc.setFont(fontBold, 'bold');
        doc.setFontSize(9.8);
        doc.setTextColor(15, 23, 42);
        doc.text(item.role || 'Job Title', marginX, cursorY);

        const dateText = `${item.startDate || ''} – ${item.current ? 'Present' : (item.endDate || '')}`.trim();
        if (dateText !== '–') {
          doc.setFont(fontRegular, 'normal');
          doc.setFontSize(8.8);
          doc.setTextColor(100, 116, 139);
          doc.text(dateText, marginX + contentWidth, cursorY, { align: 'right' });
        }
        cursorY += 12;

        // Second line: Company & Location
        doc.setFont(fontBold, 'bold');
        doc.setFontSize(9.2);
        doc.setTextColor(29, 78, 216); // blue-700
        doc.text(item.company || 'Company', marginX, cursorY);

        if (item.location?.trim()) {
          doc.setFont(fontRegular, 'normal');
          doc.setFontSize(8.8);
          doc.setTextColor(100, 116, 139);
          doc.text(item.location.trim(), marginX + contentWidth, cursorY, { align: 'right' });
        }
        cursorY += 12;

        // Bullets
        if (item.bullets && item.bullets.length > 0) {
          doc.setFont(fontRegular, 'normal');
          doc.setFontSize(9);
          item.bullets.forEach((bullet) => {
            if (!bullet.trim()) return;
            checkPageBreak(16);

            // Bullet dot
            doc.setTextColor(100, 116, 139);
            doc.text('•', marginX + 2, cursorY);

            renderTextWithInlineLinks(bullet.trim(), marginX + 12, contentWidth - 14);
          });
        }
        cursorY += 4;
      });
    }

    if (sectionId === 'education' && cv.education && cv.education.length > 0) {
      renderSectionHeading('Education');
      cv.education.forEach((item) => {
        checkPageBreak(28);
        doc.setFont(fontBold, 'bold');
        doc.setFontSize(9.8);
        doc.setTextColor(15, 23, 42);
        doc.text(item.degree || 'Degree', marginX, cursorY);

        const dateText = `${item.startDate || ''} – ${item.endDate || ''}`.trim();
        if (dateText !== '–') {
          doc.setFont(fontRegular, 'normal');
          doc.setFontSize(8.8);
          doc.setTextColor(100, 116, 139);
          doc.text(dateText, marginX + contentWidth, cursorY, { align: 'right' });
        }
        cursorY += 12;

        doc.setFont(fontRegular, 'normal');
        doc.setFontSize(9.2);
        doc.setTextColor(71, 85, 105);
        doc.text(item.institution || 'University', marginX, cursorY);

        if (item.location?.trim()) {
          doc.setFont(fontRegular, 'normal');
          doc.setFontSize(8.8);
          doc.setTextColor(100, 116, 139);
          doc.text(item.location.trim(), marginX + contentWidth, cursorY, { align: 'right' });
        }
        cursorY += 13;
      });
    }

    if (sectionId === 'skills' && cv.skills && cv.skills.length > 0) {
      renderSectionHeading('Skills');
      cv.skills.forEach((group) => {
        if (!group.skills || group.skills.length === 0) return;
        checkPageBreak(15);

        doc.setFont(fontBold, 'bold');
        doc.setFontSize(9.2);
        doc.setTextColor(15, 23, 42);
        const labelText = `${group.label || 'Skills'}: `;
        const labelWidth = doc.getTextWidth(labelText);
        doc.text(labelText, marginX, cursorY);

        doc.setFont(fontRegular, 'normal');
        doc.setTextColor(51, 65, 85);
        const skillList = group.skills.join(', ');
        const skillLines = doc.splitTextToSize(skillList, contentWidth - labelWidth - 4);

        skillLines.forEach((line: string, lIdx: number) => {
          if (lIdx === 0) {
            doc.text(line, marginX + labelWidth + 2, cursorY);
          } else {
            cursorY += 11.5;
            checkPageBreak(12);
            doc.text(line, marginX + 14, cursorY);
          }
        });
        cursorY += 12.5;
      });
      cursorY += 3;
    }

    if (sectionId === 'projects' && cv.projects && cv.projects.length > 0) {
      renderSectionHeading('Projects');
      cv.projects.forEach((item) => {
        checkPageBreak(30);

        // Project Title with Clickable Project Links
        doc.setFont(fontBold, 'bold');
        doc.setFontSize(9.8);
        doc.setTextColor(15, 23, 42);

        const projectTitle = item.title || 'Project Title';
        const titleWidth = doc.getTextWidth(projectTitle);

        if (item.link?.trim()) {
          doc.setTextColor(29, 78, 216); // blue-700
          doc.textWithLink(projectTitle, marginX, cursorY, { url: formatUrl(item.link) });
        } else {
          doc.text(projectTitle, marginX, cursorY);
        }

        let linkOffsetX = marginX + titleWidth + 6;

        // Render Clickable GitHub Link if available
        if (item.github?.trim()) {
          doc.setFont(fontRegular, 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(29, 78, 216);
          const ghLabel = '[GitHub]';
          doc.textWithLink(ghLabel, linkOffsetX, cursorY, { url: formatUrl(item.github) });
          linkOffsetX += doc.getTextWidth(ghLabel) + 5;
        }

        // Render Clickable Live Demo Link if separate from title
        if (item.link?.trim() && !projectTitle.includes('http')) {
          doc.setFont(fontRegular, 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(29, 78, 216);
          const demoLabel = '[Live Demo]';
          doc.textWithLink(demoLabel, linkOffsetX, cursorY, { url: formatUrl(item.link) });
        }

        // Technologies on right
        if (item.technologies && item.technologies.length > 0) {
          doc.setFont(fontRegular, 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(100, 116, 139);
          doc.text(item.technologies.join(', '), marginX + contentWidth, cursorY, { align: 'right' });
        }
        cursorY += 12;

        // Bullets
        if (item.bullets && item.bullets.length > 0) {
          doc.setFont(fontRegular, 'normal');
          doc.setFontSize(9);
          item.bullets.forEach((bullet) => {
            if (!bullet.trim()) return;
            checkPageBreak(16);

            doc.setTextColor(100, 116, 139);
            doc.text('•', marginX + 2, cursorY);

            renderTextWithInlineLinks(bullet.trim(), marginX + 12, contentWidth - 14);
          });
        }
        cursorY += 4;
      });
    }
  });

  const saveName = options.fileName
    ? (options.fileName.endsWith('.pdf') ? options.fileName : `${options.fileName}.pdf`)
    : `${fullName.replace(/\s+/g, '_')}_Resume.pdf`;

  doc.save(saveName);
}
