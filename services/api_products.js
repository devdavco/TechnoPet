// Único punto de acceso a los productos del catálogo
const API_PRODUCTOS = "./data/productos.json";
const API_CATEGORIAS = "./data/categories.json";

// Misma clave que usa admin para guardar la lista (scripts/pages/admin/storage.js)
const CLAVE_PRODUCTOS_ADMIN = "technopet-admin-products";

// Si admin ya guardó productos usamos esa lista; si no, la del JSON
async function cargarListaProductos() {
  const textoGuardado = localStorage.getItem(CLAVE_PRODUCTOS_ADMIN);
  if (textoGuardado !== null) {
    return JSON.parse(textoGuardado);
  }

  const respuesta = await fetch(API_PRODUCTOS);
  if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
  return await respuesta.json();
}

export async function obtenerProductos() {
  try {
    const respuestaCategorias = await fetch(API_CATEGORIAS);
    if (!respuestaCategorias.ok) throw new Error(`Error HTTP: ${respuestaCategorias.status}`);
    const datosCategorias = await respuestaCategorias.json();

    const listaProductos = await cargarListaProductos();

    // Guardamos el nombre de cada categoría por su id (2 -> "Alimentación")
    const nombresCategorias = {};
    datosCategorias.categories.forEach(function (categoria) {
      nombresCategorias[categoria.id] = categoria.title;
    });

    // Quitamos los productos que admin ocultó de la tienda
    const productosVisibles = listaProductos.filter(function (producto) {
      return producto.active !== false;
    });

    // Cambiamos el número de categoría por su nombre
    return productosVisibles.map(function (producto) {
      return {
        ...producto,
        category: nombresCategorias[producto.category] || "General",
        stock: producto.quantity > 0,
      };
    });
  } catch (error) {
    console.error("No se pudieron cargar los productos:", error);
    return [];
  }
}
