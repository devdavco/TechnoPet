// TEMPORAL: lista en texto plano para probar búsqueda y paginación.
// Se reemplaza cuando esté el componente de tarjetas del equipo
// (debe mantener la función dibujarProductos y el mensaje de "No encontramos...").
class ProductList extends HTMLElement {
  dibujar(productos) {
    this.innerHTML = "";

    // Sin resultados: mostramos el mensaje.
    // Usamos textContent para que lo escrito se muestre como texto y no como HTML.
    if (productos.length === 0) {
      const mensaje = document.createElement("p");
      mensaje.className = "text-center py-5 mb-0";
      mensaje.textContent = `No encontramos productos para '${busqueda.trim()}'`;
      this.appendChild(mensaje);
      return;
    }

    const lista = document.createElement("ul");
    productos.forEach(function (producto) {
      const item = document.createElement("li");
      item.textContent = `${producto.name} - ${producto.currency_price}${producto.price}`;
      lista.appendChild(item);
    });
    this.appendChild(lista);
  }
}

customElements.define("product-list", ProductList);

// La llama actualizarCatalogo() cada vez que cambia la lista
function dibujarProductos(productos) {
  document.querySelector("product-list").dibujar(productos);
}
