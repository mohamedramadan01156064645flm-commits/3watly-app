"use client";

import type { Analysis } from './atsAnalysis';
import type { CVData } from '../types/cv';

function escapeHtml(str: unknown): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Generates a 100% Real-Text, 1-Page A4 ATS Diagnostic Report:
 * - 100% Vector Real Selectable & Copyable Text (NOT a photo/image)
 * - Supports genuine Arabic (Cairo) & English (Inter) typography
 * - Guaranteed strictly 1 single page with zero page overflow
 * - Clean Enterprise header: Date ONLY (No # 3W-... reference)
 * - AI Recommendations removed for a focused, clean layout
 * - Real vector SVG charts, donut score gauge, and badges
 */
export async function downloadAtsDiagnosticPdf(
  analysis: Analysis,
  cvData: CVData,
  isAr: boolean = false
): Promise<void> {
  const candidateName = cvData.contact.fullName?.trim() || (isAr ? 'المرشح المهني' : 'Candidate');
  const roleTitle = cvData.contact.jobTitle?.trim() || analysis.keywords.role || (isAr ? 'متخصص تقني' : 'Tech Professional');
  const currentDate = new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Score metrics
  const score = analysis.score;
  const circumference = 2 * Math.PI * 46;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const scoreColor = score >= 80 ? '#10B981' : score >= 65 ? '#3B82F6' : '#F59E0B';

  // Sub-scores
  const structureScore = Math.min(100, Math.round((analysis.structure.passed / Math.max(1, analysis.structure.total)) * 100));
  const parserScore = Math.min(100, Math.round((analysis.parser.passed / Math.max(1, analysis.parser.total)) * 100));
  const keywordScore = Math.min(100, Math.round((analysis.keywords.found.length / Math.max(1, analysis.keywords.total)) * 100));
  const impactScore = Math.min(100, Math.round((analysis.metricRatio || 0.75) * 100));

  const cleanName = candidateName.replace(/[/\\?%*:|"<>]/g, '_').trim() || 'Candidate';
  const langSuffix = isAr ? 'AR' : 'EN';
  const docTitle = `3WATLY_ATS_Report_${cleanName}_${langSuffix}`;

  // Create isolated hidden iframe for 100% clean, genuine vector text PDF generation
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.top = '-99999px';
  iframe.style.left = '-99999px';
  iframe.style.width = '210mm';
  iframe.style.height = '297mm';
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
<html lang="${isAr ? 'ar' : 'en'}" dir="${isAr ? 'rtl' : 'ltr'}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${docTitle}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 0 !important;
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
      width: 210mm !important;
      height: 297mm !important;
      max-height: 297mm !important;
      overflow: hidden !important;
      font-family: ${isAr ? "'Cairo', 'Segoe UI', Tahoma, sans-serif" : "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"};
      -webkit-font-smoothing: antialiased;
      page-break-after: avoid !important;
      page-break-inside: avoid !important;
    }
    @media print {
      body {
        margin: 0 !important;
        padding: 0 !important;
        width: 210mm !important;
        height: 297mm !important;
        max-height: 297mm !important;
        overflow: hidden !important;
      }
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 700;
    }
  </style>
</head>
<body style="background: #ffffff; color: #0F172A; margin: 0; padding: 0;">
  <div style="width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; box-sizing: border-box; padding: 12mm 14mm 10mm 14mm; display: flex; flex-direction: column; justify-content: space-between; background: #ffffff;">
    
    <div>
      <!-- TOP HEADER (Date ONLY, NO # 3W-... reference) -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0F172A; padding-bottom: 10px; margin-bottom: 12px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 38px; height: 38px; background: linear-gradient(135deg, #1B57E0 0%, #0F3BA0 100%); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #ffffff; font-weight: 900; font-size: 18px; letter-spacing: -0.5px; box-shadow: 0 2px 6px rgba(27,87,224,0.3);">
            3W
          </div>
          <div>
            <h1 style="margin: 0; font-size: 16px; font-weight: 900; color: #0F172A; letter-spacing: -0.3px;">
              ${isAr ? 'عواطلي • تقرير فحص ومطابقة الـ ATS الشامل' : '3WATLY • ATS DIAGNOSTICS & SCREENING AUDIT'}
            </h1>
            <p style="margin: 2px 0 0 0; font-size: 10.5px; color: #64748B; font-weight: 600;">
              ${isAr ? 'فحص ومطابقة لهيكل السيرة الذاتية وفق معايير أنظمة التوظيف الآلية (ATS)' : 'ATS Resume Structural & Keyword Screening Report'}
            </p>
          </div>
        </div>
        
        <!-- Date Badge Only -->
        <div style="text-align: ${isAr ? 'left' : 'right'};">
          <div style="display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; background: #F1F5F9; border: 1px solid #E2E8F0; border-radius: 8px; font-size: 10.5px; font-weight: 700; color: #334155;">
            <span>📅</span>
            <span>${currentDate}</span>
          </div>
        </div>
      </div>

      <!-- CANDIDATE SNAPSHOT CARD -->
      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 12px 16px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <span style="display: inline-block; padding: 2px 7px; background: #EEF2FF; color: #4338CA; border: 1px solid #C7D2FE; border-radius: 5px; font-size: 9.5px; font-weight: 700; margin-bottom: 3px;">
            ${isAr ? 'ملف السيرة الذاتية المفحوص' : 'AUDITED RESUME PROFILE'}
          </span>
          <h2 style="margin: 2px 0 0 0; font-size: 16px; font-weight: 900; color: #0F172A; letter-spacing: -0.2px;">
            ${escapeHtml(candidateName)}
          </h2>
          <p style="margin: 2px 0 0 0; font-size: 11.5px; color: #475569; font-weight: 600;">
            ${isAr ? 'المسمى المستهدف:' : 'Target Role:'} <span style="color: #1B57E0; font-weight: 800;">${escapeHtml(roleTitle)}</span>
          </p>
        </div>

        <div style="display: flex; gap: 16px; align-items: center;">
          <div style="text-align: center; border-${isAr ? 'left' : 'right'}: 1px solid #CBD5E1; padding-${isAr ? 'left' : 'right'}: 16px;">
            <div style="font-size: 10px; font-weight: 800; color: #64748B; text-transform: uppercase;">
              ${isAr ? 'الدرجة الإجمالية' : 'ATS Score'}
            </div>
            <div style="font-size: 17px; font-weight: 900; color: ${scoreColor}; margin-top: 1px;">
              ${score} / 100
            </div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 10px; font-weight: 800; color: #64748B; text-transform: uppercase;">
              ${isAr ? 'حالة التوافق' : 'ATS Status'}
            </div>
            <div style="font-size: 13px; font-weight: 900; color: ${scoreColor}; margin-top: 2px;">
              ${isAr ? analysis.bandLabelAr : analysis.bandLabel}
            </div>
          </div>
        </div>
      </div>

      <!-- MAIN CHARTS ROW: Donut Score Chart + 4 Progress Bars -->
      <div style="display: flex; gap: 12px; margin-bottom: 12px;">
        
        <!-- Chart 1: Donut Gauge (SVG Ring) -->
        <div style="flex: 0 0 200px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 10px 12px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <div style="font-size: 10.5px; font-weight: 800; color: #0F172A; margin-bottom: 3px;">
            ${isAr ? 'مؤشر التوافق الكلي (ATS Score)' : 'Overall ATS Match Score'}
          </div>

          <div style="position: relative; width: 90px; height: 90px; margin: 2px 0;">
            <svg width="90" height="90" viewBox="0 0 120 120" style="transform: rotate(-90deg);">
              <circle cx="60" cy="60" r="46" fill="none" stroke="#E2E8F0" stroke-width="11" />
              <circle
                cx="60"
                cy="60"
                r="46"
                fill="none"
                stroke="${scoreColor}"
                stroke-width="11"
                stroke-linecap="round"
                stroke-dasharray="${circumference}"
                stroke-dashoffset="${strokeDashoffset}"
              />
            </svg>
            <div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;">
              <span style="font-size: 21px; font-weight: 900; color: #0F172A; line-height: 1;">${score}</span>
              <span style="font-size: 8.5px; font-weight: 800; color: #64748B;">/ 100</span>
            </div>
          </div>

          <p style="margin: 2px 0 0 0; font-size: 9.5px; color: #64748B; font-weight: 600; line-height: 1.3;">
            ${isAr ? (analysis.descriptionAr || 'سيرتك الذاتية مهيأة ومطابقة لأنظمة الفرز الآلي') : (analysis.description || 'Strong alignment with ATS parsers')}
          </p>
        </div>

        <!-- Chart 2: 4 Category Progress Bars -->
        <div style="flex: 1; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 10px 14px; display: flex; flex-direction: column; justify-content: center; gap: 7px;">
          <div style="font-size: 10.5px; font-weight: 800; color: #0F172A; border-bottom: 1px solid #E2E8F0; padding-bottom: 3px;">
            ${isAr ? 'مؤشرات الأداء الفرعية لمعايير الفحص' : 'ATS Sub-Criteria Performance Breakdown'}
          </div>

          <!-- Bar 1: Structure -->
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 9.5px; font-weight: 700; margin-bottom: 2px;">
              <span>${isAr ? '1. الهيكل والتنسيق المعتمد' : '1. Standard ATS Layout & Sections'}</span>
              <span style="color: #1B57E0; font-weight: 800;">${structureScore}%</span>
            </div>
            <div style="height: 5px; width: 100%; background: #E2E8F0; border-radius: 999px; overflow: hidden;">
              <div style="height: 100%; width: ${structureScore}%; background: #1B57E0; border-radius: 999px;"></div>
            </div>
          </div>

          <!-- Bar 2: Parser Readability -->
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 9.5px; font-weight: 700; margin-bottom: 2px;">
              <span>${isAr ? '2. سهولة القراءة الآلية (Parser Readability)' : '2. Machine Readability & Parsing'}</span>
              <span style="color: #10B981; font-weight: 800;">${parserScore}%</span>
            </div>
            <div style="height: 5px; width: 100%; background: #E2E8F0; border-radius: 999px; overflow: hidden;">
              <div style="height: 100%; width: ${parserScore}%; background: #10B981; border-radius: 999px;"></div>
            </div>
          </div>

          <!-- Bar 3: Keywords -->
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 9.5px; font-weight: 700; margin-bottom: 2px;">
              <span>${isAr ? '3. الكلمات المفتاحية ومطابقة السوق' : '3. Egyptian Market Keyword Density'}</span>
              <span style="color: #8B5CF6; font-weight: 800;">${keywordScore}%</span>
            </div>
            <div style="height: 5px; width: 100%; background: #E2E8F0; border-radius: 999px; overflow: hidden;">
              <div style="height: 100%; width: ${keywordScore}%; background: #8B5CF6; border-radius: 999px;"></div>
            </div>
          </div>

          <!-- Bar 4: Impact & Measurable Results -->
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 9.5px; font-weight: 700; margin-bottom: 2px;">
              <span>${isAr ? '4. صياغة الإنجازات والنتائج القابلة للقياس' : '4. Action Verbs & Quantifiable Impact'}</span>
              <span style="color: #F59E0B; font-weight: 800;">${impactScore}%</span>
            </div>
            <div style="height: 5px; width: 100%; background: #E2E8F0; border-radius: 999px; overflow: hidden;">
              <div style="height: 100%; width: ${impactScore}%; background: #F59E0B; border-radius: 999px;"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION 2: KEYWORD MATRIX -->
      <div style="background: #ffffff; border: 1px solid #E2E8F0; border-radius: 12px; padding: 12px 16px; margin-bottom: 12px;">
        <h3 style="margin: 0 0 7px 0; font-size: 11.5px; font-weight: 900; color: #0F172A; display: flex; align-items: center; gap: 6px;">
          <span>🎯</span>
          <span>${isAr ? 'مطابقة الكلمات المفتاحية الأكثر طلباً في السوق المصري' : 'Egyptian Tech Market Keyword Intelligence'}</span>
        </h3>

        <!-- Detected Keywords -->
        <div style="margin-bottom: 7px;">
          <div style="font-size: 10px; font-weight: 800; color: #166534; margin-bottom: 4px;">
            ✓ ${isAr ? 'مهارات تقنية تم رصدها بنجاح داخل سيرتك:' : 'Keywords detected successfully in your resume:'}
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 4px;">
            ${
              analysis.keywords.found.length > 0
                ? analysis.keywords.found
                    .map(
                      (k) =>
                        `<span style="padding: 2px 7px; background: #DCFCE7; color: #166534; border: 1px solid #BBF7D0; border-radius: 5px; font-size: 9.5px; font-weight: 700;">${escapeHtml(k)}</span>`
                    )
                    .join('')
                : `<span style="font-size: 9.5px; color: #64748B;">${isAr ? 'لم يتم رصد مهارات تقنية كافية' : 'No primary keywords detected'}</span>`
            }
          </div>
        </div>

        <!-- Missing Keywords -->
        <div>
          <div style="font-size: 10px; font-weight: 800; color: #991B1B; margin-bottom: 4px;">
            ⚠️ ${isAr ? 'كلمات مفتاحية حيوية يُنصح بإضافتها لزيادة فرص الترشح:' : 'High-demand keywords missing for this role in Egypt:'}
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 4px;">
            ${
              analysis.keywords.missing.length > 0
                ? analysis.keywords.missing
                    .slice(0, 10)
                    .map(
                      (k) =>
                        `<span style="padding: 2px 7px; background: #FEE2E2; color: #991B1B; border: 1px solid #FECACA; border-radius: 5px; font-size: 9.5px; font-weight: 700;">+ ${escapeHtml(k)}</span>`
                    )
                    .join('')
                : `<span style="font-size: 9.5px; color: #166534; font-weight: 800;">${isAr ? 'ممتاز! سيرتك تغطي كافة الكلمات الأساسية.' : 'All key skills covered!'}</span>`
            }
          </div>
        </div>
      </div>

      <!-- SECTION 3: CHECKLIST TABLE -->
      <div style="background: #ffffff; border: 1px solid #E2E8F0; border-radius: 12px; padding: 12px 16px;">
        <h3 style="margin: 0 0 7px 0; font-size: 11.5px; font-weight: 900; color: #0F172A; display: flex; align-items: center; gap: 6px;">
          <span>📋</span>
          <span>${isAr ? 'جدول التدقيق الفني الشامل للهيكل وقابلية القراءة' : 'ATS Parser Technical Compliance Audit'}</span>
        </h3>

        <div style="display: flex; flex-direction: column; gap: 3.5px;">
          ${[...analysis.structure.items, ...analysis.parser.items]
            .slice(0, 7)
            .map(
              (item) => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 8px; background: #F8FAFC; border: 1px solid #F1F5F9; border-radius: 6px; font-size: 10px;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="font-weight: 900; color: ${item.passed ? '#10B981' : '#EF4444'}; font-size: 10.5px;">${item.passed ? '✓' : '✗'}</span>
                <span style="font-weight: 700; color: #0F172A;">${escapeHtml(isAr ? (item.labelAr || item.label) : item.label)}</span>
              </div>
              <span style="padding: 1.5px 6px; border-radius: 4px; font-size: 9px; font-weight: 800; background: ${item.passed ? '#DCFCE7' : '#FEE2E2'}; color: ${item.passed ? '#166534' : '#991B1B'}; border: 1px solid ${item.passed ? '#BBF7D0' : '#FECACA'};">
                ${item.passed ? (isAr ? 'مستوفى (PASS)' : 'PASSED') : (isAr ? 'تنبيه (ATTN)' : 'ATTENTION')}
              </span>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    </div>

    <!-- ENTERPRISE FOOTER -->
    <div style="border-top: 1px solid #E2E8F0; padding-top: 8px; margin-top: 8px; display: flex; justify-content: space-between; align-items: center; font-size: 9px; color: #94A3B8; font-weight: 600;">
      <div>${isAr ? 'تم الإنشاء بواسطة منصة عواطلي • 3watly.com' : 'Generated by 3WATLY Platform • 3watly.com'}</div>
      <div>${isAr ? 'تقرير فحص ATS استشاري معتمد • صفحة 1 من 1' : 'Certified ATS Diagnostic Audit • Page 1 of 1'}</div>
    </div>

  </div>
</body>
</html>`);
  iframeDoc.close();

  // Allow fonts & styles to settle
  await new Promise((resolve) => setTimeout(resolve, 350));

  try {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
  } catch (printErr) {
    console.error('Print iframe error:', printErr);
    window.print();
  } finally {
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 2500);
  }
}
