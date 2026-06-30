const tbody = document.getElementById("tabla-tareas");
const form=document.querySelector(".form_agregar")
const iconCerrar=document.querySelector(".icon_Cerrar")
const miniform=document.querySelector(".form__action")
const btnAcutalizar=document.querySelector(".Aceptar")
const btnEliminar=document.querySelector(".Eliminar")
const form2=document.querySelector(".form2")
const cancelar=document.querySelector(".cancelar")


//form variables
const inputNombre = document.querySelector(".input__nombre");
const inputMateria = document.querySelector(".input__materia");
const inputPrioridad = document.querySelector(".input__prioridad");
const inputEstado = document.querySelector(".input__estado");
const inputFecha = document.querySelector(".input__fecha");
const inputPuntaje = document.querySelector(".input__puntaje");
const inputDescripcion = document.querySelector(".input__descripcion");
let fila

//obtener los datos del localStorage
function obtenerTareas() {
    return JSON.parse(localStorage.getItem("data")) ?? [];
}
//guardar en el localstorage
function guardarTareas(tareas) {
    localStorage.setItem("data", JSON.stringify(tareas));
}


//funcion que llena la tabla
function llenarTabla() {
    let cont=0
    const fragment = document.createDocumentFragment();
       tbody.innerHTML = ""; 
    for (const item of obtenerTareas()) {
        let color=""
        const fila = document.createElement("tr");
        fila.id=cont++

        if(item.prioridad==="Alta"){
           color = "#ff0000";
        }else if(item.prioridad==="Media"){
            color="#d2ae1d";
        }else{
            color="#18ce0b";
        }
        fila.innerHTML = `
            <td>${item.nombre_tarea}</td>
            <td style="color: ${color};" > ${item.prioridad}</td>
            <td>${item.fecha_limite}</td>
             <td>${item.estado_inicial}</td>
            <td>${item.materia}</td>
            <td>${item.puntaje_porcentaje}</td>
        `;
        
        fragment.appendChild(fila);
    }
    tbody.appendChild(fragment);
}


llenarTabla()
//funcion que agrega Registros
form.addEventListener("submit",(e)=>{
    e.preventDefault();
    let tareas=obtenerTareas()
    const registro={
        nombre_tarea: document.getElementById("nombre_tarea").value,
        materia: document.getElementById("materia").value,
        prioridad: document.getElementById("prioridad").value,
        descripcion: document.getElementById("descripcion").value,
        fecha_limite: document.getElementById("fecha_limite").value,
        estado_inicial: document.getElementById("estado_inicial").value,
        puntaje_porcentaje: document.getElementById("puntaje_porcentaje").value
    }
    tareas.push(registro)
    guardarTareas(tareas)

    form.reset()
    llenarTabla()
})

//mostrar miniFormulario
iconCerrar.addEventListener("click",()=>{
miniform.style.display="none"
})

//funcion que obtiene el Elemento o modifica
tbody.addEventListener("dblclick",(e)=>{
    fila=e.target.closest("tr")
    miniform.style.display="flex"
})

//eliminar Registros
btnEliminar.addEventListener("click",()=>{
    let tareas=obtenerTareas()
    tareas.splice(fila.id,1)
    guardarTareas(tareas)
     miniform.style.display="none"
    llenarTabla()
})

//Abrir Formulario Actualizar
btnAcutalizar.addEventListener("click",()=>{
    let tareas=obtenerTareas()
    let objeto=tareas[fila.id]
    miniform.style.display="none"
    form2.style.display="flex"
    inputNombre.value = objeto.nombre_tarea;
    inputMateria.value = objeto.materia;
    inputPrioridad.value = objeto.prioridad;
    inputDescripcion.value = objeto.descripcion;
    inputFecha.value = objeto.fecha_limite;
    inputEstado.value = objeto.estado_inicial;
    inputPuntaje.value = objeto.puntaje_porcentaje;
})

//cerrar Formulario Actualizar
cancelar.addEventListener("click",()=>{
form2.style.display="none"
})

//ejecutar Formulario
form2.addEventListener("submit",(e)=>{
    e.preventDefault();
    let tareas=obtenerTareas()
    let objeto=tareas[fila.id]
    objeto.nombre_tarea = inputNombre.value;
    objeto.materia = inputMateria.value;
    objeto.prioridad = inputPrioridad.value;
    objeto.descripcion = inputDescripcion.value;
    objeto.fecha_limite = inputFecha.value;
    objeto.estado_inicial = inputEstado.value;
    objeto.puntaje_porcentaje = inputPuntaje.value;

    guardarTareas(tareas)
    form2.style.display="none"
    llenarTabla()
    
})
const hamburguesa = document.getElementById("hamburguesa")
const navLinks = document.getElementById("navLinks")

hamburguesa.addEventListener("click", () => {
    navLinks.classList.toggle("abierto")
})
