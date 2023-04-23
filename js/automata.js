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
      { from: "0", to: "0", text: "b,b/bb\na,b/ba\nb,a/ab\na,a/aa\nb,#/#b\na,#/#a" },
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

    /*diagram.model.commit(function(m) {
      var nodeData = m.findNodeDataForKey("3");
      nodeData.stack.push("D");  // Agregar el nuevo elemento a la matriz stack
      nodeData.top++;
      diagram.model.updateTargetBindings(nodeData);  // Incrementar la propiedad top
    });*/
}





