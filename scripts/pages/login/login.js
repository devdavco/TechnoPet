import { iniciarSesion, haySesionAdmin } from "../../auth/auth.js";

// Si ya hay sesión iniciada, vamos directo al panel
if (haySesionAdmin()) {
  window.location.replace("./admin.html");
}

// Mostrar / ocultar contraseña
const passwordInput = document.getElementById("login-password");
const toggleButton = document.getElementById("toggle-password");

toggleButton.addEventListener("click", () => {
  const isHidden = passwordInput.type === "password";
  passwordInput.type = isHidden ? "text" : "password";
  toggleButton.textContent = isHidden ? "Ocultar" : "Mostrar";
});

// "¿Olvidaste tu contraseña?" todavía no está disponible
const forgotLink = document.getElementById("forgot-password");
const forgotMessage = document.getElementById("forgot-message");

forgotLink.addEventListener("click", (event) => {
  event.preventDefault();
  forgotMessage.classList.remove("d-none");
});

// Validación del formulario (estilos de Bootstrap) e inicio de sesión
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  loginError.classList.add("d-none");

  if (!loginForm.checkValidity()) {
    loginForm.classList.add("was-validated");
    return;
  }

  const email = document.getElementById("login-email").value;
  const remember = document.getElementById("login-remember").checked;

  if (iniciarSesion(email, passwordInput.value, remember)) {
    window.location.href = "./admin.html";
  } else {
    loginError.classList.remove("d-none");
  }
});
