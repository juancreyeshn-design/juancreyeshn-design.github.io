// bpmn-diagramador.js - parte de gestion-procesos-ia (modularizado desde script.js)
function descargarDiagramaPNG(){
var svgEl = document.querySelector('#diagramOutput svg');
if(!svgEl){ alert('Primero renderiza un diagrama para poder descargarlo.'); return; }
var svgData = new XMLSerializer().serializeToString(svgEl);
function descargarSVGDirecto(){
var blobSvg = new Blob([svgData], {type:'image/svg+xml;charset=utf-8'});
var aSvg = document.createElement('a');
aSvg.href = URL.createObjectURL(blobSvg);
aSvg.download = 'diagrama-proceso.svg';
document.body.appendChild(aSvg);
aSvg.click();
document.body.removeChild(aSvg);
}
var svgBlob = new Blob([svgData], {type:'image/svg+xml;charset=utf-8'});
var url = URL.createObjectURL(svgBlob);
var img = new Image();
img.onload = function(){
try{
var vb = svgEl.viewBox && svgEl.viewBox.baseVal;
var bbox = svgEl.getBoundingClientRect();
var w = (vb && vb.width) ? vb.width : bbox.width;
var h = (vb && vb.height) ? vb.height : bbox.height;
var scale = 2;
var canvas = document.createElement('canvas');
canvas.width = w * scale;
canvas.height = h * scale;
var ctx = canvas.getContext('2d');
ctx.fillStyle = '#ffffff';
ctx.fillRect(0,0,canvas.width,canvas.height);
ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
URL.revokeObjectURL(url);
canvas.toBlob(function(blob){
if(!blob){ descargarSVGDirecto(); return; }
var a = document.createElement('a');
a.href = URL.createObjectURL(blob);
a.download = 'diagrama-proceso.png';
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
});
}catch(e){
URL.revokeObjectURL(url);
descargarSVGDirecto();
}
};
img.onerror = function(){ URL.revokeObjectURL(url); descargarSVGDirecto(); };
img.src = url;
}
function parseMermaidANodos(texto){
var lineas = texto.split(String.fromCharCode(10));
var nodos = {};
var edges = [];
var laneStack = [];
function laneActual(){ return laneStack.length ? laneStack[laneStack.length-1] : null; }
function registrarNodo(id, label, tipo){
if(!nodos[id]){
nodos[id] = {id:id, label:label||id, tipo:tipo||'task', definido: !!(label||tipo), lane: laneActual(), entra:0, sale:0};
} else if((label || tipo) && !nodos[id].definido){
if(label) nodos[id].label = label;
if(tipo) nodos[id].tipo = tipo;
nodos[id].definido = true;
}
return nodos[id];
}
function parseDef(str){
var m = str.match(/^([A-Za-z0-9_]+)(.*)$/);
if(!m) return null;
var id = m[1];
var resto = m[2].trim();
var label = null, tipo = null;
if(resto.indexOf('([') === 0 && resto.lastIndexOf('])') === resto.length-2){
label = resto.slice(2,-2);
tipo = 'event';
} else if(resto.indexOf('{') === 0 && resto.lastIndexOf('}') === resto.length-1){
label = resto.slice(1,-1);
tipo = 'gateway';
} else if(resto.indexOf('[') === 0 && resto.lastIndexOf(']') === resto.length-1){
label = resto.slice(1,-1);
tipo = 'task';
}
return {id:id, label:label, tipo:tipo};
}
lineas.forEach(function(lineaOriginal){
var linea = lineaOriginal.trim();
if(linea === '' || linea.indexOf('flowchart') === 0) return;
var subMatch = linea.match(/^subgraph\s+([A-Za-z0-9_]+)(\[(.*)\])?/);
if(subMatch){
laneStack.push(subMatch[3] || subMatch[1]);
return;
}
if(linea === 'end'){
laneStack.pop();
return;
}
var idxArrow = linea.indexOf('-->');
if(idxArrow === -1){
var soloDef = parseDef(linea);
if(soloDef){ registrarNodo(soloDef.id, soloDef.label, soloDef.tipo); }
return;
}
var izq = linea.substring(0, idxArrow).trim();
var der = linea.substring(idxArrow+3).trim();
var etiqueta = '';
var dashIdx = izq.indexOf(' -- ');
if(dashIdx !== -1){
etiqueta = izq.substring(dashIdx+4).trim();
izq = izq.substring(0, dashIdx).trim();
}
var defIzq = parseDef(izq);
var defDer = parseDef(der);
if(!defIzq || !defDer) return;
var nodoA = registrarNodo(defIzq.id, defIzq.label, defIzq.tipo);
var nodoB = registrarNodo(defDer.id, defDer.label, defDer.tipo);
nodoA.sale++;
nodoB.entra++;
edges.push({from:defIzq.id, to:defDer.id, label:etiqueta});
});
return {nodos:nodos, edges:edges};
}
function tipoBPMNParaNodo(nodo){
if(nodo.tipo === 'gateway') return 'exclusiveGateway';
if(nodo.tipo === 'event'){
if(nodo.entra === 0) return 'startEvent';
if(nodo.sale === 0) return 'endEvent';
return 'intermediateThrowEvent';
}
return 'task';
}
function escaparXML(s){
return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function generarBPMNXML(){
var texto = document.getElementById('mermaidInput').value;
var datos = parseMermaidANodos(texto);
var nodos = datos.nodos;
var edges = datos.edges;
var ids = Object.keys(nodos);
if(ids.length === 0){ return null; }
var lanes = {};
ids.forEach(function(id){
var lane = nodos[id].lane;
if(lane){
if(!lanes[lane]) lanes[lane] = [];
lanes[lane].push(id);
}
});
var salto = String.fromCharCode(10);
var xml = '<?xml version="1.0" encoding="UTF-8"?>' + salto;
xml += '<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" id="Definitions_1" targetNamespace="http://gestion-procesos-ia/bpmn">' + salto;
xml += '<process id="Process_1" isExecutable="false">' + salto;
if(Object.keys(lanes).length > 0){
xml += '<laneSet id="LaneSet_1">' + salto;
Object.keys(lanes).forEach(function(nombreLane, i){
xml += '<lane id="Lane_' + (i+1) + '" name="' + escaparXML(nombreLane) + '">' + salto;
lanes[nombreLane].forEach(function(id){
xml += '<flowNodeRef>' + id + '</flowNodeRef>' + salto;
});
xml += '</lane>' + salto;
});
xml += '</laneSet>' + salto;
}
ids.forEach(function(id){
var nodo = nodos[id];
var tipoBpmn = tipoBPMNParaNodo(nodo);
xml += '<' + tipoBpmn + ' id="' + id + '" name="' + escaparXML(nodo.label) + '">' + salto;
edges.forEach(function(e){
if(e.to === id){ xml += '<incoming>Flow_' + e.from + '_' + e.to + '</incoming>' + salto; }
if(e.from === id){ xml += '<outgoing>Flow_' + e.from + '_' + e.to + '</outgoing>' + salto; }
});
xml += '</' + tipoBpmn + '>' + salto;
});
edges.forEach(function(e){
xml += '<sequenceFlow id="Flow_' + e.from + '_' + e.to + '" sourceRef="' + e.from + '" targetRef="' + e.to + '"' + (e.label ? ' name="' + escaparXML(e.label) + '"' : '') + ' />' + salto;
});
xml += '</process>' + salto;
xml += '</definitions>';
return xml;
}
function descargarBPMNXML(){
var xml = generarBPMNXML();
if(!xml){ alert('Primero define un diagrama valido para exportar a BPMN XML.'); return; }
var blob = new Blob([xml], {type:'application/xml'});
var a = document.createElement('a');
a.href = URL.createObjectURL(blob);
a.download = 'diagrama-proceso-bpmn.xml';
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
}
function guardarDiagramaLocal(){
try{ localStorage.setItem('diagramaMermaid', document.getElementById('mermaidInput').value); }catch(e){}
}
function cargarDiagramaLocal(){
try{
var d = localStorage.getItem('diagramaMermaid');
if(d){ document.getElementById('mermaidInput').value = d; return true; }
}catch(e){}
return false;
}
function renderDiagram(){
guardarDiagramaLocal();
var codigo = document.getElementById('mermaidInput').value;
var contenedor = document.getElementById('diagramOutput');
mermaid.render('graficoGenerado', codigo).then(function(resultado){
contenedor.innerHTML = resultado.svg;
}).catch(function(error){
contenedor.innerHTML = '<p style="color:#c0392b">No se pudo generar el diagrama. Revisa la sintaxis del proceso.</p>';
});
}

function cargarEjemplo(nombre){
document.getElementById('mermaidInput').value = ejemplos[nombre];
renderDiagram();
}

