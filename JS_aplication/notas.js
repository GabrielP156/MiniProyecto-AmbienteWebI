let notas = []
try {
  notas = JSON.parse(localStorage.getItem("notas")) || []
} catch (e) {
  notas = []
}

const colores = ["#f47c20", "#e74c3c", "#3b82f6", "#8e44ad", "#10b981", "#f59e0b"]

function guardar() {
  localStorage.setItem("notas", JSON.stringify(notas))
}

function renderizar() {
  const grid = document.getElementById("notasGrid")
  grid.innerHTML = ""

  const btnAdd = document.createElement("button")
  btnAdd.className = "btn-nueva-nota"
  btnAdd.textContent = "+ Nueva Nota"
  btnAdd.addEventListener("click", abrirModalCrear)
  grid.appendChild(btnAdd)

  if (notas.length === 0) return

  notas.forEach((nota, i) => {
    const card = document.createElement("div")
    card.className = "nota-card"
    card.style.borderColor = nota.color

    card.innerHTML = `
      <div class="nota-numero">${i + 1}</div>
      <div class="nota-menu-btn" data-i="${i}">&#8942;</div>
      <div class="nota-dropdown" id="drop-${i}">
        <div class="drop-item" data-accion="color" data-i="${i}">Cambiar color</div>
        <div class="drop-item" data-accion="eliminar" data-i="${i}">Eliminar</div>
      </div>
      <div class="nota-titulo" data-i="${i}">${nota.titulo}</div>
    `
    grid.appendChild(card)
  })

  document.querySelectorAll(".nota-menu-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation()
      const i = btn.dataset.i
      const drop = document.getElementById(`drop-${i}`)
      document.querySelectorAll(".nota-dropdown").forEach(d => d.classList.remove("activo"))
      drop.classList.toggle("activo")
    })
  })

  document.querySelectorAll(".drop-item").forEach(item => {
    item.addEventListener("click", (e) => {
      e.stopPropagation()
      const i = parseInt(item.dataset.i)
      if (item.dataset.accion === "eliminar") {
        notas.splice(i, 1)
        guardar()
        renderizar()
      } else {
        abrirModalColor(i)
      }
    })
  })

  document.querySelectorAll(".nota-titulo").forEach(el => {
    el.addEventListener("click", () => {
      const i = parseInt(el.dataset.i)
      abrirModalVer(i)
    })
  })

  document.addEventListener("click", () => {
    document.querySelectorAll(".nota-dropdown").forEach(d => d.classList.remove("activo"))
  })
}

function abrirModalCrear() {
  const overlay = document.getElementById("modalOverlay")
  const contenido = document.getElementById("modalContenido")
  let colorSeleccionado = colores[0]

  contenido.innerHTML = `
    <h3 style="margin-bottom:14px">Nueva Nota</h3>
    <input type="text" id="inputTitulo" placeholder="Título" style="width:100%;padding:8px;margin-bottom:12px;border-radius:8px;border:none;background:#2a2a3e;color:white"/>
    <div style="display:flex;gap:8px;margin-bottom:12px" id="paletaColores">
      ${colores.map(c => `<div class="circulo-color" data-color="${c}" style="background:${c};width:22px;height:22px;border-radius:50%;cursor:pointer;border:2px solid transparent"></div>`).join("")}
    </div>
    <textarea id="inputNota" placeholder="Nota..." style="width:100%;height:100px;padding:8px;border-radius:8px;border:none;background:#2a2a3e;color:white;resize:none"></textarea>
    <button id="btnGuardarNota" style="margin-top:14px;width:100%;padding:10px;background:#f47c20;border:none;border-radius:8px;color:white;cursor:pointer;font-weight:600">Guardar</button>
  `

  overlay.style.display = "flex"

  document.querySelectorAll(".circulo-color").forEach(c => {
    c.addEventListener("click", () => {
      document.querySelectorAll(".circulo-color").forEach(x => x.style.border = "2px solid transparent")
      c.style.border = "2px solid white"
      colorSeleccionado = c.dataset.color
    })
  })
  document.querySelector(".circulo-color").style.border = "2px solid white"

  document.getElementById("btnGuardarNota").addEventListener("click", () => {
    const titulo = document.getElementById("inputTitulo").value.trim()
    const texto = document.getElementById("inputNota").value.trim()
    if (!titulo) return
    notas.push({ titulo, texto, color: colorSeleccionado })
    guardar()
    overlay.style.display = "none"
    renderizar()
  })
}

function abrirModalVer(i) {
  const nota = notas[i]
  const overlay = document.getElementById("modalOverlay")
  const contenido = document.getElementById("modalContenido")
  contenido.innerHTML = `
    <input type="text" id="editTitulo" value="${nota.titulo}" style="width:100%;padding:8px;margin-bottom:12px;border-radius:8px;border:none;background:#2a2a3e;color:${nota.color};font-size:16px;font-weight:700"/>
    <textarea id="editNota" style="width:100%;height:120px;padding:8px;border-radius:8px;border:none;background:#2a2a3e;color:white;resize:none;line-height:1.7">${nota.texto || ""}</textarea>
    <button id="btnGuardarEdicion" style="margin-top:14px;width:100%;padding:10px;background:#f47c20;border:none;border-radius:8px;color:white;cursor:pointer;font-weight:600">Guardar cambios</button>
  `
  overlay.style.display = "flex"

  document.getElementById("btnGuardarEdicion").addEventListener("click", () => {
    const nuevoTitulo = document.getElementById("editTitulo").value.trim()
    const nuevoTexto = document.getElementById("editNota").value.trim()
    if (!nuevoTitulo) return
    notas[i].titulo = nuevoTitulo
    notas[i].texto = nuevoTexto
    guardar()
    overlay.style.display = "none"
    renderizar()
  })
}

function abrirModalColor(i) {
  const overlay = document.getElementById("modalOverlay")
  const contenido = document.getElementById("modalContenido")
  contenido.innerHTML = `
    <h3 style="margin-bottom:14px">Cambiar color</h3>
    <div style="display:flex;gap:10px;justify-content:center">
      ${colores.map(c => `<div class="circulo-color" data-color="${c}" style="background:${c};width:28px;height:28px;border-radius:50%;cursor:pointer"></div>`).join("")}
    </div>
  `
  overlay.style.display = "flex"

  document.querySelectorAll(".circulo-color").forEach(c => {
    c.addEventListener("click", () => {
      notas[i].color = c.dataset.color
      guardar()
      overlay.style.display = "none"
      renderizar()
    })
  })
}

document.getElementById("modalCerrar").addEventListener("click", () => {
  document.getElementById("modalOverlay").style.display = "none"
})

document.getElementById("modalOverlay").addEventListener("click", (e) => {
  if (e.target.id === "modalOverlay") {
    document.getElementById("modalOverlay").style.display = "none"
  }
})
const hamburguesa = document.getElementById("hamburguesa")
const navLinks = document.getElementById("navLinks")

hamburguesa.addEventListener("click", () => {
  navLinks.classList.toggle("abierto")
})
renderizar()
