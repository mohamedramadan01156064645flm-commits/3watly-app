"use client";

import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
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
 * Downloads a comprehensive, beautifully styled, bilingual ATS Diagnostic Report as a high-resolution PDF.
 * Includes:
 * - Visual circular SVG score gauge chart
 * - 4 Category progress bar charts
 * - Full Arabic (RTL) & English (LTR) bilingual localization
 * - Market keyword matrix (found vs missing)
 * - Complete ATS structural compliance checklist
 * - Prioritized AI recommendations
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
  // Deterministic report ID from candidate name and role
  let hash = 0;
  const hashSource = `${candidateName}_${roleTitle}`;
  for (let i = 0; i < hashSource.length; i++) {
    hash = (hash * 31 + hashSource.charCodeAt(i)) & 0xffffff;
  }
  const reportId = `3W-${String(Math.abs(hash) % 900000 + 100000)}`;

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

  // Build the off-screen report container
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '-99999px';
  container.style.left = '-99999px';
  container.style.width = '794px'; // Exact A4 width at 96 DPI
  container.style.backgroundColor = '#0F172A';
  container.style.color = '#0F172A';
  container.style.zIndex = '-99999';

  // Build HTML string according to language
  container.innerHTML = `
    <div dir="${isAr ? 'rtl' : 'ltr'}" style="width: 794px; min-height: 1123px; background: #ffffff; color: #0F172A; font-family: ${isAr ? "'Segoe UI', Tahoma, Arial, sans-serif" : "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"}; padding: 36px 42px; box-sizing: border-box;">
      
      <!-- Top Brand Header Bar -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0F172A; padding-bottom: 16px; margin-bottom: 24px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 40px; height: 40px; background: #1B57E0; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #ffffff; font-weight: 900; font-size: 20px;">
            3W
          </div>
          <div>
            <h1 style="margin: 0; font-size: 19px; font-weight: 800; color: #0F172A; letter-spacing: -0.5px;">
              ${isAr ? 'عواطلي • تقرير فحص ومطابقة الـ ATS الشامل' : '3WATLY • ATS DIAGNOSTICS & SCREENING AUDIT'}
            </h1>
            <p style="margin: 2px 0 0 0; font-size: 11px; color: #64748B; font-weight: 500;">
              ${isAr ? 'فحص ومطابقة لهيكل السيرة الذاتية وفق معايير أنظمة ATS' : 'ATS Resume Structural & Keyword Screening Report'}
            </p>
          </div>
        </div>
        <div style="text-align: ${isAr ? 'left' : 'right'}; font-size: 10px; color: #64748B;">
          <div style="font-weight: 700; color: #1B57E0;"># ${reportId}</div>
          <div>${currentDate}</div>
        </div>
      </div>

      <!-- Candidate Snapshot Card -->
      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 14px; padding: 18px 22px; margin-bottom: 22px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <span style="display: inline-block; padding: 2px 8px; background: #EEF2FF; color: #4338CA; border-radius: 6px; font-size: 10px; font-weight: 700; margin-bottom: 6px;">
            ${isAr ? 'ملف السيرة الذاتية المفحوص' : 'AUDITED RESUME PROFILE'}
          </span>
          <h2 style="margin: 0; font-size: 17px; font-weight: 800; color: #0F172A;">${escapeHtml(candidateName)}</h2>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #475569; font-weight: 600;">
            ${isAr ? 'المسمى المستهدف:' : 'Target Role:'} <span style="color: #1B57E0;">${escapeHtml(roleTitle)}</span>
          </p>
        </div>
        <div style="display: flex; gap: 20px;">
          <div style="text-align: center; border-${isAr ? 'left' : 'right'}: 1px solid #CBD5E1; padding-${isAr ? 'left' : 'right'}: 18px;">
            <div style="font-size: 10px; font-weight: 700; color: #64748B; text-transform: uppercase;">
              ${isAr ? 'الدرجة الإجمالية' : 'ATS Score'}
            </div>
            <div style="font-size: 16px; font-weight: 800; color: ${scoreColor}; margin-top: 2px;">
              ${score} / 100
            </div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 10px; font-weight: 700; color: #64748B; text-transform: uppercase;">
              ${isAr ? 'حالة التوافق' : 'ATS Status'}
            </div>
            <div style="font-size: 14px; font-weight: 800; color: ${scoreColor}; margin-top: 4px;">
              ${isAr ? analysis.bandLabelAr : analysis.bandLabel}
            </div>
          </div>
        </div>
      </div>

      <!-- MAIN CHARTS ROW: Donut Score Chart + 4 Progress Bars -->
      <div style="display: flex; gap: 20px; margin-bottom: 22px;">
        
        <!-- Chart 1: Donut Gauge (SVG Ring) -->
        <div style="flex: 0 0 240px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 14px; padding: 18px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <div style="font-size: 12px; font-weight: 800; color: #0F172A; margin-bottom: 8px;">
            ${isAr ? 'مؤشر التوافق الكلي (ATS Score)' : 'Overall ATS Match Score'}
          </div>

          <div style="position: relative; width: 120px; height: 120px; margin: 4px 0;">
            <svg width="120" height="120" viewBox="0 0 120 120" style="transform: rotate(-90deg);">
              <!-- Background track -->
              <circle cx="60" cy="60" r="46" fill="none" stroke="#E2E8F0" stroke-width="12" />
              <!-- Animated progress ring -->
              <circle
                cx="60"
                cy="60"
                r="46"
                fill="none"
                stroke="${scoreColor}"
                stroke-width="12"
                stroke-linecap="round"
                stroke-dasharray="${circumference}"
                stroke-dashoffset="${strokeDashoffset}"
              />
            </svg>
            <div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;">
              <span style="font-size: 28px; font-weight: 900; color: #0F172A; line-height: 1;">${score}</span>
              <span style="font-size: 10px; font-weight: 700; color: #64748B;">/ 100</span>
            </div>
          </div>

          <p style="margin: 6px 0 0 0; font-size: 10.5px; color: #64748B; line-height: 1.4;">
            ${isAr ? (analysis.descriptionAr || 'جاهزية عالية للفرز الآلي بالشركات') : (analysis.description || 'Strong alignment with Egyptian ATS parsers')}
          </p>
        </div>

        <!-- Chart 2: 4 Category Progress Bars -->
        <div style="flex: 1; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 14px; padding: 18px 22px; display: flex; flex-direction: column; justify-content: center; gap: 14px;">
          <div style="font-size: 12px; font-weight: 800; color: #0F172A; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px;">
            ${isAr ? 'مؤشرات الأداء الفرعية لمعايير الفحص' : 'ATS Sub-Criteria Performance Breakdown'}
          </div>

          <!-- Bar 1: Structure -->
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; margin-bottom: 4px;">
              <span>${isAr ? '1. الهيكل والتنسيق المعتمد' : '1. Standard ATS Layout & Sections'}</span>
              <span style="color: #1B57E0;">${structureScore}%</span>
            </div>
            <div style="height: 7px; width: 100%; background: #E2E8F0; border-radius: 999px; overflow: hidden;">
              <div style="height: 100%; width: ${structureScore}%; background: #1B57E0; border-radius: 999px;"></div>
            </div>
          </div>

          <!-- Bar 2: Parser Readability -->
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; margin-bottom: 4px;">
              <span>${isAr ? '2. سهولة القراءة الآلية (Parser Readability)' : '2. Machine Readability & Parsing'}</span>
              <span style="color: #10B981;">${parserScore}%</span>
            </div>
            <div style="height: 7px; width: 100%; background: #E2E8F0; border-radius: 999px; overflow: hidden;">
              <div style="height: 100%; width: ${parserScore}%; background: #10B981; border-radius: 999px;"></div>
            </div>
          </div>

          <!-- Bar 3: Keywords -->
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; margin-bottom: 4px;">
              <span>${isAr ? '3. الكلمات المفتاحية ومطابقة السوق' : '3. Egyptian Market Keyword Density'}</span>
              <span style="color: #8B5CF6;">${keywordScore}%</span>
            </div>
            <div style="height: 7px; width: 100%; background: #E2E8F0; border-radius: 999px; overflow: hidden;">
              <div style="height: 100%; width: ${keywordScore}%; background: #8B5CF6; border-radius: 999px;"></div>
            </div>
          </div>

          <!-- Bar 4: Impact & Measurable Results -->
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; margin-bottom: 4px;">
              <span>${isAr ? '4. صياغة الإنجازات والنتائج القابلة للقياس' : '4. Action Verbs & Quantifiable Impact'}</span>
              <span style="color: #F59E0B;">${impactScore}%</span>
            </div>
            <div style="height: 7px; width: 100%; background: #E2E8F0; border-radius: 999px; overflow: hidden;">
              <div style="height: 100%; width: ${impactScore}%; background: #F59E0B; border-radius: 999px;"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION 2: KEYWORD MATRIX -->
      <div style="background: #ffffff; border: 1px solid #E2E8F0; border-radius: 14px; padding: 18px 22px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 12px 0; font-size: 13px; font-weight: 800; color: #0F172A; display: flex; align-items: center; gap: 8px;">
          <span>🎯</span>
          <span>${isAr ? 'مطابقة الكلمات المفتاحية الأكثر طلباً في السوق المصري' : 'Egyptian Tech Market Keyword Intelligence'}</span>
        </h3>

        <!-- Detected Keywords -->
        <div style="margin-bottom: 12px;">
          <div style="font-size: 11px; font-weight: 700; color: #166534; margin-bottom: 6px;">
            ✓ ${isAr ? 'مهارات تقنية تم رصدها بنجاح داخل سيرتك:' : 'Keywords detected successfully in your resume:'}
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            ${
              analysis.keywords.found.length > 0
                ? analysis.keywords.found
                    .map(
                      (k) =>
                        `<span style="padding: 3px 9px; background: #DCFCE7; color: #166534; border: 1px solid #BBF7D0; border-radius: 6px; font-size: 10.5px; font-weight: 700;">${escapeHtml(k)}</span>`
                    )
                    .join('')
                : `<span style="font-size: 11px; color: #64748B;">${isAr ? 'لم يتم رصد مهارات تقنية كافية' : 'No primary keywords detected'}</span>`
            }
          </div>
        </div>

        <!-- Missing Keywords -->
        <div>
          <div style="font-size: 11px; font-weight: 700; color: #991B1B; margin-bottom: 6px;">
            ⚠️ ${isAr ? 'كلمات مفتاحية حيوية يُنصح بإضافتها لزيادة فرص الترشح:' : 'High-demand keywords missing for this role in Egypt:'}
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            ${
              analysis.keywords.missing.length > 0
                ? analysis.keywords.missing
                    .slice(0, 10)
                    .map(
                      (k) =>
                        `<span style="padding: 3px 9px; background: #FEE2E2; color: #991B1B; border: 1px solid #FECACA; border-radius: 6px; font-size: 10.5px; font-weight: 700;">+ ${escapeHtml(k)}</span>`
                    )
                    .join('')
                : `<span style="font-size: 11px; color: #166534; font-weight: 700;">${isAr ? 'ممتاز! سيرتك تغطي كافة الكلمات الأساسية.' : 'All key skills covered!'}</span>`
            }
          </div>
        </div>
      </div>

      <!-- SECTION 3: CHECKLIST TABLE -->
      <div style="background: #ffffff; border: 1px solid #E2E8F0; border-radius: 14px; padding: 18px 22px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 12px 0; font-size: 13px; font-weight: 800; color: #0F172A; display: flex; align-items: center; gap: 8px;">
          <span>📋</span>
          <span>${isAr ? 'جدول التدقيق الفني الشامل للهيكل وقابلية القراءة' : 'ATS Parser Technical Compliance Audit'}</span>
        </h3>

        <div style="display: grid; grid-cols: 1; gap: 6px;">
          ${[...analysis.structure.items, ...analysis.parser.items]
            .slice(0, 7)
            .map(
              (item) => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 7px 10px; background: #F8FAFC; border-radius: 8px; font-size: 11px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-weight: 800; color: ${item.passed ? '#10B981' : '#EF4444'};">${item.passed ? '✓' : '✗'}</span>
                <span style="font-weight: 700; color: #0F172A;">${escapeHtml(isAr ? (item.labelAr || item.label) : item.label)}</span>
              </div>
              <span style="padding: 2px 7px; border-radius: 4px; font-size: 9.5px; font-weight: 800; background: ${item.passed ? '#DCFCE7' : '#FEE2E2'}; color: ${item.passed ? '#166534' : '#991B1B'};">
                ${item.passed ? (isAr ? 'مستوفى (PASS)' : 'PASSED') : (isAr ? 'تنبيه (ATTN)' : 'ATTENTION')}
              </span>
            </div>
          `
            )
            .join('')}
        </div>
      </div>

      <!-- SECTION 4: RECOMMENDED FIXES -->
      <div style="background: #EEF2FF; border: 1px solid #C7D2FE; border-radius: 14px; padding: 18px 22px; margin-bottom: 22px;">
        <h3 style="margin: 0 0 10px 0; font-size: 13px; font-weight: 800; color: #312E81; display: flex; align-items: center; gap: 8px;">
          <span>💡</span>
          <span>${isAr ? 'توصيات الذكاء الاصطناعي ذات الأولوية القصوى لتحسين النتيجة' : 'Top Actionable AI Recommendations for Shortlist Advantage'}</span>
        </h3>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${
            analysis.fixes.length > 0
              ? analysis.fixes
                  .slice(0, 3)
                  .map(
                    (fix, idx) => `
            <div style="background: #ffffff; border-radius: 8px; padding: 10px 14px; border-inline-start: 4px solid #4F46E5;">
              <div style="font-size: 11.5px; font-weight: 800; color: #1E1B4B;">
                ${idx + 1}. ${escapeHtml(isAr ? (fix.titleAr || fix.title) : fix.title)}
              </div>
              <div style="font-size: 10.5px; color: #475569; margin-top: 2px; line-height: 1.4;">
                ${escapeHtml(isAr ? (fix.whyAr || fix.why) : fix.why)}
              </div>
            </div>
          `
                  )
                  .join('')
              : `
            <div style="background: #ffffff; border-radius: 8px; padding: 12px; font-size: 11px; color: #166534; font-weight: 700;">
              ✓ ${isAr ? 'سيرتك الذاتية مستوفية لكافة المعايير الأساسية ومجهزة للتقديم المباشر!' : 'Your resume meets all critical benchmarks and is ready for application!'}
            </div>
          `
          }
        </div>
      </div>

      <!-- FOOTER -->
      <div style="border-top: 1px solid #E2E8F0; padding-top: 12px; display: flex; justify-content: space-between; align-items: center; font-size: 9.5px; color: #94A3B8;">
        <div>${isAr ? 'تم الإنشاء بواسطة منصة عواطلي • 3watly.com' : 'Generated by 3WATLY Platform • 3watly.com'}</div>
        <div>${isAr ? 'تقرير فحص ATS استشاري • صفحة 1 من 1' : 'ATS Diagnostic Report • Page 1 of 1'}</div>
      </div>

    </div>
  `;

  document.body.appendChild(container);

  try {
    const dataUrl = await toPng(container.firstElementChild as HTMLElement, {
      quality: 0.98,
      pixelRatio: 2.2, // Razor-sharp 2.2x DPI
      backgroundColor: '#ffffff',
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth(); // 595.28 pt
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 841.89 pt

    // Fit cleanly to A4
    pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

    const cleanName = candidateName.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '_') || 'Resume';
    const langSuffix = isAr ? 'AR' : 'EN';
    pdf.save(`3WATLY_ATS_Report_${cleanName}_${langSuffix}.pdf`);
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}
