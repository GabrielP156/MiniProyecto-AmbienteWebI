const diasNombre = ["D", "L", "M", "X", "J", "V", "S"]

let arrayNotas = [
    [
        {
            "tipoPrueba": "Parcial I",
            "nota": 80,
            "porcentaje": 30
        },
        {
            "tipoPrueba": "Parcial II",
            "nota": 70,
            "porcentaje": 30
        },
        {
            "tipoPrueba": "Proyecto",
            "nota": 90,
            "porcentaje": 40
        },
        {
            "total": 81
        }
    ]
]

//guardar array en el localStorage

if (!localStorage.getItem("notasPonderadas")) {
    localStorage.setItem("notasPonderadas", JSON.stringify(arrayNotas))
}

const estado=1


//crear el calendario
function construirCalendario() {
    const hoy = new Date()
    const anio = hoy.getFullYear()
    const mes = hoy.getMonth()

    const nombresMes = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]

    document.getElementById("calMes").textContent = nombresMes[mes] + " " + anio

    const grid = document.getElementById("calGrid")
    grid.innerHTML = ""

    diasNombre.forEach(d => {
        const cel = document.createElement("div")
        cel.className = "dia-nombre"
        cel.textContent = d
        grid.appendChild(cel)
    })

    const primerDia = new Date(anio, mes, 1).getDay()
    for (let i = 0; i < primerDia; i++) {
        const vacio = document.createElement("div")
        vacio.className = "dia vacio"
        grid.appendChild(vacio)
    }

    const totalDias = new Date(anio, mes + 1, 0).getDate()
    for (let d = 1; d <= totalDias; d++) {
        const cel = document.createElement("div")
        cel.className = "dia"
        cel.textContent = d
        if (d === hoy.getDate()) cel.classList.add("hoy")
        grid.appendChild(cel)
    }
}

construirCalendario()



// =====================================================
// Funciones para sessionStorage
// =====================================================
const STORAGE_USUARIO = "gestatarea_usuario"

const formLoginSimulado = document.getElementById("formLoginSimulado")
const loginNombre = document.getElementById("loginNombre")
const loginCorreo = document.getElementById("loginCorreo")
const btnCerrarSesion = document.getElementById("btnCerrarSesion")
const usuarioActual = document.getElementById("usuarioActual")
const headerUsuario = document.getElementById("headerUsuario")

function guardarUsuarioSesion(usuario) {
    sessionStorage.setItem(STORAGE_USUARIO, JSON.stringify(usuario))
}

function obtenerUsuarioSesion() {
    const usuarioGuardado = sessionStorage.getItem(STORAGE_USUARIO)
    if (!usuarioGuardado) {
        return null
    }
    return JSON.parse(usuarioGuardado)
}

function cerrarSesion() {
    sessionStorage.removeItem(STORAGE_USUARIO)
    mostrarUsuarioActual()
}

function mostrarUsuarioActual() {
    const usuario = obtenerUsuarioSesion()

    if (!usuario) {
        usuarioActual.innerHTML = `
            <p>No hay usuario logueado.</p>
        `

        headerUsuario.innerHTML = `
    <span class="user-offline"></span>
    Usuario no logueado
`
        return
    }

    usuarioActual.innerHTML = `
        <h4>${usuario.nombre}</h4>
        <p>${usuario.correo}</p>
    `

    headerUsuario.innerHTML = `
    <span class="user-online"></span>
    ${usuario.nombre}`
}



//Crear el usuario con el formulario
formLoginSimulado.addEventListener("submit", function (event) {
    event.preventDefault()
    const nombre = loginNombre.value.trim()
    const correo = loginCorreo.value.trim()
    if (nombre === "" || correo === "") {
        alert("Debe ingresar nombre y correo.")
        return
    }
    guardarUsuarioSesion({ nombre, correo, estado })
    loginNombre.value = ""
    loginCorreo.value = ""
    mostrarUsuarioActual()
    roles()
})

btnCerrarSesion.addEventListener("click", function () {
    cerrarSesion()
    roles()
})

document.addEventListener("DOMContentLoaded", function () {
    mostrarUsuarioActual()
})

document.addEventListener("click", function (e) {
    const dropdown = document.querySelector(".session-dropdown")
    if (!dropdown.contains(e.target)) {
        dropdown.removeAttribute("open")
    }
})




