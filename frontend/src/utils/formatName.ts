/**
 * Formats user full name into First Name + Second Name Initial with dot, or full name.
 * Example: "Mohamed Ali" -> "Mohamed A." / "محمد ع."
 */
export function formatTopbarName(fullName?: string | null, isAr: boolean = false): string {
  if (!fullName || !fullName.trim()) {
    return isAr ? "مستخدم" : "User";
  }

  const clean = fullName.trim().replace(/['"]/g, '');
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0];
  }

  const firstName = parts[0];
  const secondInitial = parts[1].charAt(0);
  
  return `${firstName} ${secondInitial}.`;
}

/**
 * Resolves the authenticated user's display name according to the priority:
 * 1. Profile full_name
 * 2. OAuth provider display name
 * 3. Email-derived name
 * 4. Safe fallback: "User" / "مستخدم"
 */
export function resolveDisplayName(params: {
  fullName?: string | null;
  oauthName?: string | null;
  email?: string | null;
  isAr?: boolean;
}): string {
  const { fullName, oauthName, email, isAr = false } = params;

  if (fullName && fullName.trim() && fullName.trim() !== '3WATLY User' && fullName.trim() !== 'مستخدم عواطلي') {
    return fullName.trim();
  }

  if (oauthName && oauthName.trim()) {
    return oauthName.trim();
  }

  if (email && email.trim()) {
    const handle = email.split('@')[0];
    if (handle) {
      const parts = handle.replace(/[._-]+/g, ' ').trim();
      if (parts.length > 0) {
        return parts
          .split(/\s+/)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(' ');
      }
    }
  }

  return isAr ? "مستخدم" : "User";
}

export function extractNameFromFilename(filename?: string): string | null {
  if (!filename) return null;
  const clean = filename.replace(/\.[^/.]+$/, "");
  const spaced = clean.replace(/[_-]+/g, " ");
  const nameOnly = spaced.replace(/\b(cv|resume|resume_en|cv_ar|pdf|docx|final|updated|v\d+|portfolio)\b/gi, "").trim();
  
  if (nameOnly.length >= 3) {
    return nameOnly
      .split(/\s+/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  }
  return null;
}

/**
 * Returns time-based greeting for user's local browser time:
 * - 5:00 AM – 11:59 AM: Good morning / صباح الخير
 * - 12:00 PM – 4:59 PM: Good afternoon / مساء الخير
 * - 5:00 PM – 9:59 PM: Good evening / مساء الخير
 * - 10:00 PM – 4:59 AM: Good night / طاب مساؤك
 */
export function getTimeGreeting(hour?: number): { en: string; ar: string } {
  const currentHour = hour !== undefined ? hour : new Date().getHours();
  if (currentHour >= 5 && currentHour < 12) {
    return { en: 'Good morning', ar: 'صباح الخير' };
  }
  if (currentHour >= 12 && currentHour < 17) {
    return { en: 'Good afternoon', ar: 'مساء الخير' };
  }
  if (currentHour >= 17 && currentHour < 22) {
    return { en: 'Good evening', ar: 'مساء الخير' };
  }
  return { en: 'Good night', ar: 'طاب مساؤك' };
}

/**
 * Builds the dynamic greeting string:
 * - When user name is present: "Good morning, Mohamed 👋" / "صباح الخير، يا محمد 👋"
 * - When user name is absent / generic: "Good morning 👋" / "صباح الخير 👋"
 */
export function buildDynamicGreeting(name?: string | null, isAr: boolean = false, hour?: number): string {
  const { en, ar } = getTimeGreeting(hour);
  const cleanName = name?.trim();
  const isGeneric = !cleanName || cleanName === 'User' || cleanName === 'مستخدم' || cleanName === '3WATLY User' || cleanName === 'مستخدم عواطلي';

  if (isAr) {
    return isGeneric ? `${ar} 👋` : `${ar}، يا ${cleanName} 👋`;
  }
  return isGeneric ? `${en} 👋` : `${en}, ${cleanName} 👋`;
}
