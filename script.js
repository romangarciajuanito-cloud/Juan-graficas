let m = 0;
let b = 0;

let punto2X = 1;
let punto2Y = 0;

let zoom = 40;

let desplazamientoX = 0;
let desplazamientoY = 0;

let arrastrando = false;
let ultimoX = 0;
let ultimoY = 0;

const canvas = document.getElementById("grafica");
const ctx = canvas.getContext("2d");


function mcd(a, b) {

    a = Math.abs(a);
    b = Math.abs(b);

    while (b !== 0) {

        let temporal = b;

        b = a % b;
        a = temporal;
    }

    return a;
}


function fraccion(numero) {

    if (Number.isInteger(numero)) {
        return numero.toString();
    }

    const precision = 1000000;

    let numerador =
        Math.round(numero * precision);

    let denominador =
        precision;

    let divisor =
        mcd(numerador, denominador);

    numerador /= divisor;
    denominador /= divisor;

    if (denominador === 1) {
        return numerador.toString();
    }

    return `${numerador}/${denominador}`;
}


function mostrarEcuacion(A, B, C) {

    let texto = "";

    if (A !== 0) {

        if (A === 1) {
            texto += "x";
        }

        else if (A === -1) {
            texto += "-x";
        }

        else {
            texto += `${A}x`;
        }
    }

    if (B !== 0) {

        if (texto !== "") {

            if (B > 0) {
                texto += " + ";
            }

            else {
                texto += " - ";
            }

            let numeroB = Math.abs(B);

            if (numeroB === 1) {
                texto += "y";
            }

            else {
                texto += numeroB + "y";
            }

        }

        else {

            if (B === 1) {
                texto += "y";
            }

            else if (B === -1) {
                texto += "-y";
            }

            else {
                texto += B + "y";
            }
        }
    }

    if (C !== 0) {

        if (texto !== "") {

            if (C > 0) {
                texto += " + " + C;
            }

            else {
                texto += " - " + Math.abs(C);
            }

        }

        else {
            texto += C;
        }
    }

    if (texto === "") {
        texto = "0";
    }

    return texto + " = 0";
}


function formaFinal(m, b) {

    let resultado = "y = ";

    if (m === 0) {

        resultado += fraccion(b);

        return resultado;
    }

    if (m === 1) {
        resultado += "x";
    }

    else if (m === -1) {
        resultado += "-x";
    }

    else {
        resultado += fraccion(m) + "x";
    }

    if (b > 0) {
        resultado += " + " + fraccion(b);
    }

    else if (b < 0) {
        resultado += " - " + fraccion(Math.abs(b));
    }

    return resultado;
}


function calcular() {

    const A =
        Number(document.getElementById("A").value);

    const B =
        Number(document.getElementById("B").value);

    const C =
        Number(document.getElementById("C").value);

    const error =
        document.getElementById("error");

    error.textContent = "";


    if (
        !Number.isFinite(A) ||
        !Number.isFinite(B) ||
        !Number.isFinite(C)
    ) {

        error.textContent =
            "Ingresa valores numéricos válidos.";

        return;
    }


    if (B === 0) {

        error.textContent =
            "B no puede ser 0 porque no se puede despejar Y.";

        return;
    }


    /*
        Ax + By + C = 0

        By = -Ax - C

        y = (-A/B)x + (-C/B)
    */

    m = -A / B;

    b = -C / B;


    /*
        PUNTO B

        B = (0,b)

        SEGUNDO PUNTO

        x = 1

        y = m(1) + b
    */

    punto2X = 1;

    punto2Y =
        m * punto2X + b;


    document.getElementById("pendiente")
        .textContent = fraccion(m);

    document.getElementById("intercepto")
        .textContent = fraccion(b);

    document.getElementById("ecuacion")
        .textContent = formaFinal(m, b);


    document.getElementById("paso1")
        .textContent = mostrarEcuacion(A, B, C);


    document.getElementById("paso2")
        .textContent =
        `${B}y = ${-A}x ${
            C >= 0
                ? "- " + C
                : "+ " + Math.abs(C)
        }`;


    document.getElementById("paso3")
        .textContent =
        `y = (${fraccion(-A)}/${B})x + (${fraccion(-C)}/${B})`;


    document.getElementById("paso4")
        .textContent =
        formaFinal(m, b);


    document.getElementById("paso5")
        .textContent =
        `B = (0, ${fraccion(b)}) y P₂ = (1, ${fraccion(punto2Y)}). Se unen ambos puntos para formar la recta.`;


    dibujarGrafica();
}


