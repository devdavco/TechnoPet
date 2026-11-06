// Protege admin.html: si la sesión no es de un administrador, vamos al login antes de mostrar el panel.
// Se carga en el <head> sin defer para que corra antes de dibujar la página.
// La clave debe ser la misma que CLAVE_SESION en auth.js.
(function () {
  const texto = localStorage.getItem("technopet-session") || sessionStorage.getItem("technopet-session");

  let rol = null;
  try {
    rol = JSON.parse(texto).rol;
  } catch (error) {
    // Sin sesión (JSON.parse(null) da null y null.rol falla) o sesión dañada: rol queda en null
  }

  if (rol !== "admin") {
    window.location.replace("./login.html");
  }
})();