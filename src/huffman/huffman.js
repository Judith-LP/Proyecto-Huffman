class NodoHuffman {
    constructor(caracter, frecuencia, izquierdo = null, derecho = null) {
        this.caracter = caracter;
        this.frecuencia = frecuencia;
        this.izquierdo = izquierdo;
        this.derecho = derecho;
    }
}

export class Huffman {
    // Generar tabla de frecuencias de cada caracter del texto
    static obtenerFrecuencias(texto) {
        const frecuencias = {};
        for (let char of texto) {
            frecuencias[char] = (frecuencias[char] || 0) + 1;
        }
        return frecuencias;
    }

    // Construir el árbol binario de Huffman
    static construirArbol(frecuencias) {
        const nodos = Object.entries(frecuencias).map(
            ([char, freq]) => new NodoHuffman(char, freq)
        );

        while (nodos.length > 1) {
            // Ordenar de menor a mayor frecuencia
            nodos.sort((a, b) => a.frecuencia - b.frecuencia);

            // Extraer los dos nodos con menores frecuencias
            const izquierdo = nodos.shift();
            const derecho = nodos.shift();

            // Crear un nodo padre combinando las frecuencias
            const padre = new NodoHuffman(
                null, 
                izquierdo.frecuencia + derecho.frecuencia, 
                izquierdo, 
                derecho
            );

            nodos.push(padre);
        }

        return nodos[0]; // Retorna la raíz del árbol
    }

    // Generar los códigos binarios recorriendo recursivamente el árbol
    static generarCodigos(nodo, codigoActual = "", codigos = {}) {
        if (!nodo) return codigos;

        // Si es un nodo hoja (tiene caracter), guardamos su código binario
        if (nodo.caracter !== null) {
            codigos[nodo.caracter] = codigoActual;
        }

        this.generarCodigos(nodo.izquierdo, codigoActual + "0", codigos);
        this.generarCodigos(nodo.derecho, codigoActual + "1", codigos);

        return codigos;
    }

    // Proceso completo de compresión
    static comprimir(texto) {
        if (!texto) return { cadenaCodificada: "", totalBits: 0 };

        const frecuencias = this.obtenerFrecuencias(texto);
        const raiz = this.construirArbol(frecuencias);
        const tablaCodigos = this.generarCodigos(raiz);

        // Traducir el texto original a binario usando la tabla optimizada
        const cadenaCodificada = texto
            .split("")
            .map(char => tablaCodigos[char])
            .join("");

        return {
            cadenaCodificada,
            totalBits: cadenaCodificada.length,
            tablaCodigos
        };
    }
}