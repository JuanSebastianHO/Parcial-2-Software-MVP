// ============================================================
// auth.js — Simulación de autenticación con roles
// Roles: 'admin' | 'empleado'
// ============================================================

const MOCK_USERS = [
  { id: "u001", username: "admin@nexlearn.co",  password: "Admin2024!", role: "admin",    name: "Laura Mendoza" },
  { id: "u002", username: "juan@nexlearn.co",   password: "Emp2024!",   role: "empleado", name: "Juan Pérez" },
  { id: "u003", username: "maria@nexlearn.co",  password: "Emp2024!",   role: "empleado", name: "María González" },
  { id: "u004", username: "carlos@nexlearn.co", password: "Emp2024!",   role: "empleado", name: "Carlos Ruiz" }
];

// ── Inicializa usuarios demo en localStorage si no existen ──
function seedUsers() {
  if (!localStorage.getItem("nx_users")) {
    localStorage.setItem("nx_users", JSON.stringify(MOCK_USERS));
  }
}

// ── Login: devuelve { success, user, error } ──
function login(username, password) {
  seedUsers();
  const users = JSON.parse(localStorage.getItem("nx_users") || "[]");
  const user  = users.find(u => u.username === username && u.password === password);

  if (!user) return { success: false, error: "Credenciales incorrectas." };

  const session = { userId: user.id, name: user.name, role: user.role, username: user.username };
  localStorage.setItem("nx_session", JSON.stringify(session));
  return { success: true, user: session };
}

// ── Logout ──
function logout() {
  localStorage.removeItem("nx_session");
  window.location.href = "index.html";
}

// ── Obtener sesión activa ──
function getSession() {
  const raw = localStorage.getItem("nx_session");
  return raw ? JSON.parse(raw) : null;
}

// ── Verificar si está autenticado; redirige si no ──
function requireAuth(redirectTo = "index.html") {
  const session = getSession();
  if (!session) { window.location.href = redirectTo; return null; }
  return session;
}

// ── Verificar rol de admin; redirige si no ──
function requireAdmin(redirectTo = "dashboard.html") {
  const session = requireAuth();
  if (session && session.role !== "admin") { window.location.href = redirectTo; return null; }
  return session;
}

// ── Retorna todos los usuarios registrados (para vista admin) ──
function getAllUsers() {
  seedUsers();
  return JSON.parse(localStorage.getItem("nx_users") || "[]").map(u => ({
    id: u.id, name: u.name, username: u.username, role: u.role
  }));
}
