export type FeatureIcon = 'matching' | 'insights' | 'growth' | 'target' | 'trend';

export interface Feature {
  icon: FeatureIcon;
  tone: 'blue' | 'green' | 'violet';
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
}

export const loginFeatures: Feature[] = [
{
  icon: 'matching',
  tone: 'blue',
  title: 'AI-Powered Matching',
  titleAr: 'مطابقة ذكية بالـ AI',
  description: 'Find opportunities that truly fit you.',
  descriptionAr: 'اكتشف فرص تناسب خبرتك ومهاراتك بدقة.'
},
{
  icon: 'insights',
  tone: 'green',
  title: 'Real-time Market Insights',
  titleAr: 'تحليلات سوق العمل لحظياً',
  description: 'Stay ahead with data you can trust.',
  descriptionAr: 'كن دايماً على اطلاع ببيانات موثوقة وحقيقية.'
},
{
  icon: 'growth',
  tone: 'violet',
  title: 'Personalized Growth',
  titleAr: 'تطوير مهني مخصص ليك',
  description: 'Get recommendations to grow your skills and advance your career.',
  descriptionAr: 'توصيات ذكية لتطوير مهاراتك والارتقاء بمسارك المهني.'
}];


export const signUpFeatures: Feature[] = [
{
  icon: 'trend',
  tone: 'green',
  title: 'AI-Powered Insights',
  titleAr: 'تحليلات ذكية بالـ AI',
  description: 'Get role recommendations and market insights tailored to your skills.',
  descriptionAr: 'توصيات وظيفية وتحليلات سوق مخصصة لمهاراتك وخبرتك.'
},
{
  icon: 'target',
  tone: 'blue',
  title: 'Smart Matching',
  titleAr: 'مطابقة ذكية ودقيقة',
  description: 'We match you with high-fit opportunities you can grow with.',
  descriptionAr: 'نطابقك مع أفضل الفرص المتوافقة مع خبرتك وطموحاتك.'
},
{
  icon: 'growth',
  tone: 'violet',
  title: 'Career Growth',
  titleAr: 'تطوير المسار المهني',
  description: 'Personalized recommendations to help you learn, improve, and advance.',
  descriptionAr: 'توصيات مخصصة لتتعلم وتتطور وتترقى في مسارك.'
}];


export const passwordRules = ['At least 8 characters', 'One uppercase letter', 'One number'];
export const passwordRulesAr = ['8 أحرف على الأقل', 'حرف كبير واحد', 'رقم واحد'];

export const navLinks = [
{ label: 'Jobs', labelAr: 'الوظائف', icon: 'briefcase' as const },
{ label: 'Market Insights', labelAr: 'مؤشرات السوق', icon: 'chart' as const },
{ label: 'Resources', labelAr: 'المصادر', icon: 'none' as const, hasDropdown: true }];