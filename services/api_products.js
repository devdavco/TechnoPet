const KEY = "products";

export const getProducts = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? [];
  } catch {
    return [];
  }
};

export const saveProduct = (product) => {
  const products = getProducts();
  products.push(product);

  try {
    localStorage.setItem(KEY, JSON.stringify(products));
    return true;
  } catch (error) {
    console.error("No se pudo guardar el producto:", error);
    return false;
  }
};