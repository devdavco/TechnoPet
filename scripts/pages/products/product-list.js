import { createProductCard } from "./product-card.js";
import { busqueda } from "./catalog-state.js";

// Dibuja las tarjetas de los productos de la página actual.
// La llama actualizarCatalogo() (catalog-state.js) después de buscar, filtrar, ordenar y paginar.
export function dibujarProductos(products) {
  const catalogContainer = document.getElementById("catalog-container");

  if (!catalogContainer) return;

  if (products.length === 0) {
    // Usamos textContent para que lo escrito en el buscador se muestre como texto y no como HTML
    const message = document.createElement("p");
    message.className = "text-muted";
    if (busqueda.trim() === "") {
      message.textContent = "No hay productos que coincidan con los filtros.";
    } else {
      message.textContent = `No encontramos productos para '${busqueda.trim()}'`;
    }

    catalogContainer.innerHTML = `<div class="col-12 text-center py-5"></div>`;
    catalogContainer.firstElementChild.appendChild(message);
    return;
  }

  catalogContainer.innerHTML = products.map(product => createProductCard(product)).join("");
}
