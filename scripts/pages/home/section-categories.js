import { getCategories } from "../../../services/api_categories.js";
class SectionCategories extends HTMLElement {
  async connectedCallback() {
    const content = {
      title: "Explora la gama",
      subtitle: "Compra por categoría",
      textCategory: "Categorías principales",
    };

    const categories = await getCategories();

    const cards = categories
      .map(
        (item) => `
          <div class="col-12 col-md-6 col-lg-3">
            <a href="${item.href ?? "#"}" class="category-card d-block h-100">
              <div class="d-flex justify-content-between align-items-start mb-4">
                <div class="category-icon d-flex justify-content-center align-items-center fs-3 rounded-2">
                  <i class="${item.icon}" aria-hidden="true"></i>
                </div>
                <i class="bi bi-arrow-right category-arrow" aria-hidden="true"></i>
              </div>
              <h3 class="fs-4 fw-semibold mb-1">${item.title}</h3>
              <p class="fs-6 mb-0">${item.description}</p>
            </a>
          </div>
        `,
      )
      .join("");

    this.innerHTML = `
      <div class="py-5">
        <div class="d-flex flex-wrap justify-content-between align-items-end gap-3">
          <div>
            <p class="eyebrow mb-1">${content.title}</p>
            <h2 class="display-5 fw-bold mb-0 color-neutral-dark">${content.subtitle}</h2>
          </div>
          <div class="d-flex align-items-center px-3 py-1 rounded-pill gap-2 badge-container">
            <div class="w-10p rounded-pill bg-color-primary"></div>
            <p class="m-0">${categories.length} ${content.textCategory}</p>
          </div>
        </div>

        <div class="row g-4 pt-5">
          ${cards}
        </div>
      </div>
    `;
  }
}

customElements.define("section-categories", SectionCategories);
