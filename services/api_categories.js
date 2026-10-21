const API_URL = "./data/categories.json";
export const getCategories = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    const data = await response.json();
    return data.categories;
  } catch (error) {
    console.error("No se pudieron cargar las categorías:", error);
    return [];
  }
};
