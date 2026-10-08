class BenefitCard extends HTMLElement {
  connectedCallback() {
  const img = this.getAttribute("img") ?? "";
  const description = this.getAttribute("description") ?? "";
  const title = this.getAttribute("title") ?? "";
//  style="width: 18rem"
  this.innerHTML = `
    <div class="card">
        <img src="${img}" class="card-img-top" alt="${title}" />
        <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">
            ${description}
            </p>
        </div>
    </div>
  `;
}
}

customElements.define("benefit-card", BenefitCard);