// ===================
// DATOS SIMULADOS
// ===================

const trabajadores = ["Juan", "Carlos", "Pedro", "Luis"];

const horas = ["08:00", "09:00", "10:00", "11:00"];

const reservasPorHora = {
    "08:00": ["Juan", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    "09:00": [null, "Carlos", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    "10:00": Array(18).fill(null),
    "11:00": ["Pedro", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]
};

let indiceHoraActual = 0;

// ===================
// LOGIN
// ===================

function login(event) {
    event.preventDefault();

    const usuario = document.getElementById("usuario").value;
    const rol = document.getElementById("rol").value;

    if (!usuario || !rol) {
        document.getElementById("mensaje").textContent = "Debe completar todos los campos";
        return;
    }

    localStorage.setItem("usuario", usuario);
    localStorage.setItem("rol", rol);

    if (rol === "jefe") {
        window.location.href = "Jefe.html";
    } else {
        window.location.href = "Trabajador.html";
    }
}

// ===================
// RESTRICCIÓN POR ROL
// ===================

function verificarRol(rolEsperado) {
    const rol = localStorage.getItem("rol");

    if (rol !== rolEsperado) {
        alert("Acceso no autorizado");
        window.location.href = "index.html";
        return;
    }

    if (rol === "jefe") cargarVistaJefe();
    if (rol === "trabajador") cargarVistaTrabajador();
}

// ===================
// VISTAS
// ===================

function cargarVistaJefe() {
    mostrarReservasHora();
}

function cargarVistaTrabajador() {

    const usuario = localStorage.getItem("usuario");
    let turno = "Sin turno asignado";

    for (const hora of horas) {
        if (reservasPorHora[hora].includes(usuario)) {
            turno = hora;
            break;
        }
    }

    const turnoElemento = document.getElementById("proximoTurno");

    if (turnoElemento) {
        turnoElemento.textContent = "Tu próximo turno es: " + turno;
    }

    mostrarReservasHora();
}

// ===================
// MOSTRAR RESERVAS
// ===================

function mostrarReservasHora() {

    const lista = document.getElementById("listaReservas");
    const horaTexto = document.getElementById("horaActual");

    if (!lista || !horaTexto) return;

    const hora = horas[indiceHoraActual];
    const reservas = reservasPorHora[hora];

    horaTexto.textContent = "Hora: " + hora;

    lista.innerHTML = "";

    reservas.forEach((socio, index) => {

        const campo = document.createElement("div");
        campo.classList.add("campoReserva");

        if (socio) {
            campo.classList.add("ocupado");
            campo.textContent = `Campo ${index + 1} - ${socio}`;
        } else {
            campo.classList.add("disponible");
            campo.textContent = `Campo ${index + 1} - Disponible`;
        }

        lista.appendChild(campo);
    });
}

// ===================
// NAVEGACIÓN HORAS
// ===================

function horaAnterior() {
    if (indiceHoraActual > 0) {
        indiceHoraActual--;
        mostrarReservasHora();
    }
}

function horaSiguiente() {
    if (indiceHoraActual < horas.length - 1) {
        indiceHoraActual++;
        mostrarReservasHora();
    }
}

// ===================
// CERRAR SESIÓN
// ===================

function cerrarSesion() {
    localStorage.clear();
    window.location.href = "index.html";
}
