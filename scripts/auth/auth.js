// Inicio de sesión de administrador para la demo del proyecto.
// ⚠️ No hay backend: la credencial queda escrita aquí y cualquiera puede verla en el navegador.
// No es seguridad real; cuando exista un backend, solo hay que cambiar este archivo.
const CREDENCIAL_ADMIN = { email: "admin@admin.com", password: "admin" };

// Si cambias esta clave, cámbiala también en admin-guard.js
const CLAVE_SESION = "technopet-session";

// Devuelve true si el correo y la contraseña son los del administrador.
// Con "recordar" la sesión sigue al cerrar el navegador (localStorage); sin él, no (sessionStorage).
export function iniciarSesion(email, password, recordar) {
  const correo = email.trim().toLowerCase();

  if (correo !== CREDENCIAL_ADMIN.email || password !== CREDENCIAL_ADMIN.password) {
    return false;
  }

  const sesion = JSON.stringify({ email: correo, rol: "admin" });
  if (recordar) {
    localStorage.setItem(CLAVE_SESION, sesion);
  } else {
    sessionStorage.setItem(CLAVE_SESION, sesion);
  }
  return true;
}

export function haySesionAdmin() {
  const texto = localStorage.getItem(CLAVE_SESION) || sessionStorage.getItem(CLAVE_SESION);
  if (!texto) return false;

  try {
    return JSON.parse(texto).rol === "admin";
  } catch (error) {
    return false;
  }
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
  sessionStorage.removeItem(CLAVE_SESION);
}
