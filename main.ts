namespace SpriteKind {
    export const Personaje = SpriteKind.create()
    export const Pista = SpriteKind.create()
    export const Objeto = SpriteKind.create()
    export const Puerta = SpriteKind.create()
    export const Mecanismo = SpriteKind.create()
    export const PuntoInteres = SpriteKind.create()
}

// ============================================================
// MI VIDEOJUEGO — EDITAR EN BLOQUES
// ============================================================

let tituloJuego = "TITULO DEL MISTERIO"
let introduccionJuego = "Escribe aqui la presentacion de tu historia."
let objetivoPrincipal = "Explora, conversa y relaciona las evidencias."
let conclusionCorrecta = 1
let evidenciaFinalA = 1
let evidenciaFinalB = 2
let textoVictoria = "La hipotesis explica correctamente las evidencias."

// Nombres de escenarios. Pueden ampliarse hasta 6 en esta base.
let nombresEscenarios = [
    "INICIO",
    "CONEXIONES",
    "ESCENARIO 1",
    "ESCENARIO 2",
    "ESCENARIO 3",
    "ESCENARIO 4"
]

// Conexiones de las cuatro puertas. Cada numero es el escenario de destino.
let destinoPuerta1 = 2
let destinoPuerta2 = 3
let destinoPuerta3 = 4
let destinoPuerta4 = 5

// Personajes configurables.
let nombresPersonajes = ["TESTIGO 1", "TESTIGO 2", "TESTIGO 3"]
let dialogosIniciales = [
    "Escribe aqui el primer testimonio.",
    "Escribe aqui una version diferente.",
    "Escribe aqui una informacion incompleta."
]
let dialogosPosteriores = [
    "Este dialogo aparece despues de una pista.",
    "Ahora puedo agregar un nuevo detalle.",
    "Mi version cambia despues del descubrimiento."
]

// Objetos configurables.
let nombresObjetos = ["HERRAMIENTA", "LLAVE", "TARJETA", "LINTERNA"]
let descripcionesObjetos = [
    "Objeto de ejemplo que puede activar un mecanismo.",
    "Puede abrir una puerta configurada.",
    "Puede autorizar el acceso a una zona.",
    "Puede revelar elementos ocultos."
]
let objetosConsumibles = [false, false, false, false]

// Pistas configurables. No contienen numeros obligatorios.
let nombresPistas = ["PISTA A", "PISTA B", "PISTA C", "PISTA D", "PISTA E", "PISTA F"]
let descripcionesPistas = [
    "Describe solamente lo observado, sin revelar la conclusion.",
    "Agrega un dato que pueda compararse con otra evidencia.",
    "Incluye una posible contradiccion.",
    "Incluye una pista secundaria o un senuelo razonable.",
    "Incluye un dato obtenido mediante un mecanismo.",
    "Incluye una prueba que pueda justificar la hipotesis final."
]

// Deducciones configurables: dos pistas producen una conclusion.
let deduccionPistaA = [1, 2, 3, 4]
let deduccionPistaB = [2, 3, 5, 6]
let textosDeducciones = [
    "DEDUCCION 1: escribe la relacion entre las pistas 1 y 2.",
    "DEDUCCION 2: escribe la relacion entre las pistas 2 y 3.",
    "DEDUCCION 3: escribe la relacion entre las pistas 3 y 5.",
    "DEDUCCION 4: escribe la relacion entre las pistas 4 y 6."
]

// ============================================================
// MOTOR — NO MODIFICAR SIN ORIENTACION
// ============================================================

let protagonista: Sprite = null
let puerta1: Sprite = null
let puerta2: Sprite = null
let puerta3: Sprite = null
let puerta4: Sprite = null
let personajeActual: Sprite = null
let objetoActual: Sprite = null
let pistaActual: Sprite = null
let mecanismoActual: Sprite = null
let puertas: Sprite[] = []
let numerosPuertas: number[] = []
let personajes: Sprite[] = []
let numerosPersonajes: number[] = []
let objetos: Sprite[] = []
let numerosObjetos: number[] = []
let pistas: Sprite[] = []
let numerosPistas: number[] = []
let mecanismos: Sprite[] = []
let numerosMecanismos: number[] = []

