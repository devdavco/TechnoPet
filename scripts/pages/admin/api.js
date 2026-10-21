const PRODUCTS_URL = "./data/productos.json";
const CATEGORIES_URL = "./data/categories.json";

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

// Trae la lista de categorías desde el JSON
export async function getCategories() {
  try {
    const response = await fetch(CATEGORIES_URL);

    if (!response.ok) throw new Error("Error al cargar las categorías");

    const data = await response.json();

    // El arreglo viene dentro de la propiedad "categories", no en la raíz
    return data.categories;
  } catch (error) {
    console.log("Hubo un error al buscar las categorías: ", error.message);
    return [];
  }
}
