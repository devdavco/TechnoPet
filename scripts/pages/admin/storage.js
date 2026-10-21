const STORAGE_KEY = "technopet-admin-products";

// Devuelve los productos guardados, o null si todavía no se guardó nada
export function getStoredProducts() {
  const savedText = localStorage.getItem(STORAGE_KEY);

  if (savedText === null) return null;

  // localStorage solo guarda texto, por eso lo convertimos de vuelta a arreglo
  return JSON.parse(savedText);
}

// Guarda la lista completa después de cada cambio
export function saveProducts(products) {
  // localStorage solo guarda texto, por eso convertimos el arreglo a JSON
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));

  // Muestra en consola cómo quedó la lista después del cambio
  console.log("Lista actualizada:\n" + JSON.stringify(products, null, 2));
}
