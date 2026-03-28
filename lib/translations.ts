export type Locale = 'es' | 'en';

export const translations = {
  es: {
    // Landing
    aboutUs: 'Sobre mí',
    rolePill: 'PM · Diseñador · AI Builder',
    headline: 'Soy Axel, PM y diseñador. ',
    headlineHighlight: 'Preguntame lo que quieras.',
    subtitle: 'Construí este portfolio de punta a punta, IA incluida. Es la mejor forma que encontré de mostrar lo que hago.',
    searchPlaceholder: 'Quiero explorar proyectos, experiencia, disponibilidad...',
    poweredBy: 'Powered by AI · Pregunta lo que quieras sobre Axel',
    goToChat: 'Ir al chat',
    featuredProjects: 'Proyectos destacados',
    featuredProjectsPrev: 'Proyectos anteriores',
    featuredProjectsNext: 'Siguientes proyectos',
    connectQuestion: '¿Queres conectar? ',
    connectLinkedIn: 'Conecta por LinkedIn',

    // Filters
    projects: 'Proyectos',
    experience: 'Experiencia',
    skills: 'Skills',
    pmDesign: 'PM & Design',
    collaboration: 'Colaboración',

    // Featured projects
    active: 'Activo',
    shipped: 'Lanzado',
    caseStudy: 'Estudio de caso',
    wakeUpLabsDesc: 'Estrategia de producto y UX en todos los productos',
    fintechDesc: 'Rediseño de onboarding, mejora de conversión',
    aiPrototypeDesc: 'Prototipo en 48h con Cursor y Claude',
    marketplaceDesc: 'Sistema de diseño unificado en 3 equipos',

    // Topbar (chat view)
    available: 'Disponible',
    linkedIn: 'LinkedIn',
    email: 'Email',
    downloadCV: 'Descargar CV',

    // Sidebar
    name: 'Axel Klecki',
    role: 'Product Manager & Design Strategist',
    projectsLabel: 'Proyectos',
    skillsLabel: 'Skills',
    skillLabels: ['Estrategia de producto', 'UX/UI Design', 'Investigación de usuarios', 'Design Systems', 'Desarrollo con IA'],
    noProjectsLoaded: 'Sin proyectos cargados',
    viewAllProjects: 'Ver todos →',
    chatHistory: 'Historial de chats',
    noHistory: 'Las preguntas que hagas aparecerán acá',
    navBack: 'Volver atrás',

    // Chat
    welcomeText: 'Pregunta lo que quieras sobre Axel — proyectos, experiencia, disponibilidad o cómo trabaja.',
    chatPlaceholder: 'Pregunta lo que quieras sobre Axel...',
    errorMessage: 'Algo salió mal. Por favor intenta de nuevo.',
    retry: 'Reintentar',

    // Project panel
    loadingProject: 'Cargando proyecto…',
    projectLoadError: 'No se pudo cargar el proyecto.',
    projectPanelLabel: 'Panel de proyecto',
    closePanel: 'Cerrar panel',
    viewProject: 'Ver proyecto →',
    viewProjectNamed: 'Ver',
    viewProjectLive: 'Ver proyecto en vivo',
    viewDemo: 'Ver demo',
    projectSectionOverview: 'Visión general',
    projectSectionProblem: 'Problema',
    projectSectionProcess: 'Proceso',
    projectSectionResult: 'Resultado',
    projectStepLabel: 'Paso',

    // Suggested questions (2 long + 3 short for landing layout)
    suggestedQuestions: [
      "¿Cómo combinas PM y diseño en un mismo rol?",
      "¿Cómo integras la IA en trabajo?",
      "¿Por qué debería contratarte?",
      "¿Cuál es tu experiencia en fintech?",
      "¿Estás disponible para roles full-time?",
      "¿Cómo trabajas con equipos de ingeniería?",
      "¿Qué herramientas usas para trabajo de producto?",
    ],
  },
  en: {
    // Landing
    aboutUs: 'About me',
    rolePill: 'PM · Designer · AI Builder',
    headline: "I'm Axel, PM and designer. ",
    headlineHighlight: 'Ask me whatever you want.',
    subtitle: 'I built this portfolio from end to end, AI included. It\'s the best way I found to show what I do',
    searchPlaceholder: 'I want to explore projects, experience, availability...',
    poweredBy: 'Powered by AI · Ask anything about Axel',
    goToChat: 'Go to chat',
    featuredProjects: 'Featured Projects',
    featuredProjectsPrev: 'Previous projects',
    featuredProjectsNext: 'Next projects',
    connectQuestion: 'Want to connect? ',
    connectLinkedIn: 'Connect via LinkedIn',

    // Filters
    projects: 'Projects',
    experience: 'Experience',
    skills: 'Skills',
    pmDesign: 'PM & Design',
    collaboration: 'Collaboration',

    // Featured projects
    active: 'Active',
    shipped: 'Shipped',
    caseStudy: 'Estudio de caso',
    wakeUpLabsDesc: 'Product strategy & UX across all products',
    fintechDesc: 'Onboarding redesign, conversion improvement',
    aiPrototypeDesc: '48h prototype with Cursor + Claude',
    marketplaceDesc: 'Unified design system across 3 teams',

    // Topbar (chat view)
    available: 'Available',
    linkedIn: 'LinkedIn',
    email: 'Email',
    downloadCV: 'Download CV',

    // Sidebar
    name: 'Axel Klecki',
    role: 'Product Manager & Design Strategist',
    projectsLabel: 'Projects',
    skillsLabel: 'Skills',
    skillLabels: ['Product Strategy', 'UX/UI Design', 'User Research', 'Design Systems', 'AI-Assisted Dev'],
    noProjectsLoaded: 'No projects loaded',
    viewAllProjects: 'View all →',
    chatHistory: 'Chat history',
    noHistory: 'Questions you ask will appear here',
    navBack: 'Go back',

    // Chat
    welcomeText: 'Ask anything about Axel — projects, experience, availability, or how he works.',
    chatPlaceholder: 'Ask anything about Axel...',
    errorMessage: 'Something went wrong. Please try again.',
    retry: 'Retry',

    // Project panel
    loadingProject: 'Loading project…',
    projectLoadError: 'Could not load project.',
    projectPanelLabel: 'Project panel',
    closePanel: 'Close panel',
    viewProject: 'View project →',
    viewProjectNamed: 'View',
    viewProjectLive: 'View project live',
    viewDemo: 'View demo',
    projectSectionOverview: 'Overview',
    projectSectionProblem: 'Problem',
    projectSectionProcess: 'Process',
    projectSectionResult: 'Result',
    projectStepLabel: 'Step',

    // Suggested questions (2 long + 3 short for landing layout)
    suggestedQuestions: [
      "How do you combine PM and design in one role?",
      "How do you integrate AI into your work?",
      "Why should I hire you?",
      "What's your experience in fintech?",
      "Are you available for full-time roles?",
      "How do you work with engineering teams?",
      "What tools do you use for product work?",
    ],
  },
} as const;

export type TranslationKeys = keyof (typeof translations)['es'];
