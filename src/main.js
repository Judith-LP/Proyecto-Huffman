import { UIHandler } from './ui/uiHandler.js';
import { Huffman } from './huffman/huffman.js';

document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("form-reporte");

    // Filtra caracteres no permitidos mientras el usuario escribe
    UIHandler.activarValidacionEnVivo(formulario);

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault(); // Evita que recargue la página

        // 1. Validar el formulario completo antes de continuar
        const { esValido, errores } = UIHandler.validarFormulario(formulario);
        UIHandler.mostrarErrores(formulario, errores);

        if (!esValido) {
            return; // Detiene el proceso si hay campos inválidos
        }

        // 2. Obtener texto estructurado desde los inputs
        const textoPlano = UIHandler.obtenerDatosFormulario(formulario);

        // 3. Procesar algoritmo de Huffman
        const resultadoCompresion = Huffman.comprimir(textoPlano);

        // 4. Renderizar métricas finales en pantalla
        UIHandler.mostrarResultados({
            textoOriginal: textoPlano,
            cadenaCodificada: resultadoCompresion.cadenaCodificada,
            bitsHuffman: resultadoCompresion.totalBits
        });
    });
});