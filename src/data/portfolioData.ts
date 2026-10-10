import { Project, WorkExperience, EducationItem, CertificateItem, SkillCategory } from '../types';

export const PERSONAL_INFO = {
  name: 'MD SHAWON MOLLA',
  shortName: 'Shawon Molla',
  domain: 'Shawon.dev',
  title: 'Junior Software Engineer · Full-Stack Developer · AI-Integrated Web Applications',
  location: 'Dhaka, Bangladesh',
  email: '22103330@iubat.edu',
  phone: '+880 1987-407441',
  whatsAppUrl: 'https://wa.me/8801987407441',
  githubUrl: 'https://github.com/shawon2210',
  linkedinUrl: 'https://linkedin.com/in/md-shawon-molla-2a3877293',
  liveAppUrl: 'https://oddboundary.lovable.app',
  avatarUrl: '/mdshawonmolla.jpg',
  portraitUrl: '/mdshawonmolla.jpg',
  logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLCHJjyXcP3WGiCESsSk0TO-ee-JSQuqOlGcbjFKYUltpXQtmC8hGeNwYLfG2ijA7bmWIwFlFfrdX3zeZRSPpfQ3T2WZ22WHPOq8Qdlda4WewOcPLY-ZwY_C5hdOErnZx6xozUmvjyn_NO3L8q28gdMrv7PMIQePPIrKhVhs5iQ0QKX_qMohVqKVszsMWps3a1G9cXOeMfYCSMd03F54EyIkJB1ZDCuvSKP4njo5-1C0ad7Yl_AZQ',
  bio: 'Ambition-driven Computer Science graduate specializing in modern web development and database management. Strong foundation in object-oriented programming, clean system architecture, and core Agile methodologies. Seeking an entry-level software engineering role to deliver high-quality, scalable code within a collaborative team.',
  codeFocus: 'const focus = ["High-Scale Systems", "LLMs", "Microservices"];',
  statusPill: 'Open for Full-Time SWE Roles',
  availabilityDetails: 'Available for Immediate Hire / Relocation / Remote',
};

