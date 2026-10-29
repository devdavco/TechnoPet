class SectionHero extends HTMLElement {
  connectedCallback() {
    const contentPage = {
      title: "Tecnología para cuidar mejor a tu mascota",
      description:
        "Encuentra soluciones para su alimentación, seguridad y bienestar, estés donde estés.",
      carousel: [
        {
          img: "./assets/home/dog_necklace_tech.webp",
          description: "Perro con collar tecnologico",
        },
        {
          img: "./assets/home/automatic_sandbox.webp",
          description: "Arenero automatico para gatos",
        },
        {
          img: "./assets/home/birds_feeder.webp",
          description: "Comedero con camara para aves",
        },
        {
          img: "./assets/home/automatic_cat_feeder.webp",
          description: "Comedero automatico",
        },
        {
          img: "./assets/home/pet_hair_dryer.webp",
          description: "Secador de cabello automatico para mascotas",
        },
      ],
    };

    const slides = contentPage.carousel
      .map(
        (item, index) => `
          <div class="carousel-item ${index === 0 ? "active" : ""}">
            <img src="${item.img}" class="d-block w-100 rounded-3" alt="${item.description}" />
          </div>`,
      )
      .join("");

    this.innerHTML = `
  <div class="bg-color-secondary py-5">
    <div class="container">
      <div class="row gy-5 g-mg-0">
        <div class="col-md-7 col-lg-7 d-flex flex-col align-items-center">
          <div>
            <h1 class="fs-1 fw-bold color-primary">${contentPage.title}</h1>
            <div class="pt-5">
              <p class="color-neutral-dark">${contentPage.description}</p>
              <a href="./products.html" class="btn btn-customer rounded-pill px-4">
                Explorar catálogo
              </a>
            </div>
          </div>
        </div>
        <div class="col-md-5 col-lg-5">
          <div id="carouselExampleAutoplaying" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
              ${slides}
            </div>
            <button class="carousel-control-prev" type="button"
              data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button"
              data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
`;
  }
}

customElements.define("section-hero", SectionHero);
