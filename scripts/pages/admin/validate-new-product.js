const rules = {
  name: { min: 3, required: true },
  description: { min: 15, required: false },
};

const IMAGE = {
  types: ["image/png", "image/jpeg", "image/webp"],
  maxSize: 5 * 1024 * 1024, // 5MB
  minWidth: 800,
  minHeight: 800,
};

const getImageSize = (file) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = url;
  });

const validateImage = async (input) => {
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
    } else {
      try {
        const { width, height } = await getImageSize(file);
        if (width < IMAGE.minWidth || height < IMAGE.minHeight) {
          error = `La imagen debe medir al menos ${IMAGE.minWidth}×${IMAGE.minHeight}px.`;
        }
      } catch {
        error = "No se pudo leer la imagen.";
      }
    }
  }

  input.setCustomValidity(error);
  feedback.textContent = error;
  zone.classList.toggle("is-invalid", Boolean(error));
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

  await validateImage(form.elements.image);

  form.classList.add("was-validated");

  if (!form.checkValidity()) return;

  const data = Object.fromEntries(new FormData(form));
  console.log("Producto válido:", data);

  form.reset();
  form.classList.remove("was-validated");
  bootstrap.Modal.getInstance(document.getElementById("createProduct")).hide();
};