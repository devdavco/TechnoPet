import { obtenerProductos } from "../../services/api_products.js";
import {
  leerCarrito,
  cambiarCantidad,
  quitarDelCarrito,
  vaciarCarrito,
  ajustarCarrito,
  EVENTO_CARRITO,
} from "./cart-storage.js";

// Mismo formato de precio que las tarjetas: 150000 -> "150.000"
function formatearPrecio(valor) {
  return Number(valor).toLocaleString("es-CO");
}

// Panel lateral del carrito (offcanvas de Bootstrap).
// Lo abre el botón de cart-button.js con data-bs-target="#cartOffcanvas".
class CartPanel extends HTMLElement {
  async connectedCallback() {
    this.innerHTML = `
      <div class="offcanvas offcanvas-end" tabindex="-1" id="cartOffcanvas" aria-labelledby="cartOffcanvasTitle">
        <div class="offcanvas-header border-bottom">
          <h2 class="offcanvas-title h5 fw-bold m-0" id="cartOffcanvasTitle">
            <i class="bi bi-cart3 me-2" aria-hidden="true"></i>Tu carrito
          </h2>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Cerrar"></button>
        </div>
        <div class="offcanvas-body d-flex flex-column" data-role="cart-body">
          <p class="text-secondary">Cargando carrito...</p>
        </div>
      </div>
    `;

    this.productos = null;
    this.compraRealizada = false;

    this.addEventListener("click", (evento) => this.alHacerClic(evento));
    document.addEventListener(EVENTO_CARRITO, () => this.dibujar());

    this.productos = await obtenerProductos();
    ajustarCarrito(this.productos);
    this.dibujar();
  }

  alHacerClic(evento) {
    const boton = evento.target.closest("[data-action]");
    if (!boton) return;

    const accion = boton.dataset.action;
    const item = boton.closest('[data-role="cart-item"]');

    if (accion === "increase" || accion === "decrease") {
      const cantidad = Number(item.dataset.cantidad);
      cambiarCantidad(item.dataset.id, accion === "increase" ? cantidad + 1 : cantidad - 1);
    }
    if (accion === "remove") quitarDelCarrito(item.dataset.id);
    if (accion === "clear") vaciarCarrito();
    if (accion === "checkout") {
      // Compra simulada: no hay pagos en el proyecto, solo vaciamos el carrito
      this.compraRealizada = true;
      vaciarCarrito();
    }

    // Al volver a dibujar, el botón pulsado se reemplaza y se pierde el foco.
    // Lo devolvemos al mismo botón o, si ya no está, al panel (así Escape sigue cerrándolo).
    const selector = item
      ? `[data-role="cart-item"][data-id="${item.dataset.id}"] [data-action="${accion}"]`
      : `[data-action="${accion}"]`;
    const destino = this.querySelector(selector);
    if (destino && !destino.disabled) {
      destino.focus();
    } else {
      this.querySelector(".offcanvas").focus();
    }
  }

  dibujar() {
    if (!this.productos) return;

    const cuerpo = this.querySelector('[data-role="cart-body"]');

    // Unimos lo guardado ({ id, cantidad }) con los datos del catálogo
    const items = [];
    leerCarrito().forEach((item) => {
      const producto = this.productos.find((p) => String(p.id) === item.id);
      if (producto) items.push({ producto: producto, cantidad: item.cantidad });
    });

    if (items.length === 0) {
      const mensaje = this.compraRealizada ? "¡Compra realizada! Gracias por confiar en Techno Pet." : "Tu carrito está vacío";
      cuerpo.innerHTML = `
        <div class="text-center my-auto py-5">
          <i class="bi ${this.compraRealizada ? "bi-bag-check" : "bi-cart-x"} cart-empty-icon" aria-hidden="true"></i>
          <p class="fw-semibold mt-3" data-role="cart-message">${mensaje}</p>
          <a href="./products.html" class="btn btn-customer px-4">Ver catálogo</a>
        </div>
      `;
      return;
    }

    this.compraRealizada = false;

    let total = 0;
    let lista = "";
    items.forEach(({ producto, cantidad }) => {
      const precio = Number(producto.price) || 0;
      const stock = Number(producto.quantity) || 0;
      const moneda = producto.currency_price || "$";
      total += precio * cantidad;

      lista += `
        <li class="d-flex gap-3 py-3 border-bottom" data-role="cart-item" data-id="${producto.id}" data-cantidad="${cantidad}">
          <img src="${producto.image || "./assets/favicon/favicon.svg"}" alt="" class="cart-item-img"
            onerror="this.onerror=null; this.src='./assets/favicon/favicon.svg'" />
          <div class="flex-grow-1">
            <p class="cart-item-name fw-semibold mb-1">${producto.name}</p>
            <p class="small text-secondary mb-2">${moneda}${formatearPrecio(precio)} c/u</p>
            <div class="d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center gap-2">
                <button type="button" class="cart-qty-btn" data-action="decrease"
                  aria-label="Quitar una unidad de ${producto.name}" ${cantidad <= 1 ? "disabled" : ""}>−</button>
                <span class="cart-qty" data-role="item-qty">${cantidad}</span>
                <button type="button" class="cart-qty-btn" data-action="increase"
                  aria-label="Agregar una unidad de ${producto.name}" ${cantidad >= stock ? "disabled" : ""}>+</button>
              </div>
              <span class="fw-bold" data-role="item-subtotal">${moneda}${formatearPrecio(precio * cantidad)}</span>
            </div>
          </div>
          <button type="button" class="btn btn-link link-secondary p-0 align-self-start" data-action="remove"
            aria-label="Quitar ${producto.name} del carrito">
            <i class="bi bi-trash" aria-hidden="true"></i>
          </button>
        </li>
      `;
    });

    cuerpo.innerHTML = `
      <ul class="list-unstyled m-0">${lista}</ul>
      <div class="mt-auto pt-3">
        <div class="d-flex justify-content-between fs-5 fw-bold mb-3">
          <span>Total</span>
          <span data-role="cart-total">$${formatearPrecio(total)}</span>
        </div>
        <button type="button" class="btn btn-customer w-100 py-2 fw-semibold mb-2" data-action="checkout">Finalizar compra</button>
        <button type="button" class="btn btn-link link-secondary w-100 small" data-action="clear">Vaciar carrito</button>
      </div>
    `;
  }
}

customElements.define("cart-panel", CartPanel);
