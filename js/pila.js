const inputPalabra = document.getElementById('formText');
const comprobarPalabra = document.getElementById('formSubmit');
const containerPila = document.getElementById('Pila');

function llenarPila(e){
    e.preventDefault()
    let palabra = inputPalabra.value;
    for(let i=0;i<palabra.length;i++){
        let contenedor = document.createElement('div');
        contenedor.classList.add('elementoPila')

        let elemento = document.createElement('p');
        elemento.classList.add('textPila');
        elemento.innerText=palabra[i];

        contenedor.appendChild(elemento)
        containerPila.appendChild(contenedor)
    }
}



comprobarPalabra.addEventListener('click',(e)=>llenarPila(e));
