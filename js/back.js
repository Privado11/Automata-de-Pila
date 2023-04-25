//document.addEventListener('load',obtenerPalabras())


function obtenerPalabras(){
    try{
        fetch('https://desingkuro.pythonanywhere.com/Palabras')
            .then(data=>data.json)
            .then(data=>{
                console.log(JSON.stringify(data)+"se obtuvieron con exito")
            })
    }catch(error){
        console.log(error+" ha sucesido un arror")
    }
}

const Palabra={
    'Palabra':'',
    'Estado':''
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