import { obtenerProductos } from "../../../services/api_products.js";
import { buscarProductos } from "./catalog-search.js";
import { filtrarProductos, prepararFiltros } from "./filters-component.js";
import { ordenarProductos, dibujarResumen } from "./order-component.js";
import { dibujarProductos } from "./product-list.js";
import { dibujarPaginacion } from "./catalog-pagination.js";

// Datos compartidos del catálogo.
// Los componentes los cambian con las funciones de abajo, solo cuando el usuario hace algo
// (nunca al cargarse, porque en ese momento este archivo todavía no terminó de cargar).
let todosLosProductos = [];
export let busqueda = "";
export let pagina = 1;
export let filtros = { categorias: [], precioMax: null, soloDisponibles: false };
export let orden = "recomendado";

export const PRODUCTOS_POR_PAGINA = 6;

// Recalcula la lista y vuelve a dibujar.
// Orden: productos -> búsqueda -> filtros -> orden -> paginación -> dibujar
function actualizarCatalogo() {
  let productos = buscarProductos(todosLosProductos, busqueda);
  productos = filtrarProductos(productos, filtros);
  productos = ordenarProductos(productos, orden);

  const total = productos.length;
  const inicio = (pagina - 1) * PRODUCTOS_POR_PAGINA;
  const productosPagina = productos.slice(inicio, inicio + PRODUCTOS_POR_PAGINA);

  dibujarProductos(productosPagina);
  dibujarResumen(inicio + 1, inicio + productosPagina.length, total);
  dibujarPaginacion(total);
}

// Cambia la página desde los controles de paginación
export function cambiarPagina(nuevaPagina) {
  pagina = nuevaPagina;
  actualizarCatalogo();
}

// Actualiza el texto buscado y vuelve a la primera página
export function buscarEnCatalogo(texto) {
  busqueda = texto;
  pagina = 1;
  actualizarCatalogo();
}

// Aplica los filtros del panel y vuelve a la primera página
export function filtrarEnCatalogo(nuevosFiltros) {
  filtros = nuevosFiltros;
  pagina = 1;
  actualizarCatalogo();
}

// Cambia el orden y vuelve a la primera página
export function ordenarCatalogo(nuevoOrden) {
  orden = nuevoOrden;
  pagina = 1;
  actualizarCatalogo();
}

// Al abrir la página: cargamos los productos, preparamos los filtros y dibujamos
async function iniciarCatalogo() {
  todosLosProductos = await obtenerProductos();

  // Si la URL trae ?q=texto, empezamos con esa búsqueda
  const textoUrl = new URLSearchParams(window.location.search).get("q");
  if (textoUrl) {
    busqueda = textoUrl;
  }

  prepararFiltros(todosLosProductos);
  actualizarCatalogo();
}

document.addEventListener("DOMContentLoaded", iniciarCatalogo);
