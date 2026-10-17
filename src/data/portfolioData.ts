import { Project, WorkExperience, EducationItem, CertificateItem, SkillCategory } from '../types';

export const PERSONAL_INFO = {
  name: 'MD SHAWON MOLLA',
  shortName: 'MD Shawon Molla',
  /** Canonical professional title. Keep in sync with static metadata in index.html. */
  title: 'Full-Stack Engineer, Product Systems & AI',
  location: 'Dhaka, Bangladesh',
  email: '22103330@iubat.edu',
  phone: '+880 1987-407441',
  whatsAppUrl: 'https://wa.me/8801987407441',
  githubUrl: 'https://github.com/shawon2210',
  linkedinUrl: 'https://linkedin.com/in/md-shawon-molla-2a3877293',
  liveAppUrl: 'https://oddboundary.lovable.app',
  portraitUrl: '/mdshawonmolla.jpeg',
  logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLCHJjyXcP3WGiCESsSk0TO-ee-JSQuqOlGcbjFKYUltpXQtmC8hGeNwYLfG2ijA7bmWIwFlFfrdX3zeZRSPpfQ3T2WZ22WHPOq8Qdlda4WewOcPLY-ZwY_C5hdOErnZx6xozUmvjyn_NO3L8q28gdMrv7PMIQePPIrKhVhs5iQ0QKX_qMohVqKVszsMWps3a1G9cXOeMfYCSMd03F54EyIkJB1ZDCuvSKP4njo5-1C0ad7Yl_AZQ',
  bio: 'Product-minded full-stack engineer building resilient products and AI-enabled systems that hold up in real operations. I connect architecture, delivery speed, and product thinking to software that teams can trust in production.',
  codeFocus: 'const focus = ["Product Systems", "AI Workflows", "Backend + Frontend"];',
  statusPill: 'Open to Product, AI & Full-Stack Roles',
  availabilityDetails: 'Remote / Hybrid / Relocation',
};

export const PROJECTS: Project[] = [
  {
    id: 'amarshop',
    title: 'AmarShop',
    flagshipNumber: 'Flagship #01',
    category: 'fullstack',
    categories: ['fullstack', 'backend'],
    tagline: 'Multi-vendor commerce platform for concurrent order flow, vendor operations, and reliable checkout orchestration under high-volume conditions.',
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
        title: 'Multi-domain schema design',
        description: 'Separated customer, seller, and admin boundaries to reduce cross-tenant risk and simplify ownership of operational logic.',
      },
      {
        icon: 'security',
        title: 'Access control and auth flow',
        description: 'JWT-based session handling with refresh rotation and role-based protection across sensitive commerce actions.',
      },
      {
        icon: 'bolt',
        title: 'Operational resilience under load',
        description: 'Built for flash-sale pressure, race-condition handling, and stable inventory flow during peak checkouts.',
      },
      {
        icon: 'payments',
        title: 'Checkout orchestration',
        description: 'Integrated payment rails and observability hooks to keep the purchase lifecycle visible and manageable.',
      },
    ],
    techStack: [
      'Next.js',
      'NestJS',
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
      overview: 'Commerce architecture designed around order integrity, tenant isolation, and predictable checkout behavior under concurrent demand.',
      keyDecisions: [
        'Split product, seller, and admin domains into clearly scoped data boundaries to reduce operational coupling.',
        'Modeled auth and permissions around role isolation so sensitive flows remain protected across the commerce lifecycle.',
        'Used observability and structured tracing to diagnose checkout and inventory edge cases during high-traffic conditions.',
        'Kept frontend and backend responsibilities separated enough to support faster iteration without weakening the purchase workflow.'
      ],
      schemaTablesCount: 97,
      testCoverage: 'Production-focused design and validation across core commerce operations'
    }
  },
  {
    id: 'supportpilot',
    title: 'SupportPilot AI',
    flagshipNumber: 'Flagship #02',
    category: 'aiml',
    categories: ['aiml', 'backend'],
    tagline: 'AI support platform for handling multi-step customer workflows, semantic retrieval, and model routing without losing operational clarity.',
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
        title: 'Grounded support workflow',
        description: 'Combined semantic retrieval, source-grounded response logic, and document retrieval to keep troubleshooting workflows grounded in evidence.',
      },
      {
        icon: 'swap_horiz',
        title: 'Model routing architecture',
        description: 'Designed a provider abstraction layer so model changes remain isolated from the application workflow and business logic.',
      },
      {
        icon: 'stream',
        title: 'Operational control and billing',
        description: 'Used streaming responses and metered usage patterns to keep live support interactions transparent and trackable.',
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
      overview: 'AI support architecture built around retrieval quality, model flexibility, and a clean separation between customer-facing response generation and system operations.',
      keyDecisions: [
        'Stored customer and document context in a structured relational system while keeping retrieval vectors optimized for semantic lookup.',
        'Separated provider interfaces from workflow logic so model switching does not force redesigns in the main assistant experience.',
        'Structured streaming responses and accounting hooks so usage and service quality remain visible to operators.',
        'Kept automation steps interpretable enough for customer support teams to reason about response quality and escalation paths.'
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
    tagline: 'Healthcare workflow platform connecting order intake, pharmacist review, logistics, and role-based access in one operational system.',
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
        title: 'Role-based operational flow',
        description: 'Mapped customer, pharmacist, delivery, and supplier roles into a single workflow with clear boundaries and permissions.',
      },
      {
        icon: 'forum',
        title: 'AI triage and workflow support',
        description: 'Used AI-assisted triage to reduce repetitive inquiry handling while keeping escalation and handoff paths visible.',
      },
      {
        icon: 'verified_user',
        title: 'Security and compliance posture',
        description: 'Designed a stateless auth model and validation flows that prioritize trust, access control, and maintainability.',
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
      overview: 'Healthcare platform structured around role separation, operational clarity, and reliability in an environment where trust and workflow correctness matter as much as UI polish.',
      keyDecisions: [
        'Modeled a four-role workflow to keep customer, pharmacist, driver, and supplier responsibilities explicit and auditable.',
        'Built permission boundaries early so sensitive health-related actions remained protected by a consistent access model.',
        'Used automated validation and workflow checks to keep routine operational tasks understandable and less error-prone.',
        'Balanced product flow and system constraints to make the experience usable without hiding the operational complexity behind the scenes.'
      ],
      testCoverage: 'Vitest-based validation across workflow and access-control paths'
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
    skills: ['React.js', 'Next.js 15', 'TypeScript', 'Tailwind CSS', 'State Machines'],
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
