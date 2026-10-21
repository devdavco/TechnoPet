import { getProducts, getCategories } from "./api.js";
import { getStoredProducts, saveProducts } from "./storage.js";
import { isActive, findProductById, generateId } from "./utils.js";
import {
  renderProducts,
  renderCategoryOptions,
  openDetailModal,
  openEditModal,
  openDeleteModal,
  closeModal,
  showToast,
} from "./dom.js";
import {
  setupViewEvent,
  setupEditEvent,
  setupToggleEvent,
  setupDuplicateEvent,
  setupDeleteEvent,
  setupSaveEvent,
  setupConfirmDeleteEvent,
  setupProductCreatedEvent,
  fillProductForm,
  isProductFormValid,
  getProductFormData,
} from "./events.js";

let products = [];
let categories = [];

// Id del producto que se está editando o eliminando en el modal
let editingId = null;

// Pinta la lista y conecta los botones nuevos.
// Se llama después de cada cambio, porque al pintar se crean botones nuevos.
function renderAll() {
  renderProducts(products, categories);

  setupViewEvent(handleView);
  setupEditEvent(handleEdit);
  setupToggleEvent(handleToggle);
  setupDuplicateEvent(handleDuplicate);
  setupDeleteEvent(handleDelete);
}

// Guarda en localStorage y vuelve a pintar
function saveAndRender() {
  saveProducts(products);
  renderAll();
}

/* ===== Acciones ===== */

function handleView(id) {
  const product = findProductById(products, id);
  if (!product) return;

  openDetailModal(product, categories);
}

function handleEdit(id) {
  const product = findProductById(products, id);
  if (!product) return;

  editingId = id;
  fillProductForm(product);
  openEditModal();
}

function handleSave(event) {
  // Evita que el formulario recargue la página
  event.preventDefault();

  if (!isProductFormValid()) return;

  const product = findProductById(products, editingId);
  if (!product) return;

  // Copiamos los datos del formulario al producto (el id, la imagen y "active" no cambian)
  const formData = getProductFormData();
  product.name = formData.name;
  product.price = formData.price;
  product.currency_price = formData.currency_price;
  product.description = formData.description;
  product.quantity = formData.quantity;
  product.category = formData.category;

  editingId = null;
  closeModal();
  saveAndRender();
  showToast("Producto actualizado");
}

function handleToggle(id) {
  const product = findProductById(products, id);
  if (!product) return;

  // Si estaba visible lo ocultamos, y al revés
  product.active = !isActive(product);

  saveAndRender();

  if (product.active) {
    showToast("Producto visible en la tienda");
  } else {
    showToast("Producto oculto en la tienda");
  }
}

function handleDuplicate(id) {
  const product = findProductById(products, id);
  if (!product) return;

  // { ...product } crea una copia del objeto; luego cambiamos el id y el nombre
  const copy = { ...product, id: generateId(products), name: product.name + " (copia)" };
  products.push(copy);

  saveAndRender();
  showToast("Producto duplicado");
}

// Solo abre el modal de confirmación; se elimina en handleConfirmDelete
function handleDelete(id) {
  const product = findProductById(products, id);
  if (!product) return;

  editingId = id;
  openDeleteModal(product);
}

function handleConfirmDelete() {
  // Dejamos en la lista todos los productos menos el que se va a eliminar
  products = products.filter((product) => product.id !== editingId);

  editingId = null;
  closeModal();
  saveAndRender();
  showToast("Producto eliminado");
}

/*
  Producto nuevo desde el formulario de crear (lo hace otro compañero).
  El formulario debe disparar este evento con el producto en "detail":

    document.dispatchEvent(new CustomEvent("product:created", { detail: product }));

  El objeto product debe tener la misma estructura que data/products.json:
    {
      "id": 6,                 // opcional: si no viene, se genera aquí
      "name": "Arenero automático",
      "price": 12500,
      "currency_price": "$",
      "description": "Arenero autolimpiable",
      "quantity": 2,
      "category": 4            // id de data/categories.json
    }
*/
function handleProductCreated(event) {
  const product = event.detail;
  if (!product) return;

  if (!product.id) {
    product.id = generateId(products);
  }

  products.push(product);
  saveAndRender();
}

/* ===== Inicio ===== */

async function init() {
  categories = await getCategories();

  // Si hay productos guardados en localStorage los usamos; si no, los traemos del JSON
  const storedProducts = getStoredProducts();
  if (storedProducts !== null) {
    products = storedProducts;
  } else {
    products = await getProducts();
  }

  console.log("Productos cargados:\n" + JSON.stringify(products, null, 2));

  renderCategoryOptions(categories);
  renderAll();

  // Estos botones están fijos en admin.html, por eso se configuran una sola vez
  setupSaveEvent(handleSave);
  setupConfirmDeleteEvent(handleConfirmDelete);
  setupProductCreatedEvent(handleProductCreated);
}

init();
