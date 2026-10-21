import { saveProduct, getProducts } from "../../../services/api_products.js";

const rules = {
  name: { min: 3, required: true },
  description: { min: 15, required: false },
};

const IMAGE = {
  types: ["image/png", "image/jpeg", "image/webp"],
  maxSize: 5 * 1024 * 1024, // 5MB
};

// Redimensiona y comprime la imagen para que quepa en localStorage
const fileToDataURL = (file, maxSize = 800) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);

      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.8));
    };

    img.onerror = reject;
    img.src = url;
  });

const validateImage = (input) => {
  const zone = input.form.querySelector(".dropzone");
  const feedback = input.form.querySelector(".dropzone-feedback");
  const file = input.files[0];
  let error = "";

  // La imagen es opcional
  if (file) {
    if (!IMAGE.types.includes(file.type)) {
      error = "Formato no permitido. Usa PNG, JPG o WebP.";
    } else if (file.size > IMAGE.maxSize) {
      error = "La imagen supera los 5MB.";
    }
  }

  input.setCustomValidity(error);
  feedback.textContent = error;
  zone.classList.toggle("is-invalid", Boolean(error));
};

const getNextId = () => {
  const products = getProducts();
  return products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1;
};

export const validateProductForm = async (e) => {
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

  validateImage(form.elements.image);

  form.classList.add("was-validated");

  if (!form.checkValidity()) return;

  const formData = Object.fromEntries(new FormData(form));
  const file = form.elements.image.files[0];

  const product = {
    id: getNextId(),
    name: formData.name.trim(),
    category: Number(formData.category),
    price: Number(formData.price),
    stock: Number(formData.stock),
    description: formData.description.trim(),
    image: file ? await fileToDataURL(file) : null,
    createdAt: new Date().toISOString(),
  };

  if (!saveProduct(product)) {
    alert("No hay espacio suficiente para guardar el producto.");
    return;
  }

  // Avisa a otros componentes (ej. la tabla) que hay datos nuevos
  document.dispatchEvent(new CustomEvent("products:updated"));

  form.reset();
  form.classList.remove("was-validated");
  bootstrap.Modal.getInstance(document.getElementById("createProduct")).hide();
};
