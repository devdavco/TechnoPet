import { apiFetch, CLAVE_SESION, borrarSesion, obtenerToken } from "../../services/api.js";

// Inicio de sesión contra el backend (POST /api/login), que devuelve un token JWT y los datos del usuario.
// La sesión se guarda como { id, nombre, email, rol, token }. rol es "admin" o "cliente"
// (lo leen admin-guard.js y session-menu.js).

// Inicia sesión y devuelve el rol, o null si el correo o la contraseña no coinciden.
// Lanza un Error si no se pudo conectar con el servidor.
// Con "recordar" la sesión sigue al cerrar el navegador (localStorage); sin él, no (sessionStorage).
export async function iniciarSesion(email, password, recordar) {
  const correo = email.trim().toLowerCase();
  let datos;
  try {
    datos = await apiFetch("/login", { method: "POST", body: { email: correo, contrasena: password } });
  } catch (error) {
    if (error.status === 401) return null;
    throw error;
  }

  const sesion = JSON.stringify({
    id: datos.id,
    nombre: datos.nombre,
    email: datos.email,
    rol: datos.rol === "ADMIN" ? "admin" : "cliente",
    token: datos.token,
  });
  borrarSesion();
  if (recordar) {
    localStorage.setItem(CLAVE_SESION, sesion);
  } else {
    sessionStorage.setItem(CLAVE_SESION, sesion);
  }
  return JSON.parse(sesion).rol;
}

// Devuelve la sesión guardada ({ id, nombre, email, rol, token }) o null si no hay ninguna o el token venció
export function obtenerSesion() {
  if (!obtenerToken()) return null;
  const texto = localStorage.getItem(CLAVE_SESION) || sessionStorage.getItem(CLAVE_SESION);
  try {
    return JSON.parse(texto);
  } catch (error) {
    return null;
  }
}

export function haySesionAdmin() {
  const sesion = obtenerSesion();
  return sesion !== null && sesion.rol === "admin";
}

export function cerrarSesion() {
  borrarSesion();
}
