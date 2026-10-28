import { filtrarEnCatalogo } from "./catalog-state.js";

const ALL_ID = "all";
const PASO_PRECIO = 10000;

// Mismo formato de precio que las tarjetas: 150000 -> "150.000"
const formatPrice = (value) => Number(value).toLocaleString("es-CO");

// Deja solo los productos que cumplen los filtros.
// La usa actualizarCatalogo() (catalog-state.js).
export function filtrarProductos(products, filters) {
    return products.filter((product) => {
        if (filters.categorias.length > 0 && !filters.categorias.includes(product.category)) return false;
        if (filters.precioMax !== null && Number(product.price) > filters.precioMax) return false;
        if (filters.soloDisponibles && !(product.quantity > 0)) return false;
        return true;
    });
}

// Prepara el panel con los productos reales.
// La llama catalog-state.js cuando termina de cargar los productos.
export function prepararFiltros(products) {
    const panel = document.querySelector("filters-component");
    if (panel) panel.prepare(products);
}

class FiltersComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<p class="text-secondary small m-0">Cargando filtros...</p>`;

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

                this.state.categories = boxes
                    .filter((b) => b.checked)
                    .map((b) => b.dataset.id);
            }

            if (role === "stock") this.state.inStock = e.target.checked;
        });

        this.addEventListener("input", (e) => {
            if (e.target.dataset.role !== "price") return;
            this.state.maxPrice = Number(e.target.value);
            this.querySelector('[data-role="price-label"]').textContent = `Hasta $${formatPrice(this.state.maxPrice)}`;
        });

        this.addEventListener("click", (e) => {
            const button = e.target.closest("[data-action]");
            if (!button) return;
            if (button.dataset.action === "clear") this.clearFilters();
            if (button.dataset.action === "apply") this.applyFilters();
        });
    }

    // Calcula categorías, cantidades y rango de precio a partir de los productos
    prepare(products) {
        const counts = {};
        products.forEach((product) => {
            counts[product.category] = (counts[product.category] || 0) + 1;
        });

        const names = Object.keys(counts).sort((a, b) => a.localeCompare(b, "es"));
        this.categories = [{ id: ALL_ID, title: "Todas", count: products.length }].concat(
            names.map((name) => ({ id: name, title: name, count: counts[name] })),
        );

        // Redondeamos los extremos al paso del rango (79.968 -> 70.000, 380.800 -> 390.000)
        const prices = products.map((product) => Number(product.price));
        this.minPrice = prices.length ? Math.floor(Math.min(...prices) / PASO_PRECIO) * PASO_PRECIO : 0;
        this.maxPrice = prices.length ? Math.ceil(Math.max(...prices) / PASO_PRECIO) * PASO_PRECIO : 0;

        this.state = this.initialState();
        this.render();
    }

    initialState() {
        return { categories: [ALL_ID], maxPrice: this.maxPrice, inStock: false };
    }

    clearFilters() {
        this.state = this.initialState();
        this.render();
        this.applyFilters();
    }

    applyFilters() {
        filtrarEnCatalogo({
            categorias: this.state.categories.includes(ALL_ID) ? [] : this.state.categories,
            precioMax: this.state.maxPrice,
            soloDisponibles: this.state.inStock,
        });

        // En móvil el panel está en un offcanvas: lo cerramos para que se vean los resultados
        const offcanvas = this.closest(".offcanvas-lg");
        if (offcanvas && offcanvas.classList.contains("show") && window.bootstrap) {
            window.bootstrap.Offcanvas.getOrCreateInstance(offcanvas).hide();
        }
    }

    render() {
        const state = this.state;

        this.innerHTML = `
            <aside class="filters card rounded-4 shadow-sm">
                <div class="card-body p-4 d-flex flex-column gap-4">
                    <div class="d-flex justify-content-between align-items-center pb-3 border-bottom">
                        <h2 class="h5 fw-bold m-0 d-flex align-items-center gap-2">
                            <i class="bi bi-funnel" aria-hidden="true"></i> Filtros
                        </h2>
                        <button type="button" class="btn btn-link link-secondary p-0 small" data-action="clear">Limpiar</button>
                    </div>

                    <section class="pb-4 border-bottom">
                        <h3 class="small fw-semibold text-uppercase text-secondary mb-3">Categoría</h3>
                        <div class="d-flex flex-column gap-2">
                        ${this.categories
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
                            <span class="badge filters-price-badge fw-semibold" data-role="price-label">
                                Hasta $${formatPrice(state.maxPrice)}
                            </span>
                        </div>
                        <input type="range" class="form-range" min="${this.minPrice}" max="${this.maxPrice}" step="${PASO_PRECIO}"
                            value="${state.maxPrice}" data-role="price" aria-label="Precio máximo">
                        <div class="d-flex justify-content-between small fw-semibold text-secondary">
                            <span>$${formatPrice(this.minPrice)}</span><span>$${formatPrice(this.maxPrice)}</span>
                        </div>
                    </section>

                    <section>
                        <h3 class="small fw-semibold text-uppercase text-secondary mb-3">Disponibilidad</h3>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" role="switch" id="in-stock" data-role="stock" ${state.inStock ? "checked" : ""}>
                            <label class="form-check-label" for="in-stock">Solo disponibles</label>
                        </div>
                    </section>

                    <button type="button" class="btn btn-customer w-100 py-2 fw-semibold rounded-3" data-action="apply">
                        <i class="bi bi-check-lg me-1" aria-hidden="true"></i> Aplicar filtros
                    </button>
                </div>
            </aside>`;
    }
}

customElements.define("filters-component", FiltersComponent);
