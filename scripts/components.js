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
    /* Componentes comunes */
    loadComponent("header-component", "./layouts/header.html"),
    loadComponent("footer-component", "./layouts/footer.html"),
    loadComponent("header-admin", "./layouts/headerAdmin.html"),
    /* Componentes home page */
    loadComponent("section-hero", "./scripts/pages/home/section-hero.html"),
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
// ===== TECHNOPET: efectos con JavaScript =====
(function () {
  "use strict";

  // 1. Aparecer al hacer scroll
  const SELECTOR = ".card, section h2, section h1, .row.mt-4 > div, main h1";
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  function prepare(root) {
    root.querySelectorAll(SELECTOR).forEach((el, i) => {
      if (el.dataset.revealReady) return;
      el.dataset.revealReady = "1";
      el.classList.add("reveal");
      // Escalonado: cada elemento aparece un poquito después del anterior
      el.style.transitionDelay = (i % 4) * 90 + "ms";
      observer.observe(el);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    prepare(document);

    // Tus componentes (productos, categorías) se dibujan después: los vigilamos
    new MutationObserver(() => prepare(document)).observe(document.body, {
      childList: true,
      subtree: true,
    });

    // 2. Sombra del header al bajar
    const onScroll = () => {
      document
        .querySelectorAll("#header-component, #header-admin")
        .forEach((h) => h.classList.toggle("header-scrolled", window.scrollY > 10));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  });

  // 3. Rebote del carrito: llama a window.bumpCart() cuando agregues un producto
  window.bumpCart = function () {
    const btn = document.querySelector("#header-component [class*='cart'], #header-component .bi-cart, #header-component .bi-cart3");
    if (!btn) return;
    btn.classList.remove("cart-bump");
    void btn.offsetWidth; // reinicia la animación
    btn.classList.add("cart-bump");
  };
})();