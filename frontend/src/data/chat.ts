export type AssistantPoint = {text: string;strong?: string[];source?: string;};

export type AssistantPayload = {
  intro: string;
  points: AssistantPoint[];
  outro?: string;
  showRoadmap?: boolean;
};

export const seedQuestion =
'I am a Junior Data Analyst in Cairo with 1 year experience in SQL and Excel.\nWhat should I learn next to reach 30k EGP salary?';

export const roadmapReply: AssistantPayload = {
  intro: 'Based on our analysis of 840 Mid-Level Data Analyst postings in Cairo over the last 90 days:',
  points: [
  {
    text: 'Adding **Python & Power BI** increases your median compensation to **26k–32k EGP**',
    source: '[Source: Q3 Cairo Salary Index].'
  },
  { text: '**Docker** appears in 31% of modern analytics engineering roles.' }],

  outro: 'Here is your customized 6-week roadmap.',
  showRoadmap: true
};

const cvReply: AssistantPayload = {
  intro: 'I reviewed the structure most Cairo analytics recruiters screen for. Three changes matter most:',
  points: [
  { text: 'Lead with **quantified outcomes** — "cut reporting time 40%" beats "responsible for reports".' },
  { text: 'List **SQL, Python, Power BI** in a dedicated skills block; 78% of ATS filters scan for exact matches.' },
  { text: 'Trim to **one page** and drop unrelated roles older than four years.' }],

  outro: 'Upload your CV with the attach button and I will mark up the specific lines.'
};

const companiesReply: AssistantPayload = {
  intro: 'These are the fastest-hiring tech employers in Cairo over the last 90 days:',
  points: [
  { text: '**Microsoft** — 96 open roles, 34% of them data or platform focused.' },
  { text: '**Vodafone VOIS** — 74 open roles, strongest demand for SQL and Power BI.' },
  { text: '**INSTABASE & Fawry** — 69 combined roles, mostly analytics engineering.' }],

  outro: 'Salary bands at these four sit 14% above the Cairo median for your level.'
};

const compareReply: AssistantPayload = {
  intro: 'Data Analyst versus BI Analyst in the Cairo market, same seniority:',
  points: [
  { text: 'Median pay: **24k EGP** for Data Analyst versus **26k EGP** for BI Analyst.' },
  { text: 'BI Analyst postings ask for **Power BI and DAX** in 84% of cases; Data Analyst leans on **Python**.' },
  { text: 'Data Analyst has **3.3x more openings**, so it is the faster route to a first mid-level offer.' }],

  outro: 'With your SQL and Excel base, BI Analyst is the shorter jump — roughly six weeks of Power BI work.'
};

const salaryReply: AssistantPayload = {
  intro: 'Here is what the last 90 days of postings say about compensation for your profile:',
  points: [
  { text: 'Junior with SQL and Excel only: **16k–21k EGP**.' },
  { text: 'Adding **Python and Power BI**: **26k–32k EGP**.' },
  { text: 'Adding **cloud plus Docker** on top: **33k–40k EGP**.' }],

  outro: 'The 6-week roadmap below is the shortest path across that first gap.',
  showRoadmap: true
};

export function getAssistantReply(prompt: string): AssistantPayload {
  const q = prompt.toLowerCase();
  if (q.includes('cv') || q.includes('resume')) return cvReply;
  if (q.includes('compan') || q.includes('hiring') || q.includes('employer')) return companiesReply;
  if (q.includes('compare') || q.includes('vs') || q.includes('versus') || q.includes('bi analyst')) return compareReply;
  if (q.includes('salary') || q.includes('egp') || q.includes('pay') || q.includes('compensation')) return salaryReply;
  if (q.includes('roadmap') || q.includes('learn') || q.includes('plan') || q.includes('skill')) return roadmapReply;
  return {
    intro: 'Here is what our market data says about that, based on 12,842 analyzed postings in Egypt:',
    points: [
    { text: 'Demand for **data and AI skills** grew 45% in the last quarter, the fastest of any skill cluster.' },
    { text: 'Roles pairing **SQL with Python** pay 31% above roles asking for SQL alone.' },
    { text: 'Only 38% of postings offer remote or hybrid, so location still shapes your options.' }],

    outro: 'Ask me about salaries, companies, or a learning plan and I will get more specific.'
  };
}

export const primarySuggestions = [
'Review my CV',
'Show high-growth tech companies in Cairo',
'Compare Data Analyst vs BI Analyst'];


export const moreSuggestions = [
'What salary can I ask for with 2 years experience?',
'Which skills should I drop from my learning list?',
'Show remote-friendly data roles in Egypt',
'Build me a 12-week plan instead'];


export const emptyStatePrompts = [
{ title: 'Plan my next 6 weeks', prompt: 'Build me a 6-week learning plan to reach a mid-level data role.' },
{ title: 'Benchmark my salary', prompt: 'What salary should I target as a Data Analyst in Cairo?' },
{ title: 'Find who is hiring', prompt: 'Show high-growth tech companies in Cairo hiring analysts.' },
{ title: 'Review my CV', prompt: 'Review my CV for analytics roles.' }];