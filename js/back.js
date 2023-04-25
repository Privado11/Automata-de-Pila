formText.addEventListener('input',(valor)=>guardarPalabra(valor))

const Palabra={
    'Palabra':'',
    'Estado':''
}

const diccionario = {
    "Aceptada": {
        "es": "Aceptada",
        "en": "Accepted",
        "fr": "Accepté"
    },
    "No Aceptada": {
        "es": "No Aceptada",
        "en": "Not Accepted",
        "fr": "Non accepté"
    }
};

function guardarPalabra(valor){
    const palabra = valor.target.value;
    Palabra.Palabra=palabra;
}
function guardarEstado(Estado){
    if(Estado){
        Palabra.Estado='Aceptada';
    }else{
        Palabra.Estado='No Aceptada';
    }
    console.log(JSON.stringify(Palabra))
    enviarDatos()
}

function enviarDatos(){
    fetch('https://desingkuro.pythonanywhere.com/Palabras_recibidas', {
        method: 'POST',
        body: JSON.stringify(Palabra),
        headers: {'Content-Type': 'application/json'}
    })
    .then(response => response.text())
    .then(data => console.log(data))
}


function actualizarTabla(data, tabla, idiomaDestino) {
    const rowCount = tabla.rows.length;
    for (let i = rowCount - 1; i > 0; i--) {
        tabla.deleteRow(i);
    }
      // Iterar sobre el array de datos y agregar cada fila a la tabla
    data.forEach((fila) => {
        const nuevaFila = tabla.insertRow();
        fila.forEach((palabra, index) => {
            const nuevaCelda = nuevaFila.insertCell();
            let nuevoTexto;
            if (index === 2) {
                const traduccion = diccionario[palabra][idiomaDestino];
                nuevoTexto = document.createTextNode(traduccion || palabra);
            } else {
                nuevoTexto = document.createTextNode(palabra);
            }
            nuevaCelda.appendChild(nuevoTexto);
        });
    });
}

function obtenerDatos() {
    let table = document.getElementById("tabla-datos");
    let rowCount = table.rows.length;
    for (var i = rowCount - 1; i > 0; i--) {
        table.deleteRow(i);
    }
    
    fetch('https://desingkuro.pythonanywhere.com/Palabras')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const tabla = document.getElementById("tabla-datos");
            let contadorColumna = 0;
            // valor predeterminado
            let idiomaDestino = "es"; 
            // Agregar controlador de eventos a los enlaces de idioma
            document.querySelectorAll(".dropdown-content a").forEach((enlace) => {
                enlace.addEventListener("click", (event) => {
                    event.preventDefault();
                    idiomaDestino = enlace.getAttribute("data-lang");
                    // Actualizar la tabla con los nuevos datos traducidos
                    actualizarTabla(data, tabla, idiomaDestino);
                });
            });
            // Construir la tabla inicialmente
            actualizarTabla(data, tabla, idiomaDestino);
        });
} 
