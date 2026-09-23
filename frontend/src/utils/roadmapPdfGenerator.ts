"use client";

import type { SkillPlan } from '../types/skills';

function escapeHtml(str: unknown): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export interface RoadmapPdfWeek {
  weekNum: number;
  title: string;
  duration: string;
  description: string;
  deliverable: string;
  hoursLabel: string;
  skills: { def: { id?: string; name: string } }[];
  resources?: { title: string; provider: string; kind?: string }[];
}

export interface RoadmapPdfOptions {
  plan: SkillPlan;
  roleName: string;
  weeksRoadmap: RoadmapPdfWeek[];
  isAr: boolean;
}

export async function downloadRoadmapPdf({
  plan,
  roleName,
  weeksRoadmap,
  isAr,
}: RoadmapPdfOptions): Promise<void> {
  const currentDate = new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const readinessPct = plan?.readinessPct ?? 65;
  const eligibleJobs = plan?.eligibleJobs ?? 140;
  const potentialJobs = plan?.potentialJobs ?? 320;
  const salaryUplift = plan?.salaryUplift ?? 25;
  const totalWeeks = weeksRoadmap.length || 6;
  const cleanRole = (roleName || (isAr ? 'المسار المهني' : 'Career Track')).replace(/[/\\?%*:|"<>]/g, '_').trim();
  const docTitle = `3WATLY_Roadmap_${cleanRole}_${isAr ? 'AR' : 'EN'}`;

  // Create isolated hidden iframe for high-resolution vector PDF generation
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
      margin: 10mm 12mm 12mm 12mm;
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
    @media print {
      body {
        margin: 0 !important;
        padding: 0 !important;
        background: #ffffff !important;
      }
      .no-print {
        display: none !important;
      }
      .page-break {
        page-break-before: always !important;
        break-before: page !important;
      }
    }
    .phase-card {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
      margin-bottom: 12px;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 14px 16px;
      background: #FFFFFF;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
      position: relative;
    }
    .phase-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 8px;
      background: linear-gradient(135deg, #1B57E0 0%, #0F3BA0 100%);
      color: #FFFFFF;
      font-weight: 800;
      font-size: 13px;
      letter-spacing: -0.2px;
    }
    .skill-chip {
      display: inline-flex;
      align-items: center;
      padding: 2.5px 8px;
      border-radius: 6px;
      font-size: 10.5px;
      font-weight: 700;
      background: #F1F5F9;
      color: #1E293B;
      border: 1px solid #E2E8F0;
      margin-inline-end: 4px;
      margin-bottom: 4px;
    }
    .deliverable-box {
      margin-top: 10px;
      padding: 9px 12px;
      background: #F0FDF4;
      border: 1px solid #BBF7D0;
      border-radius: 8px;
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }
    .deliverable-icon {
      flex-shrink: 0;
      width: 16px;
      height: 16px;
      margin-top: 2px;
      color: #15803D;
    }
    .kpi-tile {
      flex: 1;
      padding: 10px 12px;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 10px;
      min-width: 0;
    }
  </style>
</head>
<body style="background: #ffffff; color: #0F172A; padding: 2px;">

  <!-- ═══════════════════════════════════════════════════════ -->
  <!-- PAGE HEADER & BRANDING                                 -->
  <!-- ═══════════════════════════════════════════════════════ -->
  <div style="border-bottom: 2px solid #0F172A; padding-bottom: 12px; margin-bottom: 14px;">
    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;">
      
      <!-- Logo & Main Title -->
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="width: 44px; height: 44px; background: linear-gradient(135deg, #1B57E0 0%, #0F3BA0 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #ffffff; font-weight: 900; font-size: 20px; letter-spacing: -0.5px; box-shadow: 0 4px 12px rgba(27,87,224,0.3); flex-shrink: 0;">
          3W
        </div>
        <div>
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 2px;">
            <span style="font-size: 13px; font-weight: 900; color: #1B57E0; letter-spacing: 0.5px;">3WATLY</span>
            <span style="font-size: 10px; font-weight: 800; color: #64748B; text-transform: uppercase; letter-spacing: 1px;">• ${isAr ? 'ذكاء المسار المهني وسوق العمل' : 'Career Intelligence & Market Analytics'}</span>
          </div>
          <h1 style="margin: 0; font-size: 18px; font-weight: 900; color: #0F172A; letter-spacing: -0.3px;">
            ${isAr ? `خارطة طريق التطوير المهني: ${escapeHtml(roleName)}` : `Career Skill Roadmap: ${escapeHtml(roleName)}`}
          </h1>
          <p style="margin: 3px 0 0 0; font-size: 11px; color: #475569; font-weight: 500;">
            ${isAr
              ? 'خطة تطبيقية مكثفة وموجهة مصممة بناءً على متطلبات التوظيف الفعلية في كبرى الشركات لسد فجوة المهارات وتحقيق الجاهزية القصوى.'
              : 'A rigorous execution blueprint engineered from active hiring benchmarks to eliminate skill gaps and accelerate career readiness.'}
          </p>
        </div>
      </div>

      <!-- Metadata Badge -->
      <div style="text-align: ${isAr ? 'left' : 'right'}; flex-shrink: 0;">
        <div style="display: inline-flex; flex-direction: column; align-items: ${isAr ? 'flex-start' : 'flex-end'}; gap: 4px; padding: 6px 12px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px;">
          <div style="font-size: 10px; font-weight: 700; color: #64748B;">
            ${isAr ? 'تاريخ التوليد:' : 'Issue Date:'} <span style="color: #0F172A; font-weight: 800;">${escapeHtml(currentDate)}</span>
          </div>
          <div style="font-size: 10px; font-weight: 700; color: #64748B;">
            ${isAr ? 'المسار المستهدف:' : 'Target Path:'} <span style="color: #1B57E0; font-weight: 800;">${escapeHtml(roleName)}</span>
          </div>
          <div style="font-size: 9.5px; font-weight: 800; color: #059669; background: #DCFCE7; padding: 1.5px 6px; border-radius: 4px; border: 1px solid #BBF7D0;">
            ✓ ${isAr ? 'خطة تنفيذية معتمدة' : 'Verified Execution Plan'}
          </div>
        </div>
      </div>

    </div>
  </div>

  <!-- ═══════════════════════════════════════════════════════ -->
  <!-- EXECUTIVE KPI STATS BAR (SMART DASHBOARD TILES)        -->
  <!-- ═══════════════════════════════════════════════════════ -->
  <div style="display: flex; gap: 8px; margin-bottom: 16px;">
    
    <!-- Readiness Metric -->
    <div class="kpi-tile">
      <div style="font-size: 9.5px; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 2px;">
        ${isAr ? 'نسبة الجاهزية الحالية' : 'Current Readiness'}
      </div>
      <div style="display: flex; align-items: baseline; gap: 6px;">
        <span style="font-size: 18px; font-weight: 900; color: #1B57E0;">${readinessPct}%</span>
        <span style="font-size: 10px; font-weight: 700; color: #059669;">${isAr ? 'مؤهل للتطور' : 'Good Base'}</span>
      </div>
      <div style="height: 4px; background: #E2E8F0; border-radius: 999px; margin-top: 5px; overflow: hidden;">
        <div style="width: ${readinessPct}%; height: 100%; background: #1B57E0; border-radius: 999px;"></div>
      </div>
    </div>

    <!-- Duration Metric -->
    <div class="kpi-tile">
      <div style="font-size: 9.5px; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 2px;">
        ${isAr ? 'المدة الإجمالية للمسار' : 'Roadmap Duration'}
      </div>
      <div style="display: flex; align-items: baseline; gap: 4px;">
        <span style="font-size: 18px; font-weight: 900; color: #0F172A;">${totalWeeks}</span>
        <span style="font-size: 11px; font-weight: 800; color: #475569;">${isAr ? 'أسابيع مكثفة' : 'Intensive Weeks'}</span>
      </div>
      <div style="font-size: 9.5px; color: #64748B; font-weight: 600; margin-top: 4px;">
        ${isAr ? 'بمعدل 10-12 ساعة أسبوعياً' : '10-12 hours / week'}
      </div>
    </div>

    <!-- Jobs Unlocked Metric -->
    <div class="kpi-tile">
      <div style="font-size: 9.5px; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 2px;">
        ${isAr ? 'فرص العمل المستهدفة' : 'Market Opportunities'}
      </div>
      <div style="display: flex; align-items: baseline; gap: 4px;">
        <span style="font-size: 18px; font-weight: 900; color: #059669;">+${potentialJobs}</span>
        <span style="font-size: 11px; font-weight: 800; color: #059669;">${isAr ? 'وظيفة مفتوحة' : 'Jobs Open'}</span>
      </div>
      <div style="font-size: 9.5px; color: #64748B; font-weight: 600; margin-top: 4px;">
        ${isAr ? `تضاعف الفرص من ${eligibleJobs} حالياً` : `Up from ${eligibleJobs} currently`}
      </div>
    </div>

    <!-- Salary Uplift Metric -->
    <div class="kpi-tile">
      <div style="font-size: 9.5px; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 2px;">
        ${isAr ? 'متوسط الزيادة المتوقعة' : 'Est. Salary Uplift'}
      </div>
      <div style="display: flex; align-items: baseline; gap: 4px;">
        <span style="font-size: 18px; font-weight: 900; color: #7C3AED;">+${salaryUplift}K</span>
        <span style="font-size: 11px; font-weight: 800; color: #7C3AED;">${isAr ? 'ج.م شهرياً' : 'EGP / Mo'}</span>
      </div>
      <div style="font-size: 9.5px; color: #64748B; font-weight: 600; margin-top: 4px;">
        ${isAr ? 'وفق متوسط السوق المصري 2026' : 'Based on Egypt 2026 data'}
      </div>
    </div>

  </div>

  <!-- ═══════════════════════════════════════════════════════ -->
  <!-- 6-WEEK ROADMAP PHASES                                   -->
  <!-- ═══════════════════════════════════════════════════════ -->
  <div style="margin-bottom: 12px;">
    ${weeksRoadmap.map((w, idx) => `
      <div class="phase-card">
        
        <!-- Phase Header Row -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1px solid #F1F5F9; padding-bottom: 6px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div class="phase-badge">
              ${w.weekNum < 10 ? '0' + w.weekNum : w.weekNum}
            </div>
            <div>
              <h2 style="margin: 0; font-size: 13.5px; font-weight: 900; color: #0F172A; letter-spacing: -0.2px;">
                ${escapeHtml(w.title)}
              </h2>
            </div>
          </div>
          
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 6px; font-size: 10.5px; font-weight: 800; background: #EFF6FF; color: #1D4ED8; border: 1px solid #DBEAFE;">
              ⏱️ ${escapeHtml(w.duration)} · ${escapeHtml(w.hoursLabel)}
            </span>
          </div>
        </div>

        <!-- Description -->
        <p style="margin: 0 0 10px 0; font-size: 11px; color: #334155; line-height: 1.55; font-weight: 500;">
          ${escapeHtml(w.description)}
        </p>

        <!-- Bottom Grid: Skills + Resources Preview -->
        <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 6px; margin-top: 4px;">
          <div style="flex: 1; min-width: 250px;">
            <span style="font-size: 10px; font-weight: 800; color: #64748B; text-transform: uppercase; margin-inline-end: 6px;">
              ${isAr ? 'المهارات التقنية:' : 'Target Skills:'}
            </span>
            <div style="display: inline-flex; flex-wrap: wrap; vertical-align: middle;">
              ${w.skills.map((s) => `
                <span class="skill-chip">${escapeHtml(s.def.name)}</span>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- High-Impact Practical Deliverable Callout -->
        <div class="deliverable-box">
          <svg class="deliverable-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <div style="flex: 1;">
            <div style="font-size: 10px; font-weight: 900; color: #15803D; text-transform: uppercase; letter-spacing: 0.2px; margin-bottom: 1px;">
              ${isAr ? 'المخرج العملي القابل للعرض والتقييم (Practical Deliverable):' : 'Key Portfolio Deliverable:'}
            </div>
            <div style="font-size: 11px; font-weight: 700; color: #0F172A; line-height: 1.45;">
              ${escapeHtml(w.deliverable)}
            </div>
          </div>
        </div>

      </div>
    `).join('')}
  </div>

  <!-- ═══════════════════════════════════════════════════════ -->
  <!-- STRATEGIC EXECUTION PRINCIPLES (SMART ADVISORY)        -->
  <!-- ═══════════════════════════════════════════════════════ -->
  <div style="page-break-inside: avoid; break-inside: avoid; border: 1px solid #E2E8F0; border-radius: 12px; padding: 12px 16px; background: #F8FAFC; margin-bottom: 14px;">
    <div style="font-size: 11px; font-weight: 900; color: #0F172A; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
      <span style="color: #1B57E0;">💡</span>
      <span>${isAr ? 'بروتوكول النجاح والتنفيذ المعتمد من خبراء التوظيف' : 'Executive Career Success Protocol'}</span>
    </div>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; font-size: 10.5px;">
      <div style="background: #ffffff; padding: 8px 10px; border-radius: 8px; border: 1px solid #E2E8F0;">
        <div style="font-weight: 800; color: #1B57E0; margin-bottom: 2px;">
          1. ${isAr ? 'البناء الميداني والنشر' : 'Build in Public'}
        </div>
        <div style="color: #475569; line-height: 1.45; font-size: 10px;">
          ${isAr ? 'انشر كل مخرج أسبوعي مباشرة على GitHub لتوثيق خبرتك العملية أمام مسؤولي التوظيف.' : 'Publish every week’s deliverable directly to GitHub to build tangible proof of work.'}
        </div>
      </div>
      <div style="background: #ffffff; padding: 8px 10px; border-radius: 8px; border: 1px solid #E2E8F0;">
        <div style="font-weight: 800; color: #059669; margin-bottom: 2px;">
          2. ${isAr ? 'الاستمرارية المنتظمة' : 'Daily Cadence'}
        </div>
        <div style="color: #475569; line-height: 1.45; font-size: 10px;">
          ${isAr ? 'خصص 90 دقيقة يومياً دون انقطاع. الممارسة العملية المركزة تفوق ساعات المشاهدة النظرية.' : 'Dedicate 90 focused minutes daily. Hands-on coding outperforms passive tutorial watching.'}
        </div>
      </div>
      <div style="background: #ffffff; padding: 8px 10px; border-radius: 8px; border: 1px solid #E2E8F0;">
        <div style="font-weight: 800; color: #7C3AED; margin-bottom: 2px;">
          3. ${isAr ? 'المزامنة مع الـ ATS' : 'ATS CV Sync'}
        </div>
        <div style="color: #475569; line-height: 1.45; font-size: 10px;">
          ${isAr ? 'فور إتمام كل أسبوع، قم بإضافة المهارات والمشاريع إلى سيرتك الذاتية في عواتلي.' : 'Immediately add completed skills & project bullet points to your 3WATLY smart CV.'}
        </div>
      </div>
    </div>
  </div>

  <!-- ═══════════════════════════════════════════════════════ -->
  <!-- OFFICIAL ENTERPRISE FOOTER                             -->
  <!-- ═══════════════════════════════════════════════════════ -->
  <div style="page-break-inside: avoid; break-inside: avoid; border-top: 1.5px solid #E2E8F0; padding-top: 10px; display: flex; justify-content: space-between; align-items: center; font-size: 9.5px; color: #64748B; font-weight: 600;">
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="font-weight: 800; color: #0F172A;">3WATLY Platform</span>
      <span>•</span>
      <span>${isAr ? 'منصة ذكاء التوظيف وسوق العمل التكنولوجي' : 'Tech Career Intelligence Platform'}</span>
      <span>•</span>
      <span style="color: #1B57E0; font-weight: 700;">https://3watly.com</span>
    </div>
    <div>
      <span>${isAr ? 'وثيقة استشارية مهنية معتمدة' : 'Official Career Guidance Document'} • ${escapeHtml(docTitle)}</span>
    </div>
  </div>

</body>
</html>`);
  iframeDoc.close();

  // Allow web fonts (Cairo & Plus Jakarta Sans) to fully load and settle
  await new Promise((resolve) => setTimeout(resolve, 450));

  try {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
  } catch (printErr) {
    console.error('Print iframe error, falling back to window.print:', printErr);
    window.print();
  } finally {
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 3000);
  }
}
