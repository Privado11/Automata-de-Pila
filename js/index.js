const containerLoader = document.getElementById('load');
const loaderCircle = document.getElementById('circle');
const textLoader = document.getElementById('textLoad');

const activarForm = document.getElementById('insertarPalabra')
const cuboIcon = document.getElementById('cuboIcon')
const form = document.getElementById('form')

const check = document.getElementById('clickDarkMode');
const tittle = document.getElementById('title');
const containerAutomata = document.getElementById('myDiagramDiv');
const Menu = document.getElementById('Menu');

//Commander
class Command {
    execute() {}
}

// Commander para mostrar cuadro de validación de palabras
class ActivarFormCommand extends Command {
    constructor(cuboIcon, form) {
      super();
      this.cuboIcon = cuboIcon;
      this.form = form;
    }
  
    execute() {
      this.cuboIcon.classList.add('oculto');
      this.form.classList.remove('oculto');
    }
  }
  
  // Crea una instancia del comando y pásalo al controlador de eventos del botón
  const activarFormCommand = new ActivarFormCommand(cuboIcon, form);
  activarForm.addEventListener('click', () => activarFormCommand.execute());
  
//Commander para el modo Oscuro
class ToggleEstilosCommand extends Command {
    constructor(menu, tittle, containerAutomata) {
      super();
      this.menu = menu;
      this.tittle = tittle;
      this.containerAutomata = containerAutomata;
    }
  
    execute() {
      this.menu.classList.toggle('MenuDarck');
      this.tittle.classList.toggle('tittleDarck');
      this.containerAutomata.classList.toggle('containerAutomataDarck');
    }
  }
  
  const toggleEstilosCommand = new ToggleEstilosCommand(Menu, tittle, containerAutomata);
  check.addEventListener('click', () => toggleEstilosCommand.execute());
  




//Command para cambio de idioma
class ChangeLanguageCommand {
    constructor(lang) {
      this.lang = lang;
    }
  
    execute() {
      loadTranslation(this.lang);
      highlightLanguage(this.lang);
    }
  }
  
  // Función que crea y ejecuta el Command 
  function changeLanguage(lang) {
    const command = new ChangeLanguageCommand(lang);
    command.execute();
  }
  
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
  
  function highlightLanguage(lang) {
    items.forEach(item => {
      item.classList.remove('active');
    });
    const item = document.querySelector(`.items[data-lang="${lang}"]`);
    item.classList.add('active');
  }
  
  document.getElementById('idioma').addEventListener('click', function() {
    dropdownContent.classList.toggle('show');
  });
  
  items.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const lang = this.dataset.lang;
      changeLanguage(lang);
    });
  });
  






//Carga de la página
window.addEventListener('load',()=>{
    setTimeout(()=>{
        containerLoader.classList.remove('load');
        containerLoader.classList.add('oculto');
    },2000)
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
  