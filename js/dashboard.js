// ============================================================
// dashboard.js — Renderizado dinámico del dashboard de cursos
// Progress rings SVG + lógica de certificado
// ============================================================

function initDashboard(session) {
  renderSideNav(session);
  renderCourseGrid(session);
  renderRightPanel(session);
  listenForProgressUpdates(session);
}

// ── Sidenav colapsable ──
function renderSideNav(session) {
  const nav = document.getElementById("sidenav");
  if (!nav) return;

  nav.innerHTML = `
    <div class="flex flex-col h-full">
      <!-- Logo -->
      <div class="p-5 flex items-center gap-3 border-b border-white/10">
        <div class="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center flex-shrink-0">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
        </div>
        <span class="nav-label font-bold text-white text-sm tracking-wide">NexLearn</span>
      </div>

      <!-- Links -->
      <nav class="flex-1 p-3 space-y-1 mt-2">
        ${navItems(session).map(item => `
          <a href="${item.href}"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70
                   hover:bg-white/10 hover:text-white transition-colors group
                   ${item.active ? "bg-white/15 text-white" : ""}">
            <span class="flex-shrink-0">${item.icon}</span>
            <span class="nav-label text-sm">${item.label}</span>
          </a>
        `).join("")}
      </nav>

      <!-- User -->
      <div class="p-4 border-t border-white/10 flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-indigo-400 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
          ${session.name.charAt(0)}
        </div>
        <div class="nav-label min-w-0">
          <p class="text-white text-xs font-medium truncate">${session.name}</p>
          <p class="text-white/50 text-xs capitalize">${session.role}</p>
        </div>
        <button onclick="logout()" class="nav-label ml-auto text-white/40 hover:text-white transition-colors" title="Cerrar sesión">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
        </button>
      </div>
    </div>
  `;
}

function navItems(session) {
  const base = [
    {
      href: "dashboard.html", label: "Mis Cursos", active: true,
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>`
    }
  ];
  if (session.role === "admin") {
    base.push({
      href: "admin.html", label: "Administrador", active: false,
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`
    });
  }
  return base;
}

// ── Grid de cursos ──
function renderCourseGrid(session) {
  const grid = document.getElementById("course-grid");
  if (!grid) return;

  if (!COURSES_DATA || !COURSES_DATA.length) {
    grid.innerHTML = `
      <div class="col-span-full flex flex-col items-center justify-center py-20 text-center">
        <svg class="w-24 h-24 text-slate-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253"/>
        </svg>
        <h3 class="text-slate-500 font-semibold text-lg">Aún no hay cursos disponibles</h3>
        <p class="text-slate-400 text-sm mt-1">Tu administrador los activará pronto. ¡Sigue atento!</p>
      </div>`;
    return;
  }

  grid.innerHTML = COURSES_DATA.map(course => courseCard(course, session)).join("");
}

function courseCard(course, session) {
  const prog      = getCourseProgress(session.userId, course.id);
  const pct       = prog.progressPercent || 0;
  const completed = pct >= 100;
  const catColor  = categoryColor(course.category);

  return `
    <div class="course-card group relative bg-white rounded-2xl border overflow-hidden
                shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1
                ${completed ? "border-emerald-200 ring-1 ring-emerald-300" : "border-slate-200"}">

      <!-- Thumbnail -->
      <div class="relative h-40 overflow-hidden">
        <img src="${course.thumbnailUrl}" alt="${course.title}"
             class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
             onerror="this.src='https://via.placeholder.com/600x240/6366f1/ffffff?text=${encodeURIComponent(course.title)}'">
        <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        ${completed ? `<div class="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
          Completado
        </div>` : ""}
        <span class="absolute bottom-3 left-3 text-xs font-semibold px-2 py-1 rounded-full ${catColor}">
          ${course.category}
        </span>
      </div>

      <!-- Body -->
      <div class="p-5">
        <h3 class="font-bold text-slate-800 text-sm leading-snug mb-1">${course.title}</h3>
        <p class="text-slate-400 text-xs mb-4">⏱ ${course.duration} · ${course.lessons.length} lecciones</p>

        <!-- Progress Ring + Info -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            ${progressRingSVG(pct, 44)}
            <div>
              <p class="text-xs font-semibold text-slate-700">${pct}% completado</p>
              <p class="text-xs text-slate-400">${prog.completedLessons?.length || 0}/${course.lessons.length} lecciones</p>
            </div>
          </div>
          ${prog.quizScore !== null ? `<span class="text-xs bg-indigo-50 text-indigo-600 font-semibold px-2 py-1 rounded-full">Quiz: ${prog.quizScore}%</span>` : ""}
        </div>

        <!-- Action button -->
        ${completed
          ? `<button onclick="simulateCertificate('${course.id}', '${course.title}')"
               class="w-full py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl
                      hover:bg-emerald-700 active:scale-95 transition-all duration-200
                      flex items-center justify-center gap-2">
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                   d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
               </svg>
               Descargar Certificado
             </button>`
          : `<button onclick="openCourse('${course.id}')"
               class="w-full py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl
                      hover:bg-indigo-700 active:scale-95 transition-all duration-200">
               ${pct > 0 ? "Continuar" : "Comenzar"}
             </button>`
        }
      </div>
    </div>
  `;
}

