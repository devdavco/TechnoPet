import { PRODUCTOS_POR_PAGINA, pagina, cambiarPagina } from "./catalog-state.js";

// HU-03 Paginación del catálogo
class CatalogPagination extends HTMLElement {
  dibujar(total) {
    const totalPaginas = Math.ceil(total / PRODUCTOS_POR_PAGINA);

    // Con una página o ninguna no se muestran los botones.
    // El texto "Mostrando X–Y de Z" lo dibuja order-component.js, arriba de las tarjetas.
    if (totalPaginas <= 1) {
      this.innerHTML = "";
      return;
    }

    let html = `<nav aria-label="Paginación del catálogo" class="d-flex justify-content-center flex-wrap gap-2">`;

    html += `<button type="button" class="catalog-page-button" data-pagina="${pagina - 1}" ${pagina === 1 ? "disabled" : ""}>Anterior</button>`;

    for (let numero = 1; numero <= totalPaginas; numero++) {
      if (numero === pagina) {
        html += `<button type="button" class="catalog-page-button active" data-pagina="${numero}" aria-current="page">${numero}</button>`;
      } else {
        html += `<button type="button" class="catalog-page-button" data-pagina="${numero}">${numero}</button>`;
      }
    }

    html += `<button type="button" class="catalog-page-button" data-pagina="${pagina + 1}" ${pagina === totalPaginas ? "disabled" : ""}>Siguiente</button>`;
    html += `</nav>`;

    this.innerHTML = `<div class="catalog-pagination py-4">${html}</div>`;

    // Al hacer clic en un botón cambiamos de página
    const botones = this.querySelectorAll("button");
    botones.forEach(function (boton) {
      boton.addEventListener("click", function () {
        cambiarPagina(Number(boton.dataset.pagina));

        // Volvemos al inicio del listado
        document.getElementById("catalog-container").scrollIntoView({ behavior: "smooth" });
      });
    });
  }
}

customElements.define("catalog-pagination", CatalogPagination);

// La llama actualizarCatalogo() cada vez que cambia la lista
export function dibujarPaginacion(total) {
  document.querySelector("catalog-pagination").dibujar(total);
}
