export type TabType = 'home' | 'projects' | 'experience' | 'contact';

export interface ProjectMetric {
  value: string;
  label: string;
  color?: 'primary' | 'secondary' | 'tertiary' | 'primary-fixed';
}

export interface ProjectHighlight {
  icon: string;
  title?: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  flagshipNumber?: string;
  category: 'fullstack' | 'aiml' | 'backend';
  categories: string[];
  tagline: string;
  badge: string;
  badgeColor?: string;
  versionOrEndpoint: string;
  imageUrl?: string;
  metrics: ProjectMetric[];
  highlights: ProjectHighlight[];
  techStack: string[];
  githubUrl: string;
  liveUrl?: string;
  isFlagship: boolean;
  architectureDetails?: {
    overview: string;
    keyDecisions: string[];
    schemaTablesCount?: number;
    testCoverage?: string;
  };
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  badge: string;
  badgeColor: string;
  typeBadge: string;
  stackSummary: string;
  metrics: {
    label: string;
    value: string;
    subtext?: string;
    icon: string;
    color: string;
  }[];
  achievements: string[];
  previewImage?: string;
  previewCaption?: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  level: string;
  institution: string;
  boardOrDetails?: string;
  period: string;
  gradeLabel: string;
  gradeValue: string;
  icon: string;
  color: string;
  isPerfectScore?: boolean;
  curricula?: string[];
}

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  duration: string;
  completedDate: string;
  icon: string;
  color: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  badge: string;
  icon: string;
  color: string;
  skills: string[];
}
