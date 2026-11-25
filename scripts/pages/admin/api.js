import { apiFetch } from "../../../services/api.js";

// CRUD de productos contra el backend (/api/productos).
// El panel trabaja con la forma de siempre: { id, name, price, currency_price, description, image, quantity, category }
// donde category es el id de la categoría.

function toAdminProduct(p) {
  return {
    id: p.id,
    name: p.nombre,
    price: p.precio,
    currency_price: "$",
    description: p.descripcion || "",
    image: p.imagen,
    quantity: p.stock,
    category: p.categoriaId,
  };
}

// Forma que espera ProductoDTO en el backend
function toProductoDTO(product) {
  return {
    categoriaId: product.category,
    nombre: product.name,
    descripcion: product.description,
    precio: product.price,
    stock: product.quantity,
    imagen: product.image || null,
  };
}

// Trae la lista de productos. Si falla devuelve [] para que el panel se pueda dibujar igual
export async function getProducts() {
  try {
    const products = await apiFetch("/productos");
    return products.map(toAdminProduct);
  } catch (error) {
    console.log("Hubo un error al buscar los productos: ", error.message);
    return [];
  }
}

// Las siguientes funciones lanzan un Error con el mensaje del backend si algo falla

export async function createProduct(product) {
  const created = await apiFetch("/productos", { method: "POST", body: toProductoDTO(product) });
  return toAdminProduct(created);
}

export async function updateProduct(id, product) {
  const updated = await apiFetch(`/productos/${id}`, { method: "PUT", body: toProductoDTO(product) });
  return toAdminProduct(updated);
}

export async function deleteProduct(id) {
  await apiFetch(`/productos/${id}`, { method: "DELETE" });
}

// Las categorías se cargan con getCategories de services/api_categories.js,
// que también usan la home y el formulario de crear producto.