function ajustarCanvas() {

    const escala =
        window.devicePixelRatio || 1;

    canvas.width =
        canvas.clientWidth * escala;

    canvas.height =
        canvas.clientHeight * escala;

    ctx.setTransform(
        escala,
        0,
        0,
        escala,
        0,
        0
    );
}


function convertirX(x) {

    return (
        canvas.clientWidth / 2
        + desplazamientoX
        + x * zoom
    );
}


function convertirY(y) {

    return (
        canvas.clientHeight / 2
        + desplazamientoY
        - y * zoom
    );
}


function dibujarGrafica() {

    const ancho =
        canvas.clientWidth;

    const alto =
        canvas.clientHeight;


    ctx.clearRect(
        0,
        0,
        ancho,
        alto
    );


    /* CUADRÍCULA */

    ctx.strokeStyle = "#dfe7ee";
    ctx.lineWidth = 1;


    let inicioX =
        (
            (
                ancho / 2 +
                desplazamientoX
            ) % zoom + zoom
        ) % zoom;


    for (
        let x = inicioX;
        x < ancho;
        x += zoom
    ) {

        ctx.beginPath();

        ctx.moveTo(x, 0);

        ctx.lineTo(x, alto);

        ctx.stroke();
    }


    let inicioY =
        (
            (
                alto / 2 +
                desplazamientoY
            ) % zoom + zoom
        ) % zoom;


    for (
        let y = inicioY;
        y < alto;
        y += zoom
    ) {

        ctx.beginPath();

        ctx.moveTo(0, y);

        ctx.lineTo(ancho, y);

        ctx.stroke();
    }


    /* EJES */

    const ejeX =
        convertirX(0);

    const ejeY =
        convertirY(0);


    ctx.strokeStyle = "#455a64";
    ctx.lineWidth = 2;


    ctx.beginPath();

    ctx.moveTo(ejeX, 0);

    ctx.lineTo(ejeX, alto);

    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(0, ejeY);

    ctx.lineTo(ancho, ejeY);

    ctx.stroke();


    /* NÚMEROS */

    ctx.fillStyle = "#607d8b";
    ctx.font = "11px Arial";


    for (
        let x = -30;
        x <= 30;
        x++
    ) {

        if (x === 0) continue;

        const px = convertirX(x);

        if (px > 0 && px < ancho) {

            ctx.fillText(
                x,
                px + 3,
                ejeY - 5
            );
        }
    }


    for (
        let y = -30;
        y <= 30;
        y++
    ) {

        if (y === 0) continue;

        const py = convertirY(y);

        if (py > 0 && py < alto) {

            ctx.fillText(
                y,
                ejeX + 5,
                py - 3
            );
        }
    }


    /*
        ============================
        PUNTO B
        ============================

        B = (0,b)
    */

    const bx =
        convertirX(0);

    const by =
        convertirY(b);


    /*
        ============================
        SEGUNDO PUNTO
        ============================
    */

    const p2x =
        convertirX(punto2X);

    const p2y =
        convertirY(punto2Y);


    /*
        ============================
        UNIÓN DE LOS DOS PUNTOS
        ============================

        Aquí se muestra visualmente
        cómo B y P₂ forman la recta.
    */

    ctx.strokeStyle = "#90caf9";

    ctx.lineWidth = 7;

    ctx.beginPath();

    ctx.moveTo(
        bx,
        by
    );

    ctx.lineTo(
        p2x,
        p2y
    );

    ctx.stroke();


    /*
        ============================
        RECTA COMPLETA
        ============================
    */

    let x1 = -100;

    let x2 = 100;

    let y1 =
        m * x1 + b;

    let y2 =
        m * x2 + b;


    ctx.strokeStyle = "#1976d2";

    ctx.lineWidth = 4;

    ctx.beginPath();

    ctx.moveTo(
        convertirX(x1),
        convertirY(y1)
    );

    ctx.lineTo(
        convertirX(x2),
        convertirY(y2)
    );

    ctx.stroke();


    /*
        ============================
        DIBUJAR PUNTO B
        ============================
    */

    dibujarPunto(
        0,
        b,
        "#e53935",
        `B (0, ${fraccion(b)})`
    );


    /*
        ============================
        DIBUJAR P₂
        ============================
    */

    dibujarPunto(
        punto2X,
        punto2Y,
        "#43a047",
        `P₂ (1, ${fraccion(punto2Y)})`
    );
}