export const PROJECTS: Project[] = [
  {
    id: 'amarshop',
    title: 'AmarShop',
    flagshipNumber: 'Flagship #01',
    category: 'fullstack',
    categories: ['fullstack', 'backend'],
    tagline: 'Enterprise multi-vendor commerce platform powering high-concurrency order settlements with sub-millisecond inventory locking.',
    badge: 'Production Ready',
    badgeColor: 'text-secondary',
    versionOrEndpoint: 'v2.4.0',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbTMiFvPV9xTw4VEoXIdN7pVFT04F4_VavycJ1DPH1motJ8dzRGTW8ToL__kS9nF8-PXdnE1clpCDDn4NnjJs4YTJETgqcrTj52iIIFCn3qR2fe2r1Vg2YIfVd3B9F0HLPR_c2VeHjOPeH3AaraJUJ_FnjNX2nvLkHcZ6wi1FjQBxZgLv9Ew2zKAf5DNR0Svn-WFvMuuLLg9AWkn-oynMGxVmqU-7KAYZPpQ9xvTIsfcfNaPFZVDE',
    isFlagship: true,
    metrics: [
      { value: '97', label: 'PG Tables', color: 'primary' },
      { value: '4-Tier', label: 'RBAC Guards', color: 'secondary' },
      { value: '4 Rails', label: 'Payments', color: 'tertiary' },
    ],
    highlights: [
      {
        icon: 'schema',
        title: '97-table PostgreSQL schema',
        description: 'Architected across isolated admin, seller, and buyer schema domains.',
      },
      {
        icon: 'security',
        title: 'JWT authentication',
        description: 'With rotating refresh tokens, blacklisting via Redis, and fine-grained @Roles() guards.',
      },
      {
        icon: 'bolt',
        title: 'Real-time WebSocket dispatcher',
        description: 'Dynamic flash-sale inventory reservation and RFM cohort business analytics.',
      },
      {
        icon: 'payments',
        title: 'Integrated payment rails',
        description: 'bKash, Nagad, SSLCommerz & COD rails, packaged with Docker Compose and OpenTelemetry APM traces.',
      },
    ],
    techStack: [
      'Next.js 16',
      'NestJS 11',
      'PostgreSQL',
      'Prisma',
      'Redis',
      'Docker',
      'WebSocket',
      'SSLCommerz',
    ],
    githubUrl: 'https://github.com/shawon2210/AMAR-Shop',
    liveUrl: 'https://amarshop-eight.vercel.app/',
    architectureDetails: {
      overview: 'Multi-vendor e-commerce platform built to solve inventory racing, double-spending, and inconsistent order states under high concurrent flash sales.',
      keyDecisions: [
        'Isolated PostgreSQL schemas for customer, vendor tenant, and platform admin domains.',
        'Redis distributed lock pattern (Redlock) ensuring zero overselling during flash promotions.',
        'NestJS modular architecture with interceptors for OpenTelemetry distributed tracing.',
        'Next.js App Router frontend with server-side caching and dynamic client cart hydration.'
      ],
      schemaTablesCount: 97,
      testCoverage: '88% unit & integration coverage'
    }
  },
  {
    id: 'supportpilot',
    title: 'SupportPilot AI',
    flagshipNumber: 'Flagship #02',
    category: 'aiml',
    categories: ['aiml', 'backend'],
    tagline: 'Autonomous customer support infrastructure integrating LangChain agents, pgvector embeddings, and dynamic multi-model routing.',
    badge: 'Multi-Tenant RAG',
    badgeColor: 'text-primary',
    versionOrEndpoint: '79 Endpoints',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_lsDg-L7-ae_WSX8INPgi3_M4PQ8jfTp9HyY0nreEMtNb_ajdfgLmLjMBsqyL8Mkm9CJIXIyVnbULIojkAaerwvaqrQD7ueSIQps1i45c0wjnMMfg3vQ09hTR53ImmC5Hfp08qSCV6ubv_ZGZglSSCWx4rYHqMfk-PJDtC-oRmR_qiEU-NuQmkBzzAZJZvWk6bFRS0-trz9V0dHQhQR2uN9egQDIFW9G6VJzK7dZDeGlFM6LccCw',
    isFlagship: true,
    metrics: [
      { value: '97 Tests', label: 'PyTest Passing', color: 'secondary' },
      { value: '7 LLMs', label: 'Hot Swappable', color: 'primary' },
      { value: '29 Pages', label: 'Next 15 App', color: 'tertiary' },
    ],
    highlights: [
      {
        icon: 'neurology',
        title: 'Autonomous RAG Engine',
        description: 'Auto document chunking, dynamic web scrapers, pgvector semantic search, and grounded source citations.',
      },
      {
        icon: 'swap_horiz',
        title: 'Unified Provider Abstraction',
        description: 'Seamlessly switching OpenAI, Anthropic, Gemini, or DeepSeek through a single runtime flag.',
      },
      {
        icon: 'stream',
        title: 'Streaming & Metered Billing',
        description: 'SSE streaming token updates, intelligent zero-shot ticket classification, and Stripe 4-tier metered usage billing.',
      },
    ],
    techStack: [
      'FastAPI',
      'Next.js 15',
      'pgvector',
      'LangChain',
      'Redis',
      'Stripe',
      'Docker',
    ],
    githubUrl: 'https://github.com/shawon2210/SupportPilot-AI',
    liveUrl: 'https://supportpilot-ai-phi.vercel.app/',
    architectureDetails: {
      overview: 'B2B enterprise customer support automation system with hybrid keyword + semantic vector retrieval and verifiable LLM attribution.',
      keyDecisions: [
        'PostgreSQL with pgvector for unified storage of relational client accounts and high-dimensional document vectors.',
        'FastAPI asynchronous event loops streaming chunked inference via Server-Sent Events (SSE).',
        'Hot-swappable model gateway with automatic failover fallback between Gemini, Claude, and GPT-4o.',
        'Redis rate-limiting and Celery background workers for background documentation scrapers.'
      ],
      testCoverage: '97 PyTest passing suite'
    }
  },
  {
    id: 'online24pharmacy',
    title: 'Online24Pharmacy',
    flagshipNumber: 'Flagship #03',
    category: 'fullstack',
    categories: ['fullstack', 'aiml'],
    tagline: 'Complete prescription distribution and inventory ecosystem linking customer orders, pharmacist checks, and courier logistics.',
    badge: 'HealthTech Core',
    badgeColor: 'text-tertiary',
    versionOrEndpoint: '7 Workflows',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQ-v_u1RjYLU21M_DUO0W8MVccihRV1eCW8HNDM8Q-dNPEfjAsnjN37i6cHmI0PzReT4zDBD8ovymocDJpo30cmndBuLDA97MH6QXYNcMfP4C9AmFHY8nKOd5h89eeoNjaTRIvGXFb_ujtkztYJqmkDwlMuR1pCCMc133Jp0m1no4uqKFGjRJwufwA4OSPm92BF4L0xyTIxP93S3QOlH-s1aGdxtHFDPuR29sCLXvTj8RCQwAsNPg',
    isFlagship: true,
    metrics: [
      { value: '-50%', label: 'Support Load', color: 'tertiary' },
      { value: '4 Roles', label: 'End-to-End', color: 'primary' },
      { value: '25+', label: 'Secured Routes', color: 'secondary' },
    ],
    highlights: [
      {
        icon: 'diversity_3',
        title: '4-Role Orchestration',
        description: 'Granular views and permissions for Customer, Pharmacist, Delivery Driver, and Medical Supplier.',
      },
      {
        icon: 'forum',
        title: 'AI Triage Chatbot',
        description: 'AI-driven triage chatbot leveraging OpenAI & Gemini reducing routine dosage inquiry escalation by half.',
      },
      {
        icon: 'verified_user',
        title: 'Stateless Security Model',
        description: 'Stateless JWT rotation security model validated via comprehensive Vitest suite for drug supply compliance.',
      },
    ],
    techStack: [
      'React.js',
      'Node.js',
      'Express',
      'Prisma',
      'PostgreSQL',
      'Vitest',
    ],
    githubUrl: 'https://github.com/shawon2210/Online24Pharmacy',
    liveUrl: 'https://online24pharmacy.vercel.app/',
    architectureDetails: {
      overview: 'Digital healthcare platform orchestrating prescription validation, medicine stock reservations, and multi-tenant delivery assignments.',
      keyDecisions: [
        'Role-Based Access Control (RBAC) across 4 synchronized portal experiences.',
        'Prescription image attachment validation with automated OCR verification pipelines.',
        'Vitest integration test harness validating batch medicine expiration queries and restocking alerts.'
      ],
      testCoverage: 'Vitest comprehensive security suite'
    }
  },
  // Specialized Modules
  {
    id: 'shohel-pharmacy',
    title: 'Shohel Pharmacy System',
    category: 'fullstack',
    categories: ['fullstack', 'backend'],
    tagline: 'Modular pharmacy inventory suite featuring 6 core business modules, 20+ validated REST endpoints, and containerized Vercel deployment.',
    badge: 'Deployed',
    badgeColor: 'text-secondary',
    versionOrEndpoint: '20+ Endpoints',
    isFlagship: false,
    metrics: [
      { value: '20+', label: 'Endpoints', color: 'primary' },
      { value: '6', label: 'Modules', color: 'secondary' },
    ],
    highlights: [
      {
        icon: 'dns',
        description: '20+ validated REST endpoints for medicine stock control and billing.',
      },
    ],
    techStack: ['MongoDB', 'Express', 'React', 'Docker'],
    githubUrl: 'https://github.com/shawon2210/Shohel-Pharmacy-',
    liveUrl: 'https://shohel-pharmacy.vercel.app/',
  },
  {
    id: 'email-generation-assistant',
    title: 'Email Generation Assistant',
    category: 'aiml',
    categories: ['aiml'],
    tagline: 'Streamlit AI copilot running OpenRouter and LangChain pipelines with 19 passing unit tests and contextual cold-outreach templates.',
    badge: '+23.5% Metric',
    badgeColor: 'text-primary',
    versionOrEndpoint: '19 Passing Tests',
    isFlagship: false,
    metrics: [
      { value: '+23.5%', label: 'Metric Boost', color: 'primary' },
      { value: '19', label: 'Unit Tests', color: 'secondary' },
    ],
    highlights: [
      {
        icon: 'check_circle',
        description: '19 Passing unit tests with contextual cold-outreach templates.',
      },
    ],
    techStack: ['Streamlit', 'LangChain', 'OpenRouter', 'Python'],
    githubUrl: 'https://github.com/shawon2210/Email-Generation-Assistant',
    liveUrl: 'https://github.com/shawon2210/Email-Generation-Assistant',
  },
  {
    id: 'bangla-fake-news',
    title: 'Bangla Fake News Detection',
    category: 'aiml',
    categories: ['aiml'],
    tagline: 'Deep learning sequence classifier tailored for low-resource Bangla linguistic nuances, evaluating veracity with interactive inference sandbox.',
    badge: 'Gradio Demo',
    badgeColor: 'text-secondary',
    versionOrEndpoint: 'BanglaBERT',
    isFlagship: false,
    metrics: [
      { value: 'BanglaBERT', label: 'Fine-Tuned', color: 'tertiary' },
      { value: 'Transformer', label: 'Architecture', color: 'secondary' },
    ],
    highlights: [
      {
        icon: 'model_training',
        description: 'Low-resource Bangla linguistic nuances classified with fine-tuned BanglaBERT.',
      },
    ],
    techStack: ['PyTorch', 'HuggingFace', 'Gradio', 'Transformers'],
    githubUrl: 'https://github.com/shawon2210/Bangla-FakeNewsDetection',
    liveUrl: 'https://github.com/shawon2210/Bangla-FakeNewsDetection',
  },
];

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    id: 'innofast',
    company: 'Innofast Technologies Limited',
    role: 'Frontend Developer',
    period: 'Oct 2025 – Feb 2026',
    location: 'Dhaka, Bangladesh',
    badge: 'Recent',
    badgeColor: 'text-secondary',
    typeBadge: '3-Mo Intern',
    stackSummary: 'Core Stack: React.js · Tailwind · REST APIs',
    metrics: [
      {
        label: 'LIGHTHOUSE',
        value: '64 → 91 (+27)',
        icon: 'speed',
        color: 'text-secondary',
      },
      {
        label: 'PAGE LOAD',
        value: '-30% latency',
        icon: 'rocket_launch',
        color: 'text-primary',
      },
    ],
    achievements: [
      'Engineered 8+ mobile-first React.js components using modular Tailwind CSS paradigms for seamless cross-device rendering.',
      'Integrated 10+ REST API endpoints with centralized error-trapping and async/await, reducing failed requests by 25% across 3 production releases.',
      'Shipped 4 on-time Agile sprint cycles within a 6-engineer squad; engaged in daily stand-ups, pull-request critiques, and Git workflows.',
    ],
    previewImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQycKELgFOlYrfnD3VxC243NbNojFagS4ffIVr2fzKVwuV2O7QURZKBJHdeMlxP9Dlr10UpbAFkLM2225eRu4Ful_zBkc_ImgG9rE7cOOjTSi30Db_e-FFI4mgq11wmudUUzkyjeOmiHZMxfg6iTU_1I0G1ekcgi-iHymCVwy8wcht-yl6lEnS7If5hzdYaQEFSGPUOUUvqAENohuakP-CAd-GANDEzkFazS93yxghAcKjIEK7jb8',
    previewCaption: 'Component Architecture & Dashboard Engine',
  },
  {
    id: 'edge-django',
    company: 'EDGE Education · ICT Division',
    role: 'Django Developer (Trainee)',
    period: 'Dec 2024 – Jun 2025',
    location: 'Dhaka, Bangladesh',
    badge: '80h Certified',
    badgeColor: 'text-primary',
    typeBadge: 'BCC Accredited',
    stackSummary: 'Core Stack: Python · Django REST · PostgreSQL',
    metrics: [
      {
        label: 'FULL APPS',
        value: '3 Production',
        icon: 'storage',
        color: 'text-secondary',
      },
      {
        label: 'FRONTEND TIME',
        value: '-40% Saved',
        icon: 'swap_horiz',
        color: 'text-primary',
      },
    ],
    achievements: [
      'Completed intensive 80-hour advanced Django certification conducted by Dept. of CSE, Jagannath University and Bangladesh Computer Council (BCC).',
      'Architected 3 relational database apps on PostgreSQL utilizing standard Django MVC patterns, custom querysets, and migrations.',
      'Designed and documented clean Swagger/Postman 12+ endpoint REST API specifications with strict HTTP verbs, reducing integration blockers 40%.',
    ],
  },
];

