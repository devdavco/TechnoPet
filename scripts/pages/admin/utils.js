const DESCRIPTION_LENGTH = 60;

// Si el producto no tiene el campo "active", se considera visible
export function isActive(product) {
  return product.active !== false;
}

// Ejemplo: { currency_price: "$", price: 8900 } → "$8,900"
export function formatPrice(product) {
  return product.currency_price + Number(product.price).toLocaleString("es-MX");
}

// El producto solo trae el id de la categoría; aquí buscamos su nombre
export function getCategoryName(categoryId, categories) {
  const category = categories.find((item) => item.id === Number(categoryId));

  if (category) return category.title;
  return "Sin categoría";
}

// Busca un producto por su id
export function findProductById(products, id) {
  return products.find((product) => product.id === id);
}

// El nuevo id es el id más alto de la lista + 1
export function generateId(products) {
  let maxId = 0;

  for (const product of products) {
    if (product.id > maxId) maxId = product.id;
  }

  return maxId + 1;
}

// Corta la descripción para que la tabla no quede muy larga
export function shortDescription(text) {
  if (text.length <= DESCRIPTION_LENGTH) return text;
  return text.slice(0, DESCRIPTION_LENGTH).trim() + "…";
}
