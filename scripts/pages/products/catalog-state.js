// Datos compartidos del catálogo (los usan la búsqueda y la paginación)
let todosLosProductos = [];
let busqueda = "";
let pagina = 1;

const PRODUCTOS_POR_PAGINA = 6;

// Busca, corta la página actual y vuelve a dibujar
function actualizarCatalogo() {
  const resultados = buscarProductos(todosLosProductos, busqueda);

  const inicio = (pagina - 1) * PRODUCTOS_POR_PAGINA;
  const productosPagina = resultados.slice(inicio, inicio + PRODUCTOS_POR_PAGINA);

  dibujarProductos(productosPagina);
  dibujarPaginacion(resultados.length);
}

// Al abrir la página: cargamos los productos y dibujamos
async function iniciarCatalogo() {
  todosLosProductos = await obtenerProductos();
  actualizarCatalogo();
}

document.addEventListener("DOMContentLoaded", iniciarCatalogo);
