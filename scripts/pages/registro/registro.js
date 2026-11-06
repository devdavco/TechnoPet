import { leerUsuarios, guardarUsuario } from "../../auth/usuarios.js";
import { validarRegistro } from "./validar-registro.js";

const form = document.getElementById("registro-form");
const mensaje = document.getElementById("registro-mensaje");
const botonesMostrar = document.querySelectorAll("[data-toggle-password]");

botonesMostrar.forEach((boton) => {
  boton.addEventListener("click", () => {
    const input = document.getElementById(boton.dataset.togglePassword);
    const oculto = input.type === "password";
    input.type = oculto ? "text" : "password";
    boton.textContent = oculto ? "Ocultar" : "Mostrar";
  });
});

function leerFormulario() {
  const campos = form.elements;
  return {
    nombreCompleto: campos.nombreCompleto.value.trim().replace(/\s+/g, " "),
    telefono: campos.telefono.value.replace(/\s/g, ""),
    email: campos.email.value.trim().toLowerCase(),
    password: campos.password.value,
    confirmarPassword: campos.confirmarPassword.value,
    terminos: campos.terminos.checked,
    novedades: campos.novedades.checked,
  };
}

function mostrarErrores(errores) {
  form.querySelectorAll(".form-control, .form-check-input").forEach((campo) => {
    const error = errores[campo.id];
    campo.classList.toggle("is-invalid", Boolean(error));
    if (error) {
      campo.closest(".mb-3, .form-check").querySelector(".invalid-feedback").textContent = error;
    }
  });
}

function mostrarMensaje(texto, tipo) {
  mensaje.className = `alert alert-${tipo} py-2 small`;
  mensaje.textContent = texto;
}

function limpiarFormulario() {
  form.reset();
  botonesMostrar.forEach((boton) => {
    document.getElementById(boton.dataset.togglePassword).type = "password";
    boton.textContent = "Mostrar";
  });
}

form.addEventListener("submit", (evento) => {
  evento.preventDefault();
  mensaje.classList.add("d-none");

  const datos = leerFormulario();
  const errores = validarRegistro(datos, leerUsuarios());
  mostrarErrores(errores);

  const primerError = Object.keys(errores)[0];
  if (primerError) {
    document.getElementById(primerError).focus();
    return;
  }

  const usuario = {
    id: Date.now(),
    nombreCompleto: datos.nombreCompleto,
    telefono: datos.telefono,
    email: datos.email,
    password: datos.password,
    novedades: datos.novedades,
    rol: "cliente",
    fechaRegistro: new Date().toISOString(),
  };

  if (!guardarUsuario(usuario)) {
    mostrarMensaje("No se pudo crear tu cuenta. Intenta de nuevo.", "danger");
    return;
  }

  console.log("Usuario creado:\n" + JSON.stringify({ ...usuario, password: "********" }, null, 2));

  limpiarFormulario();
  mostrarMensaje(`¡Cuenta creada con éxito, ${usuario.nombreCompleto}!`, "success");
});