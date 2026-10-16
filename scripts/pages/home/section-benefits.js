class SectionBenefits extends HTMLElement {
  connectedCallback() {
    const benefits = [
      {
        icon: "bi bi-bus-front",
        title: "Envíos a todo el país",
        description: "Rápido y seguro directo a tu puerta con código de rastreo."
      },
      {
        icon: "bi bi-shield-check",
        title: "Pago seguro",
        description: "Transacciones 256-bit encriptadas, cuotas y múltiples medios."
      },
      {
        icon: "bi bi-headset",
        title: "Soporte para tus dispositivos",
        description: "Asesoría técnica y configuración guiada paso a paso."
      }
    ];

    const lastIndex = benefits.length - 1;

    const benefitsList = benefits
      .map(
        (item, index) => `
          <div class="col-12 col-md-4">
            <div class="d-flex align-items-start gap-3 h-100
                        ${index !== lastIndex ? "divider-responsive" : ""}
                        ${index !== 0 ? "ps-md-4" : ""}">
              <div class="flex-shrink-0 rounded-2 bg-color-secondary bg-opacity-10
                          d-flex justify-content-center align-items-center fs-4 text-white"
                   style="width: 60px; height: 60px;">
                <i class="${item.icon}" aria-hidden="true"></i>
              </div>
              <div>
                <h3 class="fs-5 fw-medium mb-1">${item.title}</h3>
                <p class="fs-6 mb-0">${item.description}</p>
              </div>
            </div>
          </div>
        `
      )
      .join("");

    this.innerHTML = `
      <div class="bg-neutral-cream py-5 px-4 px-md-5">
        <div class="container">
          <div class="row g-4 g-md-0 p-3 p-md-5 bg-white rounded-4">
            ${benefitsList}
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("section-benefits", SectionBenefits);