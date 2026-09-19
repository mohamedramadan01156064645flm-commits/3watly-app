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

/** Remove redundant dates concatenated into location strings */
function cleanLocationText(loc?: string): string {
  if (!loc) return '';
  return loc
    .replace(/\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)?\s*\d{4}\s*[-–—]\s*(?:present|\w+\s*\d{4})?/gi, '')
    .replace(/^[,\s·•-]+|[,\s·•-]+$/g, '')
    .trim();
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
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0); // Pure black
  doc.text(fullName, pageWidth / 2, cursorY, { align: 'center' });
  cursorY += 16;

  // Header: Headline / Job Title
  if (cv.contact.jobTitle?.trim()) {
    doc.setFont(fontRegular, isSerif ? 'italic' : 'bold');
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0); // Pure black
    doc.text(cv.contact.jobTitle.trim(), pageWidth / 2, cursorY, { align: 'center' });
    cursorY += 14;
  }

  // Header: Location (if available)
  if (cv.contact.location?.trim()) {
    doc.setFont(fontRegular, 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(0, 0, 0);
    doc.text(cv.contact.location.trim(), pageWidth / 2, cursorY, { align: 'center' });
    cursorY += 12;
  }

  // Header: Contact Row 1 (Email [Clickable mailto:] • Phone [Clickable tel:])
  const email = cv.contact.email?.trim() || '';
  const phone = cv.contact.phone?.trim() || '';

  const contactItems: Array<{ text: string; url?: string }> = [];
  if (phone) {
    contactItems.push({ text: phone, url: `tel:${phone.replace(/[^\d+]/g, '')}` });
  }
  if (email) {
    contactItems.push({ text: email, url: `mailto:${email}` });
  }

  // Header: Contact Row 2 (Clickable Social & Portfolio Links)
  const activeLinks = (Array.isArray(cv.contact.socialLinks) && cv.contact.socialLinks.length > 0)
    ? cv.contact.socialLinks.filter(l => Boolean(l.url && l.url.trim()))
    : [
        cv.contact.linkedin?.trim() ? { platform: 'LinkedIn', url: cv.contact.linkedin.trim() } : null,
        cv.contact.github?.trim() ? { platform: 'GitHub', url: cv.contact.github.trim() } : null,
        cv.contact.portfolio?.trim() ? { platform: 'Portfolio', url: cv.contact.portfolio.trim() } : null,
      ].filter(Boolean) as Array<{ platform: string; url: string }>;

  activeLinks.forEach(link => {
    const cleanLabel = (link as any).customLabel?.trim() || link.platform || 'Link';
    contactItems.push({ text: cleanLabel, url: formatUrl(link.url) });
  });

  if (contactItems.length > 0) {
    doc.setFont(fontRegular, 'normal');
    doc.setFontSize(9);

    const pipeStr = '   |   ';
    const pipeWidth = doc.getTextWidth(pipeStr);

    let totalWidth = 0;
    contactItems.forEach((item, idx) => {
      totalWidth += doc.getTextWidth(item.text);
      if (idx < contactItems.length - 1) totalWidth += pipeWidth;
    });

    let currentX = (pageWidth - totalWidth) / 2;
    contactItems.forEach((item, idx) => {
      const itemWidth = doc.getTextWidth(item.text);
      doc.setTextColor(0, 0, 0); // Pure black
      if (item.url) {
        doc.textWithLink(item.text, currentX, cursorY, { url: item.url });
      } else {
        doc.text(item.text, currentX, cursorY);
      }
      currentX += itemWidth;

      if (idx < contactItems.length - 1) {
        doc.setTextColor(0, 0, 0);
        doc.text(pipeStr, currentX, cursorY);
        currentX += pipeWidth;
      }
    });

    cursorY += 15;
  }

  // Section Header Macro: Solid black heading with solid black divider rule
  const renderSectionHeading = (title: string) => {
    checkPageBreak(35);
    cursorY += 7;
    doc.setFont(fontBold, 'bold');
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0); // Pure black
    doc.text(title.toUpperCase(), marginX, cursorY);
    cursorY += 4;
    doc.setDrawColor(0, 0, 0); // Pure black divider
    doc.setLineWidth(0.85);
    doc.line(marginX, cursorY, marginX + contentWidth, cursorY);
    cursorY += 11;
  };

  // Helper to render text with auto-detected inline hyperlinks
  const renderTextWithInlineLinks = (text: string, x: number, maxWidth: number) => {
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|github\.com\/[^\s]+|linkedin\.com\/[^\s]+)/gi;
    const lines = doc.splitTextToSize(text, maxWidth);

    lines.forEach((line: string) => {
      checkPageBreak(12.5);

      if (!urlRegex.test(line)) {
        doc.setTextColor(0, 0, 0); // Pure black
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
            doc.setTextColor(0, 0, 0); // Pure black with underline
            doc.textWithLink(wordWithSpace, lineX, cursorY, { url: formatUrl(word) });
          } else {
            doc.setTextColor(0, 0, 0);
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
        // Top line: Role (Bold Black) & Dates (Black Right)
        doc.setFont(fontBold, 'bold');
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(item.role || 'Job Title', marginX, cursorY);

        const dateText = `${item.startDate || ''} – ${item.current ? 'Present' : (item.endDate || '')}`.trim();
        if (dateText !== '–') {
          doc.setFont(fontRegular, 'normal');
          doc.setFontSize(9);
          doc.setTextColor(0, 0, 0);
          doc.text(dateText, marginX + contentWidth, cursorY, { align: 'right' });
        }
        cursorY += 12;

        // Second line: Company (Italic Black) & Location (Italic Black Right)
        doc.setFont(fontRegular, 'italic');
        doc.setFontSize(9.2);
        doc.setTextColor(0, 0, 0);
        doc.text(item.company || 'Company', marginX, cursorY);

        const cleanLoc = cleanLocationText(item.location);
        if (cleanLoc) {
          doc.setFont(fontRegular, 'italic');
          doc.setFontSize(9);
          doc.setTextColor(0, 0, 0);
          doc.text(cleanLoc, marginX + contentWidth, cursorY, { align: 'right' });
        }
        cursorY += 12;

        // Bullets: Solid black dots with clean black text
        if (item.bullets && item.bullets.length > 0) {
          doc.setFont(fontRegular, 'normal');
          doc.setFontSize(9);
          item.bullets.forEach((bullet) => {
            if (!bullet.trim()) return;
            checkPageBreak(16);

            doc.setTextColor(0, 0, 0);
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
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(item.degree || 'Degree', marginX, cursorY);

        const dateText = `${item.startDate || ''} – ${item.endDate || ''}`.trim();
        if (dateText !== '–') {
          doc.setFont(fontRegular, 'normal');
          doc.setFontSize(9);
          doc.setTextColor(0, 0, 0);
          doc.text(dateText, marginX + contentWidth, cursorY, { align: 'right' });
        }
        cursorY += 12;

        doc.setFont(fontRegular, 'italic');
        doc.setFontSize(9.2);
        doc.setTextColor(0, 0, 0);
        doc.text(item.institution || 'University', marginX, cursorY);

        const cleanLoc = cleanLocationText(item.location);
        if (cleanLoc) {
          doc.setFont(fontRegular, 'italic');
          doc.setFontSize(9);
          doc.setTextColor(0, 0, 0);
          doc.text(cleanLoc, marginX + contentWidth, cursorY, { align: 'right' });
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
        doc.setTextColor(0, 0, 0);
        const labelText = `${group.label || 'Skills'}: `;
        const labelWidth = doc.getTextWidth(labelText);
        doc.text(labelText, marginX, cursorY);

        doc.setFont(fontRegular, 'normal');
        doc.setTextColor(0, 0, 0);
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

        // Project Title
        doc.setFont(fontBold, 'bold');
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);

        const projectTitle = item.title || 'Project Title';
        const titleWidth = doc.getTextWidth(projectTitle);

        if (item.link?.trim()) {
          doc.textWithLink(projectTitle, marginX, cursorY, { url: formatUrl(item.link) });
        } else {
          doc.text(projectTitle, marginX, cursorY);
        }

        const techStr = item.technologies && item.technologies.length > 0 ? item.technologies.join(', ') : '';
        doc.setFont(fontRegular, 'normal');
        doc.setFontSize(8.5);
        const techWidth = techStr ? doc.getTextWidth(techStr) : 0;
        const maxTitleX = marginX + contentWidth - techWidth - 14;

        let linkOffsetX = marginX + titleWidth + 6;

        // If title and links would collide with technologies, wrap links to their own line
        const needsWrap = linkOffsetX + 80 > maxTitleX;
        if (needsWrap && (item.github?.trim() || item.link?.trim())) {
          cursorY += 11;
          linkOffsetX = marginX;
        }

        // Render Clickable GitHub Link
        if (item.github?.trim()) {
          doc.setFont(fontRegular, 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(29, 78, 216); // Professional blue for clickable links
          const ghLabel = 'GitHub ↗';
          doc.textWithLink(ghLabel, linkOffsetX, cursorY, { url: formatUrl(item.github) });
          linkOffsetX += doc.getTextWidth(ghLabel) + 6;
        }

        // Render Clickable Live Demo Link
        if (item.link?.trim() && !projectTitle.includes('http')) {
          doc.setFont(fontRegular, 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(29, 78, 216); // Professional blue for clickable links
          const demoLabel = 'Live Demo ↗';
          doc.textWithLink(demoLabel, linkOffsetX, cursorY, { url: formatUrl(item.link) });
        }

        // Technologies on right (aligned with the first line)
        if (techStr) {
          doc.setFont(fontRegular, 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(0, 0, 0);
          const techY = needsWrap ? cursorY - 11 : cursorY;
          doc.text(techStr, marginX + contentWidth, techY, { align: 'right' });
        }
        cursorY += 12;

        // Bullets
        if (item.bullets && item.bullets.length > 0) {
          doc.setFont(fontRegular, 'normal');
          doc.setFontSize(9);
          item.bullets.forEach((bullet) => {
            if (!bullet.trim()) return;
            checkPageBreak(16);

            doc.setTextColor(0, 0, 0);
            doc.text('•', marginX + 2, cursorY);

            renderTextWithInlineLinks(bullet.trim(), marginX + 12, contentWidth - 14);
          });
        }
        cursorY += 4;
      });
    }

    if (sectionId === 'certifications' && cv.certifications && cv.certifications.length > 0) {
      renderSectionHeading('Certifications & Courses');
      cv.certifications.forEach((cert) => {
        if (!cert.name?.trim()) return;
        checkPageBreak(24);

        doc.setFont(fontBold, 'bold');
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const certName = cert.name.trim();
        const certNameWidth = doc.getTextWidth(certName);

        if (cert.url?.trim()) {
          doc.textWithLink(certName, marginX, cursorY, { url: formatUrl(cert.url) });
        } else {
          doc.text(certName, marginX, cursorY);
        }

        // Date on right
        if (cert.date?.trim()) {
          doc.setFont(fontRegular, 'normal');
          doc.setFontSize(9);
          doc.setTextColor(0, 0, 0);
          doc.text(cert.date.trim(), marginX + contentWidth, cursorY, { align: 'right' });
        }
        cursorY += 12;

        // Issuer + Credential Link
        doc.setFont(fontRegular, 'italic');
        doc.setFontSize(9.2);
        doc.setTextColor(0, 0, 0);
        const issuerText = cert.issuer?.trim() || 'Verified Credential';
        doc.text(issuerText, marginX, cursorY);

        if (cert.url?.trim()) {
          const verifyLabel = '[Verify Credential]';
          doc.setFont(fontRegular, 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(0, 0, 0);
          const issuerWidth = doc.getTextWidth(issuerText);
          doc.textWithLink(verifyLabel, marginX + issuerWidth + 8, cursorY, { url: formatUrl(cert.url) });
        }

        cursorY += 13;
      });
      cursorY += 3;
    }
  });

  const saveName = options.fileName
    ? (options.fileName.endsWith('.pdf') ? options.fileName : `${options.fileName}.pdf`)
    : `${fullName.replace(/\s+/g, '_')}_Resume.pdf`;

  doc.save(saveName);
}
