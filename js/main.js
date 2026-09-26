class Paciente {
    constructor(nombre, edad, raza, especie, tutor,id=crypto.randomUUID() ) {
        this.id=id;
        this.nombre = nombre;
        this.edad = edad;
        this.raza = raza;
        this.especie = especie;
        this.tutor = tutor;
        this.historial = "sin historial medico";
    }

    actualizarHistorial(nuevoRegistro) {
        this.historial = nuevoRegistro
    }
}

const paciente1 = new Paciente("Curcuma", 7, "mestizo", "perro", "Nancy");
const paciente2 = new Paciente("Curky", 5, "chihuahua", "perro", "Lucas");
const paciente3 = new Paciente("Manuelita", 80, "tortuga", "reptil", "Barbara");
const paciente4 = new Paciente("Poly", 4, "mestizo", "gato", "Nancy");
const paciente5 = new Paciente("Luna", 3, "mestizo", "perro", "Lucas");

const pacienteDeMuestra = [paciente1, paciente2, paciente3, paciente4, paciente5];


const contenedorPaciente = document.getElementById("contenedorPaciente");
const formPaciente= document.getElementById("formPaciente");
const mensajeRegistro= document.getElementById("mensajeRegistro");
const inputBuscar= document.getElementById("inputBuscar");
const btnLimpiarstorage= document.getElementById("btnLimpiarstorage");




function guardarPaciente(lista){
    const PacienteJson = JSON.stringify(lista);
    localStorage.setItem(`datosPaciente`,PacienteJson);
}

function obtenerPaciente(){
    
try {  const pacienteStorage = localStorage.getItem(`datosPaciente`)
    return pacienteStorage ? JSON.parse(pacienteStorage): pacienteDeMuestra;
}catch(error){console.log("Error al leer datosPaciente de LocalStorage: " + error)
    return pacienteDeMuestra

}finally{console.log("Inicializacion de lista de pacientes completa.")}

}
    

let listaDePacientes = obtenerPaciente();

function vaciarStorage(){

    localStorage.removeItem("datosPaciente");
    listaDePacientes=[]
    mostrarPacientes(listaDePacientes)
}




function mostrarPacientes(lista) {

    contenedorPaciente.innerHTML = "";

    lista.forEach((paciente) => {
        const tarjeta = document.createElement("article");
        tarjeta.classList.add("card")
        const {nombre, edad, raza, especie, tutor, historial, id}=paciente
        tarjeta.innerHTML = `<h3>${nombre}</h3>
                             <p>Edad: ${edad}</p>
                             <p>Raza:${raza}</p>
                             <p>Especie: ${especie}</p>
                             <p>Tutor: ${tutor}</p>
                             <p class="historial">Historial: ${historial? historial : "Sin historial médico"}</p>
                             <input type="text" class="input-historial" placeholder="Nuevo diagnóstico">
                             <button class="btn-historial btn">Modificar Historial</button>
                             <button class="btn-eliminar btn"> Eliminar Paciente </button>
                             `
        const btn= tarjeta.querySelector(".btn-historial");
        const btnEliminar=tarjeta.querySelector(".btn-eliminar")
        const inputHistorial = tarjeta.querySelector(".input-historial");
        const parrafoHistorial = tarjeta.querySelector(".historial");

        btnEliminar.addEventListener("click",()=>{


            listaDePacientes=listaDePacientes.filter(p=>p.id !== id);

            guardarPaciente(listaDePacientes);

            mostrarPacientes(listaDePacientes);

        })

        btn.addEventListener("click",()=>{
            const textoHistorial=inputHistorial.value.trim();

            if(textoHistorial!==""){
                paciente.historial = textoHistorial;
                parrafoHistorial.textContent=`Historial: ${textoHistorial}`;
                inputHistorial.value="";
            }

            guardarPaciente(listaDePacientes);
        })
        
        contenedorPaciente.appendChild(tarjeta);
    })

}
mostrarPacientes(listaDePacientes);

formPaciente.addEventListener("submit",(e)=>{
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const edad= Number(document.getElementById("edad").value);
    const raza = document.getElementById("raza").value.trim();
     const especie= document.getElementById("especie").value.trim();
    const tutor= document.getElementById("tutor").value.trim();

    const nuevoPaciente = new Paciente (nombre,edad ,especie ,raza ,tutor );
    listaDePacientes.push(nuevoPaciente);
       guardarPaciente(listaDePacientes);

            Toastify({
            text:`${nuevoPaciente.nombre} fue agregado con exito `,
            duration:4000,
            gravity:"center",
            position:"center",
            style:{
                background:"linear-gradient(to right, #E0FCFF, #FFE0E0)",
                color:"#26292B"
            }
        }).showToast(); 
      

    

    mostrarPacientes(listaDePacientes);
     formPaciente.reset();

});

inputBuscar.addEventListener("input", ()=>{
    const textoInput = inputBuscar.value.toLowerCase().trim();

    const pacienteFiltrado =listaDePacientes.filter(({nombre, tutor})=>{
        const datos =`${nombre} ${tutor}`.toLowerCase();
        return datos.includes(textoInput);
    });
    pacienteFiltrado.length>0 ? mostrarPacientes(pacienteFiltrado):
    (contenedorPaciente.innerHTML="<p> No se encontro coincidencia. </p>");
});

btnLimpiarstorage.addEventListener("click",vaciarStorage);

setTimeout(() => {
    Toastify({
        text: `📋 Tenés ${listaDePacientes.length} pacientes registrados en el sistema`,
        duration: 4000,
        gravity: "top",
        position: "right",
        style: {
            background: "linear-gradient(to right, #bcf5ee, #f1a4bb)",
            color:"#262929"
        }
    }).showToast();
}, 2000);