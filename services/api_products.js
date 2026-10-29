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

// Evento que avisa a la tienda que cambió el stock (por ejemplo, después de una compra)
export const EVENTO_PRODUCTOS = "productos:actualizados";

// Resta del stock las unidades compradas y guarda la lista para que admin la vea.
// carrito: [{ id: "3", cantidad: 2 }, ...]. Devuelve true si se guardó.
export async function descontarStock(carrito) {
  try {
    // Lista original (con productos ocultos y categorías como número), no la de obtenerProductos()
    const lista = await cargarListaProductos();

    carrito.forEach(function (item) {
      const producto = lista.find(function (p) {
        return String(p.id) === item.id;
      });
      if (producto) {
        producto.quantity = Math.max(0, (Number(producto.quantity) || 0) - item.cantidad);
      }
    });

    localStorage.setItem(CLAVE_PRODUCTOS_ADMIN, JSON.stringify(lista));
    document.dispatchEvent(new CustomEvent(EVENTO_PRODUCTOS));
    return true;
  } catch (error) {
    console.error("No se pudo actualizar el stock:", error);
    return false;
  }
}