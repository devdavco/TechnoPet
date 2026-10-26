// HU-03 Paginación del catálogo
class CatalogPagination extends HTMLElement {
  dibujar(total) {
    // Sin productos no se muestra nada
    if (total === 0) {
      this.innerHTML = "";
      return;
    }

    const totalPaginas = Math.ceil(total / PRODUCTOS_POR_PAGINA);

    // Texto "Mostrando X–Y de Z productos"
    const desde = (pagina - 1) * PRODUCTOS_POR_PAGINA + 1;
    const hasta = Math.min(pagina * PRODUCTOS_POR_PAGINA, total);
    let html = `<p class="catalog-pagination-text mb-3">Mostrando ${desde}–${hasta} de ${total} productos</p>`;

    // Con más de una página mostramos los botones
    if (totalPaginas > 1) {
      html += `<nav aria-label="Paginación del catálogo" class="d-flex justify-content-center flex-wrap gap-2">`;

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
    }

    this.innerHTML = `<div class="catalog-pagination py-4">${html}</div>`;

    // Al hacer clic en un botón cambiamos de página
    const botones = this.querySelectorAll("button");
    botones.forEach(function (boton) {
      boton.addEventListener("click", function () {
        pagina = Number(boton.dataset.pagina);
        actualizarCatalogo();

        // Volvemos al inicio del listado
        document.getElementById("listado-productos").scrollIntoView({ behavior: "smooth" });
      });
    });
  }
}

customElements.define("catalog-pagination", CatalogPagination);

// La llama actualizarCatalogo() cada vez que cambia la lista
function dibujarPaginacion(total) {
  document.querySelector("catalog-pagination").dibujar(total);
}
