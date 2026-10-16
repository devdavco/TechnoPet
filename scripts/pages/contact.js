document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    const formResponse = document.getElementById("formResponse");
    const submitBtn = document.getElementById("submitBtn");

    if (!form) return;

    function limpiarFormularioCompleto() {
    form.reset();
    if (formResponse) formResponse.classList.add("d-none");
    
    form.querySelectorAll("input, textarea, select").forEach(el => {
        if (el.type !== "hidden" && el.type !== "submit" && el.type !== "checkbox" && el.type !== "radio") {
        el.value = "";
        } else if (el.type === "checkbox" || el.type === "radio") {
        el.checked = false;
        }
    });
    }

    window.addEventListener("pageshow", (event) => {
    limpiarFormularioCompleto();
    });

    form.addEventListener("submit", async function (e) {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando...";

    const formData = new FormData(form);

    try {
        const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
        });

        if (response.ok) {
        limpiarFormularioCompleto();
        formResponse.className = "mb-3 alert alert-success";
        formResponse.textContent = "¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.";
        formResponse.classList.remove("d-none");
        } else {
        const data = await response.json();
        formResponse.className = "mb-3 alert alert-danger";
        formResponse.textContent = data.error || "Hubo un error al enviar el mensaje. Inténtalo de nuevo.";
        formResponse.classList.remove("d-none");
        }
    } catch (error) {
        formResponse.className = "mb-3 alert alert-danger";
        formResponse.textContent = "Error de conexión. Verifica tu red e inténtalo de nuevo.";
        formResponse.classList.remove("d-none");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Enviar mensaje";
    }
    });
});