function dibujarPunto(
    x,
    y,
    color,
    texto
) {

    const px =
        convertirX(x);

    const py =
        convertirY(y);


    ctx.beginPath();

    ctx.arc(
        px,
        py,
        8,
        0,
        Math.PI * 2
    );


    ctx.fillStyle = color;

    ctx.fill();


    ctx.strokeStyle = "#ffffff";

    ctx.lineWidth = 2;

    ctx.stroke();


    ctx.fillStyle = "#263238";

    ctx.font =
        "bold 12px Arial";


    ctx.fillText(
        texto,
        px + 12,
        py - 12
    );
}


/* ZOOM */

function zoomMas() {

    zoom *= 1.25;

    if (zoom > 150) {
        zoom = 150;
    }

    dibujarGrafica();
}


function zoomMenos() {

    zoom /= 1.25;

    if (zoom < 10) {
        zoom = 10;
    }

    dibujarGrafica();
}


/* CENTRAR */

function centrarGrafica() {

    desplazamientoX = 0;

    desplazamientoY = 0;

    zoom = 40;

    dibujarGrafica();
}


/* ARRASTRAR */

canvas.addEventListener(
    "mousedown",
    function(evento) {

        arrastrando = true;

        ultimoX =
            evento.clientX;

        ultimoY =
            evento.clientY;
    }
);


canvas.addEventListener(
    "mousemove",
    function(evento) {

        if (!arrastrando) return;


        desplazamientoX +=
            evento.clientX - ultimoX;

        desplazamientoY +=
            evento.clientY - ultimoY;


        ultimoX =
            evento.clientX;

        ultimoY =
            evento.clientY;


        dibujarGrafica();
    }
);


canvas.addEventListener(
    "mouseup",
    function() {

        arrastrando = false;
    }
);


canvas.addEventListener(
    "mouseleave",
    function() {

        arrastrando = false;
    }
);


/* CELULAR */

canvas.addEventListener(
    "touchstart",
    function(evento) {

        if (evento.touches.length !== 1) {
            return;
        }

        arrastrando = true;

        ultimoX =
            evento.touches[0].clientX;

        ultimoY =
            evento.touches[0].clientY;
    }
);


canvas.addEventListener(
    "touchmove",
    function(evento) {

        if (!arrastrando) return;

        if (evento.touches.length !== 1) {
            return;
        }

        evento.preventDefault();


        desplazamientoX +=
            evento.touches[0].clientX - ultimoX;

        desplazamientoY +=
            evento.touches[0].clientY - ultimoY;


        ultimoX =
            evento.touches[0].clientX;

        ultimoY =
            evento.touches[0].clientY;


        dibujarGrafica();
    },
    {
        passive: false
    }
);


canvas.addEventListener(
    "touchend",
    function() {

        arrastrando = false;
    }
);


/* CAMBIO DE TAMAÑO */

window.addEventListener(
    "resize",
    function() {

        ajustarCanvas();

        dibujarGrafica();
    }
);


/* INICIO */

window.addEventListener(
    "load",
    function() {

        ajustarCanvas();

        calcular();
    }
);
