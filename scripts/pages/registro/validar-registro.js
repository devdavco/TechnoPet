const SOLO_LETRAS = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;
const TELEFONO = /^\+?[0-9]{7,15}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validarRegistro(datos, usuarios) {
  const errores = {};

  if (datos.nombreCompleto === "") {
    errores.nombreCompleto = "Ingresa tu nombre completo.";
  } else if (!SOLO_LETRAS.test(datos.nombreCompleto)) {
    errores.nombreCompleto = "El nombre solo puede tener letras y espacios.";
  } else if (datos.nombreCompleto.split(/\s+/).length < 2) {
    errores.nombreCompleto = "Escribe tu nombre y tu apellido.";
  }

  if (datos.telefono === "") {
    errores.telefono = "Ingresa tu número de teléfono.";
  } else if (!TELEFONO.test(datos.telefono)) {
    errores.telefono = "Ingresa un teléfono válido (entre 7 y 15 dígitos).";
  }

  if (datos.email === "") {
    errores.email = "Ingresa tu correo electrónico.";
  } else if (!EMAIL.test(datos.email)) {
    errores.email = "Ingresa un correo válido, por ejemplo nombre@correo.com.";
  } else if (usuarios.some((usuario) => usuario.email === datos.email)) {
    errores.email = "Ya existe una cuenta con este correo.";
  }

  if (datos.password.length < 8) {
    errores.password = "La contraseña debe tener al menos 8 caracteres.";
  } else if (!/[A-Za-z]/.test(datos.password) || !/[0-9]/.test(datos.password)) {
    errores.password = "La contraseña debe tener al menos una letra y un número.";
  }

  if (datos.confirmarPassword === "") {
    errores.confirmarPassword = "Repite tu contraseña.";
  } else if (datos.confirmarPassword !== datos.password) {
    errores.confirmarPassword = "Las contraseñas no coinciden.";
  }

  if (!datos.terminos) {
    errores.terminos = "Debes aceptar los términos y condiciones.";
  }

  return errores;
}