import { getCategories } from "../../../services/api_categories.js";
import { validateProductForm } from "./validate-new-product.js";

const contentForm = {
  title: "Añadir Nuevo Producto",
  subTitle:
    "Ingresa los datos para registrar un nuevo artículo en el catálogo.",
  inputs: {
    name: {
      title: "Nombre del producto",
      placeholder: "Ej. Collar GPS Inteligente Pro",
    },
    category: {
      title: "Categoría",
      placeholder: "Selecciona una categoría",
    },
    price: {
      title: "Precio ($ COP)",
      placeholder: "89.00",
    },
    quantity: {
      title: "Cantidad / Stock",
      placeholder: "50",
    },
    description: {
      title: "Descripción del producto",
      placeholder:
        "Detalles técnicos, especificaciones de conectividad IoT, dimensiones y funcionalidades principales...",
    },
    image: {
      title: "Imagen del producto",
      placeholder: "PNG, JPG o WebP (Hasta 5MB)",
    },
  },
};

class NewProductComponent extends HTMLElement {
  async connectedCallback() {
    const categories = await getCategories();

    const button = `
    <button type="button" class="btn btn-brand" data-bs-toggle="modal" data-bs-target="#createProduct">
        <i class="bi bi-plus-lg me-1" aria-hidden="true"></i> Añadir producto
    </button>
    `;

    const inputImage = `
    <div class="col-12">
        <span class="form-label fw-medium d-block">${contentForm.inputs.image.title}</span>
        <label for="image" class="dropzone d-flex flex-column align-items-center justify-content-center text-center gap-2 p-3 p-md-4 rounded-4 w-100">
        <span class="dropzone-icon d-flex justify-content-center align-items-center rounded-circle fs-4">
            <i class="bi bi-cloud-arrow-up" aria-hidden="true"></i>
        </span>
        <span data-dropzone-text>
            <span class="badge btn-brand fs-6 fw-medium">Subir imagen</span>
            o arrastra un archivo aquí
        </span>
        <img data-preview class="d-none rounded-3 object-fit-cover" width="96" height="96" alt="Vista previa" />
        <small class="text-secondary">${contentForm.inputs.image.placeholder}</small>
        </label>
        <input type="file" class="visually-hidden" id="image" name="image" accept="image/png,image/jpeg,image/webp" />
        <div class="dropzone-feedback text-danger small mt-2"></div>
    </div>`;

    this.innerHTML = `
    <div class="d-flex justify-content-end">
        ${button}
    </div>
      

      <div class="modal fade product-modal" id="createProduct" data-bs-backdrop="static" tabindex="-1" aria-labelledby="newProductTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <form id="productForm" class="modal-content border-0 rounded-4 needs-validation" novalidate>

            <div class="modal-header product-soft border-0 align-items-start gap-3 p-3 p-md-4">
              <div class="flex-grow-1">
                <h2 class="modal-title fs-4 fw-bold" id="newProductTitle">${contentForm.title}</h2>
                <p class="mb-0 text-secondary small">${contentForm.subTitle}</p>
              </div>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>

            <div class="modal-body p-3 p-md-4">
              <div class="row g-3">
                <div class="col-12">
                  <label for="name" class="form-label fw-medium">
                    ${contentForm.inputs.name.title} <span class="text-danger">*</span>
                  </label>
                  <input type="text" class="form-control" id="name" name="name" placeholder="${contentForm.inputs.name.placeholder}" required />
                  <div class="invalid-feedback">El nombre es obligatorio (mínimo 3 caracteres).</div>
                </div>

                <div class="col-12 col-md-4">
                  <label for="category" class="form-label fw-medium">
                    ${contentForm.inputs.category.title} <span class="text-danger">*</span>
                  </label>
                  <select class="form-select" id="category" name="category" required>
                    <option value="" selected disabled>${contentForm.inputs.category.placeholder}</option>
                    ${categories
                      .map((c) => `<option value="${c.id}">${c.title}</option>`)
                      .join("")}
                  </select>
                  <div class="invalid-feedback">Selecciona una categoría.</div>
                </div>

                <div class="col-12 col-md-4">
                  <label for="price" class="form-label fw-medium">
                    ${contentForm.inputs.price.title} <span class="text-danger">*</span>
                  </label>
                  <div class="input-group has-validation">
                    <span class="input-group-text fw-semibold">$</span>
                    <input type="number" class="form-control" id="price" name="price" placeholder="${contentForm.inputs.price.placeholder}" min="0.01" step="0.01" required />
                    <div class="invalid-feedback">Ingresa un precio válido</div>
                  </div>
                </div>

                <div class="col-12 col-md-4">
                  <label for="stock" class="form-label fw-medium">
                    ${contentForm.inputs.quantity.title} <span class="text-danger">*</span>
                  </label>
                  <input type="number" class="form-control" id="stock" name="stock" placeholder="${contentForm.inputs.quantity.placeholder}" min="0" step="1" required />
                  <div class="invalid-feedback">Ingresa una cantidad válida</div>
                </div>

                <div class="col-12">
                  <label for="description" class="form-label fw-medium">${contentForm.inputs.description.title}</label>
                  <textarea class="form-control" id="description" name="description" rows="2" placeholder="${contentForm.inputs.description.placeholder}"></textarea>
                  <div class="invalid-feedback">Si la completas, debe tener al menos 15 caracteres</div>
                </div>

                ${inputImage}

              </div>
            </div>

            <div class="modal-footer product-soft border-0 p-3 p-md-4 gap-2 flex-column-reverse flex-sm-row align-items-stretch align-items-sm-center">
                <button type="button" class="btn btn-outline-secondary fw-medium" data-bs-dismiss="modal">
                    Cancelar
                </button>
                <button type="submit" class="btn btn-brand px-4">
                    <i class="bi bi-check-lg me-1" aria-hidden="true"></i> Guardar Producto
                </button>
             </div>
          </form>
        </div>
      </div>
    `;

    this.initForm();
    this.initDropzone();
  }

