// Carrito de compras guardado en localStorage.
// Solo guardamos { id, cantidad } de cada producto; nombre, precio y stock se leen del catálogo.
const CLAVE_CARRITO = "technopet-cart";

// Evento que avisa al ícono y al panel que el carrito cambió
export const EVENTO_CARRITO = "carrito:actualizado";

function avisarCambio() {
  document.dispatchEvent(new CustomEvent(EVENTO_CARRITO));
}

// Devuelve la lista guardada, o una lista vacía si no hay nada o está dañada
export function leerCarrito() {
  try {
    const carrito = JSON.parse(localStorage.getItem(CLAVE_CARRITO));
    return Array.isArray(carrito) ? carrito : [];
  } catch (error) {
    return [];
  }
}

function guardarCarrito(carrito) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
  avisarCambio();
}

// Total de unidades: 2 comederos + 1 collar = 3
export function contarUnidades() {
  let total = 0;
  leerCarrito().forEach(function (item) {
    total += item.cantidad;
  });
  return total;
}

// Suma una unidad. Devuelve false si ya se llegó al stock.
export function agregarAlCarrito(id, stock) {
  const carrito = leerCarrito();
  const item = carrito.find(function (i) {
    return i.id === String(id);
  });
  const cantidadActual = item ? item.cantidad : 0;

  if (cantidadActual >= stock) {
    return false;
  }

  if (item) {
    item.cantidad++;
  } else {
    carrito.push({ id: String(id), cantidad: 1 });
  }

  guardarCarrito(carrito);
  return true;
}

export function cambiarCantidad(id, cantidad) {
  const carrito = leerCarrito();
  carrito.forEach(function (item) {
    if (item.id === String(id)) {
      item.cantidad = cantidad;
    }
  });
  guardarCarrito(carrito);
}

export function quitarDelCarrito(id) {
  const carrito = leerCarrito().filter(function (item) {
    return item.id !== String(id);
  });
  guardarCarrito(carrito);
}

export function vaciarCarrito() {
  guardarCarrito([]);
}

// Revisa el carrito contra el catálogo actual:
// quita los productos que ya no existen o no tienen stock, y ajusta la cantidad al stock.
export function ajustarCarrito(productos) {
  // Si no se pudieron cargar los productos no tocamos nada, para no borrar el carrito por error
  if (productos.length === 0) return;

  const carrito = leerCarrito();
  const ajustado = [];

  carrito.forEach(function (item) {
    const producto = productos.find(function (p) {
      return String(p.id) === item.id;
    });
    const stock = producto ? Number(producto.quantity) || 0 : 0;

    if (stock > 0) {
      ajustado.push({ id: item.id, cantidad: Math.min(item.cantidad, stock) });
    }
  });

  if (JSON.stringify(ajustado) !== JSON.stringify(carrito)) {
    guardarCarrito(ajustado);
  }
}

// Si el carrito cambia en otra pestaña, también actualizamos esta
window.addEventListener("storage", function (evento) {
  if (evento.key === CLAVE_CARRITO || evento.key === null) {
    avisarCambio();
  }
});
