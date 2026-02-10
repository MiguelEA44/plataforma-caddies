const trabajadores = ["Juan", "Carlos", "Pedro", "Luis"];
const reservas = ["08:00", "09:00", "10:00", "11:00"];

// LOGIN
function login(event) {
    event.preventDefault();

    const usuario = document.getElementById("usuario").value;
    const rol = document.getElementById("rol").value;

    if (usuario === "") {
        document.getElementById("mensaje").textContent = "Usuario inválido";
        return;
    }

    localStorage.setItem("rol", rol);
    localStorage.setItem("usuario", usuario);

    if (rol === "jefe") {
        window.location.href = "jefe.html";
    } else {
        window.location.href = "trabajador.html";
    }
}

// RESTRICCIÓN POR ROL
function verificarRol(rolEsperado) {
    const rol = localStorage.getItem("rol");

    if (rol !== rolEsperado) {
        alert("Acceso no autorizado");
        window.location.href = "index.html";
    }

    if (rol === "jefe") cargarVistaJefe();
    if (rol === "trabajador") cargarVistaTrabajador();
}

// VISTA JEFE
function cargarVistaJefe() {
    const listaT = document.getElementById("listaTrabajadores");
    const listaR = document.getElementById("listaReservas");

    trabajadores.forEach(t => {
        const li = document.createElement("li");
        li.textContent = t;
        listaT.appendChild(li);
    });

    reservas.forEach(r => {
        const li = document.createElement("li");
        li.textContent = r;
        listaR.appendChild(li);
    });
}

// VISTA TRABAJADOR
function cargarVistaTrabajador() {
    const usuario = localStorage.getItem("usuario");
    const turno = reservas[trabajadores.indexOf(usuario)] || "Sin turno";

    document.getElementById("proximoTurno").textContent =
        "Tu próximo turno es: " + turno;

    const listaR = document.getElementById("listaReservas");

    reservas.forEach(r => {
        const li = document.createElement("li");
        li.textContent = r;
        listaR.appendChild(li);
    });
}

// CERRAR SESIÓN
function cerrarSesion() {
    localStorage.clear();
    window.location.href = "index.html";
}
