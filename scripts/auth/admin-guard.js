// Protege admin.html: si no hay sesión de administrador, vamos al login antes de mostrar el panel.
// Se carga en el <head> sin defer para que corra antes de dibujar la página.
// La clave debe ser la misma que CLAVE_SESION en auth.js.
if (!localStorage.getItem("technopet-session") && !sessionStorage.getItem("technopet-session")) {
  window.location.replace("./login.html");
}
