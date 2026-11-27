
// ==========================================
// PERÍMETROS NOA
// LÓGICA PRINCIPAL DEL FRONTEND
// ==========================================


// 1. REFERENCIAS A LAS PANTALLAS

const pantallaInicio = document.getElementById("pantalla-inicio");

const pantallaTipos = document.getElementById("pantalla-tipos");

const pantallaFormulario = document.getElementById("pantalla-formulario");

const pantallaHistorial = document.getElementById("pantalla-historial");


// 2. REFERENCIAS A LOS BOTONES

const btnNuevo = document.getElementById("btn-nuevo");

const btnHistorial = document.getElementById("btn-historial");

const btnVolver = document.getElementById("btn-volver");

const btnGuardar = document.getElementById("btn-guardar");

const btnCancelar = document.getElementById("btn-cancelar");

const btnVolverHistorial = document.getElementById("btn-volver-historial");

const botonesTipo = document.querySelectorAll(".btn-tipo");


// 3. VARIABLES DEL SISTEMA

let tipoSeleccionado = null;

let presupuestos = [];


// 4. FUNCIÓN PARA CAMBIAR DE PANTALLA

function mostrarPantalla(pantalla) {

    pantallaInicio.hidden = true;
    pantallaTipos.hidden = true;
    pantallaFormulario.hidden = true;
    pantallaHistorial.hidden = true;

    pantalla.hidden = false;
}


// 5. BOTÓN NUEVO PRESUPUESTO

btnNuevo.addEventListener("click", () => {

    mostrarPantalla(pantallaTipos);

});


// 6. VOLVER AL INICIO DESDE LA SELECCIÓN

btnVolver.addEventListener("click", () => {

    mostrarPantalla(pantallaInicio);

});


// 7. SELECCIONAR TIPO DE CERCO

botonesTipo.forEach((boton) => {

    boton.addEventListener("click", () => {

        tipoSeleccionado = boton.dataset.tipo;

        prepararFormulario();

        mostrarPantalla(pantallaFormulario);

    });

});


// 8. PREPARAR FORMULARIO


function prepararFormulario() {

    // Título según el tipo de cerco seleccionado
    const titulos = {
        "punta-diamante": "Presupuesto Punta diamante",
        "quebracho": "Presupuesto Quebracho",
        "olimpico": "Presupuesto Olímpico"
    };

    document.getElementById("titulo-presupuesto").textContent =
        titulos[tipoSeleccionado];

    // Fecha local automática
    const hoy = new Date();

    const fechaLocal = [
        hoy.getFullYear(),
        String(hoy.getMonth() + 1).padStart(2, "0"),
        String(hoy.getDate()).padStart(2, "0")
    ].join("-");

    document.getElementById("fecha").value = fechaLocal;

    // Limpiar todos los campos de texto y números
    const campos = [
        "numero",
        "cliente",
        "telefono",
        "direccion",
        "metros",
        "altura",
        "tejido",
        "calibre-tejido",
        "hilos-puas",
        "postes",
        "distancia-postes",
        "medidas-porton",
        "costo-total",
        "anticipo",
        "saldo-inicial",
        "cantidad-pagos",
        "pago-semanal",
        "total-semanal",
        "saldo-final"
    ];

    campos.forEach((id) => {
        document.getElementById(id).value = "";
    });

    // Reiniciar las opciones desplegables
    selectorPorton.value = "No";
    selectorPagos.value = "No";

    document.getElementById("tejido").value = "";
    document.getElementById("calibre-tejido").value = "";

    // Actualizar la visibilidad de los campos opcionales
    actualizarCampoPorton();
    actualizarCampoPagos();

    // Dejar los cálculos en cero
    calcularPagos();
}



// 9. GUARDAR PRESUPUESTO (PROTOTIPO)

btnGuardar.addEventListener("click", () => {

    const cliente = document.getElementById("cliente").value.trim();

    const telefono = document.getElementById("telefono").value.trim();

    const direccion = document.getElementById("direccion").value.trim();

    const fecha = document.getElementById("fecha").value;

    if (!cliente) {

        alert("Ingresá el nombre del cliente.");

        return;

    }

    const nuevoPresupuesto = {

        tipo: tipoSeleccionado,

        cliente: cliente,

        telefono: telefono,

        direccion: direccion,

        fecha: fecha

    };

    presupuestos.push(nuevoPresupuesto);

    alert("Datos cargados correctamente. El registro definitivo y la numeración se implementarán con el backend.");

    console.log("Presupuestos cargados:", presupuestos);

    mostrarPantalla(pantallaInicio);

});


// 10. CANCELAR FORMULARIO

btnCancelar.addEventListener("click", () => {

    tipoSeleccionado = null;

    mostrarPantalla(pantallaInicio);

});


// 11. ABRIR HISTORIAL

btnHistorial.addEventListener("click", () => {

    actualizarHistorial();

    mostrarPantalla(pantallaHistorial);

});


