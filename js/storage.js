// ============================================================
// storage.js — Capa de persistencia centralizada
// Gestiona userProgress en localStorage
// ============================================================

// Estructura de userProgress por usuario:
// {
//   [userId]: {
//     [courseId]: {
//       courseId: string,
//       status: "pending" | "in_progress" | "completed",
//       completedLessons: [lessonId, ...],
//       quizScore: number | null,
//       lastAccess: ISO string,
//       progressPercent: number (0-100)
//     }
//   }
// }

const STORAGE_KEY = "nx_userProgress";

// ── Lee todo el progreso almacenado ──
function getAllProgress() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
}

// ── Lee el progreso de un usuario específico ──
function getUserProgress(userId) {
  const all = getAllProgress();
  return all[userId] || {};
}

// ── Lee el progreso de un curso específico para un usuario ──
function getCourseProgress(userId, courseId) {
  const userProg = getUserProgress(userId);
  return userProg[courseId] || {
    courseId,
    status: "pending",
    completedLessons: [],
    quizScore: null,
    lastAccess: null,
    progressPercent: 0
  };
}

// ── Guarda (o actualiza) el progreso de un curso ──
function saveCourseProgress(userId, courseId, updates) {
  const all      = getAllProgress();
  const userProg = all[userId] || {};
  const current  = userProg[courseId] || {
    courseId,
    status: "pending",
    completedLessons: [],
    quizScore: null,
    lastAccess: null,
    progressPercent: 0
  };

  const merged = { ...current, ...updates, lastAccess: new Date().toISOString() };

  // Auto-calcular status según porcentaje
  if (merged.progressPercent >= 100) merged.status = "completed";
  else if (merged.progressPercent > 0) merged.status = "in_progress";
  else merged.status = "pending";

  userProg[courseId] = merged;
  all[userId] = userProg;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));

  // Dispara evento personalizado para que el dashboard pueda escucharlo
  window.dispatchEvent(new CustomEvent("nx:progressUpdated", { detail: { userId, courseId, progress: merged } }));

  return merged;
}

// ── Marca una lección como completada y recalcula el porcentaje ──
function completeLesson(userId, courseId, lessonId, totalLessons) {
  const current = getCourseProgress(userId, courseId);
  const completedLessons = [...new Set([...current.completedLessons, lessonId])];
  const progressPercent  = Math.round((completedLessons.length / totalLessons) * 100);

  return saveCourseProgress(userId, courseId, { completedLessons, progressPercent });
}

// ── Registra el puntaje del quiz ──
function saveQuizScore(userId, courseId, score) {
  return saveCourseProgress(userId, courseId, { quizScore: score });
}

// ── Resetea el progreso de un usuario (acción admin) ──
function resetUserProgress(userId) {
  const all = getAllProgress();
  delete all[userId];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  window.dispatchEvent(new CustomEvent("nx:progressReset", { detail: { userId } }));
}

// ── Resumen de progreso general de un usuario (0-100) ──
function getOverallProgress(userId) {
  const userProg = getUserProgress(userId);
  const entries  = Object.values(userProg);
  if (!entries.length) return 0;
  const total = entries.reduce((sum, c) => sum + (c.progressPercent || 0), 0);
  return Math.round(total / entries.length);
}
