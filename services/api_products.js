// Único punto de acceso a los productos del catálogo
const API_PRODUCTOS = "./data/productos.json";

async function obtenerProductos() {
  try {
    const respuesta = await fetch(API_PRODUCTOS);
    if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
    return await respuesta.json();
  } catch (error) {
    console.error("No se pudieron cargar los productos:", error);
    return [];
  }
}
