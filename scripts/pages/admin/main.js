import { getProducts, createProduct, updateProduct, deleteProduct } from "./api.js";
import { getCategories } from "../../../services/api_categories.js";
import { findProductById, filterProducts } from "./utils.js";
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

// Texto del buscador del header (layouts/headerAdmin.html)
let searchText = "";

// Pinta la lista y conecta los botones nuevos.
// Se llama después de cada cambio, porque al pintar se crean botones nuevos.
function renderAll() {
  renderProducts(filterProducts(products, searchText, categories), categories, products.length);

  setupViewEvent(handleView);
  setupEditEvent(handleEdit);
  setupDuplicateEvent(handleDuplicate);
  setupDeleteEvent(handleDelete);
}

// Muestra el error del backend en el toast
function showError(action, error) {
  console.error(`No se pudo ${action}:`, error);
  showToast(`No se pudo ${action}: ${error.message}`);
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

async function handleSave(event) {
  // Evita que el formulario recargue la página
  event.preventDefault();

  if (!isProductFormValid()) return;

  const product = findProductById(products, editingId);
  if (!product) return;

  // Datos del formulario + los que no se editan aquí (id e imagen)
  const changes = { ...product, ...getProductFormData() };

  try {
    const updated = await updateProduct(editingId, changes);
    products = products.map((p) => (p.id === updated.id ? updated : p));
  } catch (error) {
    showError("actualizar el producto", error);
    return;
  }

  editingId = null;
  closeModal();
  renderAll();
  showToast("Producto actualizado");
}

async function handleDuplicate(id) {
  const product = findProductById(products, id);
  if (!product) return;

  try {
    const copy = await createProduct({ ...product, name: product.name + " (copia)" });
    products.push(copy);
  } catch (error) {
    showError("duplicar el producto", error);
    return;
  }

  renderAll();
  showToast("Producto duplicado");
}

// Solo abre el modal de confirmación; se elimina en handleConfirmDelete
function handleDelete(id) {
  const product = findProductById(products, id);
  if (!product) return;

  editingId = id;
  openDeleteModal(product);
}

async function handleConfirmDelete() {
  try {
    await deleteProduct(editingId);
  } catch (error) {
    // Por ejemplo, si el producto ya está en algún pedido la base de datos no deja borrarlo
    showError("eliminar el producto", error);
    return;
  }

  // Dejamos en la lista todos los productos menos el que se eliminó
  products = products.filter((product) => product.id !== editingId);

  editingId = null;
  closeModal();
  renderAll();
  showToast("Producto eliminado");
}

/*
  Producto nuevo desde el formulario de crear (validate-new-product.js).
  El formulario dispara este evento con el producto en "detail":

    document.dispatchEvent(new CustomEvent("product:created", { detail: product }));

  El objeto product tiene esta estructura (el id lo asigna el backend):
    {
      "name": "Arenero automático",
      "price": 150000,
      "currency_price": "$",
      "description": "Arenero autolimpiable",   // puede venir vacío
      "image": "https://...",                   // URL de la imagen, o null
      "quantity": 2,
      "category": 4            // id de la categoría
    }
*/
async function handleProductCreated(event) {
  const product = event.detail;
  if (!product) return;

  try {
    const created = await createProduct(product);
    products.push(created);
  } catch (error) {
    showError("crear el producto", error);
    return;
  }

  renderAll();
  showToast("Producto creado");
}

/* ===== Inicio ===== */

async function init() {
  categories = await getCategories();
  products = await getProducts();

  renderCategoryOptions(categories);
  renderAll();

  // Estos botones están fijos en admin.html, por eso se configuran una sola vez
  setupSaveEvent(handleSave);
  setupConfirmDeleteEvent(handleConfirmDelete);
  setupProductCreatedEvent(handleProductCreated);
}

// El buscador está en el header, que se carga después (components.js); por eso escuchamos en document
document.addEventListener("input", (event) => {
  if (event.target.id !== "admin-search") return;

  searchText = event.target.value;
  renderAll();
});

init();
