"use client";

function escapeHtml(str: unknown): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export interface CandidateCvExportData {
  userFullName: string;
  userEmail: string;
  targetRole: string;
  targetIndustry?: string;
  atsScore: number;
  summary?: string;
  parsedSkills: string[];
  experiences?: Array<{
    role?: string;
    company?: string;
    startDate?: string;
    endDate?: string;
    bullets?: string[];
    location?: string;
  }>;
  education?: Array<{
    degree?: string;
    institution?: string;
    startDate?: string;
    endDate?: string;
    major?: string;
  }>;
  projects?: Array<{
    title?: string;
    technologies?: string[];
    bullets?: string[];
    github?: string;
    link?: string;
  }>;
  source?: 'uploaded' | 'profile';
  createdAt?: string;
}

export async function exportCandidateCvToPdf(data: CandidateCvExportData, isAr: boolean = false): Promise<void> {
  const candidateName = data.userFullName || (isAr ? 'مرشح مهني' : 'Candidate');
  const cleanName = candidateName.replace(/[/\\?%*:|"<>]/g, '_').trim();
  const docTitle = `3WATLY_CV_${cleanName}`;

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.top = '-99999px';
  iframe.style.left = '-99999px';
  iframe.style.width = '210mm';
  iframe.style.minHeight = '297mm';
  iframe.style.border = 'none';
  iframe.style.zIndex = '-99999';
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!iframeDoc) {
    if (document.body.contains(iframe)) document.body.removeChild(iframe);
    window.print();
    return;
  }

  const fontFamily = isAr
    ? "'Cairo', -apple-system, BlinkMacSystemFont, 'Segoe UI', Tahoma, sans-serif"
    : "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif";

  iframeDoc.open();
  iframeDoc.write(`<!DOCTYPE html>
<html lang="${isAr ? 'ar' : 'en'}" dir="${isAr ? 'rtl' : 'ltr'}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(docTitle)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 14mm 12mm 14mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    html, body {
      background: #ffffff !important;
      background-color: #ffffff !important;
      color: #0F172A !important;
      margin: 0 !important;
      padding: 0 !important;
      font-family: ${fontFamily};
      -webkit-font-smoothing: antialiased;
      line-height: 1.5;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 2.5px 8px;
      border-radius: 6px;
      font-size: 10.5px;
      font-weight: 700;
    }
    .skill-pill {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 6px;
      background: #F1F5F9;
      color: #1E293B;
      border: 1px solid #E2E8F0;
      font-size: 10.5px;
      font-weight: 700;
      margin-inline-end: 4px;
      margin-bottom: 4px;
    }
    .section-title {
      font-size: 13px;
      font-weight: 900;
      color: #0F172A;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1.5px solid #0F172A;
      padding-bottom: 4px;
      margin-bottom: 10px;
      margin-top: 14px;
    }
    .item-card {
      margin-bottom: 10px;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
  </style>
</head>
<body style="background: #ffffff; color: #0F172A; padding: 4px;">

  <!-- HEADER -->
  <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0F172A; padding-bottom: 12px; margin-bottom: 14px;">
    <div>
      <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: #0F172A; letter-spacing: -0.5px;">
        ${escapeHtml(candidateName)}
      </h1>
      <div style="font-size: 13px; font-weight: 800; color: #1B57E0; margin-top: 2px;">
        ${escapeHtml(data.targetRole || (isAr ? 'متخصص تقني' : 'Technical Professional'))}
      </div>
      <div style="font-size: 11px; color: #64748B; margin-top: 4px; display: flex; gap: 12px;">
        <span>✉️ ${escapeHtml(data.userEmail || '—')}</span>
        ${data.targetIndustry ? `<span>🏢 ${escapeHtml(data.targetIndustry)}</span>` : ''}
      </div>
    </div>

    <!-- ATS & Platform Badge -->
    <div style="text-align: ${isAr ? 'left' : 'right'};">
      <div style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 8px; background: #DCFCE7; border: 1px solid #BBF7D0; color: #15803D; font-size: 11px; font-weight: 800;">
        <span>ATS Score:</span>
        <span style="font-size: 13px;">${data.atsScore}%</span>
      </div>
      <div style="font-size: 9.5px; color: #64748B; font-weight: 600; margin-top: 4px;">
        ${data.source === 'uploaded' ? (isAr ? 'ملف سيرة ذاتية مرفوع' : 'Uploaded CV Document') : (isAr ? 'سيرة المنصة الموثقة' : 'Verified Platform Profile CV')}
      </div>
    </div>
  </div>

  <!-- SUMMARY -->
  ${data.summary ? `
    <div class="item-card">
      <div class="section-title">${isAr ? 'الملخص المهني' : 'Professional Summary'}</div>
      <p style="margin: 0; font-size: 11.5px; color: #334155; line-height: 1.6; font-weight: 500;">
        ${escapeHtml(data.summary)}
      </p>
    </div>
  ` : ''}

  <!-- SKILLS -->
  ${data.parsedSkills && data.parsedSkills.length > 0 ? `
    <div class="item-card">
      <div class="section-title">${isAr ? 'المهارات التقنية والأساسية' : 'Technical & Core Skills'}</div>
      <div style="display: flex; flex-wrap: wrap;">
        ${data.parsedSkills.map(s => `<span class="skill-pill">${escapeHtml(s)}</span>`).join('')}
      </div>
    </div>
  ` : ''}

  <!-- EXPERIENCES -->
  ${data.experiences && data.experiences.length > 0 ? `
    <div class="item-card">
      <div class="section-title">${isAr ? 'الخبرات المهنية والعملية' : 'Work Experience'}</div>
      ${data.experiences.map(exp => `
        <div style="margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <span style="font-size: 12.5px; font-weight: 800; color: #0F172A;">${escapeHtml(exp.role || 'Role')}</span>
            <span style="font-size: 10.5px; font-weight: 700; color: #64748B;">
              ${escapeHtml(exp.startDate || '')} ${exp.endDate ? `– ${escapeHtml(exp.endDate)}` : ''}
            </span>
          </div>
          <div style="font-size: 11px; font-weight: 700; color: #1B57E0; margin-bottom: 4px;">
            ${escapeHtml(exp.company || '')} ${exp.location ? `• ${escapeHtml(exp.location)}` : ''}
          </div>
          ${exp.bullets && exp.bullets.length > 0 ? `
            <ul style="margin: 3px 0 0 0; padding-inline-start: 18px; font-size: 11px; color: #334155; line-height: 1.5;">
              ${exp.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      `).join('')}
    </div>
  ` : ''}

  <!-- EDUCATION -->
  ${data.education && data.education.length > 0 ? `
    <div class="item-card">
      <div class="section-title">${isAr ? 'التعليم والمؤهلات الأكاديمية' : 'Education'}</div>
      ${data.education.map(edu => `
        <div style="margin-bottom: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <span style="font-size: 12px; font-weight: 800; color: #0F172A;">${escapeHtml(edu.degree || 'Degree')}</span>
            <span style="font-size: 10.5px; font-weight: 700; color: #64748B;">
              ${escapeHtml(edu.startDate || '')} ${edu.endDate ? `– ${escapeHtml(edu.endDate)}` : ''}
            </span>
          </div>
          <div style="font-size: 11px; color: #475569; font-weight: 600;">
            ${escapeHtml(edu.institution || '')} ${edu.major ? `• ${escapeHtml(edu.major)}` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  ` : ''}

  <!-- PROJECTS -->
  ${data.projects && data.projects.length > 0 ? `
    <div class="item-card">
      <div class="section-title">${isAr ? 'المشاريع البارزة' : 'Featured Projects'}</div>
      ${data.projects.map(proj => `
        <div style="margin-bottom: 8px;">
          <div style="font-size: 12px; font-weight: 800; color: #0F172A;">${escapeHtml(proj.title || 'Project')}</div>
          ${proj.technologies && proj.technologies.length > 0 ? `
            <div style="font-size: 10.5px; color: #1B57E0; font-weight: 700; margin-bottom: 2px;">
              ${proj.technologies.map(t => escapeHtml(t)).join(' · ')}
            </div>
          ` : ''}
          ${proj.bullets && proj.bullets.length > 0 ? `
            <ul style="margin: 2px 0 0 0; padding-inline-start: 18px; font-size: 11px; color: #334155; line-height: 1.45;">
              ${proj.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      `).join('')}
    </div>
  ` : ''}

  <!-- FOOTER -->
  <div style="margin-top: 24px; padding-top: 10px; border-top: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center; font-size: 9.5px; color: #94A3B8; font-weight: 600;">
    <div>
      ${isAr ? 'منصة عواتلي للذكاء المهني • 3WATLY Platform' : '3WATLY Tech Career Platform • 3watly.com'}
    </div>
    <div>
      ${isAr ? 'نسخة معتمدة من استوديو الإدارة' : 'Official Document via Admin Studio'}
    </div>
  </div>

</body>
</html>`);
  iframeDoc.close();

  await new Promise((resolve) => setTimeout(resolve, 400));

  try {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
  } catch (err) {
    console.error('Print iframe error:', err);
    window.print();
  } finally {
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 2500);
  }
}
