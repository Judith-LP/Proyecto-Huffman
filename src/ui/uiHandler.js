export class UIHandler {

    // Campos que deben contener solo texto (letras, espacios, acentos). No se permiten números.
static CAMPOS_TEXTO = [
    "ID_MAQUINA",
    "AREA",
    "ESTADO",
    "ALARMA",
    "ESTADO_MANTENIMIENTO",
    "PRIORIDAD"
];

// Campos que deben contener solo números positivos (sin signo negativo, sin letras).
static CAMPOS_NUMERICOS = [
    "TEMPERATURA",
    "PRESION",
    "HUMEDAD",
    "VOLTAJE",
    "PRODUCCION",
    "NIVEL_COMBUSTIBLE",
    "HORAS_OPERACION"
];

// Expresiones regulares de validación
static REGEX_TEXTO = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;      // solo letras y espacios
static REGEX_NUMERO_POSITIVO = /^\d+(\.\d+)?$/;          // enteros o decimales positivos

/**
 * Valida todos los campos del formulario.
 * Devuelve { esValido, errores } donde errores es un objeto { nombreCampo: mensaje }
 */
static validarFormulario(formElement) {
    const errores = {};
    const formData = new FormData(formElement);

    formData.forEach((valor, llave) => {
        const valorLimpio = String(valor).trim();

        if (valorLimpio === "") {
            errores[llave] = "Este campo es obligatorio.";
            return;
        }

        if (this.CAMPOS_TEXTO.includes(llave)) {
            if (!this.REGEX_TEXTO.test(valorLimpio)) {
                errores[llave] = "Solo se permiten letras (sin números ni símbolos).";
            }
        } else if (this.CAMPOS_NUMERICOS.includes(llave)) {
            if (!this.REGEX_NUMERO_POSITIVO.test(valorLimpio)) {
                errores[llave] = "Solo se permiten números positivos.";
            } else if (Number(valorLimpio) <= 0) {
                errores[llave] = "El valor debe ser mayor que cero.";
            }
        }
    });

    return {
        esValido: Object.keys(errores).length === 0,
        errores
    };
}

/**
 * Pinta los mensajes de error debajo de cada input y resalta el borde en rojo.
 * Limpia primero cualquier error previo.
 */
static mostrarErrores(formElement, errores) {
    // Limpiar estado previo
    formElement.querySelectorAll("input").forEach(input => {
        input.classList.remove("border-red-500", "ring-2", "ring-red-200");
        const spanError = input.parentElement.querySelector(".mensaje-error");
        if (spanError) spanError.remove();
    });

    // Pintar errores actuales
    Object.entries(errores).forEach(([nombreCampo, mensaje]) => {
        const input = formElement.querySelector(`[name="${nombreCampo}"]`);
        if (!input) return;

        input.classList.add("border-red-500", "ring-2", "ring-red-200");

        const spanError = document.createElement("span");
        spanError.className = "mensaje-error text-xs text-red-600 mt-1 block";
        spanError.textContent = mensaje;
        input.parentElement.appendChild(spanError);
    });
}

/**
 * Bloquea en tiempo real la escritura de caracteres no permitidos
 * mientras el usuario escribe (no solo al enviar el formulario).
 */
static activarValidacionEnVivo(formElement) {
    formElement.querySelectorAll("input").forEach(input => {
        const nombreCampo = input.name;

        input.addEventListener("input", () => {
            if (this.CAMPOS_NUMERICOS.includes(nombreCampo)) {
                // Elimina cualquier caracter que no sea dígito o punto decimal
                input.value = input.value.replace(/[^0-9.]/g, "");
                // Evita más de un punto decimal
                const partes = input.value.split(".");
                if (partes.length > 2) {
                    input.value = partes[0] + "." + partes.slice(1).join("");
                }
            } else if (this.CAMPOS_TEXTO.includes(nombreCampo)) {
                // Elimina números y símbolos, deja solo letras y espacios
                input.value = input.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
            }
        });
    });
}


    static obtenerDatosFormulario(formElement) {
        const formData = new FormData(formElement);
        let textoPlano = "";

        // Construir el formato llave=valor con salto de línea tal como pide tu reporte
        formData.forEach((valor, llave) => {
            textoPlano += `${llave}=${valor}\n`;
        });

        return textoPlano.trim(); // Remueve el último salto de línea redundante
    }

    static mostrarResultados({ textoOriginal, cadenaCodificada, bitsHuffman }) {
        const totalCaracteres = textoOriginal.length;
        const bitsASCII = totalCaracteres * 8; // Cada caracter en ASCII tradicional usa 8 bits
        const porcentajeAhorro = ((bitsASCII - bitsHuffman) / bitsASCII) * 100;

        // Quitar la clase 'hidden' para revelar la sección de resultados
        document.getElementById("seccion-resultados").classList.remove("hidden");

        // Asignar los textos a los contenedores correspondientes
        document.getElementById("output-plano").textContent = textoOriginal;
        document.getElementById("output-codificado").textContent = cadenaCodificada;
        
        document.getElementById("bits-ascii").textContent = `${bitsASCII} bits`;
        document.getElementById("bits-huffman").textContent = `${bitsHuffman} bits`;
        document.getElementById("porcentaje-ahorro").textContent = `${porcentajeAhorro.toFixed(2)} %`;

        // Detalle de la fórmula matemática inferior
        document.getElementById("formula-calculo").textContent = 
            `Cálculo: ASCII = ${totalCaracteres} caracteres × 8 bits = ${bitsASCII} bits. Huffman = ${bitsHuffman} bits. Ahorro = (ASCII − Huffman) / ASCII.`;
    }
}