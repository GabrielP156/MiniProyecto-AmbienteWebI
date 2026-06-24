const diasNombre = ["D", "L", "M", "X", "J", "V", "S"]

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
fetch("Json/data.json")
    .then(res => res.json())
    .then(data => {
        localStorage.setItem("data", JSON.stringify(data))

        if (!localStorage.getItem("estadosTareas")) {
            const estados = {}
            for (const t of data) {
                estados[t.id] = t.estado_inicial === "Completada"
            }
            localStorage.setItem("estadosTareas", JSON.stringify(estados))
        }

        if (!localStorage.getItem("tareasUsuario")) {
            localStorage.setItem("tareasUsuario", JSON.stringify([]))
        }

        const datos = JSON.parse(localStorage.getItem("data"))

        let activas = datos.filter(t => t.estado_inicial !== "Completada")
        document.getElementById("statActivas").textContent = activas.length

        const hoy = new Date()
        const fin = new Date()
        fin.setDate(hoy.getDate() + 7)

        let semana = datos.filter(t => {
            const p = t.fecha_limite.split("/")
            const fecha = new Date(p[2], p[1] - 1, p[0])
            return fecha >= hoy && fecha <= fin
        })
        document.getElementById("statSemana").textContent = semana.length

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

const hamburguesa = document.getElementById("hamburguesa")
const navLinks = document.getElementById("navLinks")

hamburguesa.addEventListener("click", () => {
    navLinks.classList.toggle("abierto")
})