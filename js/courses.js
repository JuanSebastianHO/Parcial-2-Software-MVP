// ============================================================
// CAPA DE DATOS — courses.js
// Exporta COURSES_DATA con 4 cursos de capacitación corporativa
// ============================================================

const COURSES_DATA = [
  {
    id: "course-001",
    title: "Protección de Datos Personales",
    category: "Cumplimiento Legal",
    duration: "3h 20min",
    thumbnailUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&q=80",
    lessons: [
      { id: "l001-1", title: "Introducción al RGPD y normativas locales", type: "video", status: "pending" },
      { id: "l001-2", title: "Principios del tratamiento de datos", type: "text", status: "pending" },
      { id: "l001-3", title: "Derechos del titular de los datos", type: "video", status: "pending" },
      { id: "l001-4", title: "Responsabilidades del empleado", type: "text", status: "pending" },
      { id: "l001-5", title: "Casos prácticos y sanciones", type: "video", status: "pending" }
    ]
  },
  {
    id: "course-002",
    title: "Ética Empresarial y Código de Conducta",
    category: "Cultura Corporativa",
    duration: "2h 45min",
    thumbnailUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80",
    lessons: [
      { id: "l002-1", title: "Fundamentos de la ética organizacional", type: "text", status: "pending" },
      { id: "l002-2", title: "Conflictos de interés: identificación y gestión", type: "video", status: "pending" },
      { id: "l002-3", title: "Canal de denuncias y política de no represalia", type: "text", status: "pending" },
      { id: "l002-4", title: "Toma de decisiones éticas bajo presión", type: "video", status: "pending" }
    ]
  },
  {
    id: "course-003",
    title: "Seguridad de la Información",
    category: "Ciberseguridad",
    duration: "4h 10min",
    thumbnailUrl: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&q=80",
    lessons: [
      { id: "l003-1", title: "Amenazas digitales: phishing y ransomware", type: "video", status: "pending" },
      { id: "l003-2", title: "Gestión segura de contraseñas", type: "text", status: "pending" },
      { id: "l003-3", title: "Uso seguro de dispositivos corporativos", type: "video", status: "pending" },
      { id: "l003-4", title: "Protocolos ante incidentes de seguridad", type: "text", status: "pending" },
      { id: "l003-5", title: "Teletrabajo seguro y VPN", type: "video", status: "pending" },
      { id: "l003-6", title: "Simulacro de respuesta a incidentes", type: "video", status: "pending" }
    ]
  },
  {
    id: "course-004",
    title: "Comunicación Efectiva en el Entorno Laboral",
    category: "Habilidades Blandas",
    duration: "2h 30min",
    thumbnailUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80",
    lessons: [
      { id: "l004-1", title: "Escucha activa y empatía organizacional", type: "text", status: "pending" },
      { id: "l004-2", title: "Comunicación asertiva y no violenta", type: "video", status: "pending" },
      { id: "l004-3", title: "Comunicación escrita efectiva: emails y reportes", type: "text", status: "pending" },
      { id: "l004-4", title: "Presentaciones de alto impacto", type: "video", status: "pending" }
    ]
  }
];
