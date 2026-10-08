const loadComponent = async (elementId, filePath) => {
  const container = document.getElementById(elementId);
  if (!container) return;

  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(
        `No se pudo cargar el archivo: ${filePath} (Status: ${response.status})`,
      );
    }
    const html = await response.text();
    // Reemplaza el contenedor placeholder por el contenido del componente
    container.outerHTML = html;
  } catch (error) {
    console.error(`[Componentes] Error al cargar ${filePath}:`, error);
    if (window.location.protocol === "file:") {
      console.warn(
        'Usa un servidor local (como Live Server en VS Code o "python -m http.server") para probar.',
      );
    }
  }
};

/**
 * Función principal para cargar los componentes comunes
 */
const loadSharedComponents = async () => {
  return Promise.all([
    loadComponent("header-component", "./layouts/header.html")
  ]);
};

// Cargar automáticamente cuando el DOM esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadSharedComponents);
} else {
  loadSharedComponents();
}

// Exponer funciones globales
if (typeof window !== "undefined") {
  window.loadComponent = loadComponent;
  window.loadSharedComponents = loadSharedComponents;
}
