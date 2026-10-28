import { contarUnidades, agregarAlCarrito, EVENTO_CARRITO } from "./cart-storage.js";

// Ícono del carrito en el navbar con la cantidad de unidades.
// Al hacer clic abre el panel del carrito (cart-panel.js).
class CartButton extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <button type="button" class="btn cart-button position-relative"
        data-bs-toggle="offcanvas" data-bs-target="#cartOffcanvas" aria-controls="cartOffcanvas">
        <i class="bi bi-cart3 fs-5" aria-hidden="true"></i>
        <span class="d-lg-none ms-1">Carrito</span>
        <span class="cart-count badge rounded-pill position-absolute top-0 start-100 translate-middle" data-role="cart-count"></span>
      </button>
    `;

    this.actualizar = this.actualizar.bind(this);
    document.addEventListener(EVENTO_CARRITO, this.actualizar);
    this.actualizar();
  }

  disconnectedCallback() {
    document.removeEventListener(EVENTO_CARRITO, this.actualizar);
  }

  actualizar() {
    const unidades = contarUnidades();
    const numero = this.querySelector('[data-role="cart-count"]');

    numero.textContent = unidades;
    numero.hidden = unidades === 0;
    this.querySelector("button").setAttribute("aria-label", `Carrito: ${unidades} ${unidades === 1 ? "unidad" : "unidades"}`);
  }
}

customElements.define("cart-button", CartButton);

// Aviso corto en la parte de abajo de la pantalla
let temporizadorAviso;
function mostrarAviso(texto) {
  let aviso = document.querySelector(".cart-toast");
  if (!aviso) {
    aviso = document.createElement("div");
    aviso.className = "cart-toast";
    aviso.setAttribute("role", "status");
    document.body.appendChild(aviso);
  }

  aviso.textContent = texto;
  aviso.classList.add("show");

  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(function () {
    aviso.classList.remove("show");
  }, 2000);
}

// Botones "Añadir al carrito" de las tarjetas (catálogo y home).
// Escuchamos en todo el documento porque las tarjetas se dibujan después de cargar la página.
document.addEventListener("click", function (evento) {
  const boton = evento.target.closest(".add-to-cart-btn");
  if (!boton) return;

  const agregado = agregarAlCarrito(boton.dataset.id, Number(boton.dataset.stock));
  if (agregado) {
    mostrarAviso("Agregado al carrito");
  } else {
    mostrarAviso("No hay más unidades disponibles");
  }
});
