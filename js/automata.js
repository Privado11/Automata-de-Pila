const botonForm = document.getElementById('formSubmit')

let diagram;

window.onload = function init() {
  
    // Definir los datos del autómata
    let nodeDataArray = [
      { key: "0", text: "q0", loc: new go.Point(-150, 0)},
      { key: "1", text: "q1", loc: new go.Point(0, 0)},
      { key: "2", text: "q2", loc: new go.Point(150, 0), isAccept: true },
      { key: "3", text: "q3", loc: new go.Point(300, 0), stack: ["#"], top: 1 }
    ];    
    let linkDataArray = [
      // Desde el nodo 0 al mismo
      { from: "0", to: "0", text: "b,b/bb\na,b/ba\nb,a/ab\na,a/aa\nb,#/#b\na,#/#a"},
      // Desde el nodo 0 al nodo 1
      { from: "0", to: "1", text: "b,b/λ\na,a/λ" },
      // Desde el nodo 1 al mismo
      { from: "1", to: "1", text: "b,b/λ\na,a/λ" },
      // Desde el nodo 1 al nodo 2
      { from: "1", to: "2", text: "λ,#/#" }
    ];
        
    // Crear el diagrama con GoJS
    let $ = go.GraphObject.make;
    
    diagram = $(go.Diagram, "myDiagramDiv", {
        "undoManager.isEnabled": true,
        allowMove: false,
        allowHorizontalScroll: false,
        allowVerticalScroll: false
    });
    
    // Definir los nodos 
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
        $(go.TextBlock, { margin: 5 }, new go.Binding("text", "text")),
    );

    // Definir la pila
    diagram.nodeTemplateMap.add("stack",
    $(go.Node, "Auto",
      { background: "#F1F1F1" },
      // Panel para contener los elementos de la pila
      $(go.Panel, "Vertical",
          // Flecha que indica el elemento superior de la pila
          $(go.Shape, "TriangleDown",
            { width: 20, height: 10, margin: 2, fill: "white", stroke: "#333333" },
            new go.Binding("visible", "stack", function(s) { return s.length > 0; })),
          // Elementos de la pila representados como rectángulos
          $(go.Panel, "Vertical",
          new go.Binding("itemArray", "stack", function(stack) { return stack.slice().reverse(); }),
            {
              itemTemplate:
              $(go.Panel, "Auto",
                $(go.Shape, "Rectangle", { width: 60, height: 20, margin: 2, fill: "white" }),
                $(go.TextBlock, new go.Binding("text", ""))
              )
            }
          )
        )
      )
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

    // Actualizar los datos del nodo con clave "3" para que use la plantilla especial
    let node = diagram.findNodeForKey("3");
    if (node !== null) {
      node.category = "stack";
    }
}

botonForm.addEventListener('click',(evento)=>recorrerAutomata(evento));

