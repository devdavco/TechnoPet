// Mostrar / ocultar contraseña
const passwordInput = document.getElementById("login-password");
const toggleButton = document.getElementById("toggle-password");

toggleButton.addEventListener("click", () => {
  const isHidden = passwordInput.type === "password";
  passwordInput.type = isHidden ? "text" : "password";
  toggleButton.textContent = isHidden ? "Ocultar" : "Mostrar";
});

// Validación del formulario (estilos de Bootstrap)
const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!loginForm.checkValidity()) {
    loginForm.classList.add("was-validated");
    return;
  }

  // TODO: conectar con el backend cuando exista
  console.log("Formulario de login válido");
});
