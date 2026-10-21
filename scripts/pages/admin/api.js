const PRODUCTS_URL = "./data/productos.json";

// Trae la lista de productos desde el JSON
export async function getProducts() {
  try {
    const response = await fetch(PRODUCTS_URL);

    // Si el archivo no existe o el servidor falla, lanzamos un error
    if (!response.ok) throw new Error("Error al cargar los productos");

    const products = await response.json();
    return products;
  } catch (error) {
    console.log("Hubo un error al buscar los productos: ", error.message);
    return [];
  }
}

// Las categorías se cargan con getCategories de services/api_categories.js,
// que también usan la home y el formulario de crear producto.