// 12. ACTUALIZAR HISTORIAL

function actualizarHistorial() {

    const contenedor = document.getElementById("lista-historial");

    contenedor.innerHTML = "";

    if (presupuestos.length === 0) {

        contenedor.textContent =
            "Todavía no hay presupuestos registrados.";

        return;

    }

    presupuestos.forEach((presupuesto) => {

        const registro = document.createElement("p");

        registro.textContent =
            `${presupuesto.tipo} | ${presupuesto.cliente} | ${presupuesto.fecha}`;

        contenedor.appendChild(registro);

    });

}


// 13. VOLVER DESDE EL HISTORIAL

btnVolverHistorial.addEventListener("click", () => {

    mostrarPantalla(pantallaInicio);

});


// 14. INICIAR APLICACIÓN

mostrarPantalla(pantallaInicio);

// ==========================================
// MOSTRAR U OCULTAR LAS MEDIDAS DEL PORTÓN
// ==========================================

const selectorPorton = document.getElementById("porton");
const campoMedidasPorton = document.getElementById("medidas-porton");

function actualizarCampoPorton() {
    const incluyePorton = selectorPorton.value === "Sí";

    campoMedidasPorton.disabled = !incluyePorton;
    campoMedidasPorton.parentElement.hidden = !incluyePorton;

    if (!incluyePorton) {
        campoMedidasPorton.value = "";
    }
}

 // ==========================================
// FORMATO DE DINERO
// ==========================================

// Convierte un importe escrito con puntos en un número
function convertirImporte(valor) {
    return Number(String(valor).replace(/\D/g, "")) || 0;
}

// Agrega los puntos de miles
function formatoNumero(valor) {
    return new Intl.NumberFormat("es-AR", {
        maximumFractionDigits: 0
    }).format(valor);
}

// ==========================================
// CÁLCULOS AUTOMÁTICOS DE COSTOS
// ==========================================

const campoCostoTotal = document.getElementById("costo-total");
const campoAnticipo = document.getElementById("anticipo");
const campoSaldoInicial = document.getElementById("saldo-inicial");

const campoCantidadPagos = document.getElementById("cantidad-pagos");
const campoPagoSemanal = document.getElementById("pago-semanal");
const campoTotalSemanal = document.getElementById("total-semanal");
const campoSaldoFinal = document.getElementById("saldo-final");

const selectorPagos = document.getElementById("incluye-pagos");
const contenedorPagos = document.getElementById("contenedor-pagos-semanales");

function actualizarCampoPagos() {
    const incluyePagos = selectorPagos.value === "Sí";

    contenedorPagos.hidden = !incluyePagos;

    if (!incluyePagos) {
        campoCantidadPagos.value = "";
        campoPagoSemanal.value = "";
    }

    calcularPagos();
}

selectorPagos.addEventListener("change", actualizarCampoPagos);

function calcularPagos() {
    const inversionTotal = convertirImporte(campoCostoTotal.value);

    const incluyePagos = selectorPagos.value === "Sí";

    const cantidadPagos = incluyePagos
        ? Number(campoCantidadPagos.value) || 0
        : 0;

    const montoSemanal = incluyePagos
        ? convertirImporte(campoPagoSemanal.value)
        : 0;

    // Anticipo del 60%
    const anticipo = inversionTotal * 0.60;

    // Saldo después del anticipo
    const saldoInicial = inversionTotal - anticipo;

    // Total de pagos semanales
    const totalSemanal = cantidadPagos * montoSemanal;

    // Saldo final
    const saldoFinal = saldoInicial - totalSemanal;

    // Mostrar resultados
    campoAnticipo.value =
        inversionTotal > 0 ? formatoNumero(anticipo) : "";

    campoSaldoInicial.value =
        inversionTotal > 0 ? formatoNumero(saldoInicial) : "";

    campoTotalSemanal.value =
        totalSemanal > 0 ? formatoNumero(totalSemanal) : "";

    campoSaldoFinal.value =
        inversionTotal > 0 ? formatoNumero(saldoFinal) : "";
}

// Formatear la inversión total mientras se escribe
campoCostoTotal.addEventListener("input", () => {
    const numero = convertirImporte(campoCostoTotal.value);

    campoCostoTotal.value =
        campoCostoTotal.value === "" ? "" : formatoNumero(numero);

    calcularPagos();
});

// Formatear el importe semanal mientras se escribe
campoPagoSemanal.addEventListener("input", () => {
    const numero = convertirImporte(campoPagoSemanal.value);

    campoPagoSemanal.value =
        campoPagoSemanal.value === "" ? "" : formatoNumero(numero);

    calcularPagos();
});

// Actualizar los cálculos cuando cambia la cantidad de pagos
campoCantidadPagos.addEventListener("input", calcularPagos);

selectorPorton.addEventListener("change", actualizarCampoPorton);

// Estado inicial
actualizarCampoPorton();

console.log("Perímetros NOA iniciado correctamente.");
