"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Target,
  Sparkles,
  Calendar,
  Clock,
  Printer,
  Zap,
  Award,
  Layers,
  Check,
  BookOpen,
  Film,
  Code2,
  FolderGit2,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSkillPlan } from '@/contexts/SkillPlanContext';
import { useCV } from '@/contexts/CVContext';
import { PlannedSkill, SkillResource, ResourceKind } from '@/types/skills';
import { SkillIcon } from './SkillIcon';
import { SKILLS } from '@/data/skillCatalog';
import { toast } from 'sonner';
import { downloadRoadmapPdf } from '@/utils/roadmapPdfGenerator';

type PremiumSkillPlanModalProps = {
  open: boolean;
  onClose: () => void;
  onConsultCopilot?: () => void;
};

interface RoadmapPhase {
  weekNum: number;
  titleAr: string;
  titleEn: string;
  hours: string;
  durationAr: string;
  durationEn: string;
  descriptionAr: string;
  descriptionEn: string;
  deliverableAr: string;
  deliverableEn: string;
  skillKeys: string[];
}

export function PremiumSkillPlanModal({ open, onClose, onConsultCopilot }: PremiumSkillPlanModalProps) {
  const { isAr } = useLanguage();
  const { plan } = useSkillPlan();
  const { addSkillToActiveCv } = useCV();
  const [activeTab, setActiveTab] = useState<'roadmap' | 'skills'>('roadmap');
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);
  
  // Resource modal state
  const [resourceModalData, setResourceModalData] = useState<{
    title: string;
    resources: SkillResource[];
  } | null>(null);
  const [resourceFilter, setResourceFilter] = useState<ResourceKind | 'all'>('all');

  const roleId = plan?.role?.id || 'data-engineer';
  const targetRole = plan?.role?.name || (isAr ? 'مطور برمجيات محترف' : 'Software Professional');
  const targetRoleAr = plan?.role?.nameAr || targetRole;
  const displayRole = isAr ? targetRoleAr : targetRole;

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNumber) ? prev.filter((s) => s !== stepNumber) : [...prev, stepNumber]
    );
  };

  const handleAddSkillToCv = async (skillName: string) => {
    try {
      const res = await addSkillToActiveCv(skillName);
      if (res.success) {
        toast.success(
          isAr
            ? `تمت إضافة مهارة ${skillName} إلى قسم ${res.categoryLabel} في سيرتك الذاتية ✓`
            : `Added ${skillName} to ${res.categoryLabel} in your CV ✓`
        );
      } else {
        toast.info(isAr ? `مهارة ${skillName} موجودة بالفعل في سيرتك الذاتية` : `${skillName} is already in your CV`);
      }
    } catch {
      toast.error(isAr ? 'فشل إضافة المهارة' : 'Failed to add skill');
    }
  };

  const allSkills: PlannedSkill[] = [
    ...(plan?.priorities || []),
    ...(plan?.covered || []),
    ...(plan?.future || []),
  ];

  // Map role to tailored 6-week roadmap
  const phasesConfig: RoadmapPhase[] = useMemo(() => {
    if (roleId === 'data-engineer') {
      return [
        {
          weekNum: 1,
          titleAr: 'المرحلة الأولى: نمذجة قواعد البيانات وإتقان SQL المتقدم',
          titleEn: 'Phase 1: Advanced SQL & Data Warehousing Modeling',
          hours: '8-10',
          durationAr: 'الأسبوع الأول',
          durationEn: 'Week 1',
          descriptionAr: 'تصميم وبناء مخططات البيانات النجمية (Star Schema) والاستعلامات التحليلية المتقدمة و CTEs.',
          descriptionEn: 'Design normalized and dimensional star schemas with window functions and analytical CTEs.',
          deliverableAr: 'مستودع بيانات ونموذج تحليلي منشور على GitHub',
          deliverableEn: 'Analytical Data Warehouse schema with indexed queries',
          skillKeys: ['sql', 'data-modeling', 'postgresql'],
        },
        {
          weekNum: 2,
          titleAr: 'المرحلة الثانية: المعالجة البرمجية بـ Python والأتمتة',
          titleEn: 'Phase 2: Python Data Processing & Ingestion Automation',
          hours: '10-12',
          durationAr: 'الأسبوع الثاني',
          durationEn: 'Week 2',
          descriptionAr: 'كتابة برمجيات استخراج البيانات والتعامل مع ملفات JSON و Parquet وربط واجهات APIs.',
          descriptionEn: 'Develop resilient extraction scripts, manage Parquet/JSON formats, and consume external APIs.',
          deliverableAr: 'سكربت بايثون معالجة مؤتمت مع اختبارات الوحدة (Unit Tests)',
          deliverableEn: 'Automated data ingestion pipeline script with unit tests',
          skillKeys: ['python', 'git'],
        },
        {
          weekNum: 3,
          titleAr: 'المرحلة الثالثة: هندسة خطوط الأنابيب (ETL / ELT Pipelines)',
          titleEn: 'Phase 3: Resilient ETL/ELT Pipeline Engineering',
          hours: '12-14',
          durationAr: 'الأسبوع الثالث',
          durationEn: 'Week 3',
          descriptionAr: 'بناء خط معالجة وتدفق للبيانات متكامل مع معالجة الأخطاء وإعادة المحاولة والتحقق من جودة البيانات.',
          descriptionEn: 'Construct end-to-end extraction and transformation pipelines with logging and data contract validation.',
          deliverableAr: 'خط أنابيب بيانات حقيقي ينقل ويحول البيانات بكفاءة',
          deliverableEn: 'Production ETL pipeline with automated retries and schema checks',
          skillKeys: ['etl', 'postgresql'],
        },
        {
          weekNum: 4,
          titleAr: 'المرحلة الرابعة: جدولة وأتمتة المهام بـ Apache Airflow & Docker',
          titleEn: 'Phase 4: DAG Orchestration with Airflow & Containerization',
          hours: '10-12',
          durationAr: 'الأسبوع الرابع',
          durationEn: 'Week 4',
          descriptionAr: 'بناء مخططات DAGs في Airflow وتشغيل بيئة العمل بالكامل داخل حاويات Docker معزولة.',
          descriptionEn: 'Author robust DAG workflows in Airflow containerized within production Docker compose environments.',
          deliverableAr: 'بيئة Docker متكاملة مع Airflow DAGs تعمل تلقائياً',
          deliverableEn: 'Dockerized Airflow environment running scheduled DAGs',
          skillKeys: ['airflow', 'docker'],
        },
        {
          weekNum: 5,
          titleAr: 'المرحلة الخامسة: معالجة البيانات الضخمة بـ Apache Spark',
          titleEn: 'Phase 5: Distributed Big Data Processing with Spark',
          hours: '10-12',
          durationAr: 'الأسبوع الخامس',
          durationEn: 'Week 5',
          descriptionAr: 'معالجة مجموعات البيانات المليونية عبر Spark DataFrames و PySpark وتحسين الذاكرة والتوزيع.',
          descriptionEn: 'Scale data transformations across massive datasets using PySpark and optimized partitioning.',
          deliverableAr: 'دفتر PySpark يعالج ملايين السجلات بسرعة فائقة',
          deliverableEn: 'PySpark pipeline processing multi-million row datasets',
          skillKeys: ['spark', 'kafka'],
        },
        {
          weekNum: 6,
          titleAr: 'المرحلة السادسة: مشروع المنصة المتكاملة (Capstone Project) والتجهيز للمقابلات',
          titleEn: 'Phase 6: End-to-End Lakehouse Capstone & Interview Mastery',
          hours: '12-14',
          durationAr: 'الأسبوع السادس',
          durationEn: 'Week 6',
          descriptionAr: 'ربط جميع التقنيات السابقة في مشروع هندسة بيانات عملاق وتحديث الـ CV ومحاكاة المقابلات التقنية.',
          descriptionEn: 'Integrate the entire data platform into a live GitHub portfolio project and practice system design interviews.',
          deliverableAr: 'مشروع هندسي متكامل وموثق على GitHub جاهز لمسؤولي التوظيف',
          deliverableEn: 'Production Data Platform repo with architecture diagram and live documentation',
          skillKeys: ['etl', 'airflow', 'spark', 'sql'],
        },
      ];
    } else if (roleId === 'senior-data-analyst' || roleId === 'data-analyst') {
      return [
        {
          weekNum: 1,
          titleAr: 'المرحلة الأولى: الاستعلامات التحليلية المتقدمة بـ SQL',
          titleEn: 'Phase 1: Advanced Analytical SQL & Business Metrics',
          hours: '8-10',
          durationAr: 'الأسبوع الأول',
          durationEn: 'Week 1',
          descriptionAr: 'إتقان الـ Window Functions واستخراج مؤشرات الأداء الرئيسية ومعدلات الاحتفاظ والمبيعات.',
          descriptionEn: 'Master complex window functions, retention cohorts, churn analysis, and revenue KPIs.',
          deliverableAr: 'ملف استعلامات SQL تحليلي متقدم لقاعدة بيانات تجارية',
          deliverableEn: 'Comprehensive SQL business intelligence query workbook',
          skillKeys: ['sql', 'excel'],
        },
        {
          weekNum: 2,
          titleAr: 'المرحلة الثانية: بناء لوحات التحكم التفاعلية بـ Power BI',
          titleEn: 'Phase 2: Interactive BI Dashboards with Power BI & DAX',
          hours: '10-12',
          durationAr: 'الأسبوع الثاني',
          durationEn: 'Week 2',
          descriptionAr: 'تصميم لوحات تحكم تفاعلية مع مقاييس DAX وحسابات مقارنة الفترات الزمنية ومعدلات النمو.',
          descriptionEn: 'Build executive Power BI dashboards with DAX time-intelligence and drill-through capabilities.',
          deliverableAr: 'لوحة تحكم Power BI تفاعلية تشمل مؤشرات استراتيجية',
          deliverableEn: 'Interactive Power BI report published to portfolio',
          skillKeys: ['powerbi', 'dax'],
        },
        {
          weekNum: 3,
          titleAr: 'المرحلة الثالثة: تنظيف وتحليل البيانات البرمجي بـ Python & Pandas',
          titleEn: 'Phase 3: Python Data Wrangling with Pandas & NumPy',
          hours: '10-12',
          durationAr: 'الأسبوع الثالث',
          durationEn: 'Week 3',
          descriptionAr: 'تنظيف البيانات واستكشاف الأنماط الإحصائية والتعامل مع القيم المفقودة والبيانات الشاذة.',
          descriptionEn: 'Clean noisy raw datasets, handle missing values, and compute aggregate business summaries in Pandas.',
          deliverableAr: 'دفتر Jupyter منظم يوضح خطوات تنظيف واستكشاف البيانات',
          deliverableEn: 'Jupyter notebook documenting data cleansing & exploration',
          skillKeys: ['python', 'statistics'],
        },
        {
          weekNum: 4,
          titleAr: 'المرحلة الرابعة: التحليل الإحصائي واختبارات الفرضيات (A/B Testing)',
          titleEn: 'Phase 4: Statistical Testing & Business Decision Analysis',
          hours: '8-10',
          durationAr: 'الأسبوع الرابع',
          durationEn: 'Week 4',
          descriptionAr: 'إجراء اختبارات الدلالة الإحصائية واختبارات A/B وتقييم قرارات إطلاق الميزات في المنتجات.',
          descriptionEn: 'Run hypothesis tests, confidence intervals, and interpret A/B experiment outcomes for product growth.',
          deliverableAr: 'تقرير نتائج تجربة A/B مع توصيات تجارية واضحة',
          deliverableEn: 'Executive A/B testing experiment report with actionable insights',
          skillKeys: ['statistics', 'python'],
        },
        {
          weekNum: 5,
          titleAr: 'المرحلة الخامسة: سرد القصص بالبيانات والتصور البصري بـ Tableau',
          titleEn: 'Phase 5: Visual Storytelling & Executive Reporting with Tableau',
          hours: '8-10',
          durationAr: 'الأسبوع الخامس',
          durationEn: 'Week 5',
          descriptionAr: 'تحويل الأرقام الجافة إلى عروض مرئية مقنعة لصناع القرار باستخدام أفضل ممارسات التصميم والتصور.',
          descriptionEn: 'Translate raw findings into compelling executive visualizations and narratives that drive strategy.',
          deliverableAr: 'قصة تفاعلية على Tableau Public مع تحليل متكامل',
          deliverableEn: 'Tableau Public story board presenting actionable commercial findings',
          skillKeys: ['tableau', 'data-viz'],
        },
        {
          weekNum: 6,
          titleAr: 'المرحلة السادسة: مشروع التحليلات الشامل (Capstone Project) وجاهزية المقابلات',
          titleEn: 'Phase 6: End-to-End Business Analytics Capstone & Case Interviews',
          hours: '12-14',
          durationAr: 'الأسبوع السادس',
          durationEn: 'Week 6',
          descriptionAr: 'مشروع تحليلي شامل يغطي SQL و Power BI و Python لعرضه في البورتفوليو ومحاكاة أسئلة مقابلات التحليل.',
          descriptionEn: 'Synthesize SQL, Python, and BI into a complete case study portfolio with interview preparation.',
          deliverableAr: 'ملف بورتفوليو تحليلي احترافي وسيرة ذاتية محسنة لمسؤولي التوظيف',
          deliverableEn: 'Full-scope business analytics portfolio project with executive slide deck',
          skillKeys: ['sql', 'powerbi', 'python'],
        },
      ];
    } else if (roleId === 'frontend-developer') {
      return [
        {
          weekNum: 1,
          titleAr: 'المرحلة الأولى: أساسيات JavaScript الحديثة و TypeScript',
          titleEn: 'Phase 1: Modern JavaScript (ESNext) & TypeScript Mastery',
          hours: '8-10',
          durationAr: 'الأسبوع الأول',
          durationEn: 'Week 1',
          descriptionAr: 'إتقان الـ Type Safety والـ Generics والتعامل مع الـ Promises والبرمجة الوظيفية.',
          descriptionEn: 'Master strict typing, generics, async event loops, and functional paradigms.',
          deliverableAr: 'مكتبة دوال برمجية آمنة ومختبرة منشورة على GitHub',
          deliverableEn: 'Type-safe TypeScript utility library with Jest tests',
          skillKeys: ['typescript', 'javascript', 'git'],
        },
        {
          weekNum: 2,
          titleAr: 'المرحلة الثانية: بناء مكونات React المتقدمة و Tailwind CSS',
          titleEn: 'Phase 2: React Component Architecture & Tailwind Styling',
          hours: '10-12',
          durationAr: 'الأسبوع الثاني',
          durationEn: 'Week 2',
          descriptionAr: 'هيكلة المكونات القابلة لإعادة الاستخدام وإتقان الـ Custom Hooks وبناء واجهات مستجيبة وسريعة.',
          descriptionEn: 'Build responsive design systems using custom hooks, compound components, and Tailwind utility patterns.',
          deliverableAr: 'نظام تصميم ومكتبة مكونات UI متجاوبة مع كل الشاشات',
          deliverableEn: 'Responsive Design System component library',
          skillKeys: ['react', 'tailwind'],
        },
        {
          weekNum: 3,
          titleAr: 'المرحلة الثالثة: إدارة الحالة والربط مع الخوادم (APIs & State)',
          titleEn: 'Phase 3: State Management & Real-Time API Consumption',
          hours: '10-12',
          durationAr: 'الأسبوع الثالث',
          durationEn: 'Week 3',
          descriptionAr: 'استخدام React Query / Zustand لإدارة الكاش ومعالجة حالات الخطأ والتحميل بكفاءة.',
          descriptionEn: 'Implement robust client & server state with optimistic updates, caching, and loading skeletons.',
          deliverableAr: 'تطبيق ويب تفاعلي حي يستهلك بيانات REST API في الوقت الفعلي',
          deliverableEn: 'Live single-page web app with optimistic mutations and caching',
          skillKeys: ['react', 'typescript'],
        },
        {
          weekNum: 4,
          titleAr: 'المرحلة الرابعة: ميزات Next.js المتقدمة وتحسين محركات البحث SEO',
          titleEn: 'Phase 4: Next.js Server Components & Web Performance',
          hours: '8-10',
          durationAr: 'الأسبوع الرابع',
          durationEn: 'Week 4',
          descriptionAr: 'الاستفادة من Server Components و Server Actions وتحقيق درجات مرتفعة في Core Web Vitals.',
          descriptionEn: 'Harness Next.js App Router, SSR, and image optimization to achieve 95+ Google Lighthouse scores.',
          deliverableAr: 'تطبيق Next.js منشور على Vercel بأداء فائق السرعة',
          deliverableEn: 'Production Next.js application with high performance benchmarks',
          skillKeys: ['react', 'tailwind'],
        },
        {
          weekNum: 5,
          titleAr: 'المرحلة الخامسة: الاختبارات التلقائية وخطوط النشر CI/CD',
          titleEn: 'Phase 5: Automated Testing & Continuous Deployment',
          hours: '8-10',
          durationAr: 'الأسبوع الخامس',
          durationEn: 'Week 5',
          descriptionAr: 'كتابة اختبارات المكونات بـ React Testing Library وإعداد GitHub Actions للنشر التلقائي.',
          descriptionEn: 'Write integration tests and configure automated GitHub Action workflows for continuous delivery.',
          deliverableAr: 'خط أنابيب CI/CD تلقائي يمر بنجاح مع كل Commit',
          deliverableEn: 'Automated CI/CD pipeline verifying code quality and preview deployments',
          skillKeys: ['git'],
        },
        {
          weekNum: 6,
          titleAr: 'المرحلة السادسة: مشروع البورتفوليو الشامل والمقابلات التقنية',
          titleEn: 'Phase 6: Full-Scale Capstone Project & Frontend Tech Screens',
          hours: '12-14',
          durationAr: 'الأسبوع السادس',
          durationEn: 'Week 6',
          descriptionAr: 'تطوير تطبيق SaaS احترافي كامل، وتجهيز السيرة الذاتية ومحاكاة التحديات البرمجية للمقابلات.',
          descriptionEn: 'Engineer an end-to-end SaaS frontend project, pass ATS review, and practice coding challenges.',
          deliverableAr: 'مشروع ويب حي منشور برابط مباشر وكود نظيف على GitHub',
          deliverableEn: 'Live production SaaS frontend application with verified clean code',
          skillKeys: ['react', 'typescript', 'tailwind'],
        },
      ];
    } else if (roleId === 'backend-developer') {
      return [
        {
          weekNum: 1,
          titleAr: 'المرحلة الأولى: هندسة الخوادم وبناء واجهات RESTful APIs',
          titleEn: 'Phase 1: Server Architectures & RESTful API Standards',
          hours: '8-10',
          durationAr: 'الأسبوع الأول',
          durationEn: 'Week 1',
          descriptionAr: 'تصميم وبناء خوادم سريعة وآمنة وموثقة بمعايير OpenAPI / Swagger مع معالجة الأخطاء.',
          descriptionEn: 'Design clean RESTful architectures with middleware pipelines and OpenAPI documentation.',
          deliverableAr: 'واجهة API موثقة وجاهزة للاستهلاك من تطبيقات الويب والموبايل',
          deliverableEn: 'Fully documented REST API with Swagger/OpenAPI contracts',
          skillKeys: ['nodejs', 'python'],
        },
        {
          weekNum: 2,
          titleAr: 'المرحلة الثانية: قواعد البيانات العلائقية وتحسين الأداء (PostgreSQL & SQL)',
          titleEn: 'Phase 2: Relational Databases & PostgreSQL Query Optimization',
          hours: '10-12',
          durationAr: 'الأسبوع الثاني',
          durationEn: 'Week 2',
          descriptionAr: 'تصميم الـ Schemas وعمليات الربط والفهارس (Indexing) والمعاملات (Transactions) الآمنة.',
          descriptionEn: 'Model relational schemas, manage migrations, and optimize queries using indices and execution plans.',
          deliverableAr: 'قاعدة بيانات مهيكلة ومفهرسة مع استعلامات عالية السرعة',
          deliverableEn: 'Optimized PostgreSQL database schema with migration scripts',
          skillKeys: ['postgresql', 'sql'],
        },
        {
          weekNum: 3,
          titleAr: 'المرحلة الثالثة: المصادقة والأمان والكاش السريع (Auth & Redis)',
          titleEn: 'Phase 3: Authentication, Security & High-Performance Caching',
          hours: '10-12',
          durationAr: 'الأسبوع الثالث',
          durationEn: 'Week 3',
          descriptionAr: 'تطبيق أمان JWT و OAuth وتحديد معدل الطلبات (Rate Limiting) والكاش السريع بـ Redis.',
          descriptionEn: 'Implement robust JWT authentication, RBAC authorization, and lightning-fast Redis cache invalidation.',
          deliverableAr: 'نظام حماية ومصادقة معتمد مع كاش يقلل الضغط على الخادم بنسبة 80%',
          deliverableEn: 'Secure authentication system with Redis caching and rate limiters',
          skillKeys: ['nodejs', 'postgresql'],
        },
        {
          weekNum: 4,
          titleAr: 'المرحلة الرابعة: الحاويات وبيئات العمل المعزولة بـ Docker',
          titleEn: 'Phase 4: Containerization with Docker & Microservices',
          hours: '10-12',
          durationAr: 'الأسبوع الرابع',
          durationEn: 'Week 4',
          descriptionAr: 'كتابة ملفات Dockerfile و Docker Compose متعددة الحاويات لمحاكاة بيئة الإنتاج.',
          descriptionEn: 'Containerize backend services, databases, and caches into production-ready Docker Compose stacks.',
          deliverableAr: 'بيئة Docker متكاملة تعمل بأمر واحد (docker-compose up)',
          deliverableEn: 'Multi-service containerized architecture orchestrated via Docker',
          skillKeys: ['docker', 'git'],
        },
        {
          weekNum: 5,
          titleAr: 'المرحلة الخامسة: معالجة المهام الخلفية وقوائم الانتظار (Message Queues)',
          titleEn: 'Phase 5: Background Jobs & Asynchronous Messaging',
          hours: '8-10',
          durationAr: 'الأسبوع الخامس',
          durationEn: 'Week 5',
          descriptionAr: 'إرسال الإيميلات ومعالجة الملفات في الخلفية بدون حجب الخادم باستخدام Worker Queues.',
          descriptionEn: 'Offload long-running operations and notifications to background workers via message queues.',
          deliverableAr: 'خدمة معالجة خلفية غير متزامنة مع نظام مراقبة المهام',
          deliverableEn: 'Asynchronous task queue worker with job retry monitoring',
          skillKeys: ['nodejs', 'docker'],
        },
        {
          weekNum: 6,
          titleAr: 'المرحلة السادسة: مشروع الباك إند الشامل والنشر السحابي والمقابلات',
          titleEn: 'Phase 6: Scalable Backend Production Capstone & System Design',
          hours: '12-14',
          durationAr: 'الأسبوع السادس',
          durationEn: 'Week 6',
          descriptionAr: 'نظام خوادم متكامل منشور على السحابة، والتدريب على أسئلة System Design في المقابلات التقنية.',
          descriptionEn: 'Deploy a resilient backend on cloud infrastructure and master system design interview fundamentals.',
          deliverableAr: 'سيرفر إنتاجي مباشر وموثق مع لوحة مراقبة وسيرة ذاتية محسنة',
          deliverableEn: 'Live production backend microservice stack with monitoring and documentation',
          skillKeys: ['postgresql', 'docker', 'nodejs'],
        },
      ];
    } else if (roleId === 'ai-ml-engineer') {
      return [
        {
          weekNum: 1,
          titleAr: 'المرحلة الأولى: بايثون لعلوم البيانات والأسس الرياضية',
          titleEn: 'Phase 1: Python for Data Science & Math Foundations',
          hours: '8-10',
          durationAr: 'الأسبوع الأول',
          durationEn: 'Week 1',
          descriptionAr: 'إتقان NumPy و Pandas والجبر الخطي والإحصاء الموجه للذكاء الاصطناعي.',
          descriptionEn: 'Master vector computation, probability, and exploratory data engineering with NumPy & Pandas.',
          deliverableAr: 'دفتر تحليلي وهندسة مميزات (Feature Engineering) متقدم',
          deliverableEn: 'Mathematical exploratory data notebook with feature pipelines',
          skillKeys: ['python', 'statistics'],
        },
        {
          weekNum: 2,
          titleAr: 'المرحلة الثانية: خوارزميات تعلم الآلة الكلاسيكية بـ Scikit-Learn',
          titleEn: 'Phase 2: Supervised & Unsupervised Machine Learning',
          hours: '10-12',
          durationAr: 'الأسبوع الثاني',
          durationEn: 'Week 2',
          descriptionAr: 'بناء وتدريب نماذج التصنيف والتنبؤ وتقييم الأداء عبر مصفوفات الالتباس و ROC-AUC.',
          descriptionEn: 'Train classification, regression, and clustering algorithms with hyperparameter optimization.',
          deliverableAr: 'خط تدريب وتوقع لنموذج تعلم آلة مع تقييم دقيق للأداء',
          deliverableEn: 'End-to-end Scikit-Learn model pipeline with validation metrics',
          skillKeys: ['machine-learning', 'python'],
        },
        {
          weekNum: 3,
          titleAr: 'المرحلة الثالثة: التعلم العميق والشبكات العصبية بـ PyTorch',
          titleEn: 'Phase 3: Deep Neural Networks with PyTorch',
          hours: '12-14',
          durationAr: 'الأسبوع الثالث',
          durationEn: 'Week 3',
          descriptionAr: 'بناء وتدريب الشبكات العصبية والتعامل مع Tensors وتقنيات تحسين دقة النماذج (Backprop & Optimizers).',
          descriptionEn: 'Architect and train custom neural networks using PyTorch autograd and tensor computations.',
          deliverableAr: 'نموذج شبكة عصبية عميقة مدرب ومحفوظ للاستخدام الفوري',
          deliverableEn: 'Custom trained PyTorch deep learning neural network',
          skillKeys: ['pytorch', 'python'],
        },
        {
          weekNum: 4,
          titleAr: 'المرحلة الرابعة: الذكاء الاصطناعي التوليدي ونماذج LLMs & RAG',
          titleEn: 'Phase 4: Generative AI, LLMs & Retrieval Augmented Generation',
          hours: '12-14',
          durationAr: 'الأسبوع الرابع',
          durationEn: 'Week 4',
          descriptionAr: 'بناء تطبيقات RAG وقواعد بيانات الـ Vectors (Chroma/Pinecone) والربط مع نماذج Gemini و OpenAI.',
          descriptionEn: 'Construct production RAG architectures using vector embeddings, LangChain, and state-of-the-art LLMs.',
          deliverableAr: 'نظام شات ذكي يجيب من ملفات المستندات باستخدام RAG',
          deliverableEn: 'Working RAG conversational assistant connected to proprietary knowledge bases',
          skillKeys: ['gen-ai-llm', 'python'],
        },
        {
          weekNum: 5,
          titleAr: 'المرحلة الخامسة: نشر النماذج وسرعة الاستجابة بـ FastAPI & Docker',
          titleEn: 'Phase 5: High-Performance Model Serving with FastAPI & Docker',
          hours: '8-10',
          durationAr: 'الأسبوع الخامس',
          durationEn: 'Week 5',
          descriptionAr: 'تغليف النماذج في واجهات برمجية سريعة قادرة على خدمة الاستنتاج وتضمينها داخل حاوية Docker.',
          descriptionEn: 'Wrap ML and GenAI models in asynchronous FastAPI endpoints with containerized inference runtimes.',
          deliverableAr: 'واجهة API سريعة لتوقع النتائج من النموذج منشورة داخل حاوية',
          deliverableEn: 'Containerized high-throughput ML inference microservice endpoint',
          skillKeys: ['fastapi', 'docker'],
        },
        {
          weekNum: 6,
          titleAr: 'المرحلة السادسة: مشروع الذكاء الاصطناعي الشامل والتجهيز للمقابلات',
          titleEn: 'Phase 6: Full-Scale AI Solution Capstone & Mock Tech Screens',
          hours: '14-16',
          durationAr: 'الأسبوع السادس',
          durationEn: 'Week 6',
          descriptionAr: 'بناء نظام ذكاء اصطناعي متكامل، والتدريب على أسئلة المقابلات في خوارزميات الذكاء الاصطناعي.',
          descriptionEn: 'Deploy a complete GenAI product on cloud and prepare for machine learning engineering interviews.',
          deliverableAr: 'تطبيق ذكاء اصطناعي تفاعلي منشور لايف مع توثيق كود احترافي',
          deliverableEn: 'Full-stack deployed GenAI application with GitHub repository and documentation',
          skillKeys: ['pytorch', 'gen-ai-llm', 'fastapi'],
        },
      ];
    } else if (roleId === 'flutter-developer') {
      return [
        {
          weekNum: 1,
          titleAr: 'المرحلة الأولى: لغة Dart وهيكلة شجرة الـ Widgets في Flutter',
          titleEn: 'Phase 1: Dart Programming & Flutter Widget Tree Architecture',
          hours: '8-10',
          durationAr: 'الأسبوع الأول',
          durationEn: 'Week 1',
          descriptionAr: 'إتقان لغة Dart والمفاهيم الكائنية، وبناء واجهات مستخدم متجاوبة ودقيقة باستخدام Widgets.',
          descriptionEn: 'Master Dart object-oriented paradigms and construct pixel-perfect, responsive Flutter widget trees.',
          deliverableAr: 'تطبيق موبايل متعدد الشاشات متجاوب على Android و iOS',
          deliverableEn: 'Multi-screen responsive Flutter mobile layout running on Android & iOS',
          skillKeys: ['flutter', 'git'],
        },
        {
          weekNum: 2,
          titleAr: 'المرحلة الثانية: إدارة الحالة المتقدمة (Bloc / Riverpod)',
          titleEn: 'Phase 2: Robust State Management with Bloc / Riverpod',
          hours: '10-12',
          durationAr: 'الأسبوع الثاني',
          durationEn: 'Week 2',
          descriptionAr: 'فصل منطق العمل عن الواجهات والتعامل مع تدفق البيانات (Streams) والحالات غير المتزامنة.',
          descriptionEn: 'Decouple UI from business logic using reactive BLoC/Riverpod state architectures.',
          deliverableAr: 'تطبيق موبايل يعتمد على إدارة حالة نظيفة وقابلة للاختبار',
          deliverableEn: 'Modular Flutter application with testable BLoC architecture',
          skillKeys: ['flutter'],
        },
        {
          weekNum: 3,
          titleAr: 'المرحلة الثالثة: الربط مع خوادم REST APIs والتخزين المحلي',
          titleEn: 'Phase 3: REST API Integration & Local Offline Storage',
          hours: '10-12',
          durationAr: 'الأسبوع الثالث',
          durationEn: 'Week 3',
          descriptionAr: 'استهلاك البيانات عبر HTTP والتخزين المحلي بدون إنترنت ومعالجة أخطاء الشبكة بسلاسة.',
          descriptionEn: 'Handle network requests, serialize JSON, and support offline-first local storage with SQLite/Hive.',
          deliverableAr: 'تطبيق يعمل دون إنترنت ويتزامن فور عودة الاتصال',
          deliverableEn: 'Offline-first Flutter app with data synchronization and caching',
          skillKeys: ['flutter'],
        },
        {
          weekNum: 4,
          titleAr: 'المرحلة الرابعة: خدمات السحابة والمصادقة بـ Firebase',
          titleEn: 'Phase 4: Cloud Services & Authentication with Firebase',
          hours: '8-10',
          durationAr: 'الأسبوع الرابع',
          durationEn: 'Week 4',
          descriptionAr: 'ربط مصادقة المستخدمين وقواعد البيانات اللحظية (Firestore) والإشعارات الفورية (Push Notifications).',
          descriptionEn: 'Integrate Firebase Auth, real-time Cloud Firestore listeners, and push notifications.',
          deliverableAr: 'تطبيق موبايل متصل بسحابة Firebase مع نظام تسجيل دخول',
          deliverableEn: 'Authenticated mobile app with real-time cloud data sync',
          skillKeys: ['firebase', 'flutter'],
        },
        {
          weekNum: 5,
          titleAr: 'المرحلة الخامسة: الحركات التفاعلية وتجربة المستخدم السلسة (Animations)',
          titleEn: 'Phase 5: Custom Animations & Native Platform Features',
          hours: '8-10',
          durationAr: 'الأسبوع الخامس',
          durationEn: 'Week 5',
          descriptionAr: 'بناء تجارب بصرية مبهرة بمعدل 60 إطاراً في الثانية واستخدام خصائص الجهاز مثل الكاميرا والموقع.',
          descriptionEn: 'Implement smooth custom animations, hero transitions, and access native device camera and GPS.',
          deliverableAr: 'تطبيق يتميز بتجربة استخدام فائقة السلاسة مع أنيميشن وتفاعل متقدم',
          deliverableEn: 'Engaging mobile UI with custom physics-based animations',
          skillKeys: ['flutter'],
        },
        {
          weekNum: 6,
          titleAr: 'المرحلة السادسة: مشروع التخرج الشامل وتجهيز التطبيق للمتاجر',
          titleEn: 'Phase 6: Production Mobile App Capstone & App Store Deployment',
          hours: '12-14',
          durationAr: 'الأسبوع السادس',
          durationEn: 'Week 6',
          descriptionAr: 'بناء تطبيق كامل جاهز للرفع على Google Play و Apple App Store وتجهيز ملفات الـ APK/AAB.',
          descriptionEn: 'Produce a complete store-ready mobile app bundle with signing, assets, and interview preparation.',
          deliverableAr: 'ملف تطبيق جاهز للتثبيت مع كود مصدري نظيف على GitHub',
          deliverableEn: 'Production signed APK/AAB bundle with complete repository documentation',
          skillKeys: ['flutter', 'firebase'],
        },
      ];
    } else {
      // General fallback using plan priorities
      return [
        {
          weekNum: 1,
          titleAr: 'المرحلة الأولى: الأساسيات المعمارية ونقاط الفرز (ATS)',
          titleEn: 'Phase 1: Core Architecture & ATS Match',
          hours: '8-10',
          durationAr: 'الأسبوع الأول',
          durationEn: 'Week 1',
          descriptionAr: 'إتقان المعايير الأساسية وبناء أول مشروع عملي وتضمين الكلمات المفتاحية الأكثر طلباً في سوق العمل.',
          descriptionEn: 'Master essential principles, build a baseline prototype, and optimize core ATS keyword density.',
          deliverableAr: 'مشروع عملي مصغر منشور على GitHub',
          deliverableEn: 'Clean GitHub project repo with README',
          skillKeys: ['sql', 'python', 'git'],
        },
        {
          weekNum: 2,
          titleAr: 'المرحلة الثانية: بناء الأنظمة التفاعلية والتكامل',
          titleEn: 'Phase 2: Interactive Systems & State',
          hours: '8-10',
          durationAr: 'الأسبوع الثاني',
          durationEn: 'Week 2',
          descriptionAr: 'ربط الواجهات بالـ APIs وإدارة الحالة المتقدمة ومعالجة حالات الخطأ باحترافية.',
          descriptionEn: 'Connect to live APIs, robust state management, and production error boundaries.',
          deliverableAr: 'تطبيق حي متكامل مع REST APIs وإدارة حالة',
          deliverableEn: 'Live deployed app with state & API flows',
          skillKeys: ['react', 'nodejs'],
        },
        {
          weekNum: 3,
          titleAr: 'المرحلة الثالثة: أدوات الإنتاج السحابية والأتمتة',
          titleEn: 'Phase 3: Production & DevOps Integration',
          hours: '6-8',
          durationAr: 'الأسبوع الثالث',
          durationEn: 'Week 3',
          descriptionAr: 'إنشاء ملفات Dockerfile وتجهيز بيئات العمل المعزولة ومحاكاة بيئات العمل في الشركات الكبرى.',
          descriptionEn: 'Containerize applications with Docker, isolate dependencies, and mirror production workflows.',
          deliverableAr: 'حاوية Docker تعمل محلياً ومرفوعة على Docker Hub',
          deliverableEn: 'Dockerized application on Docker Hub',
          skillKeys: ['docker'],
        },
        {
          weekNum: 4,
          titleAr: 'المرحلة الرابعة: خطوط النشر التلقائي وجودة الأكواد',
          titleEn: 'Phase 4: CI/CD & Automated Testing',
          hours: '8-10',
          durationAr: 'الأسبوع الرابع',
          durationEn: 'Week 4',
          descriptionAr: 'إعداد GitHub Actions لفحص الأكواد تلقائياً وإجراء اختبارات الجودة والنشر المباشر.',
          descriptionEn: 'Automate build & test pipelines via GitHub Actions and continuous cloud deployments.',
          deliverableAr: 'خط أنابيب CI/CD تلقائي يمر بنجاح مع كل Commit',
          deliverableEn: 'Passing CI/CD pipeline on every commit',
          skillKeys: ['git'],
        },
        {
          weekNum: 5,
          titleAr: 'المرحلة الخامسة: مشروع التخرج الشامل (Capstone Project)',
          titleEn: 'Phase 5: Full-Scale Capstone Project',
          hours: '12-14',
          durationAr: 'الأسبوع الخامس',
          durationEn: 'Week 5',
          descriptionAr: 'بناء نظام متكامل يجمع كافة المهارات السابقة ليكون نقطة القوة الأولى في مقابلاتك الوظيفية.',
          descriptionEn: 'Engineer an end-to-end full-scale application that serves as the hero project in your portfolio.',
          deliverableAr: 'مشروع لايف (Live URL) مع كود نظيف وتوثيق هندسي',
          deliverableEn: 'Live production URL with documentation',
          skillKeys: ['sql', 'docker', 'python'],
        },
        {
          weekNum: 6,
          titleAr: 'المرحلة السادسة: صياغة الإنجازات والجاهزية للمقابلات',
          titleEn: 'Phase 6: Interview Prep & ATS Final Polish',
          hours: '6-8',
          durationAr: 'الأسبوع السادس',
          durationEn: 'Week 6',
          descriptionAr: 'تضمين المشاريع الجديدة في الـ CV بصيغة أرقام ونتائج، ومحاكاة أسئلة المقابلات التقنية.',
          descriptionEn: 'Quantify achievements in your CV, pass ATS benchmarks (+85%), and practice mock tech screens.',
          deliverableAr: 'سيرة ذاتية محدثة جاهزة للتقديم المباشر',
          deliverableEn: 'Fully optimized CV ready for application',
          skillKeys: ['git'],
        },
      ];
    }
  }, [roleId]);

  // Transform config into active weeks using skills catalog
  const weeksRoadmap = useMemo(() => {
    return phasesConfig.map((p) => {
      // Find matching PlannedSkills from allSkills, or construct clean definitions
      const matchedSkills: PlannedSkill[] = p.skillKeys.map((key) => {
        const found = allSkills.find((s) => s.def.id === key || s.def.name.toLowerCase() === key.toLowerCase());
        if (found) return found;
        const catalogDef = SKILLS[key];
        return {
          def: catalogDef || {
            id: key,
            name: key.toUpperCase(),
            aliases: [],
            tier: 'core',
            hours: 8,
            courses: 2,
            growth: 15,
            why: 'Crucial competence required by top employers in Egypt.',
            actions: ['Practice core exercises', 'Publish to GitHub'],
            prerequisites: [],
            salaryUplift: 3,
            resources: [],
          },
          demand: 75,
          score: 80,
          band: 'high',
          status: 'not-started',
          covered: false,
          jobsUnlocked: 120,
          checkedActions: [],
          missingPrerequisites: [],
          remainingHours: 8,
        };
      });

      // Collect all learning resources for this phase
      const phaseResources: SkillResource[] = [];
      p.skillKeys.forEach((key) => {
        const catalogDef = SKILLS[key];
        if (catalogDef && Array.isArray(catalogDef.resources)) {
          catalogDef.resources.forEach((r) => {
            if (!phaseResources.some((ex) => ex.url === r.url)) {
              phaseResources.push(r);
            }
          });
        }
      });

      const hoursLabel = isAr ? `${p.hours} ساعات` : `${p.hours} Hours`;

      return {
        ...p,
        title: isAr ? p.titleAr : p.titleEn,
        duration: isAr ? p.durationAr : p.durationEn,
        description: isAr ? p.descriptionAr : p.descriptionEn,
        deliverable: isAr ? p.deliverableAr : p.deliverableEn,
        hoursLabel,
        skills: matchedSkills,
        resources: phaseResources,
      };
    });
  }, [phasesConfig, allSkills, isAr]);

  const handleOpenPhaseResources = (week: typeof weeksRoadmap[number]) => {
    setResourceFilter('all');
    setResourceModalData({
      title: isAr ? `مصادر وكورسات: ${week.title}` : `Learning Resources: ${week.title}`,
      resources: week.resources,
    });
  };

  const handleOpenSkillResources = (skill: PlannedSkill) => {
    setResourceFilter('all');
    const skillRes = skill.def.resources && skill.def.resources.length > 0
      ? skill.def.resources
      : (SKILLS[skill.def.id]?.resources || []);
    
    setResourceModalData({
      title: isAr ? `مصادر وكورسات مهارة: ${skill.def.name}` : `Learning Resources: ${skill.def.name}`,
      resources: skillRes,
    });
  };

  const filteredResources = useMemo(() => {
    if (!resourceModalData) return [];
    if (resourceFilter === 'all') return resourceModalData.resources;
    return resourceModalData.resources.filter((r) => r.kind === resourceFilter);
  }, [resourceModalData, resourceFilter]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md print:hidden"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-[28px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0B1120] shadow-[0_25px_70px_rgba(0,0,0,0.35)] overflow-hidden z-10 print:shadow-none print:border-none print:max-h-none print:w-full print:rounded-none"
        >
          {/* Top Banner Header */}
          <div className="relative p-6 pb-5 border-b border-slate-100 dark:border-white/10 bg-gradient-to-r from-blue-50/80 via-white to-indigo-50/50 dark:from-[#0E172E] dark:via-[#0B1120] dark:to-[#111A33] print:bg-white print:p-4">
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 ltr:right-5 rtl:left-5 flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shadow-xs print:hidden"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B57E0] text-white text-[11px] font-black tracking-wider uppercase shadow-xs">
                <Sparkles className="h-3 w-3" />
                {isAr ? 'خطة المهارات الذكية المعتمدة' : '3WATLY Copilot Pro Plan'}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40 text-[11.5px] font-bold text-emerald-700 dark:text-emerald-300">
                {isAr ? 'مخصصة لسوق العمل المصري 2026' : 'Targeted for Egyptian Tech Market'}
              </span>
            </div>

            <h2 className="text-[22px] sm:text-[24px] font-black text-slate-900 dark:text-white tracking-tight">
              {isAr ? `خارطة الطريق لسد فجوة المهارات: ${displayRole}` : `Career Skill Roadmap: ${displayRole}`}
            </h2>
            <p className="mt-1 text-[13px] text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              {isAr
                ? 'خطة تطبيقية مدروسة تمتد لـ 6 أسابيع مبنية على بيانات الشواغر الفعلية في الشركات التقنية لمساعدتك على مضاعفة فرص القبول وزيادة راتبك.'
                : 'A strategic 6-week actionable roadmap engineered from actual employer requirements to maximize interview invitations and compensation.'}
            </p>

            {/* 2 High-Impact Metric Cards (Target Salary Card REMOVED as requested) */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 print:grid-cols-2">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-2xs">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/80 text-[#1B57E0] dark:text-[#60A5FA]">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                    {isAr ? 'المدة الزمنية المقدرة' : 'Target Timeline'}
                  </span>
                  <span className="text-[14.5px] font-black text-slate-900 dark:text-white">
                    {isAr ? '6 أسابيع مكثفة' : '6-Week Sprint'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-2xs">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                    {isAr ? 'نسبة الجاهزية الحالية' : 'Current Readiness'}
                  </span>
                  <span className="text-[14.5px] font-black text-slate-900 dark:text-white">
                    {plan.readinessPct}% {isAr ? 'مستوفاة' : 'Covered'}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="mt-5 flex items-center gap-2 border-t border-slate-200/60 dark:border-white/10 pt-3 print:hidden">
              <button
                type="button"
                onClick={() => setActiveTab('roadmap')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                  activeTab === 'roadmap'
                    ? 'bg-[#1B57E0] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <Layers className="h-4 w-4" />
                <span>{isAr ? 'الخطة الأسبوعية (6 أسابيع)' : 'Weekly Roadmap'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('skills')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                  activeTab === 'skills'
                    ? 'bg-[#1B57E0] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <Award className="h-4 w-4" />
                <span>{isAr ? `المهارات المطلوبة (${allSkills.length})` : `Target Skills (${allSkills.length})`}</span>
              </button>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 print:overflow-visible print:p-2">
            {activeTab === 'roadmap' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-1 print:hidden">
                  <h3 className="text-[15px] font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Zap className="h-4 w-4 text-[#1B57E0]" />
                    {isAr ? 'خطة التنفيذ الأسبوعية خطوة بخطوة' : 'Step-by-Step Execution Path'}
                  </h3>
                  <span className="text-[12px] font-semibold text-slate-500">
                    {isAr ? `${completedSteps.length} من 6 مراحل مكتملة` : `${completedSteps.length} of 6 stages completed`}
                  </span>
                </div>

                <div className="space-y-3.5">
                  {weeksRoadmap.map((week) => {
                    const isCompleted = completedSteps.includes(week.weekNum);

                    return (
                      <div
                        key={week.weekNum}
                        className={`rounded-2xl border p-4 sm:p-5 transition-all print:break-inside-avoid print:bg-white print:border-slate-300 ${
                          isCompleted
                            ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
                            : 'bg-slate-50/70 dark:bg-white/[0.02] border-slate-200/80 dark:border-white/10 hover:border-blue-400/60'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-3.5 min-w-0">
                            <button
                              type="button"
                              onClick={() => toggleStep(week.weekNum)}
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-[12px] font-black transition-all cursor-pointer shadow-xs mt-0.5 print:border-slate-400 ${
                                isCompleted
                                  ? 'bg-emerald-600 text-white'
                                  : 'border-2 border-slate-300 dark:border-slate-600 hover:border-blue-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                              }`}
                            >
                              {isCompleted ? <Check className="h-4 w-4 stroke-[3]" /> : week.weekNum}
                            </button>

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-[#1B57E0] dark:text-[#60A5FA] text-[11px] font-extrabold uppercase">
                                  {week.duration}
                                </span>
                                <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-slate-400">
                                  <Clock className="h-3 w-3" />
                                  {week.hoursLabel}
                                </span>
                              </div>
                              <h4 className="text-[15px] font-black text-slate-900 dark:text-white mt-1">
                                {week.title}
                              </h4>
                              <p className="text-[13px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                                {week.description}
                              </p>
                            </div>
                          </div>

                          <div className="sm:text-right rtl:sm:text-left shrink-0 sm:pl-4 rtl:sm:pr-4 sm:border-l rtl:sm:border-r rtl:sm:border-l-0 border-slate-200/80 dark:border-white/10">
                            <span className="block text-[10.5px] font-bold text-slate-400 uppercase">
                              {isAr ? 'المخرج العملي (Deliverable)' : 'Deliverable'}
                            </span>
                            <span className="inline-block mt-1 text-[12px] font-bold text-[#1B57E0] dark:text-[#60A5FA] max-w-[240px]">
                              {week.deliverable}
                            </span>
                          </div>
                        </div>

                        {/* Associated Skills & Action Buttons for this Week */}
                        <div className="mt-3.5 pt-3 border-t border-slate-200/60 dark:border-white/5 flex flex-wrap items-center justify-between gap-2.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[11.5px] font-bold text-slate-500 dark:text-slate-400">
                              {isAr ? 'المهارات المستهدفة:' : 'Target Skills:'}
                            </span>
                            {week.skills.map((s: PlannedSkill) => (
                              <button
                                key={s.def.id}
                                type="button"
                                onClick={() => handleOpenSkillResources(s)}
                                title={isAr ? `عرض كورسات وفيديوهات ${s.def.name}` : `View ${s.def.name} resources`}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 hover:border-blue-500 text-[12px] font-bold text-slate-800 dark:text-slate-200 shadow-2xs hover:text-[#1B57E0] transition-colors cursor-pointer"
                              >
                                <SkillIcon skillId={s.def.name} size="sm" className="!h-4 !w-4 !rounded-sm" />
                                <span>{s.def.name}</span>
                              </button>
                            ))}
                          </div>

                          <div className="flex items-center gap-3 print:hidden">
                            {/* POP-UP WINDOW BUTTON for Videos & Courses */}
                            {week.resources.length > 0 && (
                              <button
                                type="button"
                                onClick={() => handleOpenPhaseResources(week)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/40 text-[12px] font-bold text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-colors cursor-pointer shadow-2xs"
                              >
                                <Film className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                                <span>
                                  {isAr
                                    ? `فيديوهات وكورسات المرحلة (${week.resources.length})`
                                    : `Videos & Courses (${week.resources.length})`}
                                </span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => week.skills.forEach((s: PlannedSkill) => handleAddSkillToCv(s.def.name))}
                              className="text-[12px] font-bold text-[#1B57E0] dark:text-[#60A5FA] hover:underline cursor-pointer"
                            >
                              {isAr ? '+ إضافة مهارات الأسبوع للـ CV' : '+ Add week skills to CV'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-3.5 print:hidden">
                <div className="flex items-center justify-between pb-1">
                  <h3 className="text-[15px] font-black text-slate-900 dark:text-white">
                    {isAr ? 'قائمة المهارات المصنفة حسب الأولوية وتأثيرها' : 'Prioritized Skills Breakdown'}
                  </h3>
                  <span className="text-[12px] text-slate-400">
                    {isAr ? 'مرتبة بحسب حجم الطلب في السوق المصري' : 'Ranked by Egyptian hiring demand'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {allSkills.map((item: PlannedSkill) => (
                    <div
                      key={item.def.id}
                      className="flex flex-col justify-between p-4 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] hover:border-blue-400 transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2.5">
                            <SkillIcon skillId={item.def.name} size="sm" className="!h-7 !w-7 !rounded-lg shadow-2xs" />
                            <div>
                              <h4 className="text-[14px] font-black text-slate-900 dark:text-white leading-tight">
                                {item.def.name}
                              </h4>
                              <span className="text-[11px] font-medium text-slate-400">
                                {item.def.hours} {isAr ? 'ساعات تدريب' : 'learning hours'}
                              </span>
                            </div>
                          </div>

                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            item.band === 'high'
                              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/30'
                              : 'bg-blue-50 dark:bg-blue-950/60 text-[#1B57E0] dark:text-[#60A5FA] border border-blue-200 dark:border-blue-900/30'
                          }`}>
                            {item.band === 'high' ? (isAr ? 'أولوية عاجلة' : 'High Priority') : (isAr ? 'أولوية متوسطة' : 'Mid Priority')}
                          </span>
                        </div>

                        <p className="text-[12.5px] text-slate-600 dark:text-slate-300 leading-snug line-clamp-2">
                          {item.def.why}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenSkillResources(item)}
                          className="flex items-center gap-1.5 text-[12px] font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{isAr ? 'الكورسات والفيديوهات' : 'Courses & Videos'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAddSkillToCv(item.def.name)}
                          className="flex items-center gap-1 text-[12px] font-bold text-[#1B57E0] dark:text-[#60A5FA] hover:underline cursor-pointer"
                        >
                          <span>{isAr ? 'إضافة للـ CV' : 'Add to CV'}</span>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Footer */}
          <div className="p-4 sm:p-5 border-t border-slate-200/90 dark:border-white/10 bg-slate-50/90 dark:bg-[#070B14] flex flex-wrap items-center justify-between gap-3 print:hidden">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={async () => {
                  toast.info(isAr ? 'جاري تجهيز وثيقة الـ PDF الاحترافية للخارطة...' : 'Preparing high-res roadmap PDF document...');
                  await downloadRoadmapPdf({
                    plan,
                    roleName: displayRole,
                    weeksRoadmap,
                    isAr,
                  });
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/60 dark:bg-blue-950/30 text-[13px] font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-100/70 dark:hover:bg-blue-900/40 transition-colors cursor-pointer shadow-2xs"
              >
                <Printer className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span>{isAr ? 'طباعة / تصدير الخارطة كـ PDF احترافي' : 'Export Professional Roadmap PDF'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              {onConsultCopilot && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onConsultCopilot();
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B57E0] hover:bg-blue-700 text-white font-bold text-[13px] shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{isAr ? 'اسأل المساعد الذكي عن تفاصيل المرحلة الأولى' : 'Ask Copilot About Stage 1'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-[13px] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── HIGH-FIDELITY RESOURCES & VIDEOS POPUP MODAL ── */}
        <AnimatePresence>
          {resourceModalData && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setResourceModalData(null)}
                className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 12 }}
                transition={{ duration: 0.2 }}
                className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B1120] shadow-2xl overflow-hidden z-20"
              >
                {/* Header */}
                <div className="p-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-slate-50/70 dark:bg-white/[0.02]">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400">
                      <Film className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {resourceModalData.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {isAr
                          ? 'مصادر تدريبية ومقاطع فيديو ومشاريع تطبيقية معتمدة'
                          : 'Curated courses, videos, tutorials, and practical projects'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setResourceModalData(null)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Filter Pills */}
                <div className="p-3 border-b border-slate-100 dark:border-white/5 flex flex-wrap gap-2 bg-white dark:bg-[#0B1120]">
                  {[
                    { id: 'all', label: isAr ? 'الكل' : 'All', icon: Layers },
                    { id: 'video', label: isAr ? 'فيديوهات مجانية' : 'Free Videos', icon: Film },
                    { id: 'course', label: isAr ? 'كورسات تدريبية' : 'Courses', icon: BookOpen },
                    { id: 'docs', label: isAr ? 'التوثيق الرسمي' : 'Documentation', icon: Code2 },
                    { id: 'project', label: isAr ? 'مشاريع تطبيقية' : 'Projects', icon: FolderGit2 },
                  ].map((tab) => {
                    const TabIcon = tab.icon;
                    const isActive = resourceFilter === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setResourceFilter(tab.id as any)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#1B57E0] text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                        }`}
                      >
                        <TabIcon className="w-3.5 h-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Resource List */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
                  {filteredResources.length === 0 ? (
                    <div className="text-center py-10 space-y-2">
                      <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-sm font-semibold text-slate-500">
                        {isAr ? 'لا توجد مصادر مطابقة لهذا الفلتر' : 'No resources match this filter'}
                      </p>
                    </div>
                  ) : (
                    filteredResources.map((res, idx) => {
                      const IconComponent =
                        res.kind === 'video'
                          ? Film
                          : res.kind === 'course'
                          ? BookOpen
                          : res.kind === 'project'
                          ? FolderGit2
                          : Code2;

                      return (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/70 dark:bg-white/[0.02] hover:border-blue-400/50 transition-all"
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/80 text-[#1B57E0] dark:text-[#60A5FA] mt-0.5">
                              <IconComponent className="h-4.5 w-4.5" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[10.5px] font-bold">
                                  {res.provider}
                                </span>
                                {res.free && (
                                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10.5px] font-bold">
                                    {isAr ? 'مجاني بالكامل' : '100% Free'}
                                  </span>
                                )}
                                <span className="text-[11px] font-medium text-slate-400">
                                  {res.hours} {isAr ? 'ساعات' : 'hours'}
                                </span>
                              </div>
                              <h4 className="text-[13.5px] font-bold text-slate-900 dark:text-white mt-1">
                                {res.title}
                              </h4>
                            </div>
                          </div>

                          {res.url ? (
                            <a
                              href={res.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1B57E0] hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0"
                            >
                              <span>{isAr ? 'مشاهدة / فتح المصدر' : 'Open Resource'}</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400 italic">
                              {isAr ? 'مرفوع داخلياً' : 'Embedded'}
                            </span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer */}
                <div className="p-3.5 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01] flex justify-end">
                  <button
                    type="button"
                    onClick={() => setResourceModalData(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    {isAr ? 'إغلاق النافذة' : 'Close'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── PRINT-ONLY ROADMAP REPORT DOCUMENT (EXECUTIVE HIGH-FIDELITY DESIGN) ── */}
        <div
          id="roadmap-print-root"
          dir={isAr ? 'rtl' : 'ltr'}
          className={`hidden print:block p-8 bg-white text-slate-900 ${isAr ? "font-['Cairo',sans-serif]" : "font-['Plus_Jakarta_Sans',sans-serif]"}`}
        >
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center text-white font-black text-xl shadow-md flex-shrink-0">
                  3W
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-black tracking-wider text-blue-700">3WATLY</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      • {isAr ? 'ذكاء المسار المهني وسوق العمل' : 'Career Intelligence & Market Analytics'}
                    </span>
                  </div>
                  <h1 className="text-xl font-black text-slate-900 leading-tight">
                    {isAr ? `خارطة طريق التطوير المهني: ${displayRole}` : `Career Skill Roadmap: ${displayRole}`}
                  </h1>
                  <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
                    {isAr
                      ? 'خطة تطبيقية مكثفة وموجهة مصممة بناءً على متطلبات التوظيف الفعلية في كبرى الشركات لسد فجوة المهارات وتحقيق الجاهزية القصوى.'
                      : 'A strategic execution roadmap engineered from active employer demand to eliminate skill gaps and maximize interview invitations.'}
                  </p>
                </div>
              </div>

              <div className="text-right rtl:text-left flex-shrink-0">
                <div className="p-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-[11px]">
                  <p className="font-semibold text-slate-500">
                    {isAr ? 'تاريخ التوليد:' : 'Generated Date:'}{' '}
                    <span className="font-bold text-slate-900">{new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-US')}</span>
                  </p>
                  <p className="font-semibold text-slate-500">
                    {isAr ? 'المسار المستهدف:' : 'Target Path:'}{' '}
                    <span className="font-bold text-blue-700">{displayRole}</span>
                  </p>
                  <p className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded text-[10px] font-extrabold">
                    ✓ {isAr ? 'خطة تنفيذية معتمدة' : 'Verified Execution Plan'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* KPI Summary Dashboard Tiles */}
          <div className="grid grid-cols-4 gap-2.5 mb-5">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                {isAr ? 'نسبة الجاهزية الحالية' : 'Current Readiness'}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-blue-600">{plan.readinessPct}%</span>
                <span className="text-[10px] font-bold text-emerald-600">{isAr ? 'مؤهل' : 'Good Base'}</span>
              </div>
              <div className="h-1 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${plan.readinessPct}%` }} />
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                {isAr ? 'المدة الزمنية المقدرة' : 'Roadmap Duration'}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-slate-900">{weeksRoadmap.length}</span>
                <span className="text-[11px] font-bold text-slate-700">{isAr ? 'أسابيع مكثفة' : 'Weeks'}</span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">{isAr ? '10-12 ساعة أسبوعياً' : '10-12 hrs / week'}</span>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                {isAr ? 'فرص العمل المستهدفة' : 'Market Opportunities'}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-emerald-600">+{plan.potentialJobs}</span>
                <span className="text-[10px] font-bold text-emerald-700">{isAr ? 'وظيفة متاحة' : 'Jobs Open'}</span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">{isAr ? `تضاعف من ${plan.eligibleJobs} حالياً` : `Up from ${plan.eligibleJobs}`}</span>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                {isAr ? 'متوسط الزيادة في الدخل' : 'Est. Salary Uplift'}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-purple-700">+{plan.salaryUplift || 25}K</span>
                <span className="text-[10px] font-bold text-purple-700">{isAr ? 'ج.م شهرياً' : 'EGP / Mo'}</span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">{isAr ? 'وفق بيانات مصر 2026' : 'Egypt 2026 Market'}</span>
            </div>
          </div>

          {/* 6 Phases List */}
          <div className="space-y-3.5 mb-5">
            {weeksRoadmap.map((w) => (
              <div key={w.weekNum} className="border border-slate-200 rounded-xl p-3.5 bg-white shadow-2xs break-inside-avoid">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 text-white text-xs font-black shadow-xs">
                      {w.weekNum < 10 ? `0${w.weekNum}` : w.weekNum}
                    </span>
                    <h3 className="text-sm font-black text-slate-900">{w.title}</h3>
                  </div>
                  <div className="px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-100 text-blue-700 text-[11px] font-bold">
                    <span>{w.duration}</span> · <span>{w.hoursLabel}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed mb-2.5 font-medium">
                  {w.description}
                </p>

                <div className="flex flex-wrap items-center gap-2 text-xs mb-2.5">
                  <span className="font-bold text-slate-500 text-[10px] uppercase">
                    {isAr ? 'المهارات التقنية:' : 'Target Skills:'}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {w.skills.map((s) => (
                      <span key={s.def.id} className="inline-block px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-800 font-bold text-[10.5px]">
                        {s.def.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Practical Deliverable Callout */}
                <div className="p-2.5 px-3 rounded-lg bg-emerald-50/80 border border-emerald-200 text-emerald-950 flex items-start gap-2">
                  <span className="text-emerald-700 font-bold text-xs mt-0.5">✓</span>
                  <div>
                    <span className="text-[10px] font-extrabold text-emerald-800 uppercase block tracking-wider">
                      {isAr ? 'المخرج العملي القابل للعرض والتقييم (Practical Deliverable):' : 'Key Portfolio Deliverable:'}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {w.deliverable}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Strategic Execution Principles */}
          <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 break-inside-avoid mb-4">
            <div className="text-xs font-black text-slate-900 uppercase mb-2 flex items-center gap-1.5">
              <span>💡</span>
              <span>{isAr ? 'بروتوكول النجاح والتنفيذ المعتمد من خبراء التوظيف' : 'Executive Career Success Protocol'}</span>
            </div>
            <div className="grid grid-cols-3 gap-2.5 text-[10px]">
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="font-extrabold text-blue-700 block mb-0.5">1. {isAr ? 'البناء الميداني والنشر' : 'Build in Public'}</span>
                <span className="text-slate-600">{isAr ? 'انشر كل مخرج أسبوعي مباشرة على GitHub لتوثيق خبرتك العملية.' : 'Push weekly deliverables directly to GitHub for proof of work.'}</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="font-extrabold text-emerald-700 block mb-0.5">2. {isAr ? 'الاستمرارية المنتظمة' : 'Daily Cadence'}</span>
                <span className="text-slate-600">{isAr ? 'خصص 90 دقيقة يومياً دون انقطاع للتطبيق البرمجي الفعلي.' : 'Dedicate 90 focused minutes daily to hands-on exercises.'}</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="font-extrabold text-purple-700 block mb-0.5">3. {isAr ? 'المزامنة مع الـ ATS' : 'ATS CV Sync'}</span>
                <span className="text-slate-600">{isAr ? 'فور إتمام كل أسبوع، قم بإضافة المهارات المنجزة لسيرتك الذاتية في عواتلي.' : 'Immediately add completed skills & project points to your 3WATLY CV.'}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-semibold break-inside-avoid">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">3WATLY Platform</span>
              <span>•</span>
              <span>{isAr ? 'منصة ذكاء التوظيف وسوق العمل التكنولوجي' : 'Tech Career Intelligence Platform'}</span>
              <span>•</span>
              <span className="text-blue-600">https://3watly.com</span>
            </div>
            <span>{isAr ? 'وثيقة استشارية مهنية معتمدة' : 'Official Career Guidance Document'}</span>
          </div>
        </div>
      </div>
    )}
  </AnimatePresence>
);
}