// ── SVG Progress Ring ──
function progressRingSVG(pct, size = 60) {
  const r          = (size / 2) - 5;
  const circ       = 2 * Math.PI * r;
  const offset     = circ - (pct / 100) * circ;
  const strokeColor= pct >= 100 ? "#10b981" : pct > 0 ? "#6366f1" : "#e2e8f0";

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="rotate-[-90deg]">
      <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="#f1f5f9" stroke-width="4"/>
      <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none"
        stroke="${strokeColor}" stroke-width="4" stroke-linecap="round"
        stroke-dasharray="${circ}" stroke-dashoffset="${offset}"
        style="transition: stroke-dashoffset 0.8s ease"/>
      <text x="${size/2}" y="${size/2}" dominant-baseline="middle" text-anchor="middle"
        class="rotate-90" transform="rotate(90, ${size/2}, ${size/2})"
        fill="${pct >= 100 ? "#10b981" : "#6366f1"}" font-size="10" font-weight="700">
        ${pct}%
      </text>
    </svg>`;
}

function categoryColor(cat) {
  const map = {
    "Cumplimiento Legal": "bg-amber-100 text-amber-700",
    "Cultura Corporativa": "bg-violet-100 text-violet-700",
    "Ciberseguridad":      "bg-red-100 text-red-700",
    "Habilidades Blandas": "bg-teal-100 text-teal-700"
  };
  return map[cat] || "bg-slate-100 text-slate-600";
}

// ── Panel derecho: resumen de progreso y medallas ──
function renderRightPanel(session) {
  const panel = document.getElementById("right-panel");
  if (!panel) return;

  const overall   = getOverallProgress(session.userId);
  const userProg  = getUserProgress(session.userId);
  const completed = Object.values(userProg).filter(c => c.status === "completed").length;
  const badges    = getBadges(completed, overall);

  panel.innerHTML = `
    <!-- Overall progress -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-4">
      <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Tu Progreso General</h3>
      <div class="flex justify-center mb-3">${progressRingSVG(overall, 80)}</div>
      <p class="text-center text-slate-600 text-sm"><strong class="text-slate-800">${completed}</strong> de ${COURSES_DATA.length} cursos completados</p>
    </div>

    <!-- Medallas -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Medallas Obtenidas</h3>
      <div class="grid grid-cols-3 gap-3">
        ${badges.map(b => `
          <div class="flex flex-col items-center text-center ${b.earned ? "" : "opacity-30 grayscale"}">
            <span class="text-2xl mb-1">${b.icon}</span>
            <span class="text-xs text-slate-600 leading-tight">${b.label}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function getBadges(completed, overall) {
  return [
    { icon: "🚀", label: "Inicio",      earned: overall > 0 },
    { icon: "⚡", label: "Constante",   earned: completed >= 1 },
    { icon: "🎯", label: "Enfocado",    earned: overall >= 50 },
    { icon: "🏆", label: "Campeón",     earned: completed >= 2 },
    { icon: "💡", label: "Experto",     earned: completed >= 3 },
    { icon: "🌟", label: "Élite",       earned: completed >= 4 }
  ];
}

// ── Abre un curso (simulado) ──
function openCourse(courseId) {
  window.location.href = `course.html?id=${courseId}`;
}

// ── Simula la descarga del certificado ──
function simulateCertificate(courseId, title) {
  showModal(`
    <div class="text-center py-4">
      <div class="text-5xl mb-4">🎓</div>
      <h3 class="text-xl font-bold text-slate-800 mb-2">¡Certificado generado!</h3>
      <p class="text-slate-500 text-sm mb-6">Certificado de finalización para:<br><strong>"${title}"</strong></p>
      <p class="text-xs text-slate-400">En producción, aquí se descargaría el PDF firmado digitalmente.</p>
    </div>
  `);
}

// ── Modal genérico ──
function showModal(content) {
  const overlay = document.createElement("div");
  overlay.className = "fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in";
  overlay.innerHTML = `
    <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 relative animate-slide-up">
      ${content}
      <button onclick="this.closest('.fixed').remove()"
        class="mt-4 w-full py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-medium
               hover:bg-slate-200 transition-colors">
        Cerrar
      </button>
    </div>
  `;
  document.body.appendChild(overlay);
}

// ── Escucha actualizaciones de progreso ──
function listenForProgressUpdates(session) {
  window.addEventListener("nx:progressUpdated", () => {
    renderCourseGrid(session);
    renderRightPanel(session);
  });
}
