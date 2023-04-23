
let diagram;


window.onload = function init() {
  
        // Definir los datos del autómata
        let nodeDataArray = [
          { key: "0", text: "q0", loc: new go.Point(-150, 0) },
          { key: "1", text: "q1", loc: new go.Point(0, 0), isAccept: false },
          { key: "2", text: "q2", loc: new go.Point(150, 0), isAccept: true },
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





