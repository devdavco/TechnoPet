// Único punto de acceso a los productos del catálogo
const API_PRODUCTOS = "./data/productos.json";
const API_CATEGORIAS = "./data/categories.json";

async function obtenerProductos() {
  try {
    const [respuestaCategorias, respuestaProductos] = await Promise.all([
      fetch(API_CATEGORIAS),
      fetch(API_PRODUCTOS),
    ]);
    if (!respuestaCategorias.ok) throw new Error(`Error HTTP: ${respuestaCategorias.status}`);
    if (!respuestaProductos.ok) throw new Error(`Error HTTP: ${respuestaProductos.status}`);

    const datosCategorias = await respuestaCategorias.json();
    const datosProductos = await respuestaProductos.json();

    // Guardamos el nombre de cada categoría por su id (2 -> "Alimentación")
    const nombresCategorias = {};
    datosCategorias.categories.forEach(function (categoria) {
      nombresCategorias[categoria.id] = categoria.title;
    });

    // Cambiamos el número de categoría por su nombre
    const productos = datosProductos.map(function (producto) {
      return {
        ...producto,
        category: nombresCategorias[producto.category] || "General",
        stock: producto.quantity > 0,
      };
    });

    // Sumamos los productos guardados en el navegador
    const productosGuardados = JSON.parse(localStorage.getItem("techno_pet_products")) || [];

    return productos.concat(productosGuardados);
  } catch (error) {
    console.error("No se pudieron cargar los productos:", error);
    return [];
  }
}
