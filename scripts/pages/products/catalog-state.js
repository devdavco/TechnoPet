import { obtenerProductos } from "../../../services/api_products.js";
import {dibujarProductos} from "./product-list.js"
import {dibujarPaginacion} from "./catalog-pagination.js"
import  {buscarProductos}from "./catalog-search.js"

// Datos compartidos del catálogo (los usan la búsqueda y la paginación)
let todosLosProductos = [];
export let busqueda = "";
export let pagina = 1;

export const PRODUCTOS_POR_PAGINA = 6;

// Busca, corta la página actual y vuelve a dibujar
function actualizarCatalogo() {
  const resultados = buscarProductos(todosLosProductos, busqueda);

  const inicio = (pagina - 1) * PRODUCTOS_POR_PAGINA;
  const productosPagina = resultados.slice(inicio, inicio + PRODUCTOS_POR_PAGINA);

  dibujarProductos(productosPagina);
  dibujarPaginacion(resultados.length);
}

// Cambia la página desde los controles de paginación y vuelve a dibujar el catálogo.
export function cambiarPagina(nuevaPagina) {
  pagina = nuevaPagina;
  actualizarCatalogo();
}

// Actualiza el término de búsqueda y vuelve a la primera página.
export function buscarEnCatalogo(texto) {
  busqueda = texto;
  pagina = 1;
  actualizarCatalogo();
}

// Al abrir la página: cargamos los productos y dibujamos
async function iniciarCatalogo() {
  todosLosProductos = await obtenerProductos();
  actualizarCatalogo();
}

document.addEventListener("DOMContentLoaded", iniciarCatalogo);