  initForm() {
    const form = this.querySelector("#productForm");
    const modal = this.querySelector("#createProduct");

    form.addEventListener("submit", validateProductForm);

    // Limpiar el form al cerrarse
    modal.addEventListener("hidden.bs.modal", () => {
      form.reset();
      form.classList.remove("was-validated");
    });
  }

  initDropzone() {
    const form = this.querySelector("#productForm");
    const zone = this.querySelector(".dropzone");
    const input = this.querySelector("#image");
    const preview = this.querySelector("[data-preview]");
    const text = this.querySelector("[data-dropzone-text]");

    const showPreview = () => {
      const file = input.files[0];
      if (!file) return resetPreview();
      preview.src = URL.createObjectURL(file);
      preview.classList.remove("d-none");
      text.textContent = file.name;
    };

    const resetPreview = () => {
      preview.classList.add("d-none");
      preview.removeAttribute("src");
      text.innerHTML = `<span class="badge btn-brand fs-6 fw-medium">Subir imagen</span> o arrastra un archivo aquí`;
      this.querySelector(".dropzone-feedback").textContent = "";
      zone.classList.remove("is-invalid");
    };

    input.addEventListener("change", showPreview);
    form.addEventListener("reset", resetPreview);

    ["dragenter", "dragover"].forEach((evt) =>
      zone.addEventListener(evt, (e) => {
        e.preventDefault();
        zone.classList.add("is-dragging");
      }),
    );
    ["dragleave", "drop"].forEach((evt) =>
      zone.addEventListener(evt, (e) => {
        e.preventDefault();
        zone.classList.remove("is-dragging");
      }),
    );
    zone.addEventListener("drop", (e) => {
      input.files = e.dataTransfer.files;
      showPreview();
    });
  }
}

customElements.define("new-product-component", NewProductComponent);
