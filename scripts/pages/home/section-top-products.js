import { obtenerProductos } from "../../../services/api_products.js";
import { createProductCard } from "../products/product-card.js";

class SectionTopProducts extends HTMLElement {
  async connectedCallback() {
    const content = {
      title: "Top Recomendados",
      subtitle: "Productos destacados",
      description: "Soluciones IoT con la más alta calificación de tutores.",
      linkText: "Ver todo el catálogo",
      linkHref: "./products.html",
    };

    const products = await obtenerProductos();

    const randomProducts = [...products]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);

    const cards = randomProducts
      .map((product) => createProductCard(product, "col-12 col-sm-6 col-lg-3"))
      .join("");

    this.innerHTML = `
      <div class="py-5">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3">
          <div>
            <p class="eyebrow mb-1">${content.title}</p>
            <h2 class="display-5 fw-bold mb-1 color-neutral-dark">${content.subtitle}</h2>
            <p class="mb-0 text-secondary">${content.description}</p>
          </div>

          <a href="${content.linkHref}"
             class="d-inline-flex align-items-center gap-2 fw-semibold text-decoration-none color-primary text-nowrap">
            ${content.linkText}
            <i class="bi bi-arrow-right" aria-hidden="true"></i>
          </a>
        </div>

        <div class="row g-4 pt-5">
          ${cards}
        </div>
      </div>
    `;
  }
}

customElements.define("section-top-products", SectionTopProducts);