function recorrerAutomata(evento) {
  evento.preventDefault();
  let timeoutDelayLinks = 0;
  let timeoutDelay = 0;
  let inputWord = document.getElementById("formText").value;
  let currentNode = diagram.findNodeForKey("0");
  let i = 0;
  let pila = diagram.findNodeForKey("3");
  let simboloPila = pila.data.stack[pila.data.stack.length - 1];
  vaciarPila();
  let bandera = 0;
  
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

  function procesarSiguienteCaracter() {
      if (i < inputWord.length) {
        let nextNode = null;
        let currentChar = inputWord.charAt(i);
        let transiciones = null;
        let elementoPila = "";
        let elementoPila2 = "";
        let aux = 0;
        let prueba = [];

        diagram.links.each(function(link) {
          if (link.fromNode.data.key === currentNode.data.key){
              prueba.push(link.toNode.key);
            }
        });

        const mitad = Math.ceil(inputWord.length / 2);
        let node = null;
        let aux2 = [];
        let  pilaaux = ["#"];
        simboloP = pilaaux[pilaaux.length - 1];
        while(aux < inputWord.length){
          let elemento1 = "";
          char = inputWord.charAt(aux);
        if(aux < mitad || inputWord.length === 1){
          node = diagram.findNodeForKey(prueba[0]);
          aux++;
        }else{
          node = diagram.findNodeForKey(prueba[1]);
          aux++;
        }
        //console.log(diagram.findLinksByExample({ from: currentNode.data.key, to: node.data.key }).first())
        let enlace = diagram.findLinksByExample({ from: currentNode.data.key, to: node.data.key }).first();
        transiciones = enlace.data.text.split("\n");
        //console.log(transiciones)
        transiciones.forEach(function(palabra) {
          //console.log(palabra[5])
          if(palabra[0] === char && simboloP === palabra[2]){
            //console.log(palabra[2])
            elemento1 = palabra[5];
            if(typeof elemento1 !== 'undefined'){
              pilaaux.push(elemento1);
              simboloP = elemento1;
              console.log(elementoPila2);
            }else{
              pilaaux.pop();
              simboloP = "a";
              console.log(simboloP);
            }
            aux2.push(node.data.key);
          }
        });
      }
      console.log(aux2);
      //console.log(simboloPila)
      let nodoaux = null;
      console.log(aux2[bandera]);
      nodoaux = diagram.findNodeForKey(aux2[bandera]);
      
      
      let enlace = diagram.findLinksByExample({ from: currentNode.data.key, to: nodoaux.data.key }).first();
        transiciones = enlace.data.text.split("\n");
        transiciones.forEach(function(palabra) {
          if(palabra[0] === currentChar && simboloPila === palabra[2]){
            elementoPila2 = palabra[5];
            //console.log(elementoPila2);
            if(typeof elementoPila2 !== 'undefined'){
              agregarElementoPila(elementoPila2);
              simboloPila = elementoPila2;
            }else{
              eliminarElementoPila();
              //console.log(simboloPila);
            }
            aux2.push(node.data.key);
          }
        });
        nextNode = diagram.findNodeForKey(aux2[bandera]) 
        bandera++;
            
        

        /*const mitad = Math.ceil(inputWord.length / 2);
        diagram.links.each(function(link) {
          if(encontrado){
            return;
          }else{
            if (link.fromNode.data.key === currentNode.data.key) {
              transiciones.push(link.data.text.split("\n"));
              transiciones.forEach(function(transicion) {
                transicion.forEach(function(palabra) {
                  //console.log(link.toNode.data.key)
                  
                    
                  if(palabra[0] === currentChar && simboloPila === palabra[2]){
                    //console.log(link.toNode.data.key !== 0)
                    if(aux < mitad && link.toNode.data.key !== 0){
                      elementoPila = palabra[4];
                      elementoPila2 = palabra[5];
                    //agregarElementoPila(elementoPila);
                      agregarElementoPila(elementoPila2);
                      nextNode = diagram.findNodeForKey(link.toNode.data.key);
                      encontrado = true;
                      aux ++;
                    }/*else{
                    if(palabra[0] === currentChar && simboloPila === palabra[2]){
                      elementoPila = palabra[4];
                      elementoPila2 = palabra[5];
                      //agregarElementoPila(elementoPila);
                      agregarElementoPila(elementoPila2);
                      nextNode = diagram.findNodeForKey(link.toNode.data.key);
                      encontrado = true;
    
                    }
                    
                  }
                  }
                    
                  
                });
              });
              
            }
          }
        });*/

        if (nextNode === null) {
            currentNode.findMainElement().stroke = "black";
            currentNode.findMainElement().fill = "red";
            setTimeout(function() {
              //mostrarModal(false);
            }, 1000);
            return;
        }

        let link = null;
        diagram.links.each(function(l) {
            if (l.fromNode === currentNode && l.toNode === nextNode) {
                link = l;
                return false;
            }
        });
      
        if (link === null) {
            //mostrarModal(false);
            return;
        }

        // Colorear el nodo actual y el enlace
        currentNode.findMainElement().stroke = "green";
        currentNode.findMainElement().fill = "gray";

        setTimeout(function() {
            link.path.stroke = "green";
            link.path.strokeDashArray = [4, 2];
          }, timeoutDelayLinks);
        
        // Actualizar nodo actual y contador
        let previousNode = currentNode;
        currentNode = nextNode;
        i++;
        
      // Colorear enlace anterior rojo al pasar al siguiente nodo
      setTimeout(function() {
          previousNode.findMainElement().stroke = "red";
          link.path.stroke = "red";
          procesarSiguienteCaracter();
        }, timeoutDelay);
      } else {
          // Verificar si el nodo actual es un estado de aceptación
          if (currentNode.data.isAccept) {
              currentNode.findMainElement().stroke = "red";
              currentNode.findMainElement().fill = "yellow";
              setTimeout(function() {
                //mostrarModal(true);
              }, 1000);
          } else {
              currentNode.findMainElement().stroke = "black";
              currentNode.findMainElement().fill = "red";
              setTimeout(function() {
                //mostrarModal(false);
              }, 1000);
          }
      }
  }

  function actualizarVelocidad() {
      let speed = document.getElementById("formRango").value;
      timeoutDelay = 5000 - (speed * 45);
      timeoutDelayLinks = 4000 - (speed * 45);
    }
  
    actualizarVelocidad();
  
    document.getElementById("formRango").addEventListener("input", function() {
      actualizarVelocidad();
    });

  procesarSiguienteCaracter();
}

function agregarElementoPila(x){
  diagram.model.commit(function(m){
    let nodeData = m.findNodeDataForKey("3");
    nodeData.stack.push(x);
    nodeData.top++;
    diagram.model.updateTargetBindings(nodeData);
  });
}

function eliminarElementoPila(){
  diagram.model.commit(function(m){
    let nodeData = m.findNodeDataForKey("3");
    nodeData.stack.pop();
    nodeData.top--;
    diagram.model.updateTargetBindings(nodeData);
  });
}

function vaciarPila(){
  diagram.model.commit(function(m){
    let nodeData = m.findNodeDataForKey("3");
    nodeData.stack = ["#"];
    nodeData.top = 1;
    diagram.model.updateTargetBindings(nodeData);
  });
}