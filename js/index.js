const containerLoader = document.getElementById('load');
const loaderCircle = document.getElementById('circle');
const textLoader = document.getElementById('textLoad');

const activarForm = document.getElementById('insertarPalabra')
const cuboIcon = document.getElementById('cuboIcon')
const form = document.getElementById('form')
const historialContenedor = document.getElementById('historialContainer');
const botonHistorial = document.getElementById('history');

const check = document.getElementById('clickDarkMode');
const tittle = document.getElementById('title');
const containerAutomata = document.getElementById('myDiagramDiv');
const Menu = document.getElementById('Menu');

window.addEventListener('load',()=>{
    setTimeout(()=>{
        containerLoader.classList.remove('load');
        containerLoader.classList.add('oculto');
    },2000)
})

activarForm.addEventListener('click',()=>{
    cuboIcon.classList.add('oculto')
    form.classList.remove('oculto')
    historialContenedor.classList.add('oculto')
    historialContenedor.classList.remove('containerHistorial')

})

document.addEventListener("DOMContentLoaded", function() {
    var rango = document.getElementById("formRango");
    var valor = document.getElementById("valorRango");
    valor.innerHTML = rango.value;
});

function mostrarValorRango() {
    var rango = document.getElementById("formRango");
    var valor = document.getElementById("valorRango");
    valor.textContent = rango.value;
}


loadTranslation('es');

const items = document.querySelectorAll('.items');
const dropdownContent = document.querySelector('.dropdown-content');


function loadTranslation(lang) {
    fetch(`idiomas/${lang}.txt`)
        .then(response => response.text())
        .then(data => {
            const translations = data.split('\n');
            translations.forEach(translation => {
            const [key, value] = translation.trim().split(/\s*=\s*/);
            const element = document.getElementById(key);
            const elements = [element];
            elements.forEach(element => {
                element.textContent = value;
            });
            }); 
    })
    .catch(error => console.error(error));
}



function highlightLanguage(item) {
    items.forEach(item => {
        item.classList.remove('active');
    });
    item.classList.add('active');
}

items.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        const lang = this.dataset.lang;
        loadTranslation(lang);
        highlightLanguage(this);
    });
});


document.getElementById('idioma').addEventListener('click', function() {
    dropdownContent.classList.toggle('show');
});

check.addEventListener('click',toggleEstilos)

function toggleEstilos(){
    Menu.classList.toggle('MenuDarck');
    tittle.classList.toggle('tittleDarck');
    containerAutomata.classList.toggle('containerAutomataDarck');
}

function abrirHistorial(){
    historialContenedor.classList.remove('oculto')
    historialContenedor.classList.add('containerHistorial')
    cuboIcon.classList.add('oculto')
    form.classList.add('oculto')
    obtenerDatos()
}

botonHistorial.addEventListener('click',abrirHistorial)

function actualizarVelocidad() {
    let speed = document.getElementById("formRango").value;
    timeoutDelay = 5000 - (speed * 45);
    timeoutDelayLinks = 4000 - (speed * 45);
}

    actualizarVelocidad();

    document.getElementById("formRango").addEventListener("input", function() {
        actualizarVelocidad();
    });


function mostrarModal(Aceptado){
modal.classList.remove('oculto')
modal.classList.add('containerModal')
mostrarResultado(Aceptado);
}

function mostrarResultado(Aceptado){
if(Aceptado){
    const text1 = document.getElementById("textModal");
    text1.style.display = "block";
    const text2 = document.getElementById("textModal2");
    text2.style.display = "none";
    const frase = text1.textContent;
    aceptadoModal.classList.remove('oculto')
    aceptadoModal.classList.add('aceptada')
    const mensaje = new SpeechSynthesisUtterance(frase);
    mensaje.pitch = -1;
    setTimeout(() => {
        speechSynthesis.speak(mensaje);
    }, 500);
    guardarEstado(true)
}else{
    const text1 = document.getElementById("textModal");
    text1.style.display = "none";
    const text2 = document.getElementById("textModal2");
    text2.style.display = "block";
    const frase = text2.textContent;
    noAceptadoModal.classList.remove('oculto')
    noAceptadoModal.classList.add('noAceptada')
    const mensaje = new SpeechSynthesisUtterance(frase);
    mensaje.pitch = -1;
    setTimeout(() => {
        speechSynthesis.speak(mensaje);
    }, 500);
    guardarEstado(false)
}
}

botonModal.addEventListener('click',()=>{
modal.classList.add('oculto')
modal.classList.remove('containerModal')

aceptadoModal.classList.remove('aceptado')
noAceptadoModal.classList.remove('noAceptada')

aceptadoModal.classList.add('oculto')
noAceptadoModal.classList.add('oculto')
})