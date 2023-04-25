
const inputPalabra = document.getElementById('formText');
const comprobarPalabra = document.getElementById('formSubmit');
const containerPila = document.getElementById('Pila');


let diagram;

window.onload = function init() {
  
        // Definir los datos del autómata
        var nodeDataArray = [
          { key: "0", text: "q0", loc: new go.Point(-150, 0) },
          { key: "1", text: "q1", loc: new go.Point(0, 0), isAccept: false },
          { key: "2", text: "q2", loc: new go.Point(150, 0), isAccept: true },
        ];
      
        var linkDataArray = [
          // Desde el nodo 0 al mismo
          { from: "0", to: "0", text: "b,b/bb\na,b/ba\nb,a/ab\na,a/aa\nb,#/#b\na,#/#a" },
          // Desde el nodo 0 al nodo 1
          { from: "0", to: "1", text: "b,b/λ\na,a/λ" },
          // Desde el nodo 1 al mismo
          { from: "1", to: "1", text: "b,b/λ\na,a/λ" },
          // Desde el nodo 1 al nodo 2
          { from: "1", to: "2", text: "λ,#/#" }
        ];
        
      
      // Crear el diagrama con GoJS
      var $ = go.GraphObject.make;
      
      diagram = $(go.Diagram, "myDiagramDiv", {
          "undoManager.isEnabled": true,
          allowMove: false,
          allowHorizontalScroll: false,
          allowVerticalScroll: false
      });
      
      // Definir los nodos y las conexiones
      diagram.nodeTemplate =
      $(go.Node, "Auto", 
          { width: 50, height: 50},
          new go.Binding("location", "loc"),
          $(go.Shape, "Ellipse", { fill: "white", stroke: "black", strokeWidth: 2 }),
          $(go.Panel, "Auto",
              { visible: false },
              new go.Binding("visible", "isAccept"),
              $(go.Shape, "Circle", { fill: "null", width: 40, height: 40, strokeWidth: 2})
          ),
          $(go.TextBlock, { margin: 5 }, new go.Binding("text", "text"))
      );
      
      // Definir los enlaces
      diagram.linkTemplate =
      $(go.Link,
        { curve: go.Link.Bezier, curviness: 10 },
        $(go.Shape, { strokeWidth: 2, stroke: "black" }),
        $(go.Shape, { toArrow: "OpenTriangle", fill: null }),
        $(go.TextBlock,
          new go.Binding("text", "text"), 
          { position: new go.Point(6, 6), font: "13pt sans-serif" }, 
          new go.Binding("text", "loc"),
          new go.Binding("segmentOffset", "", function(link) {
            if (link.from === "0" && link.to === "0") {
              return new go.Point(0, -60);
            } else {
              return new go.Point(0, -20);
            }
          })
        )
      );
      
      // Agregar los datos al diagrama
      diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
      diagram.isReadOnly = true;
}

