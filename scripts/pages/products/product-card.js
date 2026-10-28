export function createProductCard(product, colClass = "col-sm-6 col-md-4") {
    const productImage = product.image || "";
    const currency = product.currency_price || "$";
    const price = Number(product.price || 0).toLocaleString("es-CO", { minimumFractionDigits: 0 });
    const category = product.category || "General";
    
    const stockAvailable = product.quantity !== undefined ? product.quantity > 0 : (product.stock !== false);
    const stockText = stockAvailable ? "En stock" : "Agotado";
    const stockClass = stockAvailable ? "text-success" : "text-danger";

    return `
    <div class="${colClass} mb-4">
        <div class="card h-100 border shadow-sm rounded-0 bg-white">
        
        <!-- Imagen del producto -->
        <div class="bg-light border-bottom d-flex align-items-center justify-content-center p-3 position-relative" style="height: 190px;">
            ${
            productImage
                ? `<img src="${productImage}" class="w-100 h-100 object-fit-contain" alt="${product.name}" onerror="this.onerror=null; this.src='./assets/favicon/favicon.svg'" />`
                    : `<div class="text-secondary small text-center w-100 h-100 d-flex align-items-center justify-content-center border-dashed">
                    <span>Imagen no disponible</span>
                    </div>`
            }
        </div>

        <!-- Cuerpo de la Card -->
        <div class="card-body d-flex flex-column p-3">
            <!-- Categoría -->
            <span class="text-muted small mb-1">${category}</span>

            <!-- Título del producto -->
            <h5 class="card-title fw-bold fs-6 mb-2">${product.name}</h5>

            <!-- Descripción -->
            <p class="card-text text-secondary small flex-grow-1 mb-3">${product.description}</p>

            <!-- Precio y Estado de Stock -->
            <div class="d-flex justify-content-between align-items-center mb-3">
            <span class="fw-bold fs-5 text-dark">${currency}${price}</span>
            <span class="${stockClass} small fw-semibold">${stockText}</span>
            </div>

            <!-- Botón Añadir al carrito -->
            <button class="btn btn-customer w-100 rounded-0 py-2 fw-semibold add-to-cart-btn" data-id="${product.id || ''}" data-stock="${Number(product.quantity) || 0}" ${stockAvailable ? "" : "disabled"}>
            <i class="bi bi-cart-plus me-2"></i>Añadir al carrito
            </button>
        </div>

        </div>
    </div>
    `;
}