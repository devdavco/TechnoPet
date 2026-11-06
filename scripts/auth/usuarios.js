const CLAVE_USUARIOS = "technopet-users";

export function leerUsuarios() {
  try {
    const usuarios = JSON.parse(localStorage.getItem(CLAVE_USUARIOS));
    return Array.isArray(usuarios) ? usuarios : [];
  } catch (error) {
    return [];
  }
}

export function guardarUsuario(usuario) {
  const usuarios = leerUsuarios();
  usuarios.push(usuario);

  try {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
    return true;
  } catch (error) {
    console.error("No se pudo guardar el usuario:", error);
    return false;
  }
}