const contenedor = document.querySelector(".main_wrapper")
const pendienteElement = document.querySelector(".rojo")
const completadoElement = document.querySelector(".verde")
const progresoElement = document.querySelector(".amarillo")
const totalElement = document.querySelector(".blanco")
const btnBuscar = document.querySelector(".searchBtn")
const inputBuscar = document.querySelector(".search__main")
const btnLimpiar = document.querySelector(".limpiar")

let tareas = []

fetch("Json/data.json")
  .then(res => res.json())
  .then(data => {
    if (!localStorage.getItem("data")) {
      localStorage.setItem("data", JSON.stringify(data))
    }
    tareas = JSON.parse(localStorage.getItem("data"))
    totalesFijos = tareas
    autocomplete(tareas)
    argumentos(tareas)
  })

let totalesFijos = []
let jsonFilter = tareas
//funcion para llenar todos los registros del JSON
let autocomplete = (tareas2) => {
  let html = "";
  const colores = ["#FFD700", "#28A745", "#DC3545"];
  let color

  for (const tarea of tareas2) {
   if(tarea.estado_inicial === "Pendiente"){
    color=colores[2]
    }else{
      if(tarea.estado_inicial === "En progreso"){
        color=colores[0]
      }else{
        color=colores[1]
      }
    }
    html += `
      <div class="card" style="border-left: 5px solid ${color}">
        <h3>${tarea.nombre_tarea}</h3>
        <p>Materia: ${tarea.materia}</p>
        <p>Prioridad: ${tarea.prioridad}</p>
        <p>Estado: ${tarea.estado_inicial}</p>
      </div>
    `;
  }

  contenedor.innerHTML = html;
};


//Funcion que omite minusculas mayusculas y tildes
function normalizarTexto(texto) {
  return texto
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

//Funcion que rellena los campos de cada tarea
let argumentos = (jsonFilter2) => {
  let pendientes = 0
  let completadas = 0
  let progreso = 0
  let total = 0
  for (const item of jsonFilter2) {
    if (item.estado_inicial === "Pendiente") {
      pendientes += 1
    } else {
      if (item.estado_inicial === "En progreso") {
        progreso += 1
      } else {
        completadas += 1
      }
    }
  }
  total = jsonFilter2.length
  pendienteElement.innerHTML = pendientes
  completadoElement.innerHTML = completadas
  progresoElement.innerHTML = progreso
  totalElement.innerHTML = total

}

//funcion Buscar filtro
function filtros(arr) {
  const estado = normalizarTexto(document.getElementById("estado").value);
  const prioridad = normalizarTexto(document.getElementById("prioridad").value);

  return arr.filter(item => {
    const estadoOk =
      estado === "" ||
      normalizarTexto(item.estado_inicial) === estado;

    const prioridadOk =
      prioridad === "" ||
      normalizarTexto(item.prioridad) === prioridad;

    return estadoOk && prioridadOk;
  });
}

//funcion Buscar input
btnBuscar.addEventListener("click", () => {
  let arrayNuevo = [];

  let valor = normalizarTexto(inputBuscar.value);

  for (let tarea of tareas) {
    let nombre = normalizarTexto(tarea.nombre_tarea);
    let materia = normalizarTexto(tarea.materia);

    if (nombre.includes(valor) || materia.includes(valor)) {
      arrayNuevo.push(tarea);
    }
  }
  let arr = filtros(arrayNuevo)
  autocomplete(arr);
  argumentos(arr)
});




btnLimpiar.addEventListener("click", () => {
  inputBuscar.value = ""
  autocomplete(tareas)
  argumentos(tareas)
  document.getElementById("estado").selectedIndex = 0
  document.getElementById("prioridad").selectedIndex = 0

})

const hamburguesa = document.getElementById("hamburguesa")
const navLinks = document.getElementById("navLinks")

hamburguesa.addEventListener("click", () => {
  navLinks.classList.toggle("abierto")
})