document.addEventListener("DOMContentLoaded", async () => {
  const catalogContainer = document.getElementById("catalog-container");

  if (!catalogContainer) return;

  try {

    const [categoriesResponse, productsResponse] = await Promise.all([
      fetch('./data/categories.json'),
      fetch('./data/productos.json')
    ]);

    const categoriesData = await categoriesResponse.json();
    const productsData = await productsResponse.json();

    const categoriesMap = {};
    const categoriesList = categoriesData.categories || categoriesData;
    categoriesList.forEach(cat => {
      categoriesMap[cat.id] = cat.title;
    });

    const baseProducts = productsData.map(product => ({
      ...product,
      category: categoriesMap[product.category] || "General",
      stock: product.quantity > 0,
    }));

    const storedProducts = JSON.parse(localStorage.getItem("techno_pet_products")) || [];

    const allProducts = [...baseProducts, ...storedProducts];

    if (typeof createProductCard === "function") {
      if (allProducts.length === 0) {
        catalogContainer.innerHTML = `
          <div class="col-12 text-center py-5">
            <p class="text-muted">No hay productos disponibles en este momento.</p>
          </div>
        `;
        return;
      }

      catalogContainer.innerHTML = allProducts.map(product => createProductCard(product)).join("");
    } else {
      console.error("Error: No se encontró la función createProductCard.");
    }

  } catch (error) {
    console.error("Error al cargar los datos del catálogo:", error);
    catalogContainer.innerHTML = `
      <div class="col-12 text-center py-5">
        <p class="text-danger">Hubo un error al cargar los productos del catálogo.</p>
      </div>
    `;
  }
});