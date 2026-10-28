import { buscarEnCatalogo } from "./catalog-state.js";

// HU-01 Barra de búsqueda del catálogo

// Pasa el texto a minúsculas, quita las tildes y los espacios de los extremos.
// Ejemplo: "  Cámara " -> "camara"
function normalizarTexto(texto) {
  return String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

// Devuelve los productos cuyo nombre, categoría o descripción contienen el texto
export function buscarProductos(productos, texto) {
  const textoBuscado = normalizarTexto(texto);

  // Si el campo está vacío, se muestran todos
  if (textoBuscado === "") {
    return productos;
  }

  return productos.filter(function (producto) {
    return (
      normalizarTexto(producto.name).includes(textoBuscado) ||
      normalizarTexto(producto.category).includes(textoBuscado) ||
      normalizarTexto(producto.description).includes(textoBuscado)
    );
  });
}

class CatalogSearch extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="catalog-search-bar">
        <div class="container d-flex align-items-center justify-content-between gap-3 py-3">
          <form role="search" class="catalog-search-form d-flex flex-grow-1">
            <label for="catalog-search-input" class="visually-hidden">Buscar productos</label>
            <input
              type="search"
              id="catalog-search-input"
              class="catalog-search-input"
              placeholder="Buscar productos para tu mascota..."
            />
            <button type="submit" class="catalog-search-button">Buscar</button>
          </form>
          <p class="catalog-search-text d-none d-md-block m-0">
            Tecnología para su cuidado y bienestar
          </p>
        </div>
      </div>
    `;

    const formulario = this.querySelector("form");
    const input = this.querySelector("input");

    // Si la URL trae ?q=texto, lo mostramos en el campo
    // (la búsqueda la aplica catalog-state.js cuando terminan de cargar los productos)
    const textoUrl = new URLSearchParams(window.location.search).get("q");
    if (textoUrl) {
      input.value = textoUrl;
    }

    // Buscar al hacer clic en "Buscar" o al presionar Enter
    formulario.addEventListener("submit", function (evento) {
      evento.preventDefault();
      buscarEnCatalogo(input.value);
    });
  }
}

customElements.define("catalog-search", CatalogSearch);
