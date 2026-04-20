// ============================================================
// admin.js — Vista de administrador protegida por rol
// ============================================================

function initAdmin() {
  const session = requireAdmin(); // redirige si no es admin
  if (!session) return;

  renderSideNav(session);       // reutiliza del dashboard.js
  renderAdminHeader(session);
  renderUsersTable();
}

function renderAdminHeader(session) {
  const header = document.getElementById("admin-header");
  if (!header) return;
  header.innerHTML = `
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Panel de Administrador</h1>
        <p class="text-slate-500 text-sm mt-1">Gestión de progreso de todos los empleados</p>
      </div>
      <div class="flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-2">
        <svg class="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
        </svg>
        <span class="text-indigo-700 text-xs font-semibold">Acceso Restringido — Solo Admin</span>
      </div>
    </div>
  `;
}

function renderUsersTable() {
  const container = document.getElementById("admin-table");
  if (!container) return;

  const users   = getAllUsers();
  const spinner = `<div class="flex justify-center py-12"><div class="spinner"></div></div>`;
  container.innerHTML = spinner;

  setTimeout(() => {
    const rows = users.map(user => {
      const overall   = getOverallProgress(user.id);
      const userProg  = getUserProgress(user.id);
      const completed = Object.values(userProg).filter(c => c.status === "completed").length;
      const inProg    = Object.values(userProg).filter(c => c.status === "in_progress").length;

      return `
        <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
          <td class="px-4 py-4">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                ${user.name.charAt(0)}
              </div>
              <div>
                <p class="text-sm font-semibold text-slate-800">${user.name}</p>
                <p class="text-xs text-slate-400">${user.username}</p>
              </div>
            </div>
          </td>
          <td class="px-4 py-4">
            <span class="px-2 py-1 rounded-full text-xs font-semibold
              ${user.role === "admin" ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-600"}">
              ${user.role}
            </span>
          </td>
          <td class="px-4 py-4">
            <div class="flex items-center gap-2">
              <div class="flex-1 bg-slate-100 rounded-full h-2 max-w-24">
                <div class="h-2 rounded-full transition-all duration-500
                  ${overall >= 100 ? "bg-emerald-500" : overall > 0 ? "bg-indigo-500" : "bg-slate-300"}"
                  style="width:${overall}%">
                </div>
              </div>
              <span class="text-xs font-semibold text-slate-600 w-8">${overall}%</span>
            </div>
          </td>
          <td class="px-4 py-4 text-center">
            <span class="text-sm font-bold text-emerald-600">${completed}</span>
            <span class="text-xs text-slate-400"> / ${COURSES_DATA.length}</span>
          </td>
          <td class="px-4 py-4 text-center">
            <span class="px-2 py-1 rounded-full text-xs
              ${inProg > 0 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-400"}">
              ${inProg > 0 ? `${inProg} en progreso` : "—"}
            </span>
          </td>
          <td class="px-4 py-4 text-right">
            <button onclick="confirmResetProgress('${user.id}', '${user.name}')"
              class="px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200
                     rounded-lg hover:bg-red-50 active:scale-95 transition-all duration-150
                     opacity-0 group-hover:opacity-100">
              Resetear
            </button>
          </td>
        </tr>
      `;
    });

    container.innerHTML = `
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <!-- Summary bar -->
        <div class="grid grid-cols-3 gap-4 p-5 border-b border-slate-100 bg-slate-50">
          ${statCard("Empleados Activos", users.filter(u => u.role === "empleado").length, "👥")}
          ${statCard("Cursos Disponibles", COURSES_DATA.length, "📚")}
          ${statCard("Completaciones Totales",
            users.reduce((sum, u) => sum + Object.values(getUserProgress(u.id)).filter(c => c.status === "completed").length, 0),
            "🏆")}
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="border-b border-slate-100">
                <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Empleado</th>
                <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Rol</th>
                <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Progreso General</th>
                <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-400 text-center">Completados</th>
                <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-400 text-center">Estado</th>
                <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>${rows.join("")}</tbody>
          </table>
        </div>
      </div>
    `;
  }, 600);
}

function statCard(label, value, icon) {
  return `
    <div class="text-center">
      <div class="text-2xl mb-1">${icon}</div>
      <div class="text-xl font-bold text-slate-800">${value}</div>
      <div class="text-xs text-slate-500">${label}</div>
    </div>
  `;
}

function confirmResetProgress(userId, name) {
  const overlay = document.createElement("div");
  overlay.className = "fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm";
  overlay.innerHTML = `
    <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
      <div class="text-4xl mb-4">⚠️</div>
      <h3 class="text-lg font-bold text-slate-800 mb-2">¿Resetear progreso?</h3>
      <p class="text-slate-500 text-sm mb-6">Se eliminará todo el progreso de <strong>${name}</strong>. Esta acción no se puede deshacer.</p>
      <div class="flex gap-3">
        <button onclick="this.closest('.fixed').remove()"
          class="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors">
          Cancelar
        </button>
        <button onclick="doReset('${userId}'); this.closest('.fixed').remove()"
          class="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors">
          Sí, resetear
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

function doReset(userId) {
  resetUserProgress(userId);
  renderUsersTable();
}
