import { iniciarSesion, obtenerSesion } from "../../auth/auth.js";

// Si ya hay sesión iniciada, cada rol va a su página
const sesionActual = obtenerSesion();
if (sesionActual) {
  window.location.replace(sesionActual.rol === "admin" ? "./admin.html" : "./index.html");
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

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginError.classList.add("d-none");

  if (!loginForm.checkValidity()) {
    loginForm.classList.add("was-validated");
    return;
  }

  const email = document.getElementById("login-email").value;
  const remember = document.getElementById("login-remember").checked;
  let rol;
  try {
    rol = await iniciarSesion(email, passwordInput.value, remember);
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    loginError.textContent = "No se pudo conectar con el servidor. Intenta de nuevo.";
    loginError.classList.remove("d-none");
    return;
  }

  if (rol === "admin") {
    window.location.href = "./admin.html";
  } else if (rol) {
    window.location.href = "./index.html";
  } else {
    loginError.textContent = "Correo o contraseña incorrectos.";
    loginError.classList.remove("d-none");
  }
});
document.addEventListener("DOMContentLoaded", () => {
  // Intentamos obtener la sesión del sessionStorage (o localStorage si lo guardas ahí)
  const sessionData = sessionStorage.getItem("technopet-session") || localStorage.getItem("technopet-session");
  
  // O si guardas los datos del usuario logueado en otra llave como 'currentUser'
  // const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // Buscamos el contenedor o botón en el navbar donde debería ir la info de usuario
  const navActionContainer = document.querySelector("#header-component") || document.querySelector("nav"); // Ajusta según tu HTML

  if (sessionData) {
    try {
      const user = JSON.parse(sessionData);
      // Extraemos el nombre o el correo (dependiendo de qué guardes en el objeto)
      const identifier = user.nombre || user.email || "Mi Cuenta";

      // Si tienes un espacio reservado para mostrar el usuario, lo actualizamos:
      // Por ejemplo, si quieres que el botón de cerrar sesión o un span muestre el nombre:
      const logoutBtn = document.querySelector("#logout-btn") || document.querySelector("button.btn-dark");
      
      if (logoutBtn) {
        // Opcional: Agregar el nombre junto al botón o cambiar el texto
        console.log("Usuario logueado:", identifier);
      }
    } catch (e) {
      console.error("Error al parsear los datos de la sesión", e);
    }
  }
});