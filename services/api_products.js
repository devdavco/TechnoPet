import { apiFetch } from "./api.js";

// Único punto de acceso a los productos del catálogo (backend: GET /api/productos)

// Convierte un ProductoDTO del backend a la forma que usan las tarjetas, filtros y carrito
function aProductoTienda(p) {
  return {
    id: p.id,
    name: p.nombre,
    price: p.precio,
    currency_price: "$",
    description: p.descripcion || "",
    image: p.imagen,
    quantity: p.stock,
    category: p.categoriaNombre || "General",
    stock: p.stock > 0,
  };
}

export async function obtenerProductos() {
  try {
    const productos = await apiFetch("/productos");
    return productos.map(aProductoTienda);
  } catch (error) {
    console.error("No se pudieron cargar los productos:", error);
    return [];
  }
}

// Evento que avisa a la tienda que cambió el stock (por ejemplo, después de una compra)
export const EVENTO_PRODUCTOS = "productos:actualizados";

// Crea el pedido del usuario y le agrega cada producto del carrito.
// El backend descuenta el stock al agregar cada producto.
// carrito: [{ id: "3", cantidad: 2 }, ...]. Lanza un Error si algo falla.
export async function finalizarPedido(usuarioId, carrito) {
  const pedido = await apiFetch("/pedidos", { method: "POST", body: { usuarioId } });
  try {
    for (const item of carrito) {
      await apiFetch("/detalle-pedidos", {
        method: "POST",
        body: { pedidoId: pedido.id, productoId: Number(item.id), cantidad: item.cantidad },
      });
    }
  } finally {
    // Aunque falle un producto, otros ya pudieron descontar stock: avisamos para recargar
    document.dispatchEvent(new CustomEvent(EVENTO_PRODUCTOS));
  }
  return pedido;
}