export const EDUCATION_LIST: EducationItem[] = [
  {
    id: 'iubat',
    degree: 'BSc in Computer Science & Engineering',
    level: 'Bachelor Degree',
    institution: 'IUBAT — International University of Business Agriculture & Technology',
    period: 'Jan 2022 – Feb 2026',
    gradeLabel: 'CGPA',
    gradeValue: '3.35 / 4.00',
    icon: 'account_balance',
    color: 'text-primary',
    curricula: [
      'Data Structures & Algorithms',
      'Software Engineering',
      'Database Management',
      'Computer Networks',
      'Artificial Intelligence',
    ],
  },
  {
    id: 'hsc',
    degree: 'HSC, Science',
    level: 'Higher Secondary',
    institution: 'Khulna Public College',
    boardOrDetails: 'Jessore Board',
    period: '2019 – 2020',
    gradeLabel: 'GPA',
    gradeValue: '5.00',
    icon: 'verified_user',
    color: 'text-secondary',
    isPerfectScore: true,
  },
  {
    id: 'ssc',
    degree: 'SSC, Science',
    level: 'Secondary School',
    institution: 'A C Laha Pilot High School',
    boardOrDetails: 'Jessore Board',
    period: '2016 – 2017',
    gradeLabel: 'GPA',
    gradeValue: '5.00',
    icon: 'military_tech',
    color: 'text-tertiary',
    isPerfectScore: true,
  },
];

