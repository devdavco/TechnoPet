import { leerUsuarios } from "./usuarios.js";

// Inicio de sesión para la demo del proyecto: un administrador fijo y los usuarios del registro.
const CREDENCIAL_ADMIN = { email: "admin@admin.com", password: "admin" };

// Si cambias esta clave, cámbiala también en admin-guard.js
const CLAVE_SESION = "technopet-session";

// Devuelve el rol de la cuenta ("admin" o "cliente"), o null si el correo o la contraseña no coinciden
function buscarRol(correo, password) {
  if (correo === CREDENCIAL_ADMIN.email && password === CREDENCIAL_ADMIN.password) {
    return "admin";
  }

  const usuario = leerUsuarios().find((u) => u.email === correo && u.password === password);
  return usuario ? usuario.rol : null;
}

// Inicia sesión y devuelve el rol, o null si los datos son incorrectos.
// Con "recordar" la sesión sigue al cerrar el navegador (localStorage); sin él, no (sessionStorage).
export function iniciarSesion(email, password, recordar) {
  const correo = email.trim().toLowerCase();
  const rol = buscarRol(correo, password);
  if (!rol) return null;

  const sesion = JSON.stringify({ email: correo, rol: rol });
  if (recordar) {
    localStorage.setItem(CLAVE_SESION, sesion);
  } else {
    sessionStorage.setItem(CLAVE_SESION, sesion);
  }
  return rol;
}

// Devuelve la sesión guardada ({ email, rol }) o null si no hay ninguna
export function obtenerSesion() {
  const texto = localStorage.getItem(CLAVE_SESION) || sessionStorage.getItem(CLAVE_SESION);
  if (!texto) return null;

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
  localStorage.removeItem(CLAVE_SESION);
  sessionStorage.removeItem(CLAVE_SESION);
}