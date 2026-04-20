// ============================================================
// learning.js — Modo Lectura, Mini-Quiz y desbloqueo de módulos
// ============================================================

// Banco de preguntas por curso (3 por curso)
const QUIZ_BANK = {
  "course-001": [
    {
      question: "¿Cuál es el principio fundamental del RGPD respecto a la recolección de datos?",
      options: ["Recopilar el máximo posible", "Minimización de datos", "Compartir libremente", "Cifrado obligatorio"],
      correct: 1
    },
    {
      question: "¿Qué derecho permite al titular solicitar que sus datos sean eliminados?",
      options: ["Derecho de acceso", "Derecho de portabilidad", "Derecho al olvido", "Derecho de rectificación"],
      correct: 2
    },
    {
      question: "¿Cuánto tiempo máximo tiene una empresa para notificar una brecha de datos?",
      options: ["24 horas", "72 horas", "7 días", "30 días"],
      correct: 1
    }
  ],
  "course-002": [
    {
      question: "¿Qué es un conflicto de interés en el entorno laboral?",
      options: ["Una disputa entre colegas", "Cuando el interés personal interfiere con el profesional", "Un desacuerdo con el cliente", "Un error en un contrato"],
      correct: 1
    },
    {
      question: "El canal de denuncias sirve principalmente para:",
      options: ["Quejarse del salario", "Reportar conductas no éticas de forma segura", "Solicitar vacaciones", "Evaluar al jefe"],
      correct: 1
    },
    {
      question: "¿Cuál es la base de una toma de decisiones ética?",
      options: ["El beneficio propio", "La presión del jefe", "El bien común y los valores corporativos", "La rapidez de ejecución"],
      correct: 2
    }
  ],
  "course-003": [
    {
      question: "¿Qué es el phishing?",
      options: ["Un tipo de virus", "Un ataque que suplanta identidades para robar datos", "Un firewall", "Un protocolo de red"],
      correct: 1
    },
    {
      question: "¿Cuál es la práctica más segura para gestionar contraseñas?",
      options: ["Usar la misma para todo", "Anotarlas en un papel", "Usar un gestor de contraseñas y autenticación doble", "Compartirlas con el equipo"],
      correct: 2
    },
    {
      question: "Ante un incidente de seguridad, el primer paso es:",
      options: ["Apagar el equipo sin avisar", "Notificar al equipo de TI inmediatamente", "Intentar solucionarlo solo", "Ignorarlo si parece menor"],
      correct: 1
    }
  ],
  "course-004": [
    {
      question: "La escucha activa implica:",
      options: ["Esperar que el otro termine para responder", "Atender con plena presencia y verificar comprensión", "Tomar notas sin interactuar", "Responder rápido para ser eficiente"],
      correct: 1
    },
    {
      question: "Un mensaje asertivo se caracteriza por:",
      options: ["Imponer el punto de vista propio", "Expresar necesidades con respeto y claridad", "Ceder siempre ante el otro", "Ser indirecto para no ofender"],
      correct: 1
    },
    {
      question: "¿Qué elemento es clave en una presentación de alto impacto?",
      options: ["La cantidad de texto en las diapositivas", "Un mensaje claro con soporte visual y narración", "Leer literalmente las diapositivas", "Usar muchos colores"],
      correct: 1
    }
  ]
};

// ── Renderiza el Modo Lectura de una lección ──
function renderLessonMode(lesson, course, session, onComplete) {
  const container = document.getElementById("lesson-container");
  if (!container) return;

  container.innerHTML = `
    <div class="lesson-wrapper animate-fade-in max-w-3xl mx-auto">
      <!-- Tipo badge -->
      <div class="flex items-center gap-3 mb-6">
        <span class="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest
          ${lesson.type === "video" ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"}">
          ${lesson.type === "video" ? "🎬 Video" : "📄 Lectura"}
        </span>
        <span class="text-slate-400 text-sm">${course.title}</span>
      </div>

      <h2 class="text-2xl font-bold text-slate-800 mb-4 leading-snug">${lesson.title}</h2>

      <!-- Simulación de contenido de lección -->
      <div class="prose prose-slate max-w-none mb-8 text-slate-600 leading-relaxed space-y-4" id="lesson-body">
        ${generateLessonContent(lesson)}
      </div>

      <!-- Barra de lectura simulada -->
      <div class="reading-progress-bar h-1 bg-slate-200 rounded-full mb-8 overflow-hidden">
        <div id="reading-fill" class="h-full bg-indigo-500 rounded-full transition-all duration-1000" style="width:0%"></div>
      </div>

      <button id="btn-start-quiz"
        class="w-full py-3 px-6 bg-indigo-600 text-white rounded-xl font-semibold
               shadow-md hover:bg-indigo-700 active:scale-95 transition-all duration-200
               flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
        disabled>
        <span>Responder mini-quiz</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    </div>
  `;

  // Simula que el usuario "leyó" el contenido después de 3s
  setTimeout(() => {
    document.getElementById("reading-fill").style.width = "100%";
    const btn = document.getElementById("btn-start-quiz");
    btn.disabled = false;
    btn.classList.remove("opacity-50", "cursor-not-allowed");
    btn.addEventListener("click", () => renderQuiz(course, lesson, session, onComplete));
  }, 3000);
}

