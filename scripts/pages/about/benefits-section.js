class BenefitsSection extends HTMLElement {
  connectedCallback() {
    const benefits = [
      {
        img: "benefit_1",
        title: "Pensamos en tu mascota",
        description:
          "Seleccionamos soluciones pensando en su bienestar y seguridad.",
      },
      {
        img: "benefit_2",
        title: "Tecnología fácil de usar",
        description: "Te ayudamos a entender y configurar tus dispositivos",
      },
      {
        img: "benefit_3",
        title: "Compra con confianza",
        description:
          "Queremos que encuentres productos confiables y recibas el acompañamiento que necesitas",
      },
    ];

    const row = document.createElement("div");
    row.className = "row row-cols-1 row-cols-sm-2 row-cols-md-3 g-5 justify-content-center";

    benefits.forEach((benefit) => {
      const item = document.createElement("benefit-card");
      item.className = "col";
      item.setAttribute("title", benefit.title);
      item.setAttribute("description", benefit.description);
      item.setAttribute("img", `./assets/about/${benefit.img}.webp`);
      row.appendChild(item);
    });

    this.appendChild(row);
  }
}

customElements.define("benefits-section", BenefitsSection);
