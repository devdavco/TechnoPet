import { isActive, formatPrice, getCategoryName, shortDescription } from "./utils.js";

const PLACEHOLDER_IMAGE = "./assets/favicon/favicon.svg";
const LOW_STOCK_LIMIT = 5;

// Contenedores de la lista
const tableBody = document.getElementById("products-table-body");
const cardsContainer = document.getElementById("products-cards");
const productsCount = document.getElementById("products-count");

// Partes del modal
const modalElement = document.getElementById("admin-modal");
const modalTitle = document.getElementById("admin-modal-title");
const modalDetail = document.getElementById("modal-detail");
const productForm = document.getElementById("product-form");
const modalDelete = document.getElementById("modal-delete");
const deleteProductName = document.getElementById("delete-product-name");
const cancelButton = document.getElementById("cancel-button");
const saveButton = document.getElementById("save-button");
const confirmDeleteButton = document.getElementById("confirm-delete-button");
const categorySelect = document.getElementById("product-category");

// Toast
const toastElement = document.getElementById("admin-toast");
const toastBody = document.getElementById("admin-toast-body");

// Bootstrap ya está cargado antes que este archivo (ver el orden de los scripts en admin.html)
const modal = new bootstrap.Modal(modalElement);
const toast = new bootstrap.Toast(toastElement);

/* ===== Badges y clases ===== */

function createStockBadge(quantity) {
  if (quantity <= 0) {
    return `<span class="badge text-bg-danger ms-2">Agotado</span>`;
  }
  if (quantity <= LOW_STOCK_LIMIT) {
    return `<span class="badge text-bg-warning ms-2">Stock bajo</span>`;
  }
  return "";
}

function createHiddenBadge(product) {
  if (isActive(product)) return "";
  return `<span class="badge text-bg-secondary ms-2">Oculto</span>`;
}

// Los productos ocultos se ven más tenues (no se aplica a los botones, para que el menú se vea bien)
function getMutedClass(product) {
  if (isActive(product)) return "";
  return "opacity-50";
}

// Si el producto no tiene imagen usamos la imagen por defecto
function getImage(product) {
  return product.image || PLACEHOLDER_IMAGE;
}

/* ===== Botones de acciones (iguales en la tabla y en las tarjetas) ===== */

function createActionsHTML(product) {
  // El texto e ícono del menú cambian según si el producto está visible u oculto
  const toggleText = isActive(product) ? "Ocultar en tienda" : "Mostrar en tienda";
  const toggleIcon = isActive(product) ? "bi-eye-slash" : "bi-eye";

  // data-id guarda el id del producto para saber a cuál pertenece cada botón.
  // data-bs-popper-config hace que el menú no se corte dentro de la tabla.
  return `
    <div class="d-flex align-items-center gap-1">
      <button type="button" class="btn btn-sm btn-outline-secondary btn-view"
        data-id="${product.id}" aria-label="Ver ${product.name}">
        <i class="bi bi-eye" aria-hidden="true"></i>
      </button>
      <button type="button" class="btn btn-sm btn-outline-secondary btn-edit"
        data-id="${product.id}" aria-label="Editar ${product.name}">
        <i class="bi bi-pencil" aria-hidden="true"></i>
      </button>
      <div class="dropdown">
        <button type="button" class="btn btn-sm btn-outline-secondary"
          data-bs-toggle="dropdown" data-bs-popper-config='{"strategy":"fixed"}'
          aria-expanded="false" aria-label="Más acciones para ${product.name}">
          <i class="bi bi-three-dots-vertical" aria-hidden="true"></i>
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
          <li>
            <button type="button" class="dropdown-item btn-toggle" data-id="${product.id}">
              <i class="bi ${toggleIcon} me-2" aria-hidden="true"></i>${toggleText}
            </button>
          </li>
          <li>
            <button type="button" class="dropdown-item btn-duplicate" data-id="${product.id}">
              <i class="bi bi-copy me-2" aria-hidden="true"></i>Duplicar
            </button>
          </li>
          <li><hr class="dropdown-divider" /></li>
          <li>
            <button type="button" class="dropdown-item text-danger btn-delete" data-id="${product.id}">
              <i class="bi bi-trash me-2" aria-hidden="true"></i>Eliminar
            </button>
          </li>
        </ul>
      </div>
    </div>
  `;
}

/* ===== Tabla (escritorio) ===== */

