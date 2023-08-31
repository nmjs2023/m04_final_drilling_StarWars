import Personaje from "../clases/personaje.js";

// URL base de la API
let urlBase = "https://swapi.dev/api/people/";

// Función para obtener datos de la API por ID
const getData = async (id) => {
    let response = await fetch(urlBase + id);
    let data = await response.json();
    let { name, height, mass } = data;
    let nuevoPersonaje = new Personaje(name, height, mass);
    return nuevoPersonaje;
};

// Generador de datos para un rango de IDs
function* gen(idInicio, idTermino) {
    for (let index = idInicio; index <= idTermino; index++) {
        yield getData(index);
    }
}

// Generadores para cada fila de personajes
let gRow1 = gen(1, 5);
let gRow2 = gen(6, 10);
let gRow3 = gen(11, 15);

// Función para cargar los datos de un personaje en la tarjeta
const cargarDatos = async (personaje, contenedor, iconColor) => {
    let nuevaTarjeta = document.createElement("div");
    nuevaTarjeta.className = "col-12 col-md-6 col-lg-4";

    // Crear la tarjeta con el color de ícono correspondiente
    nuevaTarjeta.innerHTML = `
        <div class="single-timeline-content d-flex wow fadeInLeft" data-wow-delay="0.3s">
            <div><i class="fa-solid fa-circle fa-sm"  style="color: ${iconColor};"></i></div>
            <div class="timeline-text">
                <h6><strong>${personaje.name}</strong></h6>
                <p>Altura: ${personaje.height} | Peso: ${personaje.mass}</p>
            </div>
        </div>`;

    contenedor.appendChild(nuevaTarjeta);
};

// Variables para controlar el estado de carga por fila
let isLoadingRow1 = false;
let isLoadingRow2 = false;
let isLoadingRow3 = false;

// Función para mostrar el mensaje "obteniendo datos"
const mostrarMensajeCargando = (contenedorRow, iconColor) => {
    let mensajeCargando = document.createElement("div");
    mensajeCargando.className = "col-12 col-md-6 col-lg-4 loading-message"; // Agregamos una clase para poder identificar la tarjeta de "obteniendo datos"
    mensajeCargando.innerHTML = `
        <div class="single-timeline-content d-flex wow fadeInLeft" data-wow-delay="0.3s">
            <div><i class="fa-solid fa-circle fa-beat-fade fa-sm" style="color: ${iconColor};"></i></div>
            <div class="timeline-text">
                <h6><strong>Obteniendo datos...</strong></h6>
            </div>
        </div>`;
    contenedorRow.appendChild(mensajeCargando);
};

// Función para eliminar la tarjeta de "obteniendo datos"
const eliminarMensajeCargando = (contenedorRow) => {
    const mensajeCargando = contenedorRow.querySelector(".loading-message");
    if (mensajeCargando) {
        contenedorRow.removeChild(mensajeCargando);
    }
};

// Agregar el evento de mouseover a las tarjetas existentes
document.addEventListener("mouseover", async (event) => {
    // Obtener la tarjeta sobre la cual se pasó el mouse
    const tarjeta = event.target.closest(".single-timeline-content");

    if (tarjeta && !tarjeta.dataset.loaded) {
        tarjeta.dataset.loaded = true;

        const contenedorRow = tarjeta.closest(".row");

        if (contenedorRow) {
            // Verificar si la fila está cargando datos
            if (contenedorRow.id === "firstRowPersonajes" && !isLoadingRow1) {
                isLoadingRow1 = true;
                mostrarMensajeCargando(contenedorRow, "red"); // Mostrar mensaje "obteniendo datos"
                const personaje = await gRow1.next().value;
                cargarDatos(personaje, contenedorRow, "red");

                eliminarMensajeCargando(contenedorRow); // Eliminar mensaje de "obteniendo datos"
                isLoadingRow1 = false;
            } else if (
                contenedorRow.id === "secondRowPersonajes" &&
                !isLoadingRow2
            ) {
                isLoadingRow2 = true;
                mostrarMensajeCargando(contenedorRow, "green"); // Mostrar mensaje "obteniendo datos"
                const personaje = await gRow2.next().value;
                cargarDatos(personaje, contenedorRow, "green");

                eliminarMensajeCargando(contenedorRow); // Eliminar mensaje de "obteniendo datos"
                isLoadingRow2 = false;
            } else if (
                contenedorRow.id === "thirdRowPersonajes" &&
                !isLoadingRow3
            ) {
                isLoadingRow3 = true;
                mostrarMensajeCargando(contenedorRow, "blue"); // Mostrar mensaje "obteniendo datos"
                const personaje = await gRow3.next().value;
                cargarDatos(personaje, contenedorRow, "blue");

                eliminarMensajeCargando(contenedorRow); // Eliminar mensaje de "obteniendo datos"
                isLoadingRow3 = false;
            }
        }
    }
});