function procesarEntrada(evento,entrada) {
    evento.preventDefault();
    // empezar en el estado inicial
    var estadoActual = diagram.findNodeForKey("0");
    var pila = ["#"]; // iniciar la pila con el símbolo inicial
    var siguienteEstado = null;
    let introducirAPila=[];
    // Colocamos los nodos al color por defecto
    diagram.nodes.each(function(node) {
      node.findMainElement().stroke = "black";
      node.findMainElement().fill = "white";
    });

    // Colocamos los enlaces al color por defecto
    diagram.links.each(function(link) {
      link.path.stroke = "black";
      link.path.strokeDashArray = [];
    });

    let mitad = entrada.length%2 ==0 ?entrada.length/2 :entrada.length/2+1

    //console.log(mitad)
    // Recorrer la entrada
        for (let i = 0; i < entrada.length; i++) {
          var simbolo = entrada[i];
          // Buscar la conexión correspondiente al estado actual y al símbolo actual
          
          diagram.links.each(function(link) {
            let grupoLinks=link.data.text.split('\n')
            //console.log(grupoLinks)
            grupoLinks.map((elemento)=>{
              //onsole.log(elemento+' '+index)
              //console.log('entro: '+elemento+' '+index)
                let caracter=elemento.split(',')

                //el tope indicado en el link
                let caracterTope = caracter[1].split('/')
                //let introducirAPila = caracterTope[1].split('')
                let tope = obtenerTope();
                if (link.fromNode.data.key === estadoActual.data.key && caracter[0] === simbolo &&  caracterTope[0]===tope) {
                  siguienteEstado = diagram.findNodeForKey(link.toNode.data.key);
                  console.log('enlace escogido: '+elemento)
                  let letraInicial = elemento.split(',') 
                  let tope = letraInicial[1].split('/')
                  introducirAPila = tope[1].split('')
                  console.log(introducirAPila)
                  eliminarTope()
                  añadirAapila(introducirAPila)
                  //console.log('entro: '+siguienteEstado)
                  return siguienteEstado;
                }
            })
          });
            if(siguienteEstado=== null){
              estadoActual.findMainElement().stroke = "black";
              estadoActual.findMainElement().fill = "red";
              setTimeout(function() {
                //mostrarModal(false);
              }, 1000);
              return;
            }
            var link = null;
            diagram.links.each(function(l) {
                if (l.fromNode === estadoActual && l.toNode === siguienteEstado) {
                    link = l;
                    return false;
                }
            });
  
            if (link === null) {
              mostrarModal(false);
              return;
          }
          estadoActual.findMainElement().stroke = "green";
          estadoActual.findMainElement().fill = "#5B8FB9";
  
          setTimeout(function() {
            link.path.stroke = "green";
            link.path.strokeDashArray = [4, 2];
          }, 2000);
        
          // Actualizar nodo actual y contador
          let previousNode = estadoActual;
          estadoActual = siguienteEstado;
  
          setTimeout(function() {
            previousNode.findMainElement().stroke = "red";
            link.path.stroke = "red";
            //procesarSiguienteCaracter();
          }, 2000);
  
          if (estadoActual.data.isAccept) {
            estadoActual.findMainElement().stroke = "red";
            estadoActual.findMainElement().fill = "yellow";
            setTimeout(function() {
              mostrarModal(true);
            }, 1000);
        } else {
            estadoActual.findMainElement().stroke = "black";
            estadoActual.findMainElement().fill = "red";
            setTimeout(function() {
              //mostrarModal(false);
            }, 1000);
        }
      
    }

    // Verificar si se alcanzó un estado de aceptación
    var estadoFinal = diagram.model.findNodeDataForKey("2");
    return estadoActual === estadoFinal.key && pila.length === 1 && pila[0] === "#";
}

function obtenerTope(){
  let elementosPila = document.querySelectorAll('.elementoPila')
  let cantidad = elementosPila.length
  console.log(cantidad)
  let tope = cantidad ==1 ? elementosPila[0].children.textPila.textContent :elementosPila[0].textContent
  //let tope = indice>0 ? elementosPila[0].textContent :  elementosPila[0].children.textPila.textContent
  console.log(tope)
  return tope;
}

function añadirAapila(simbolos){
  simbolos.map(simbolo=>{
    setTimeout(()=>{
      // Agregar el símbolo a la pila en el HTML
      var contenedor = document.createElement('div');
      contenedor.classList.add('elementoPila')
    
      var elemento = document.createElement('p');
      elemento.classList.add('textPila');
      elemento.innerText = simbolo;
    
      contenedor.appendChild(elemento)
      containerPila.insertBefore(contenedor, containerPila.firstChild);
    },1000)
  })

}

function eliminarTope(){
  // Obtener el contenedor de la pila
  var containerPila = document.getElementById("Pila");

  // Obtener todos los elementos <p> dentro del contenedor y eliminarlos
  var elementosPila = containerPila.getElementsByTagName("div");
  while (elementosPila.length > 0) {
      elementosPila[0].parentNode.removeChild(elementosPila[0]);
}

}

comprobarPalabra.addEventListener('click',(e)=>procesarEntrada(e,inputPalabra.value));