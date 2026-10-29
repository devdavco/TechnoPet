import { ordenarCatalogo } from "./catalog-state.js";

const LIST_ORDER = [
  { id: "recomendado", title: "Recomendado" },
  { id: "precio-desc", title: "Mayor precio" },
  { id: "precio-asc", title: "Menor precio" },
  { id: "nombre-asc", title: "Nombre (A–Z)" },
  { id: "nombre-desc", title: "Nombre (Z–A)" },
];

// Devuelve una copia ordenada; "recomendado" deja el orden original.
// La usa actualizarCatalogo() (catalog-state.js).
export function ordenarProductos(products, order) {
  const sorted = products.slice();
  if (order === "precio-desc") sorted.sort((a, b) => Number(b.price) - Number(a.price));
  if (order === "precio-asc") sorted.sort((a, b) => Number(a.price) - Number(b.price));
  if (order === "nombre-asc") sorted.sort((a, b) => a.name.localeCompare(b.name, "es", { sensitivity: "base" }));
  if (order === "nombre-desc") sorted.sort((a, b) => b.name.localeCompare(a.name, "es", { sensitivity: "base" }));

  return sorted;
}

// Actualiza el texto "Mostrando X–Y de Z productos".
// La llama actualizarCatalogo() cada vez que cambia la lista.
export function dibujarResumen(desde, hasta, total) {
  const order = document.querySelector("order-component");
  if (order) order.renderSummary(desde, hasta, total);
}

class OrderComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 pb-4">
        <div class="d-flex align-items-center gap-2">
            <div class="rounded-pill form-circle flex-shrink-0"></div>
            <p class="m-0" data-role="summary" aria-live="polite">Cargando productos...</p>
        </div>

        <div class="d-flex align-items-center gap-2">
            <label for="order-select" class="m-0 text-nowrap">Ordenar por:</label>
            <select id="order-select" class="form-select w-auto">
                ${LIST_ORDER.map((o) => `<option value="${o.id}">${o.title}</option>`).join("")}
            </select>
        </div>
    </div>
    `;

    this.querySelector("select").addEventListener("change", (e) => {
      ordenarCatalogo(e.target.value);
    });
  }

  renderSummary(desde, hasta, total) {
    const summary = this.querySelector('[data-role="summary"]');

    if (total === 0) {
      summary.innerHTML = `Mostrando <span class="fw-bold">0</span> de <span class="fw-bold">0</span> productos`;
      return;
    }

    summary.innerHTML = `Mostrando <span class="fw-bold">${desde}–${hasta}</span> de <span class="fw-bold">${total}</span> productos`;
  }
}

customElements.define("order-component", OrderComponent);
