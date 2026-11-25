const rules = {
  name: { min: 3, required: true },
  description: { min: 15, required: false },
};

// La imagen es una URL (el backend guarda solo el enlace, hasta 500 caracteres).
// type="url" y maxlength="500" del input ya validan el formato y el largo.

export const validateProductForm = (e) => {
  e.preventDefault();
  const form = e.target;

  Object.entries(rules).forEach(([name, { min, required }]) => {
    const input = form.elements[name];
    const value = input.value.trim();
    const isEmpty = value.length === 0;

    if (isEmpty && !required) {
      input.setCustomValidity("");
    } else if (value.length < min) {
      input.setCustomValidity(`Debe tener al menos ${min} caracteres`);
    } else {
      input.setCustomValidity("");
    }
  });

  form.classList.add("was-validated");

  if (!form.checkValidity()) return;

  const formData = Object.fromEntries(new FormData(form));

  // Sin id: lo asigna el backend al crear el producto
  const product = {
    name: formData.name.trim(),
    price: Number(formData.price),
    currency_price: "$",
    description: formData.description.trim(),
    image: formData.image.trim() || null,
    quantity: Number(formData.stock),
    category: Number(formData.category),
  };

  // main.js escucha este evento: crea el producto en el backend y vuelve a pintar la lista
  document.dispatchEvent(new CustomEvent("product:created", { detail: product }));

  form.reset();
  form.classList.remove("was-validated");
  bootstrap.Modal.getInstance(document.getElementById("createProduct")).hide();
};
