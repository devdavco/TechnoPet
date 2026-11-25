import { apiFetch } from "./api.js";

// El backend no guarda íconos: los asignamos por id (mismo orden que database/inserts.sql)
const ICONOS = {
  1: "bi bi-joystick",
  2: "bi bi-egg-fried",
  3: "bi bi-geo-alt",
  4: "bi bi-heart-pulse",
};

// Trae las categorías del backend con la forma que usa el front: { id, title, description, icon }
export const getCategories = async () => {
  try {
    const categorias = await apiFetch("/categorias");
    return categorias.map((categoria) => ({
      id: categoria.id,
      title: categoria.nombre,
      description: categoria.descripcion || "",
      icon: ICONOS[categoria.id] || "bi bi-tag",
    }));
  } catch (error) {
    console.error("No se pudieron cargar las categorías:", error);
    return [];
  }
};
