class OrderComponent extends HTMLElement {
  connectedCallback() {

    const LIST_ORDER = [
        {
            id: 1,
            title: "Recomendado"
        },
        {
            id: 2,
            title: "Mayor precio"
        },
        {
            id: 3,
            title: "Menor precio"
        },
    ]

    const pagination = {
        total: 24
    }
    
    this.innerHTML = `
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 pb-5">
        <div class="d-flex align-items-center gap-2">
            <div class="rounded-pill form-circle flex-shrink-0"></div>
            <p class="m-0">Mostrando <span class="fw-bold">1–10</span> de <span class="fw-bold">${pagination.total}</span> productos</p>
        </div>

        <div class="d-flex align-items-center gap-2">
            <p class="m-0 text-nowrap">Ordenado por:</p>
            <select class="form-select w-auto" aria-label="Ordenar productos">
                ${LIST_ORDER
                    .map(
                    (o, i) =>
                        `<option value="${o.id}" ${i === 0 ? "selected" : ""}>${o.title}</option>`
                    )
                    .join("")}
            </select>
        </div>
    </div>
    `;
  }
}

customElements.define("order-component", OrderComponent);