let escenarioActual = 0
let escenarioAnterior = 0
let cuadernoAbierto = false
let seccionCuaderno = 0
let indiceCuaderno = 0
let interaccionBloqueada = false
let personajeFrente = 0
let objetoFrente = 0
let pistaFrente = 0
let mecanismoFrente = 0

let objetosEncontrados = [false, false, false, false]
let pistasEncontradas = [false, false, false, false, false, false]
let deduccionesEncontradas = [false, false, false, false]
let conversacionesRealizadas = [false, false, false]
let mecanismosActivados = [false, false, false, false]
let puertasAbiertas = [false, false, false, false]

function imagenProtagonista() {
    return img`
        . . . . f f f f . . . . . . . .
        . . f f 2 2 2 2 f f . . . . . .
        . f 2 2 2 2 2 2 2 2 f . . . . .
        . f 2 f 2 2 2 2 f 2 f . . . . .
        . f 2 2 2 2 2 2 2 2 f . . . . .
        . . f 2 2 2 2 2 2 f . . . . . .
        . . . f f f f f f . . . . . . .
        . . . . 5 5 5 5 . . . . . . . .
        . . . 5 5 5 5 5 5 . . . . . . .
        . . . 5 5 5 5 5 5 . . . . . . .
        . . . 5 5 5 5 5 5 . . . . . . .
        . . . . 5 5 5 5 . . . . . . . .
        . . . . 5 . . 5 . . . . . . . .
        . . . 5 5 . . 5 5 . . . . . . .
        . . . 5 . . . . 5 . . . . . . .
        . . . . . . . . . . . . . . . .
    `
}

