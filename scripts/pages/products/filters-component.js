import { getCategories } from "../../../services/api_categories.js";

const ALL_ID = "all";

class FiltersComponent extends HTMLElement {
    async connectedCallback() {
        console.log("[filters-component] connectedCallback");

        const apiCategories = await getCategories();
        console.log("[filters-component] categorías:", apiCategories);

        const quantity = [6, 5, 4, 6, 3];
        const categories = [
            { id: ALL_ID, title: "Todas", count: 24 },
            ...apiCategories.map((c, i) => ({
                ...c,
                id: String(c.id ?? i + 1),
                count: quantity[i],
            })),
        ];

        const defaults = { categories: [ALL_ID], maxPrice: 120, inStock: true };
        let state = structuredClone(defaults);

        const render = () => {
            this.innerHTML = `
      <aside class="filters card rounded-4 shadow-sm">
        <div class="card-body p-4 d-flex flex-column gap-4">
          <div class="d-flex justify-content-between align-items-center pb-3 border-bottom">
            <h2 class="h5 fw-bold m-0 d-flex align-items-center gap-2">
              <i class="bi bi-funnel"></i> Filtros
            </h2>
            <button type="button" class="btn btn-link link-secondary p-0 small" data-action="clear">Limpiar</button>
          </div>

          <section class="pb-4 border-bottom">
            <h3 class="small fw-semibold text-uppercase text-secondary mb-3">Categoría</h3>
            <div class="d-flex flex-column gap-2">
              ${categories
                    .map(
                        (c, i) => `
                <div class="d-flex justify-content-between align-items-center">
                  <div class="form-check m-0">
                    <input class="form-check-input" type="checkbox" id="cat-${i}"
                           data-role="category" data-id="${c.id}"
                           ${state.categories.includes(c.id) ? "checked" : ""}>
                    <label class="form-check-label" for="cat-${i}">${c.title}</label>
                  </div>
                  <span class="badge rounded-pill text-bg-light text-secondary fw-normal">${c.count}</span>
                </div>`,
                    )
                    .join("")}
            </div>
          </section>

          <section class="pb-4 border-bottom">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h3 class="small fw-semibold text-uppercase text-secondary m-0">Precio</h3>
              <span class="badge bg-success-subtle text-success-emphasis fw-semibold" data-role="price-label">
                Hasta $${state.maxPrice} COP
              </span>
            </div>
            <input type="range" class="form-range" min="0" max="200" step="10" value="${state.maxPrice}" data-role="price" aria-label="Precio máximo">
            <div class="d-flex justify-content-between small fw-semibold text-secondary">
              <span>$0</span><span>$100</span><span>$200+</span>
            </div>
          </section>

            <section>
                <h3 class="small fw-semibold text-uppercase text-secondary mb-3">Conectividad &amp; stock</h3>
                <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" role="switch" id="in-stock" data-role="stock" ${state.inStock ? "checked" : ""}>
                    <label class="form-check-label" for="in-stock">Solo disponibles (en stock)</label>
                </div>
            </section>

          <button type="button" class="btn btn-dark w-100 py-2 fw-semibold rounded-3" data-action="apply">
            <i class="bi bi-check-lg me-1"></i> Aplicar filtros
          </button>
        </div>
      </aside>`;
        };

        const clearFilters = () => {
            state = structuredClone(defaults);
            render();
            console.log("Filtros limpiados");
        };

        const applyFilters = () => {
            console.log("Filtros aplicados:", state);
        };

        this.addEventListener("change", (e) => {
            const { role, id } = e.target.dataset;

            if (role === "category") {
                const boxes = [...this.querySelectorAll('[data-role="category"]')];
                const all = boxes.find((b) => b.dataset.id === ALL_ID);

                if (id === ALL_ID) {
                    boxes.forEach((b) => (b.checked = b === all));
                } else {
                    all.checked = false;
                }

                if (!boxes.some((b) => b.checked)) all.checked = true;

                state.categories = boxes
                    .filter((b) => b.checked)
                    .map((b) => b.dataset.id);
            }

            if (role === "stock") state.inStock = e.target.checked;
        });

        this.addEventListener("input", (e) => {
            if (e.target.dataset.role !== "price") return;
            state.maxPrice = Number(e.target.value);
            this.querySelector('[data-role="price-label"]').textContent =
                `Hasta $${state.maxPrice} COP`;
        });

        this.addEventListener("click", (e) => {
            const action = e.target.closest("[data-action]")?.dataset.action;
            if (action === "clear") clearFilters();
            if (action === "apply") applyFilters();
        });

        render();
    }
}

customElements.define("filters-component", FiltersComponent);