//funcion que crea el localstorage
fetch("Json/data.json")
    .then(res => res.json())
    .then(data => {
        if (!localStorage.getItem("data")) {
            localStorage.setItem("data", JSON.stringify(data))
        }


        //LLENAR LOS CAMPOS DE INDEX
        let datos = JSON.parse(localStorage.getItem("data"))

        let activas = datos.filter(t => t.estado_inicial !== "Completada")
        document.getElementById("statActivas").textContent = activas.length

        const hoy = new Date()
        hoy.setHours(0, 0, 0, 0)

        const fin = new Date()
        fin.setHours(0, 0, 0, 0)
        fin.setDate(fin.getDate() + 7)

        let semana = datos.filter(t => {
            const fecha = new Date(t.fecha_limite)
            fecha.setHours(0, 0, 0, 0)

            return fecha >= hoy && fecha <= fin
        })
        document.getElementById("statSemana").textContent = semana.length




        //Crear Modal con tareas
        const overlay = document.getElementById("modalOverlay")
        const modalTitulo = document.getElementById("modalTitulo")
        const modalContenido = document.getElementById("modalContenido")

        function colorPrioridad(prioridad) {
            if (prioridad === "Alta") return "#e74c3c"
            if (prioridad === "Media") return "#f1c40f"
            return "#2ecc71"
        }

        function abrirModal(titulo, tareas, tipo) {
            modalTitulo.textContent = titulo
            let html = ""
            for (let t of tareas) {
                if (tipo === "activas") {
                    html += `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08)">
              <div>
                <div style="font-size:14px;font-weight:600">${t.nombre_tarea}</div>
                <div style="font-size:12px;opacity:0.5;margin-top:3px">${t.materia}</div>
              </div>
              <div style="font-size:11px;opacity:0.5;white-space:nowrap;margin-left:12px">${t.estado_inicial}</div>
            </div>
          `
                } else {
                    html += `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08)">
              <div>
                <div style="font-size:14px;font-weight:600">${t.nombre_tarea}</div>
                <div style="font-size:12px;opacity:0.5;margin-top:3px">${t.fecha_limite}</div>
              </div>
              <div style="width:12px;height:12px;border-radius:50%;background:${t.estado_inicial === "Completada" ? "#3498db" : colorPrioridad(t.prioridad)};margin-left:12px;flex-shrink:0"></div>
            </div>
          `
                }
            }
            modalContenido.innerHTML = html
            overlay.style.display = "block"
        }

        document.getElementById("cardActivas").addEventListener("click", () => {
            abrirModal("Tareas Activas", activas, "activas")
        })

        document.getElementById("cardSemana").addEventListener("click", () => {
            abrirModal("Entregas Esta Semana", semana, "semana")
        })

        document.getElementById("modalCerrar").addEventListener("click", () => {
            overlay.style.display = "none"
        })

        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) {
                overlay.style.display = "none"
            }
        })
        document.getElementById("btnProblema").addEventListener("click", () => {
            modalTitulo.textContent = "¿Qué es GestaTarea?"
            modalContenido.innerHTML = `
    <div style="font-size:14px;line-height:1.7;opacity:0.85">
      <p style="margin-bottom:12px">
        Los estudiantes universitarios deben gestionar tareas, proyectos, quices y exámenes 
        de múltiples materias al mismo tiempo. Al no contar con una herramienta centralizada, 
        anotan pendientes en distintos lugares y lo más común es olvidar las asignaciones, 
        generando entregas tardías y estrés innecesario.
      </p>
      <p>
        <b>GestaTarea</b> es una solución web accesible desde celular o computadora que permite 
        al estudiante registrar, consultar y marcar tareas en segundos, reduciendo el riesgo 
        de olvidar entregas importantes.
      </p>
    </div>
  `
            overlay.style.display = "block"
        })
    })



   function roles() {
    let obtener = obtenerUsuarioSesion();
    let btn1 = document.querySelector(".btn-naranja");
    let btn2 = document.querySelector(".btn-gris");

    let data = document.querySelectorAll(".o-item");

    if (obtener === null) {
        for (const element of data) {
            element.style.display = "none";
        }

        btn1.style.pointerEvents = "none";
        btn1.style.opacity = "0.5";
        btn2.style.pointerEvents = "none";
        btn2.style.opacity = "0.5";
    } else {
        for (const element of data) {
            element.style.display = "inherit";
        }
        btn1.style.pointerEvents = "auto";
        btn1.style.opacity = "1";
        btn2.style.pointerEvents = "auto";
        btn2.style.opacity = "1";
    }
}


  function obtenerTareas() {
    return JSON.parse(localStorage.getItem("notasPonderadas")) ?? [];
  }
  function mostrarIndex(){
      const notas = obtenerTareas();
  let numeroCalculadora = document.querySelector(".notas1")
  let promedio = document.querySelector(".promedio")
  let cont = 0
  promedio.textContent = notas.at(-1).at(-1).total + " %";
  numeroCalculadora.textContent = notas.length

  }
roles()
mostrarIndex()

//navbar responsive hamburguesa

const hamburguesa = document.getElementById("hamburguesa")
const navLinks = document.getElementById("navLinks")

hamburguesa.addEventListener("click", () => {
    navLinks.classList.toggle("abierto")
})