function createRowHTML(product, categories) {
  const muted = getMutedClass(product);

  return `
    <tr>
      <td class="${muted}">
        <img src="${getImage(product)}" alt="${product.name}" width="48" height="48"
          class="rounded-2 object-fit-cover bg-neutral-cream" />
      </td>
      <td class="fw-semibold ${muted}">${product.name}${createHiddenBadge(product)}</td>
      <td class="${muted}">${getCategoryName(product.category, categories)}</td>
      <td class="text-nowrap ${muted}">${product.quantity}${createStockBadge(product.quantity)}</td>
      <td class="text-nowrap ${muted}">${formatPrice(product)}</td>
      <td class="text-secondary ${muted}" title="${product.description}">
        ${shortDescription(product.description)}
      </td>
      <td>${createActionsHTML(product)}</td>
    </tr>
  `;
}

function renderTable(products, categories) {
  if (products.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-secondary py-4">No hay productos para mostrar.</td>
      </tr>
    `;
    return;
  }

  let rows = "";
  for (const product of products) {
    rows += createRowHTML(product, categories);
  }
  tableBody.innerHTML = rows;
}

/* ===== Tarjetas (móvil) ===== */

function createCardHTML(product, categories) {
  const muted = getMutedClass(product);

  return `
    <div class="card border-0 shadow-sm rounded-4">
      <div class="card-body d-flex gap-3">
        <img src="${getImage(product)}" alt="${product.name}" width="64" height="64"
          class="rounded-2 object-fit-cover bg-neutral-cream flex-shrink-0 ${muted}" />
        <div class="flex-grow-1">
          <div class="${muted}">
            <h3 class="fs-6 fw-semibold mb-0">${product.name}${createHiddenBadge(product)}</h3>
            <p class="small text-secondary mb-2">${getCategoryName(product.category, categories)}</p>
            <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
              <span class="fw-semibold">${formatPrice(product)}</span>
              <span class="small text-nowrap">Stock: ${product.quantity}${createStockBadge(product.quantity)}</span>
            </div>
            <p class="small text-secondary text-clamp-2 mb-3">${shortDescription(product.description)}</p>
          </div>
          ${createActionsHTML(product)}
        </div>
      </div>
    </div>
  `;
}

function renderCards(products, categories) {
  if (products.length === 0) {
    cardsContainer.innerHTML = `
      <p class="text-center text-secondary py-4 mb-0">No hay productos para mostrar.</p>
    `;
    return;
  }

  let cards = "";
  for (const product of products) {
    cards += createCardHTML(product, categories);
  }
  cardsContainer.innerHTML = cards;
}

// Pinta la tabla, las tarjetas y el contador con la misma lista
export function renderProducts(products, categories) {
  renderTable(products, categories);
  renderCards(products, categories);
  productsCount.textContent = products.length;
}

// Llena el <select> del formulario con las categorías del JSON
export function renderCategoryOptions(categories) {
  let options = `<option value="" disabled selected>Selecciona…</option>`;

  for (const category of categories) {
    options += `<option value="${category.id}">${category.title}</option>`;
  }

  categorySelect.innerHTML = options;
}

/* ===== Modal ===== */

// Muestra u oculta un elemento con la clase d-none de Bootstrap
function showElement(element, visible) {
  if (visible) {
    element.classList.remove("d-none");
  } else {
    element.classList.add("d-none");
  }
}

// Usamos un solo modal: según la acción mostramos una sección y ocultamos las otras.
// mode puede ser "view", "edit" o "delete".
function openModal(mode, title) {
  modalTitle.textContent = title;

  showElement(modalDetail, mode === "view");
  showElement(productForm, mode === "edit");
  showElement(modalDelete, mode === "delete");
  showElement(saveButton, mode === "edit");
  showElement(confirmDeleteButton, mode === "delete");

  cancelButton.textContent = mode === "view" ? "Cerrar" : "Cancelar";

  modal.show();
}

export function closeModal() {
  modal.hide();
}

export function openDetailModal(product, categories) {
  modalDetail.innerHTML = `
    <div class="card border-0">
      <img src="${getImage(product)}" alt="${product.name}" height="200"
        class="card-img-top object-fit-contain bg-neutral-cream rounded-3 p-3" />
      <div class="card-body px-0">
        <h3 class="fs-5 fw-semibold mb-0">${product.name}${createHiddenBadge(product)}</h3>
        <p class="small text-secondary mb-3">${getCategoryName(product.category, categories)}</p>
        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="fs-5 fw-semibold">${formatPrice(product)}</span>
          <span class="text-nowrap">Stock: ${product.quantity}${createStockBadge(product.quantity)}</span>
        </div>
        <p class="text-secondary mb-0">${product.description}</p>
      </div>
    </div>
  `;

  openModal("view", "Detalle del producto");
}

export function openEditModal() {
  openModal("edit", "Editar producto");
}

export function openDeleteModal(product) {
  deleteProductName.textContent = product.name;
  openModal("delete", "Eliminar producto");
}

/* ===== Toast ===== */

// Mensaje corto abajo a la derecha con el resultado de cada acción
export function showToast(message) {
  toastBody.textContent = message;
  toast.show();
}