export const CERTIFICATES: CertificateItem[] = [
  {
    id: 'cert-django',
    title: 'Python (Django) Web Framework',
    issuer: 'Dept. of CSE, Jagannath Univ & ICT Division (BCC)',
    duration: '80 Hrs',
    completedDate: 'Completed July 2025',
    icon: 'terminal',
    color: 'text-secondary',
  },
  {
    id: 'cert-innofast',
    title: 'Frontend Developer Internship',
    issuer: 'Innofast Technologies Limited · Production Release Certified',
    duration: '3-Month',
    completedDate: 'Completed Feb 2026',
    icon: 'integration_instructions',
    color: 'text-primary',
  },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'languages',
    name: 'Core Languages',
    badge: 'SYNTAX & LOGIC',
    icon: 'code',
    color: 'text-primary',
    skills: ['Java', 'JavaScript (ES6+)', 'Python', 'SQL', 'C#', 'C++'],
  },
  {
    id: 'frontend',
    name: 'Frontend Architecture',
    badge: 'UI / UX',
    icon: 'web',
    color: 'text-secondary',
    skills: ['React.js', 'Next.js 15/16', 'TypeScript', 'Tailwind CSS', 'State Machines'],
  },
  {
    id: 'backend',
    name: 'Backend & APIs',
    badge: 'SERVICES',
    icon: 'dns',
    color: 'text-tertiary',
    skills: ['NestJS', 'Node.js', 'Django', 'Express.js', 'FastAPI', 'JWT Auth'],
  },
  {
    id: 'database',
    name: 'Data Stores & Caching',
    badge: 'PERSISTENCE',
    icon: 'database',
    color: 'text-primary-fixed',
    skills: ['PostgreSQL', 'MongoDB', 'Prisma ORM', 'Redis Distributed Cache', 'pgvector'],
  },
  {
    id: 'aiml',
    name: 'AI & ML Integration',
    badge: 'INTELLIGENCE',
    icon: 'psychology',
    color: 'text-secondary',
    skills: ['LangChain', 'Hugging Face', 'PyTorch', 'RAG Architecture', 'Vector Embeddings'],
  },
  {
    id: 'devops',
    name: 'DevOps, Testing & Cloud',
    badge: 'PIPELINES',
    icon: 'build',
    color: 'text-primary',
    skills: ['GitHub Actions CI/CD', 'Docker Compose', 'Vitest', 'Pytest', 'Vercel', 'Linux / Bash'],
  },
];