// ── Renderiza el Mini-Quiz ──
function renderQuiz(course, lesson, session, onComplete) {
  const container = document.getElementById("lesson-container");
  const questions = QUIZ_BANK[course.id] || [];
  let answers     = new Array(questions.length).fill(null);

  container.innerHTML = `
    <div class="quiz-wrapper animate-slide-up max-w-2xl mx-auto">
      <div class="mb-6">
        <span class="text-xs font-bold uppercase tracking-widest text-indigo-500">Mini-Quiz</span>
        <h3 class="text-xl font-bold text-slate-800 mt-1">${lesson.title}</h3>
        <p class="text-slate-500 text-sm mt-1">Responde correctamente el 80% para continuar.</p>
      </div>

      <div id="quiz-questions" class="space-y-6">
        ${questions.map((q, qi) => `
          <div class="quiz-card bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <p class="font-semibold text-slate-700 mb-3">${qi + 1}. ${q.question}</p>
            <div class="space-y-2">
              ${q.options.map((opt, oi) => `
                <label class="flex items-center gap-3 p-3 rounded-lg cursor-pointer border border-transparent
                              hover:bg-indigo-50 hover:border-indigo-200 transition-colors group">
                  <input type="radio" name="q${qi}" value="${oi}"
                    class="accent-indigo-600" onchange="window._quizAnswers[${qi}]=${oi}">
                  <span class="text-slate-600 text-sm group-hover:text-indigo-700">${opt}</span>
                </label>
              `).join("")}
            </div>
          </div>
        `).join("")}
      </div>

      <button onclick="window._submitQuiz()"
        class="mt-6 w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold
               hover:bg-indigo-700 active:scale-95 transition-all duration-200">
        Enviar respuestas
      </button>
    </div>
  `;

  window._quizAnswers = answers;
  window._submitQuiz  = () => evaluateQuiz(course, lesson, questions, session, onComplete);
}

// ── Evalúa el quiz ──
function evaluateQuiz(course, lesson, questions, session, onComplete) {
  const answers   = window._quizAnswers;
  let correct     = 0;

  questions.forEach((q, i) => {
    if (answers[i] === q.correct) correct++;
  });

  const score   = Math.round((correct / questions.length) * 100);
  const passed  = score >= 80;

  // Guardar puntaje
  saveQuizScore(session.userId, course.id, score);

  renderQuizResult(score, passed, course, lesson, session, onComplete);
}

// ── Resultado del quiz ──
function renderQuizResult(score, passed, course, lesson, session, onComplete) {
  const container = document.getElementById("lesson-container");

  container.innerHTML = `
    <div class="result-wrapper animate-bounce-in text-center max-w-lg mx-auto py-10">
      <div class="text-6xl mb-4">${passed ? "🎉" : "📚"}</div>
      <h3 class="text-2xl font-bold ${passed ? "text-emerald-600" : "text-amber-600"} mb-2">
        ${passed ? "¡Excelente!" : "Sigue practicando"}
      </h3>
      <p class="text-slate-600 mb-2">Obtuviste <strong class="text-slate-800">${score}%</strong> de respuestas correctas.</p>
      <p class="text-slate-500 text-sm mb-8">
        ${passed
          ? "Lección completada. El siguiente módulo ha sido desbloqueado."
          : "Necesitas al menos 80% para avanzar. Revisa el contenido e inténtalo de nuevo."}
      </p>

      ${passed
        ? `<button onclick="window._onLessonComplete()"
             class="px-8 py-3 bg-emerald-600 text-white rounded-xl font-semibold
                    hover:bg-emerald-700 active:scale-95 transition-all duration-200">
             Continuar →
           </button>`
        : `<button onclick="window._retryLesson()"
             class="px-8 py-3 bg-amber-500 text-white rounded-xl font-semibold
                    hover:bg-amber-600 active:scale-95 transition-all duration-200">
             Reintentar lección
           </button>`}
    </div>
  `;

  if (passed) {
    window._onLessonComplete = () => {
      completeLesson(session.userId, course.id, lesson.id, course.lessons.length);
      if (onComplete) onComplete(lesson.id);
    };
  } else {
    window._retryLesson = () => renderLessonMode(lesson, course, session, onComplete);
  }
}

// ── Contenido simulado por tipo de lección ──
function generateLessonContent(lesson) {
  if (lesson.type === "video") {
    return `
      <div class="bg-slate-900 rounded-xl aspect-video flex items-center justify-center mb-4 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-slate-900"></div>
        <div class="relative text-center">
          <div class="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3 cursor-pointer hover:bg-white/30 transition-colors">
            <svg class="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
          <p class="text-white/70 text-sm">${lesson.title}</p>
          <p class="text-white/40 text-xs mt-1">Video simulado — 8 min</p>
        </div>
      </div>
      <p>Este módulo cubre los conceptos esenciales de <strong>${lesson.title}</strong>. El video incluye ejemplos reales del entorno corporativo, casos de estudio y recomendaciones prácticas aplicables desde el primer día.</p>
      <p>Al finalizar el video, estarás preparado para responder el mini-quiz de evaluación y desbloquear el siguiente módulo de aprendizaje.</p>
    `;
  }

  return `
    <p>Bienvenido a la lección sobre <strong>${lesson.title}</strong>. A lo largo de este módulo de lectura, explorarás los conceptos fundamentales con un enfoque práctico y orientado a la aplicación real.</p>
    <div class="bg-indigo-50 border-l-4 border-indigo-400 rounded-r-xl p-4 my-4">
      <p class="text-indigo-800 font-medium text-sm">💡 Concepto clave</p>
      <p class="text-indigo-700 text-sm mt-1">Comprender este tema no solo te protege a ti, sino también a tu organización. La aplicación consistente de estos principios genera confianza y reduce riesgos operativos.</p>
    </div>
    <p>Los profesionales que dominan este contenido reportan una reducción del 40% en incidentes relacionados y una mejora notable en la eficiencia de sus procesos. Tómate el tiempo necesario para interiorizar cada punto antes de avanzar al quiz.</p>
    <p>Recuerda: el aprendizaje efectivo requiere reflexión activa. Antes de continuar, piensa en cómo aplicarías estos principios en tu rol actual dentro de la organización.</p>
  `;
}
