// Formulario de editar y sus campos (están fijos en admin.html, dentro del modal)
const productForm = document.getElementById("product-form");
const nameInput = document.getElementById("product-name");
const currencyInput = document.getElementById("product-currency");
const priceInput = document.getElementById("product-price");
const quantityInput = document.getElementById("product-quantity");
const categorySelect = document.getElementById("product-category");
const descriptionInput = document.getElementById("product-description");

// Botón del modal de eliminar
const confirmDeleteButton = document.getElementById("confirm-delete-button");

/* ===== Botones de cada producto =====
   Estos botones se crean con JavaScript cada vez que se pinta la lista,
   por eso no se pueden seleccionar al inicio del archivo: hay que buscarlos
   después de cada render. querySelectorAll encuentra los de la tabla y los de las tarjetas. */

function setupButtonsEvent(selector, callback) {
  const buttons = document.querySelectorAll(selector);

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      // data-id es texto, lo convertimos a número para compararlo con product.id
      callback(Number(button.dataset.id));
    });
  });
}

export function setupViewEvent(callback) {
  setupButtonsEvent(".btn-view", callback);
}

export function setupEditEvent(callback) {
  setupButtonsEvent(".btn-edit", callback);
}

export function setupToggleEvent(callback) {
  setupButtonsEvent(".btn-toggle", callback);
}

export function setupDuplicateEvent(callback) {
  setupButtonsEvent(".btn-duplicate", callback);
}

export function setupDeleteEvent(callback) {
  setupButtonsEvent(".btn-delete", callback);
}

/* ===== Botones fijos del modal (se configuran una sola vez) ===== */

// El botón "Guardar cambios" está fuera del <form> pero tiene form="product-form",
// así que al presionarlo se dispara el evento submit del formulario
export function setupSaveEvent(callback) {
  productForm.addEventListener("submit", callback);
}

export function setupConfirmDeleteEvent(callback) {
  confirmDeleteButton.addEventListener("click", callback);
}

/* ===== Evento del formulario de crear producto (lo dispara otro archivo) ===== */

export function setupProductCreatedEvent(callback) {
  document.addEventListener("product:created", callback);
}

/* ===== Formulario ===== */

// Carga los datos del producto en los campos para editarlos
export function fillProductForm(product) {
  // Quitamos los mensajes de error de la vez anterior
  productForm.classList.remove("was-validated");

  nameInput.value = product.name;
  currencyInput.value = product.currency_price;
  priceInput.value = product.price;
  quantityInput.value = product.quantity;
  categorySelect.value = product.category;
  descriptionInput.value = product.description;
}

// Usa la validación de Bootstrap: si algo está mal, marca los campos en rojo
export function isProductFormValid() {
  if (!productForm.checkValidity()) {
    productForm.classList.add("was-validated");
    return false;
  }
  return true;
}

// Lee los campos y devuelve un objeto con la misma estructura del JSON
export function getProductFormData() {
  return {
    name: nameInput.value.trim(),
    price: Number(priceInput.value),
    currency_price: currencyInput.value.trim(),
    description: descriptionInput.value.trim(),
    quantity: Number(quantityInput.value),
    category: Number(categorySelect.value),
  };
}
