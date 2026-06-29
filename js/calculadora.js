const Agregar = document.querySelector(".Agregar")
const formContainer = document.querySelector(".text__container-form")
const calcular = document.querySelector(".form_agregar")
const container_info = document.querySelector(".ponderado-info__body")
//aray Json que guardara en el localStorage

let arrayNotas=[
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
if(!localStorage.getItem("notasPonderadas")){
localStorage.setItem("notasPonderadas",JSON.stringify(arrayNotas))
}

//obtener datos del localstorage
function obtenerTareas() {
    return JSON.parse(localStorage.getItem("notasPonderadas")) ?? [];
}

//guardar en el localstorage
function guardarTareas(tareas) {
    localStorage.setItem("notasPonderadas", JSON.stringify(tareas));
}
let not=obtenerTareas()



//agregar inputs a la calculadora
Agregar.addEventListener("click", () => {
    const element = document.createElement("div");
    element.classList.add("form_row");
    element.innerHTML = `
        <input type="text" class="tipoPrueba">
                                  <label class="texto__oculto">Nota</label>
                                <input type="number"  class="obtenido" min="0" placeholder="0" required>
                                  <label class="texto__oculto">Porcentaje Total</label>
                                <input type="number"  min="0" class="dado" placeholder="0%" required>
                                <div class="img__container_delete ">
                                    <img src="img/image.png" alt=" imagen eliminar " class="img__delete" required>
                                </div>
    `;
    formContainer.appendChild(element);
    element.querySelector("input").focus();
});




//Rellena los campos de la sumatoria
calcular.addEventListener("submit", (e) => {
    e.preventDefault();
    const resultadoPonderado = document.querySelector(".resultado-nota")
    const fragment = document.createDocumentFragment();
    const total = document.createElement("div")
    const texto = document.querySelector(".resultado-texto")
    const listaNotas = document.querySelectorAll(".obtenido")
    const tipoPrueba = document.querySelectorAll(".tipoPrueba")
    const listaPorcentajes = document.querySelectorAll(".dado")
    let listaPorcentajePonderadas = []
    let listaNotasPonderadas = []
    let notasStorage=[]
    listaPorcentajePonderadas = calcularPorcentajePonderado(listaPorcentajes);

    listaNotasPonderadas = calcularNotasPonderado(listaNotas, listaPorcentajePonderadas);

    let totalNota = calcularSumaPonderada(listaNotasPonderadas);

    let porcentaje = calcularPorcentaje(listaPorcentajes);
    if (porcentaje !== 100) {
        texto.innerHTML = "La sumatoria de los porcentajes debe ser igual a 100"
    } else {
        let cont = 0
        container_info.innerHTML = "";
        arrayNotas=obtenerTareas()
       
        resultadoPonderado.textContent = totalNota.toFixed(2)
        for (const element of tipoPrueba) {
            const item = document.createElement("div")
           
            item.innerHTML = `<div class="ponderado-item">
                    <span class="prueba">${element.value}</span>
                    <span class="resultado">${listaNotasPonderadas[cont].toFixed(2)}</span>
                </div>`
             let guardarLocalStorage={
                "tipoPrueba":element.value,
                "nota":Number(listaNotas[cont].value) ,
                "porcentaje": Number(listaPorcentajes[cont].value)
            }
            notasStorage.push(guardarLocalStorage)
            cont++
            fragment.appendChild(item)
        }
        notasStorage.push({
            "total":totalNota
        })
        arrayNotas.push(notasStorage)
        guardarTareas(arrayNotas)
       
        

        total.innerHTML = `<div class="ponderado-item">
            <span class="prueba">Total</span>
            <span class="resultado">${totalNota}</span>
        </div>`
        container_info.appendChild(fragment)
        container_info.appendChild(total)

    }

        

})


//calcular porcentaje Ponderado
function calcularPorcentajePonderado(listaPorcentajes) {
    let listaPorcentajePonderadas = []
    for (const element of listaPorcentajes) {
        listaPorcentajePonderadas.push(Number(element.value) / 100)
    }
    return listaPorcentajePonderadas
}

//calcular notasPonderadas
function calcularNotasPonderado(listaNotas, listaPorcentajePonderadas) {
    let cont = 0
    let listaNotasPonderadas = []
    for (const element of listaNotas) {
        listaNotasPonderadas.push(Number(element.value) * listaPorcentajePonderadas[cont])
        cont++
    }
    return listaNotasPonderadas

}
//calcular sumaPonderada
function calcularSumaPonderada(listaNotasPonderadas) {
    let sum = 0
    listaNotasPonderadas.forEach((val) => {
        sum += val
    })
    return sum
}
//calcularPorcentaje
function calcularPorcentaje(listaPorcentajes) {
    let sumPorcentaje = 0
    listaPorcentajes.forEach((val) => {
        sumPorcentaje += Number(val.value)
    })
    return sumPorcentaje
}



//funcion que obtiene el elemento clickeado
formContainer.addEventListener("click", (e) => {
    if (e.target.tagName === "IMG") {
        const objeto = e.target.closest(".form_row")
        eliminar(objeto)
    }
})

//funcion que elimina los elementons seleccionados
function eliminar(object) {
    formContainer.removeChild(object)
}

const hamburguesa = document.getElementById("hamburguesa")
const navLinks = document.getElementById("navLinks")

hamburguesa.addEventListener("click", () => {
    navLinks.classList.toggle("abierto")
})
