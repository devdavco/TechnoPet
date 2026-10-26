// HU-02 Encabezado del catálogo: breadcrumb, título y descripción
class CatalogHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="catalog-header py-4">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb catalog-breadcrumb mb-2">
            <li class="breadcrumb-item"><a href="./index.html">Inicio</a></li>
            <li class="breadcrumb-item active" aria-current="page">Catálogo</li>
          </ol>
        </nav>
        <h1 class="catalog-title fw-bold mb-2">Catálogo de productos</h1>
        <p class="catalog-description mb-0">
          Encuentra tecnología para la alimentación, seguridad y bienestar de tu mascota.
        </p>
      </div>
    `;
  }
}

customElements.define("catalog-header", CatalogHeader);
