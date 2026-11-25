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
      placeholder: "150000",
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
      placeholder: "https://ejemplo.com/imagen.jpg",
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

    // El backend guarda la imagen como enlace (máximo 500 caracteres), no como archivo
    const inputImage = `
    <div class="col-12">
        <label for="image" class="form-label fw-medium">${contentForm.inputs.image.title}</label>
        <input type="url" class="form-control" id="image" name="image" maxlength="500" placeholder="${contentForm.inputs.image.placeholder}" />
        <div class="invalid-feedback">Ingresa una URL válida (que empiece por https://)</div>
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
                    <input type="number" class="form-control" id="price" name="price" placeholder="${contentForm.inputs.price.placeholder}" min="1" step="1" required />
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
}

customElements.define("new-product-component", NewProductComponent);
