// Conexión con el backend (Spring Boot). Todas las llamadas a la API pasan por aquí.

// En local (Live Server) usamos el backend en el puerto 8080; en producción, el backend desplegado.
const ES_LOCAL = ["localhost", "127.0.0.1"].includes(window.location.hostname);
const API_LOCAL = "http://localhost:8080/api";
const API_PRODUCCION = "p01--technotpet--hdlxpkfybyqg.code.run/api"; // TODO: URL pública del backend desplegado

export const API_URL = ES_LOCAL ? API_LOCAL : API_PRODUCCION;

// Misma clave que usan auth.js y admin-guard.js para guardar la sesión
export const CLAVE_SESION = "technopet-session";

function leerSesion() {
  const texto = localStorage.getItem(CLAVE_SESION) || sessionStorage.getItem(CLAVE_SESION);
  try {
    return JSON.parse(texto);
  } catch (error) {
    return null;
  }
}

export function borrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
  sessionStorage.removeItem(CLAVE_SESION);
}

// El token JWT trae su fecha de vencimiento (exp, en segundos) en la parte del medio
function tokenVencido(token) {
  try {
    const datos = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return datos.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
}

// Devuelve el token de la sesión, o null si no hay sesión o ya venció (en ese caso la cierra)
export function obtenerToken() {
  const sesion = leerSesion();
  if (!sesion || !sesion.token) return null;
  if (tokenVencido(sesion.token)) {
    borrarSesion();
    return null;
  }
  return sesion.token;
}

// fetch con la URL base, JSON y el token. Lanza un Error con el mensaje del backend si la respuesta no es 2xx.
// Uso: apiFetch("/productos") o apiFetch("/productos", { method: "POST", body: { ... } })
export async function apiFetch(ruta, opciones = {}) {
  const headers = {};
  const token = obtenerToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (opciones.body !== undefined) headers["Content-Type"] = "application/json";

  const respuesta = await fetch(API_URL + ruta, {
    method: opciones.method || "GET",
    headers,
    body: opciones.body !== undefined ? JSON.stringify(opciones.body) : undefined,
  });

  // 204 No Content (por ejemplo al eliminar) no trae cuerpo
  const datos = respuesta.status === 204 ? null : await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    const mensaje = (datos && (datos.error || datos.ERROR || datos.message)) || `Error HTTP ${respuesta.status}`;
    const error = new Error(mensaje);
    error.status = respuesta.status;
    throw error;
  }
  return datos;
}
