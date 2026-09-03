import { CopilotResponse, CopilotResponseSchema, CopilotNavigationItem } from './schemas';
import { sanitizeNavPath } from './navigation';

export function parseCopilotAIResponse(
  rawText: string,
  fallbackTargetRole: string = 'Data Analyst'
): CopilotResponse {
  if (!rawText || !rawText.trim()) {
    return {
      message: 'أهلاً بك! كيف يمكنني مساعدتك في تطوير مسارك المهني اليوم؟',
      navigation: [
        { path: '/jobs', label: 'استعراض الوظائف المطابقة', priority: 'primary' },
      ],
      followUps: [
        'كيف أطور مهاراتي لسوق العمل؟',
        'راجع سيرتي الذاتية وقدم لي نصائح ATS',
      ],
    };
  }

  const trimmed = rawText.trim();

  // Strategy A & B: Try JSON extraction (direct or from ```json markdown blocks)
  let jsonString = '';
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    jsonString = trimmed;
  } else {
    const jsonBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonBlockMatch) {
      jsonString = jsonBlockMatch[1].trim();
    }
  }

  if (jsonString) {
    try {
      const parsedObj = JSON.parse(jsonString);
      const validated = CopilotResponseSchema.safeParse(parsedObj);
      if (validated.success) {
        // Sanitize navigation paths
        const cleanNav = validated.data.navigation
          .map((n) => {
            const validPath = sanitizeNavPath(n.path);
            return validPath ? { ...n, path: validPath } : null;
          })
          .filter(Boolean) as CopilotNavigationItem[];

        return {
          ...validated.data,
          navigation: cleanNav,
        };
      }
    } catch {
      // Continue to fallback
    }
  }

  // Strategy C: Legacy regex fallback for [NAV:/path "label"] or [NAV:/path]
  const navItems: CopilotNavigationItem[] = [];
  const navRegex = /\[NAV:([^\s"\]]+)(?:\s+"([^"]+)")?\]/gi;
  let match: RegExpExecArray | null;

  let cleanedMessage = trimmed;
  while ((match = navRegex.exec(trimmed)) !== null) {
    const rawPath = match[1];
    const rawLabel = match[2];
    const sanitized = sanitizeNavPath(rawPath);
    if (sanitized && navItems.length < 2) {
      navItems.push({
        path: sanitized,
        label: rawLabel || (sanitized === '/jobs' ? 'استعراض الوظائف' : 'الانتقال للقسم'),
        priority: navItems.length === 0 ? 'primary' : 'secondary',
      });
    }
  }

  // Strip NAV tokens from visible message
  cleanedMessage = cleanedMessage.replace(/\[NAV:[^\]]+\]/gi, '').trim();

  // Strategy D: Contextual intelligent default navigation if none was extracted
  if (navItems.length === 0) {
    const lower = cleanedMessage.toLowerCase();
    if (lower.includes('وظائف') || lower.includes('job') || lower.includes('تقديم') || lower.includes('شركة')) {
      navItems.push({ path: '/jobs', label: 'استعراض الوظائف المطابقة', priority: 'primary' });
    } else if (lower.includes('مهار') || lower.includes('skill') || lower.includes('خطة') || lower.includes('تعلم')) {
      navItems.push({ path: '/skill-plan', label: 'بناء خطة المهارات', priority: 'primary' });
    } else if (lower.includes('ats') || lower.includes('سيرت') || lower.includes('cv') || lower.includes('فحص')) {
      navItems.push({ path: '/ats-diagnostics', label: 'فحص الـ ATS وتوافق الـ CV', priority: 'primary' });
    }
  }

  // Default follow-ups
  const defaultFollowUps = [
    'كيف أرفع الـ Match Score للوظائف؟',
    'ما هي أكثر المهارات طلباً في القاهرة؟',
    'كيف أستعد للمقابلة التقنية؟',
  ];

  return {
    message: cleanedMessage || rawText,
    navigation: navItems.slice(0, 2),
    followUps: defaultFollowUps.slice(0, 3),
    metadata: {
      confidence: 'high',
      usedMarketData: true,
      usedUserProfile: true,
      targetRole: fallbackTargetRole,
    },
  };
}