function imagenInteractivo(color: number) {
    let imagen = img`
        . . . . 2 2 2 2 . . . . . . . .
        . . . 2 2 2 2 2 2 . . . . . . .
        . . 2 2 f f f f 2 2 . . . . . .
        . . 2 f 2 2 2 2 f 2 . . . . . .
        . . 2 f 2 2 2 2 f 2 . . . . . .
        . . 2 f 2 2 2 2 f 2 . . . . . .
        . . 2 2 f f f f 2 2 . . . . . .
        . . . 2 2 2 2 2 2 . . . . . . .
        . . . . 2 2 2 2 . . . . . . . .
        . . . . . 2 2 . . . . . . . . .
        . . . . . 2 2 . . . . . . . . .
        . . . . 2 2 2 2 . . . . . . . .
        . . . 2 2 2 2 2 2 . . . . . . .
        . . . 2 . . . . 2 . . . . . . .
        . . . 2 . . . . 2 . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    imagen.replace(2, color)
    return imagen
}

function cargarMapa(numero: number) {
    if (numero == 0) {
        tiles.setCurrentTilemap(tilemap`level1`)
    } else if (numero == 1) {
        tiles.setCurrentTilemap(tilemap`level17`)
    } else if (numero == 2) {
        tiles.setCurrentTilemap(tilemap`nivel1`)
    } else if (numero == 3) {
        tiles.setCurrentTilemap(tilemap`nivel2`)
    } else if (numero == 4) {
        tiles.setCurrentTilemap(tilemap`nivel3`)
    } else {
        tiles.setCurrentTilemap(tilemap`nivel4`)
    }
}

function ocultarElementosEscenario() {
    sprites.destroyAllSpritesOfKind(SpriteKind.Puerta)
    sprites.destroyAllSpritesOfKind(SpriteKind.Personaje)
    sprites.destroyAllSpritesOfKind(SpriteKind.Objeto)
    sprites.destroyAllSpritesOfKind(SpriteKind.Pista)
    sprites.destroyAllSpritesOfKind(SpriteKind.Mecanismo)
    puerta1 = null
    puerta2 = null
    puerta3 = null
    puerta4 = null
    personajeActual = null
    objetoActual = null
    pistaActual = null
    mecanismoActual = null
    puertas = []
    numerosPuertas = []
    personajes = []
    numerosPersonajes = []
    objetos = []
    numerosObjetos = []
    pistas = []
    numerosPistas = []
    mecanismos = []
    numerosMecanismos = []
}

function crearPuerta(numero: number, x: number, y: number) {
    let puerta = sprites.create(imagenInteractivo(7), SpriteKind.Puerta)
    puerta.setPosition(x, y)
    puertas.push(puerta)
    numerosPuertas.push(numero)
    if (numero == 1) {
        puerta1 = puerta
    } else if (numero == 2) {
        puerta2 = puerta
    } else if (numero == 3) {
        puerta3 = puerta
    } else {
        puerta4 = puerta
    }
}

function crearPersonaje(numero: number, x: number, y: number) {
    personajeActual = sprites.create(imagenInteractivo(9), SpriteKind.Personaje)
    personajeActual.setPosition(x, y)
    personajes.push(personajeActual)
    numerosPersonajes.push(numero)
}

function crearObjeto(numero: number, x: number, y: number) {
    if (objetosEncontrados[numero - 1]) {
        return
    }
    objetoActual = sprites.create(imagenInteractivo(5), SpriteKind.Objeto)
    objetoActual.setPosition(x, y)
    objetos.push(objetoActual)
    numerosObjetos.push(numero)
}

function crearPista(numero: number, x: number, y: number) {
    if (pistasEncontradas[numero - 1]) {
        return
    }
    pistaActual = sprites.create(imagenInteractivo(4), SpriteKind.Pista)
    pistaActual.setPosition(x, y)
    pistas.push(pistaActual)
    numerosPistas.push(numero)
}

function crearMecanismo(numero: number, x: number, y: number) {
    mecanismoActual = sprites.create(imagenInteractivo(8), SpriteKind.Mecanismo)
    mecanismoActual.setPosition(x, y)
    mecanismos.push(mecanismoActual)
    numerosMecanismos.push(numero)
}

function prepararEscenario() {
    ocultarElementosEscenario()
    cargarMapa(escenarioActual)
    protagonista.setPosition(80, 60)
    scene.cameraFollowSprite(protagonista)
    if (escenarioActual == 0) {
        crearPuerta(1, 128, 60)
    } else if (escenarioActual == 1) {
        crearPuerta(1, 32, 24)
        crearPuerta(2, 128, 24)
        crearPuerta(3, 32, 96)
        crearPuerta(4, 128, 96)
    } else if (escenarioActual == 2) {
        crearPersonaje(1, 40, 32)
        crearObjeto(1, 120, 88)
        crearPista(1, 120, 32)
        crearMecanismo(1, 40, 88)
        crearPuerta(1, 16, 60)
    } else if (escenarioActual == 3) {
        crearPersonaje(2, 40, 32)
        crearPista(2, 120, 32)
        crearPista(3, 120, 88)
        crearPuerta(1, 16, 60)
    } else if (escenarioActual == 4) {
        crearPersonaje(3, 40, 32)
        crearObjeto(2, 120, 88)
        crearPista(4, 120, 32)
        crearMecanismo(2, 40, 88)
        crearPuerta(1, 16, 60)
    } else {
        crearObjeto(3, 40, 88)
        crearObjeto(4, 120, 88)
        crearPista(5, 40, 32)
        crearPista(6, 120, 32)
        crearPuerta(1, 16, 60)
    }
    protagonista.sayText(nombresEscenarios[escenarioActual], 800, false)
}

function cambiarEscenario(destino: number) {
    if (interaccionBloqueada || cuadernoAbierto) {
        return
    }
    escenarioAnterior = escenarioActual
    escenarioActual = destino
    prepararEscenario()
}

function registrarObjeto(numero: number) {
    let posicion = numero - 1
    if (objetosEncontrados[posicion]) {
        game.showLongText("Este objeto ya esta en el inventario.", DialogLayout.Bottom)
        return
    }
    objetosEncontrados[posicion] = true
    game.showLongText("OBJETO: " + nombresObjetos[posicion] + "\n" + descripcionesObjetos[posicion], DialogLayout.Full)
}

function registrarPista(numero: number) {
    let posicion = numero - 1
    if (pistasEncontradas[posicion]) {
        game.showLongText("Esta evidencia ya fue registrada.", DialogLayout.Bottom)
        return
    }
    pistasEncontradas[posicion] = true
    game.showLongText("EVIDENCIA: " + nombresPistas[posicion] + "\n" + descripcionesPistas[posicion], DialogLayout.Full)
}

function hablarConPersonaje(numero: number) {
    let posicion = numero - 1
    if (conversacionesRealizadas[posicion]) {
        game.showLongText(nombresPersonajes[posicion] + ": " + dialogosPosteriores[posicion], DialogLayout.Full)
    } else {
        conversacionesRealizadas[posicion] = true
        game.showLongText(nombresPersonajes[posicion] + ": " + dialogosIniciales[posicion], DialogLayout.Full)
    }
}

function activarMecanismo(numero: number) {
    let posicion = numero - 1
    if (mecanismosActivados[posicion]) {
        game.showLongText("El mecanismo ya permanece activado.", DialogLayout.Bottom)
        return
    }
    if (numero == 1 && !objetosEncontrados[0]) {
        game.showLongText("Falta una herramienta adecuada.", DialogLayout.Bottom)
        return
    }
    if (numero == 2 && !pistasEncontradas[3]) {
        game.showLongText("Todavia no comprendes como activar este mecanismo.", DialogLayout.Bottom)
        return
    }
    mecanismosActivados[posicion] = true
    game.showLongText("ACTIVADOR + CONDICION + ACCION: el estado del mecanismo fue guardado.", DialogLayout.Full)
    if (numero == 1) {
        puertasAbiertas[0] = true
        registrarPista(5)
    } else {
        registrarPista(6)
    }
}

function destinoDePuerta(numero: number) {
    if (escenarioActual == 0) {
        return 1
    }
    if (escenarioActual >= 2) {
        return 1
    }
    if (numero == 1) {
        return destinoPuerta1
    } else if (numero == 2) {
        return destinoPuerta2
    } else if (numero == 3) {
        return destinoPuerta3
    } else {
        return destinoPuerta4
    }
}

function intentarPuerta(numero: number) {
    if (escenarioActual >= 2 || escenarioActual == 1 || escenarioActual == 0 || puertasAbiertas[numero - 1]) {
        cambiarEscenario(destinoDePuerta(numero))
    } else {
        game.showLongText("La puerta esta cerrada. Busca otra accion o herramienta.", DialogLayout.Bottom)
    }
}

function combinarEvidencias() {
    let primera = game.askForNumber("Numero de la primera pista", 1)
    let segunda = game.askForNumber("Numero de la segunda pista", 1)
    let encontrada = false
    for (let indice = 0; indice <= 3; indice++) {
        if (pistasEncontradas[primera - 1] && pistasEncontradas[segunda - 1]) {
            if (primera == deduccionPistaA[indice] && segunda == deduccionPistaB[indice] || primera == deduccionPistaB[indice] && segunda == deduccionPistaA[indice]) {
                deduccionesEncontradas[indice] = true
                encontrada = true
                game.showLongText(textosDeducciones[indice], DialogLayout.Full)
            }
        }
    }
    if (!encontrada) {
        game.showLongText("La relacion no esta demostrada o falta descubrir una evidencia.", DialogLayout.Bottom)
    }
}

function textoPistasDescubiertas() {
    let texto = "PISTAS"
    for (let indice = 0; indice <= 5; indice++) {
        if (pistasEncontradas[indice]) {
            texto = texto + "\n" + (indice + 1) + ". " + nombresPistas[indice]
        }
    }
    return texto
}

function textoObjetosEncontrados() {
    let texto = "OBJETOS"
    for (let indice = 0; indice <= 3; indice++) {
        if (objetosEncontrados[indice]) {
            texto = texto + "\n" + (indice + 1) + ". " + nombresObjetos[indice]
        }
    }
    return texto
}

function textoDeduccionesEncontradas() {
    let texto = "DEDUCCIONES"
    for (let indice = 0; indice <= 3; indice++) {
        if (deduccionesEncontradas[indice]) {
            texto = texto + "\n" + (indice + 1) + ". " + textosDeducciones[indice]
        }
    }
    return texto
}

function abrirCuaderno() {
    cuadernoAbierto = true
    interaccionBloqueada = true
    controller.moveSprite(protagonista, 0, 0)
    seccionCuaderno = game.askForNumber("CUADERNO: 1 Objetivo, 2 Pistas, 3 Objetos, 4 Deducciones, 5 Combinar, 6 Resolver", 1)
    if (seccionCuaderno == 1) {
        game.showLongText("OBJETIVO\n" + objetivoPrincipal, DialogLayout.Full)
    } else if (seccionCuaderno == 2) {
        game.showLongText(textoPistasDescubiertas(), DialogLayout.Full)
    } else if (seccionCuaderno == 3) {
        game.showLongText(textoObjetosEncontrados(), DialogLayout.Full)
    } else if (seccionCuaderno == 4) {
        game.showLongText(textoDeduccionesEncontradas(), DialogLayout.Full)
    } else if (seccionCuaderno == 5) {
        combinarEvidencias()
    } else if (seccionCuaderno == 6) {
        formularHipotesis()
    }
    cuadernoAbierto = false
    interaccionBloqueada = false
    controller.moveSprite(protagonista, 90, 90)
}

function formularHipotesis() {
    let conclusion = game.askForNumber("Numero de conclusion", 1)
    let pruebaA = game.askForNumber("Primera evidencia justificativa", 1)
    let pruebaB = game.askForNumber("Segunda evidencia justificativa", 1)
    if (conclusion == conclusionCorrecta && pistasEncontradas[pruebaA - 1] && pistasEncontradas[pruebaB - 1]) {
        if (pruebaA == evidenciaFinalA && pruebaB == evidenciaFinalB || pruebaA == evidenciaFinalB && pruebaB == evidenciaFinalA) {
            game.showLongText(textoVictoria, DialogLayout.Full)
            game.over(true)
            return
        }
    }
    game.showLongText("La hipotesis no esta suficientemente justificada. Segui investigando.", DialogLayout.Full)
}

function distancia(a: Sprite, b: Sprite) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

function interactuar() {
    if (interaccionBloqueada || cuadernoAbierto) {
        return
    }
    let mejorDistancia = 25
    let tipoElegido = 0
    let numeroElegido = 0
    let spriteElegido: Sprite = null
    for (let indice = 0; indice < personajes.length; indice++) {
        let personaje = personajes[indice]
        if (distancia(protagonista, personaje) < mejorDistancia) {
            mejorDistancia = distancia(protagonista, personaje)
            tipoElegido = 1
            numeroElegido = numerosPersonajes[indice]
            spriteElegido = personaje
        }
    }
    for (let indice = 0; indice < pistas.length; indice++) {
        let pista = pistas[indice]
        if (distancia(protagonista, pista) < mejorDistancia) {
            mejorDistancia = distancia(protagonista, pista)
            tipoElegido = 2
            numeroElegido = numerosPistas[indice]
            spriteElegido = pista
        }
    }
    for (let indice = 0; indice < objetos.length; indice++) {
        let objeto = objetos[indice]
        if (distancia(protagonista, objeto) < mejorDistancia) {
            mejorDistancia = distancia(protagonista, objeto)
            tipoElegido = 3
            numeroElegido = numerosObjetos[indice]
            spriteElegido = objeto
        }
    }
    for (let indice = 0; indice < mecanismos.length; indice++) {
        let mecanismo = mecanismos[indice]
        if (distancia(protagonista, mecanismo) < mejorDistancia) {
            mejorDistancia = distancia(protagonista, mecanismo)
            tipoElegido = 4
            numeroElegido = numerosMecanismos[indice]
            spriteElegido = mecanismo
        }
    }
    for (let indice = 0; indice < puertas.length; indice++) {
        let puerta = puertas[indice]
        if (distancia(protagonista, puerta) < mejorDistancia) {
            mejorDistancia = distancia(protagonista, puerta)
            tipoElegido = 5
            numeroElegido = numerosPuertas[indice]
            spriteElegido = puerta
        }
    }
    if (tipoElegido == 1) {
        hablarConPersonaje(numeroElegido)
    } else if (tipoElegido == 2) {
        registrarPista(numeroElegido)
        sprites.destroy(spriteElegido)
    } else if (tipoElegido == 3) {
        registrarObjeto(numeroElegido)
        sprites.destroy(spriteElegido)
    } else if (tipoElegido == 4) {
        activarMecanismo(numeroElegido)
    } else if (tipoElegido == 5) {
        intentarPuerta(numeroElegido)
    } else {
        protagonista.sayText("No hay nada para usar aqui.", 600, false)
    }
}

controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    interactuar()
})

controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!cuadernoAbierto) {
        abrirCuaderno()
    }
})

protagonista = sprites.create(imagenProtagonista(), SpriteKind.Player)
controller.moveSprite(protagonista, 90, 90)
escenarioActual = 0
game.showLongText(tituloJuego + "\n" + introduccionJuego + "\nFlechas: mover | A: interactuar | B: cuaderno", DialogLayout.Full)
prepararEscenario()
