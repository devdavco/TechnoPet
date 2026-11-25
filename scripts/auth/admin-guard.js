// Protege admin.html: si la sesión no es de un administrador, vamos al login antes de mostrar el panel.
// Se carga en el <head> sin defer para que corra antes de dibujar la página.
// La clave debe ser la misma que CLAVE_SESION en auth.js.
(function () {
  const texto = localStorage.getItem("technopet-session") || sessionStorage.getItem("technopet-session");

  let rol = null;
  try {
    const sesion = JSON.parse(texto);
    // El token JWT trae su vencimiento (exp, en segundos); si ya venció, hay que volver a iniciar sesión
    const token = JSON.parse(atob(sesion.token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (token.exp * 1000 > Date.now()) rol = sesion.rol;
  } catch (error) {
    // Sin sesión (JSON.parse(null) da null y null.rol falla) o sesión dañada: rol queda en null
  }

  if (rol !== "admin") {
    window.location.replace("./login.html");
  }
})();