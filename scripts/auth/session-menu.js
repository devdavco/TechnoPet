import { haySesionAdmin, cerrarSesion } from "./auth.js";

// Botones de sesión del navbar.
// Sin sesión: "Login/Registro". Con sesión: "Panel admin" y "Cerrar sesión".
// Con modo="admin" (header de admin) solo muestra "Cerrar sesión" y al salir vuelve al inicio.
class SessionMenu extends HTMLElement {
  connectedCallback() {
    this.dibujar();

    this.addEventListener("click", (evento) => {
      if (!evento.target.closest('[data-action="logout"]')) return;

      cerrarSesion();
      if (this.getAttribute("modo") === "admin") {
        window.location.href = "./index.html";
      } else {
        this.dibujar();
      }
    });
  }

  dibujar() {
    const enAdmin = this.getAttribute("modo") === "admin";

    if (!haySesionAdmin()) {
      this.innerHTML = `
        <a class="btn btn-dark w-100 w-lg-auto" href="./login.html">Login/Registro</a>
      `;
      return;
    }

    this.innerHTML = `
      <div class="d-flex flex-column flex-lg-row gap-2">
        ${enAdmin ? "" : `
        <a class="btn btn-outline-dark" href="./admin.html">
          <i class="bi bi-speedometer2 me-1" aria-hidden="true"></i>Panel admin
        </a>`}
        <button type="button" class="btn btn-dark ${enAdmin ? "btn-sm" : ""}" data-action="logout">
          <i class="bi bi-box-arrow-right me-1" aria-hidden="true"></i>Cerrar sesión
        </button>
      </div>
    `;
  }
}

customElements.define("session-menu", SessionMenu);
