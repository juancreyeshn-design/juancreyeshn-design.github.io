
var ejemplos = {};
ejemplos.simple = "flowchart LR\nA([Inicio]) --> B[Recibir solicitud]\nB --> C[Revisar documentos]\nC --> D[Registrar en el sistema]\nD --> E([Fin])";
ejemplos.decision = "flowchart TD\nA([Inicio]) --> B[Recibir solicitud de compra]\nB --> C{Monto mayor a limite?}\nC -- Si --> D[Enviar a aprobacion gerencial]\nC -- No --> E[Aprobacion automatica]\nD --> F{Aprobado?}\nF -- Si --> G[Generar orden de compra]\nF -- No --> H[Notificar rechazo]\nE --> G\nG --> I([Fin])\nH --> I";
ejemplos.areas = "flowchart TD\nsubgraph Cliente\nA([Inicio]) --> B[Envia solicitud]\nend\nsubgraph Ventas\nB --> C[Revisa solicitud]\nC --> D{Stock disponible?}\nend\nsubgraph Bodega\nD -- Si --> E[Prepara pedido]\nE --> F[Despacha pedido]\nend\nsubgraph Cliente2[Cliente]\nD -- No --> G[Notifica agotado]\nF --> H([Fin])\nG --> H\nend";
ejemplos.credito = "flowchart TD\nA([Inicio]) --> B[Recepcion de solicitud de credito]\nB --> C[Verificacion de identidad y documentos KYC]\nC --> D[Analisis crediticio y scoring]\nD --> E[Consulta a centrales de riesgo]\nE --> F{Comite aprueba el credito?}\nF -- Si --> G[Formalizacion y firma de contrato]\nF -- No --> H[Notificar rechazo al cliente]\nG --> I[Desembolso de fondos]\nI --> J[Seguimiento post-desembolso]\nJ --> K([Fin])\nH --> K";
ejemplos.manufactura = "flowchart TD\nA([Inicio]) --> B[Recepcion de orden de produccion]\nB --> C[Alistamiento de materiales]\nC --> D[Fabricacion y ensamble]\nD --> E{Cumple control de calidad?}\nE -- Si --> F[Empaque]\nE -- No --> G[Retrabajo del producto]\nG --> D\nF --> H[Almacenamiento en bodega]\nH --> I[Despacho y transporte]\nI --> J([Fin])";
ejemplos.soporte = "flowchart TD\nA([Inicio]) --> B[Recepcion del ticket]\nB --> C[Clasificacion y priorizacion]\nC --> D[Diagnostico del problema]\nD --> E{Requiere escalamiento?}\nE -- Si --> F[Escalamiento a nivel especializado]\nE -- No --> G[Resolucion del problema]\nF --> G\nG --> H[Confirmacion con el cliente]\nH --> I[Cierre y registro del caso]\nI --> J([Fin])";

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

function numPositivo(valor, porDefecto){
  var n = parseFloat(valor);
  if(isNaN(n) || n < 0){ return porDefecto; }
  return n;
}
function numPorcentaje(valor){
  var n = parseFloat(valor);
  if(isNaN(n) || n < 0){ return 0; }
  if(n > 100){ return 100; }
  return n;
}

function agregarPaso(nombre, ciclo, espera, retrabajo){
var tbody = document.getElementById('pasosBody');
var fila = document.createElement('tr');
fila.innerHTML = '<td><input type="text" class="p-nombre" value="' + nombre + '"></td>' +
'<td><input type="number" class="p-ciclo" value="' + ciclo + '" min="0"></td>' +
'<td><input type="number" class="p-espera" value="' + espera + '" min="0"></td>' +
'<td><input type="number" class="p-retrabajo" value="' + retrabajo + '" min="0" max="100"></td>' +
'<td><button onclick="eliminarPaso(this)">&#10005;</button></td>';
tbody.appendChild(fila);

actualizarTodo();}

function agregarPasoVacio(){
agregarPaso('Nuevo paso', 10, 0, 0);
}

function eliminarPaso(boton){
var fila = boton.closest('tr');
fila.parentNode.removeChild(fila);

actualizarTodo();}

function vaciarPasos(){
document.getElementById('pasosBody').innerHTML = '';
actualizarTodo();
}
function exportarPasosJSON(){
var filas = document.querySelectorAll('#pasosBody tr');
var datos = [];
filas.forEach(function(fila){
datos.push({
nombre: fila.querySelector('.p-nombre').value,
ciclo: fila.querySelector('.p-ciclo').value,
espera: fila.querySelector('.p-espera').value,
retrabajo: fila.querySelector('.p-retrabajo').value
});
});
var blob = new Blob([JSON.stringify(datos, null, 2)], {type:'application/json'});
var a = document.createElement('a');
a.href = URL.createObjectURL(blob);
a.download = 'pasos-proceso.json';
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
}
function importarPasosJSON(input){
var file = input.files[0];
if(!file) return;
var reader = new FileReader();
reader.onload = function(e){
try{
var datos = JSON.parse(e.target.result);
if(Array.isArray(datos) && datos.length > 0){
document.getElementById('pasosBody').innerHTML = '';
datos.forEach(function(p){
agregarPaso(p.nombre || 'Paso sin nombre', p.ciclo || 0, p.espera || 0, p.retrabajo || 0);
});
actualizarTodo();
} else {
alert('El archivo no contiene un formato valido de pasos.');
}
}catch(err){
alert('No se pudo leer el archivo. Verifica que sea un JSON valido exportado desde esta herramienta.');
}
input.value = '';
};
reader.readAsText(file);
}
var ejemplosProceso = {
credito: {
sipoc: {
nombre: 'Proceso de aprobacion de credito',
proveedores: 'Cliente externo\nArea comercial\nSistema de gestion documental',
entradas: 'Solicitud del cliente\nDocumentacion de soporte\nPoliticas internas',
salidas: 'Solicitud aprobada o rechazada\nNotificacion al cliente\nRegistro en el sistema',
clientes: 'Cliente externo\nArea de auditoria\nGerencia'
},
pasos: [
{nombre:'Recepcion de solicitud de credito', ciclo:10, espera:5, retrabajo:5},
{nombre:'Verificacion de identidad y documentos (KYC)', ciclo:20, espera:15, retrabajo:15},
{nombre:'Analisis crediticio y scoring', ciclo:30, espera:20, retrabajo:10},
{nombre:'Consulta a centrales de riesgo', ciclo:10, espera:60, retrabajo:5},
{nombre:'Comite de aprobacion de credito', ciclo:25, espera:120, retrabajo:8},
{nombre:'Formalizacion y firma de contrato', ciclo:20, espera:30, retrabajo:5},
{nombre:'Desembolso de fondos', ciclo:15, espera:10, retrabajo:2},
{nombre:'Seguimiento post-desembolso', ciclo:10, espera:5, retrabajo:0}
]
},
manufactura: {
sipoc: {
nombre: 'Proceso de produccion de un pedido',
proveedores: 'Proveedor de materia prima\nArea de compras\nArea de planificacion de produccion',
entradas: 'Orden de produccion\nMateria prima y componentes\nEspecificaciones tecnicas',
salidas: 'Producto terminado conforme\nRegistro de control de calidad\nGuia de despacho',
clientes: 'Cliente distribuidor\nArea comercial\nArea de logistica'
},
pasos: [
{nombre:'Recepcion de orden de produccion', ciclo:10, espera:5, retrabajo:2},
{nombre:'Alistamiento de materiales', ciclo:15, espera:10, retrabajo:5},
{nombre:'Fabricacion y ensamble', ciclo:60, espera:20, retrabajo:8},
{nombre:'Control de calidad', ciclo:20, espera:15, retrabajo:12},
{nombre:'Empaque', ciclo:10, espera:5, retrabajo:2},
{nombre:'Almacenamiento en bodega de producto terminado', ciclo:10, espera:30, retrabajo:0},
{nombre:'Despacho y transporte', ciclo:15, espera:45, retrabajo:3}
]
},
soporte: {
sipoc: {
nombre: 'Proceso de atencion y resolucion de tickets de soporte',
proveedores: 'Cliente o usuario\nArea de ventas\nProveedor de la plataforma de soporte',
entradas: 'Solicitud o incidencia reportada\nHistorial del cliente\nBase de conocimiento',
salidas: 'Incidencia resuelta\nEncuesta de satisfaccion\nRegistro en el sistema de tickets',
clientes: 'Cliente o usuario final\nArea de calidad\nGerencia de servicio al cliente'
},
pasos: [
{nombre:'Recepcion del ticket o solicitud', ciclo:5, espera:10, retrabajo:3},
{nombre:'Clasificacion y priorizacion', ciclo:5, espera:5, retrabajo:2},
{nombre:'Diagnostico del problema', ciclo:20, espera:15, retrabajo:10},
{nombre:'Escalamiento a nivel especializado', ciclo:10, espera:40, retrabajo:5},
{nombre:'Resolucion del problema', ciclo:25, espera:10, retrabajo:12},
{nombre:'Confirmacion con el cliente', ciclo:10, espera:20, retrabajo:5},
{nombre:'Cierre y registro del caso', ciclo:5, espera:5, retrabajo:0}
]
}
};
function cargarEjemploProceso(tipo, actualizarDiagrama){
tipo = tipo || 'credito';
if(actualizarDiagrama === undefined){ actualizarDiagrama = true; }
var datos = ejemplosProceso[tipo] || ejemplosProceso.credito;
document.getElementById('sipocNombre').value = datos.sipoc.nombre;
document.getElementById('sipocProveedores').value = datos.sipoc.proveedores;
document.getElementById('sipocEntradas').value = datos.sipoc.entradas;
document.getElementById('sipocSalidas').value = datos.sipoc.salidas;
document.getElementById('sipocClientes').value = datos.sipoc.clientes;
document.getElementById('pasosBody').innerHTML = '';
datos.pasos.forEach(function(p){
agregarPaso(p.nombre, p.ciclo, p.espera, p.retrabajo);
});
if(actualizarDiagrama && ejemplos[tipo]){
document.getElementById('mermaidInput').value = ejemplos[tipo];
renderDiagram();
}
}

function analizarProceso(){
var filas = document.querySelectorAll('#pasosBody tr');
if(filas.length === 0){
document.getElementById('resultadoAnalisis').innerHTML = '<p style="color:#c0392b">Agrega al menos un paso para analizar el proceso.</p>';
return;
}
var pasos = [];
filas.forEach(function(fila){
var nombre = fila.querySelector('.p-nombre').value || 'Paso sin nombre';
var ciclo = numPositivo(fila.querySelector('.p-ciclo').value, 0);
var espera = numPositivo(fila.querySelector('.p-espera').value, 0);
var retrabajo = numPorcentaje(fila.querySelector('.p-retrabajo').value);
pasos.push({nombre:nombre, ciclo:ciclo, espera:espera, retrabajo:retrabajo, total:ciclo+espera});
});

var tiempoTotalCiclo = 0, tiempoTotalEspera = 0, tiempoTotalProceso = 0;
pasos.forEach(function(p){
tiempoTotalCiclo += p.ciclo;
tiempoTotalEspera += p.espera;
tiempoTotalProceso += p.total;
});

var eficiencia = tiempoTotalProceso > 0 ? Math.round((tiempoTotalCiclo / tiempoTotalProceso) * 100) : 0;

var html = '';
html += '<div class="resumen-metricas">';
html += '<div>Tiempo total<span>' + tiempoTotalProceso + ' min</span></div>';
html += '<div>Tiempo de valor<span>' + tiempoTotalCiclo + ' min</span></div>';
html += '<div>Tiempo de espera<span>' + tiempoTotalEspera + ' min</span></div>';
html += '<div>Eficiencia del proceso<span>' + eficiencia + '%</span></div>';
html += '</div>';

pasos.forEach(function(p){
var motivos = [];
var nivel = 'ok';
if(tiempoTotalProceso > 0 && p.total > tiempoTotalProceso * 0.35){
motivos.push('concentra mas del 35% del tiempo total del proceso');
nivel = 'critico';
}
if(p.espera > p.ciclo * 2 && p.espera > 0){
motivos.push('el tiempo de espera es mas del doble del tiempo de ciclo (posible cuello de botella por espera)');
nivel = 'critico';
}
if(p.retrabajo >= 15){
motivos.push('porcentaje de retrabajo alto (' + p.retrabajo + '%), revisar causa raiz de errores');
if(nivel !== 'critico'){ nivel = 'alerta'; }
}
if(motivos.length === 0){
motivos.push('sin senales relevantes de cuello de botella');
}
html += '<div class="paso-flag ' + nivel + '"><strong>' + p.nombre + '</strong> (' + p.total + ' min total) &mdash; ' + motivos.join('; ') + '.</div>';
});

document.getElementById('resultadoAnalisis').innerHTML = html;
}

function simularOptimizacion(){
var filas = document.querySelectorAll('#pasosBody tr');
if(filas.length === 0){
document.getElementById('resultadoSimulacion').innerHTML = '<p style="color:#c0392b">Primero define los pasos del proceso en el Analizador de Cuellos de Botella.</p>';
return;
}
var reduccionEspera = parseFloat(document.getElementById('sliderEspera').value) / 100;
var reduccionRetrabajo = parseFloat(document.getElementById('sliderRetrabajo').value) / 100;
var reduccionCiclo = parseFloat(document.getElementById('sliderCiclo').value) / 100;

var pasos = [];
filas.forEach(function(fila){
var nombre = fila.querySelector('.p-nombre').value || 'Paso sin nombre';
var ciclo = numPositivo(fila.querySelector('.p-ciclo').value, 0);
var espera = numPositivo(fila.querySelector('.p-espera').value, 0);
var retrabajo = numPorcentaje(fila.querySelector('.p-retrabajo').value);
pasos.push({nombre:nombre, ciclo:ciclo, espera:espera, retrabajo:retrabajo});
});

var totalAntes = 0, totalDespues = 0;
var filasHtml = '';

pasos.forEach(function(p){
var tiempoRetrabajoAntes = p.ciclo * (p.retrabajo / 100);
var totalA = p.ciclo + p.espera + tiempoRetrabajoAntes;

var esCritico = (p.espera > p.ciclo * 2 && p.espera > 0);

var esperaD = p.espera * (1 - reduccionEspera);
var retrabajoD = p.retrabajo * (1 - reduccionRetrabajo);
var cicloD = esCritico ? p.ciclo * (1 - reduccionCiclo) : p.ciclo;
var tiempoRetrabajoDespues = cicloD * (retrabajoD / 100);
var totalD = cicloD + esperaD + tiempoRetrabajoDespues;

totalAntes += totalA;
totalDespues += totalD;

var reduccionPaso = totalA > 0 ? Math.round((1 - totalD / totalA) * 100) : 0;

filasHtml += '<tr><td>' + p.nombre + (esCritico ? ' &#9888;' : '') + '</td><td>' + Math.round(totalA) + ' min</td><td>' + Math.round(totalD) + ' min</td><td class="mejora-positiva">-' + reduccionPaso + '%</td></tr>';
});

var reduccionTotal = totalAntes > 0 ? Math.round((1 - totalDespues / totalAntes) * 100) : 0;

var html = '';
html += '<div class="resumen-metricas">';
html += '<div>Tiempo total antes<span>' + Math.round(totalAntes) + ' min</span></div>';
html += '<div>Tiempo total despues<span>' + Math.round(totalDespues) + ' min</span></div>';
html += '<div>Reduccion estimada<span>' + reduccionTotal + '%</span></div>';
html += '</div>';
html += '<table class="comparacion-tabla"><thead><tr><th>Paso</th><th>Antes</th><th>Despues</th><th>Mejora</th></tr></thead><tbody>' + filasHtml + '</tbody></table>';
html += '<p style="margin-top:12px;font-size:.85rem;color:#666">&#9888; Los pasos marcados fueron identificados como criticos (cuello de botella) y reciben el beneficio de la automatizacion simulada.</p>';

document.getElementById('resultadoSimulacion').innerHTML = html;
}

function calcularKPIs(){
var filas = document.querySelectorAll('#pasosBody tr');
if(filas.length === 0){
document.getElementById('resultadoKPI').innerHTML = '<p style="color:#c0392b">Primero define los pasos del proceso en el Analizador de Cuellos de Botella.</p>';
return;
}
var turno = numPositivo(document.getElementById('kpiTurno').value, 480);
var costoHora = numPositivo(document.getElementById('kpiCostoHora').value, 0);
var metaLeadTime = numPositivo(document.getElementById('kpiMeta').value, 1);

var tiempoValor = 0, tiempoTotal = 0;
filas.forEach(function(fila){
var ciclo = numPositivo(fila.querySelector('.p-ciclo').value, 0);
var espera = numPositivo(fila.querySelector('.p-espera').value, 0);
var retrabajo = numPorcentaje(fila.querySelector('.p-retrabajo').value);
var tiempoRetrabajo = ciclo * (retrabajo / 100);
tiempoValor += ciclo;
tiempoTotal += ciclo + espera + tiempoRetrabajo;
});

var pctValorAgregado = tiempoTotal > 0 ? Math.round((tiempoValor / tiempoTotal) * 100) : 0;
var throughputTurno = tiempoTotal > 0 ? Math.floor(turno / tiempoTotal) : 0;
var costoPorUnidad = (tiempoTotal / 60) * costoHora;
var cumpleMeta = tiempoTotal <= metaLeadTime;
var desviacion = Math.round(((tiempoTotal - metaLeadTime) / metaLeadTime) * 100);

var html = '';
html += '<div class="kpi-cards">';

html += '<div class="kpi-card">';
html += '<h3>Lead Time promedio</h3>';
html += '<div class="valor">' + Math.round(tiempoTotal) + ' min</div>';
html += '<div class="detalle">Tiempo total estimado por unidad procesada</div>';
html += '</div>';

html += '<div class="kpi-card">';
html += '<h3>% Valor agregado</h3>';
html += '<div class="valor">' + pctValorAgregado + '%</div>';
html += '<div class="kpi-barra-fondo"><div class="kpi-barra-relleno" style="width:' + pctValorAgregado + '%"></div></div>';
html += '<div class="detalle">Proporcion del tiempo que agrega valor real</div>';
html += '</div>';

html += '<div class="kpi-card">';
html += '<h3>Throughput estimado</h3>';
html += '<div class="valor">' + throughputTurno + ' und/turno</div>';
html += '<div class="detalle">Unidades procesables en un turno de ' + turno + ' min</div>';
html += '</div>';

html += '<div class="kpi-card">';
html += '<h3>Costo estimado por unidad</h3>';
html += '<div class="valor">$' + costoPorUnidad.toFixed(2) + '</div>';
html += '<div class="detalle">Con base en costo operativo de $' + costoHora.toFixed(2) + '/hora</div>';
html += '</div>';

html += '<div class="kpi-card ' + (cumpleMeta ? 'bueno' : 'malo') + '">';
html += '<h3>Cumplimiento de meta</h3>';
html += '<div class="valor">' + (cumpleMeta ? 'Cumple' : 'No cumple') + '</div>';
html += '<div class="detalle">' + (cumpleMeta ? 'Dentro de la meta de ' + Math.round(metaLeadTime) + ' min' : 'Supera la meta en ' + desviacion + '%') + '</div>';
html += '</div>';

html += '</div>';

document.getElementById('resultadoKPI').innerHTML = html;
}



function listaDesdeTexto(id){
var texto = document.getElementById(id).value;
return texto.split(String.fromCharCode(10)).map(function(s){return s.trim();}).filter(function(s){return s.length>0;});
}

function generarSIPOC(){
var proveedores = listaDesdeTexto('sipocProveedores');
var entradas = listaDesdeTexto('sipocEntradas');
var salidas = listaDesdeTexto('sipocSalidas');
var clientes = listaDesdeTexto('sipocClientes');
var nombreProceso = document.getElementById('sipocNombre').value || 'Proceso';

var pasosFilas = document.querySelectorAll('#pasosBody tr');
var pasos = [];
pasosFilas.forEach(function(fila){
var nombre = fila.querySelector('.p-nombre').value || 'Paso sin nombre';
pasos.push(nombre);
});
if(pasos.length === 0){
pasos = [nombreProceso];
}

var maxFilas = Math.max(proveedores.length, entradas.length, pasos.length, salidas.length, clientes.length, 1);

var filasHtml = '';
for(var i=0;i<maxFilas;i++){
filasHtml += '<tr>';
filasHtml += '<td>' + (proveedores[i] || '') + '</td>';
filasHtml += '<td>' + (entradas[i] || '') + '</td>';
filasHtml += '<td>' + (pasos[i] || '') + '</td>';
filasHtml += '<td>' + (salidas[i] || '') + '</td>';
filasHtml += '<td>' + (clientes[i] || '') + '</td>';
filasHtml += '</tr>';
}

var html = '';
html += '<h3 style="color:var(--azul);font-size:.95rem;margin-bottom:10px">Ficha SIPOC: ' + nombreProceso + '</h3>';
html += '<table class="sipoc-tabla"><thead><tr><th>Proveedores (S)</th><th>Entradas (I)</th><th>Proceso (P)</th><th>Salidas (O)</th><th>Clientes (C)</th></tr></thead><tbody>' + filasHtml + '</tbody></table>';

document.getElementById('resultadoSIPOC').innerHTML = html;
}


function kpiPanelHtml(){
var filas = [
{ind:'Lead Time del proceso', formula:'Suma de (tiempo de ciclo + tiempo de espera) de todos los pasos', frecuencia:'Mensual'},
{ind:'% Valor Agregado', formula:'(Tiempo de ciclo total / Tiempo total del proceso) x 100', frecuencia:'Mensual'},
{ind:'Tasa de Retrabajo', formula:'Promedio ponderado del % de retrabajo por paso', frecuencia:'Semanal'},
{ind:'Throughput estimado', formula:'Duracion del turno / Tiempo total del proceso', frecuencia:'Diario'},
{ind:'Cumplimiento de Meta de Tiempo', formula:'Tiempo total del proceso menor o igual a la meta de lead time definida', frecuencia:'Mensual'}
];
var html = '<table><tr><th>Indicador</th><th>Formula</th><th>Frecuencia sugerida</th></tr>';
filas.forEach(function(f){
html += '<tr><td>' + f.ind + '</td><td>' + f.formula + '</td><td>' + f.frecuencia + '</td></tr>';
});
html += '</table>';
return html;
}
function generarSOP(){
var pasosFilas = document.querySelectorAll('#pasosBody tr');
if(pasosFilas.length === 0){
document.getElementById('resultadoSOP').innerHTML = '<p style="color:#c0392b">Primero define los pasos del proceso en el Analizador de Cuellos de Botella.</p>';
return;
}
var codigo = document.getElementById('sopCodigo').value || 'SOP-001';
var version = document.getElementById('sopVersion').value || '1.0';
var objetivo = document.getElementById('sopObjetivo').value || '';
var alcance = document.getElementById('sopAlcance').value || '';
var responsables = listaDesdeTexto('sopResponsables');

var pasos = [];
pasosFilas.forEach(function(fila){
var nombre = fila.querySelector('.p-nombre').value || 'Paso sin nombre';
var ciclo = numPositivo(fila.querySelector('.p-ciclo').value, 0);
pasos.push({nombre:nombre, ciclo:ciclo});
});

var fecha = new Date().toLocaleDateString('es-ES');

var responsablesHtml = '';
responsables.forEach(function(r){ responsablesHtml += '<li>' + r + '</li>'; });

var pasosHtml = '';
pasos.forEach(function(p){
pasosHtml += '<li>' + p.nombre + ' (tiempo estimado: ' + p.ciclo + ' min).</li>';
});

var html = '<div class="sop-doc">';
html += '<h3>Procedimiento Estandar de Operacion</h3>';
html += '<div class="sop-meta">Codigo: ' + codigo + ' &middot; Version: ' + version + ' &middot; Fecha: ' + fecha + '</div>';
html += '<h4>1. Objetivo</h4><p>' + objetivo + '</p>';
html += '<h4>2. Alcance</h4><p>' + alcance + '</p>';
html += '<h4>3. Responsables</h4><ul>' + responsablesHtml + '</ul>';
html += '<h4>4. Descripcion del procedimiento</h4><ol>' + pasosHtml + '</ol>';
html += '<h4>5. Indicadores de Control (KPI)</h4>' + kpiPanelHtml();
html += '</div>';

document.getElementById('resultadoSOP').innerHTML = html;
}

function textoSOPPlano(){
var pasosFilas = document.querySelectorAll('#pasosBody tr');
var codigo = document.getElementById('sopCodigo').value || 'SOP-001';
var version = document.getElementById('sopVersion').value || '1.0';
var objetivo = document.getElementById('sopObjetivo').value || '';
var alcance = document.getElementById('sopAlcance').value || '';
var responsables = listaDesdeTexto('sopResponsables');
var salto = String.fromCharCode(10);
var texto = 'PROCEDIMIENTO ESTANDAR DE OPERACION' + salto;
texto += 'Codigo: ' + codigo + ' - Version: ' + version + salto + salto;
texto += '1. OBJETIVO' + salto + objetivo + salto + salto;
texto += '2. ALCANCE' + salto + alcance + salto + salto;
texto += '3. RESPONSABLES' + salto;
responsables.forEach(function(r){ texto += '- ' + r + salto; });
texto += salto + '4. DESCRIPCION DEL PROCEDIMIENTO' + salto;
pasosFilas.forEach(function(fila, idx){
var nombre = fila.querySelector('.p-nombre').value || 'Paso sin nombre';
var ciclo = numPositivo(fila.querySelector('.p-ciclo').value, 0);
texto += (idx+1) + '. ' + nombre + ' (tiempo estimado: ' + ciclo + ' min)' + salto;
});
return texto;
}

function copiarSOP(){
var texto = textoSOPPlano();
navigator.clipboard.writeText(texto).then(function(){
var el = document.getElementById('avisoCopiaSOP');
if(!el){
el = document.createElement('p');
el.id = 'avisoCopiaSOP';
el.style.color = '#22c55e';
el.style.fontSize = '.82rem';
el.style.marginTop = '10px';
document.getElementById('resultadoSOP').appendChild(el);
}
el.textContent = 'Procedimiento copiado al portapapeles.';
}).catch(function(){
alert('No se pudo copiar automaticamente. Copia el texto manualmente.');
});
}


function chipsHtml(lista){
if(lista.length === 0){ return '<span style="color:#bbb;font-size:.78rem">Ninguno</span>'; }
return lista.map(function(r){ return '<span class="priority-chip">' + r.nombre + '</span>'; }).join('');
}
function priorityMatrixHtml(victorias, estrategicos, menores, reevaluar){
var html = '<div class="priority-matrix"><h4>Matriz de Priorizacion (Impacto vs Complejidad)</h4>';
html += '<p class="priority-caption">Cada paso se ubica segun su peso en el tiempo total del proceso y su complejidad de intervencion.</p>';
html += '<div class="priority-grid">';
html += '<div class="priority-cell victoria"><span class="cell-tag">Victorias rapidas</span><div>' + chipsHtml(victorias) + '</div><button class="priority-add" onclick="agregarIniciativa(\'\',\'Victorias rapidas\')">+ Agregar iniciativa</button></div>';
html += '<div class="priority-cell estrategico"><span class="cell-tag">Proyectos estrategicos</span><div>' + chipsHtml(estrategicos) + '</div><button class="priority-add" onclick="agregarIniciativa(\'\',\'Proyectos estrategicos\')">+ Agregar iniciativa</button></div>';
html += '<div class="priority-cell menor"><span class="cell-tag">Mejoras menores</span><div>' + chipsHtml(menores) + '</div><button class="priority-add" onclick="agregarIniciativa(\'\',\'Mejoras menores\')">+ Agregar iniciativa</button></div>';
html += '<div class="priority-cell reevaluar"><span class="cell-tag">Reevaluar</span><div>' + chipsHtml(reevaluar) + '</div><button class="priority-add" onclick="agregarIniciativa(\'\',\'Reevaluar\')">+ Agregar iniciativa</button></div>';
html += '</div></div>';
return html;
}

function cargarIniciativasLocal(){
try{
var datos = JSON.parse(localStorage.getItem('iniciativasMejora'));
if(Array.isArray(datos)) return datos;
}catch(e){}
return [];
}
function guardarIniciativasLocal(lista){
try{ localStorage.setItem('iniciativasMejora', JSON.stringify(lista)); }catch(e){}
}
function iniciativaSiguienteId(lista){
var maxId = 0;
lista.forEach(function(it){ if(it.id > maxId) maxId = it.id; });
return maxId + 1;
}
function agregarIniciativa(iniciativaTexto, tipoTexto){
var lista = cargarIniciativasLocal();
lista.push({id: iniciativaSiguienteId(lista), iniciativa: iniciativaTexto || 'Nueva iniciativa', tipo: tipoTexto || 'Victorias rapidas', estado: 'Pendiente'});
guardarIniciativasLocal(lista);
renderIniciativas();
}
function actualizarCampoIniciativa(id, campo, valor){
var lista = cargarIniciativasLocal();
lista.forEach(function(it){ if(it.id === id){ it[campo] = valor; } });
guardarIniciativasLocal(lista);
}
function eliminarIniciativa(id){
var lista = cargarIniciativasLocal().filter(function(it){ return it.id !== id; });
guardarIniciativasLocal(lista);
renderIniciativas();
}
function renderIniciativas(){
var cont = document.getElementById('iniciativasContainer');
if(!cont) return;
var lista = cargarIniciativasLocal();
var html = '<h4 style="font-size:.78rem;text-transform:uppercase;letter-spacing:.5px;color:var(--azul);margin:16px 0 8px">Registro de Iniciativas de Mejora</h4>';
if(lista.length === 0){
html += '<p style="color:#999;font-size:.85rem;margin-bottom:10px">Aun no hay iniciativas registradas. Agrega una manualmente o usa "+ Agregar iniciativa" en la matriz de priorizacion.</p>';
} else {
html += '<table class="iniciativas-tabla"><thead><tr><th>Iniciativa</th><th>Tipo</th><th>Estado</th><th>Responsable</th><th>Fecha limite</th><th>Evaluacion</th><th></th></tr></thead><tbody>';
lista.forEach(function(it){
html += '<tr>';
html += '<td><input type="text" value="' + String(it.iniciativa).replace(/"/g,'&quot;') + '" onchange="actualizarCampoIniciativa(' + it.id + ',\'iniciativa\',this.value)"></td>';
html += '<td><select onchange="actualizarCampoIniciativa(' + it.id + ',\'tipo\',this.value)">';
['Victorias rapidas','Proyectos estrategicos','Mejoras menores','Reevaluar'].forEach(function(t){
html += '<option value="' + t + '"' + (it.tipo === t ? ' selected' : '') + '>' + t + '</option>';
});
html += '</select></td>';
html += '<td><select onchange="actualizarCampoIniciativa(' + it.id + ',\'estado\',this.value)">';
['Pendiente','En progreso','Completado'].forEach(function(e){
html += '<option value="' + e + '"' + (it.estado === e ? ' selected' : '') + '>' + e + '</option>';
});
html += '</select></td>';
html += '<td><input type="text" value="' + String(it.responsable||'').replace(/"/g,'&quot;') + '" placeholder="Asignar responsable" onchange="actualizarCampoIniciativa(' + it.id + ',\'responsable\',this.value)"></td>';
html += '<td><input type="date" value="' + String(it.fechaLimite||'') + '" onchange="actualizarCampoIniciativa(' + it.id + ',\'fechaLimite\',this.value)"></td>';
html += '<td>' + (it.evaluacion ? '<span class="eval-badge">C:' + it.evaluacion.complejidad.toFixed(1) + ' / I:' + it.evaluacion.impacto.toFixed(1) + '</span>' : '<span class="eval-badge">Sin evaluar</span>') + '<br><button onclick="abrirEvaluacion(' + it.id + ')" style="margin-top:4px;border:none;background:var(--morado);color:white;border-radius:6px;padding:4px 8px;cursor:pointer;font-size:.72rem">Evaluar</button></td>';
html += '<td><button onclick="eliminarIniciativa(' + it.id + ')">&#10005;</button></td>';
html += '</tr>';
});
html += '</tbody></table>';
}
html += '<div class="bpmn-buttons" style="margin-top:10px"><button onclick="agregarIniciativa(\'\',\'Victorias rapidas\')">Agregar iniciativa</button></div>';
cont.innerHTML = html;
}
function analizarBrechas(){
var filas = document.querySelectorAll('#pasosBody tr');
if(filas.length === 0){
document.getElementById('resultadoBrechas').innerHTML = '<p style="color:#c0392b">Primero define los pasos del proceso en el Analizador de Cuellos de Botella.</p>';
return;
}
var metaToBe = numPositivo(document.getElementById('gapMeta').value, 1);

var pasos = [];
filas.forEach(function(fila){
var nombre = fila.querySelector('.p-nombre').value || 'Paso sin nombre';
var ciclo = numPositivo(fila.querySelector('.p-ciclo').value, 0);
var espera = numPositivo(fila.querySelector('.p-espera').value, 0);
var retrabajo = numPorcentaje(fila.querySelector('.p-retrabajo').value);
var tiempoRetrabajo = ciclo * (retrabajo / 100);
var total = ciclo + espera + tiempoRetrabajo;
pasos.push({nombre:nombre, ciclo:ciclo, espera:espera, retrabajo:retrabajo, total:total});
});

var tiempoTotalAsIs = 0;
pasos.forEach(function(p){ tiempoTotalAsIs += p.total; });

var brechaMin = tiempoTotalAsIs - metaToBe;
var brechaPct = metaToBe > 0 ? Math.round((brechaMin / metaToBe) * 100) : 0;

var victorias = [], estrategicos = [], menores = [], reevaluar = [];

pasos.forEach(function(p){
var pctDelTotal = tiempoTotalAsIs > 0 ? (p.total / tiempoTotalAsIs) * 100 : 0;
var altoImpacto = pctDelTotal >= 20;
var altaComplejidad = (p.espera > p.ciclo * 2 && p.espera > 0) || p.retrabajo >= 15;

var registro = {nombre:p.nombre, total:Math.round(p.total), pct:Math.round(pctDelTotal)};

if(altoImpacto && !altaComplejidad){ victorias.push(registro); }
else if(altoImpacto && altaComplejidad){ estrategicos.push(registro); }
else if(!altoImpacto && !altaComplejidad){ menores.push(registro); }
else { reevaluar.push(registro); }
});

function listaHtml(lista){
if(lista.length === 0){ return '<div class="gap-item" style="border-left-color:#ddd;color:#999">Ninguno</div>'; }
var html = '';
lista.forEach(function(r){
html += '<div class="gap-item">' + r.nombre + ' &mdash; ' + r.total + ' min (' + r.pct + '% del tiempo total)</div>';
});
return html;
}

var html = '';
html += '<div class="gap-resumen">';
html += '<div>Tiempo AS-IS<span>' + Math.round(tiempoTotalAsIs) + ' min</span></div>';
html += '<div>Meta TO-BE<span>' + Math.round(metaToBe) + ' min</span></div>';
html += '<div>Brecha<span>' + (brechaMin >= 0 ? '+' : '') + Math.round(brechaMin) + ' min</span></div>';
html += '<div>Brecha relativa<span>' + (brechaPct >= 0 ? '+' : '') + brechaPct + '%</span></div>';
html += '</div>';

html += priorityMatrixHtml(victorias, estrategicos, menores, reevaluar);

html += '<div class="gap-grupo victoria"><h4>Victorias rapidas (alto impacto, baja complejidad)</h4>' + listaHtml(victorias) + '</div>';
html += '<div class="gap-grupo estrategico"><h4>Proyectos estrategicos (alto impacto, alta complejidad)</h4>' + listaHtml(estrategicos) + '</div>';
html += '<div class="gap-grupo menor"><h4>Mejoras menores (bajo impacto, baja complejidad)</h4>' + listaHtml(menores) + '</div>';
html += '<div class="gap-grupo reevaluar"><h4>Reevaluar (bajo impacto, alta complejidad)</h4>' + listaHtml(reevaluar) + '</div>';
html += '<div id="iniciativasContainer"></div>';

document.getElementById('resultadoBrechas').innerHTML = html;
renderIniciativas();
}


    function generarVSM(){
      var filas = document.querySelectorAll('#pasosBody tr');
      if(filas.length === 0){
        document.getElementById('resultadoVSM').innerHTML = '<p style="color:#c0392b">Agrega al menos un paso en el Analizador de Cuellos de Botella para generar el mapeo de flujo de valor.</p>';
        return;
      }
      var pasos = [];
      filas.forEach(function(fila){
        var nombre = fila.querySelector('.p-nombre').value || 'Paso sin nombre';
        var ciclo = numPositivo(fila.querySelector('.p-ciclo').value, 0);
        var espera = numPositivo(fila.querySelector('.p-espera').value, 0);
        var retrabajo = numPorcentaje(fila.querySelector('.p-retrabajo').value);
        var total = ciclo + espera;
        var categoria;
        if(retrabajo >= 15 || (espera > ciclo * 2 && espera > 0)){
          categoria = 'desperdicio';
        } else if(espera > ciclo * 0.5){
          categoria = 'necesario';
        } else {
          categoria = 'valor';
        }
        pasos.push({nombre:nombre, ciclo:ciclo, espera:espera, retrabajo:retrabajo, total:total, categoria:categoria});
      });

      var tiempoTotal = 0;
      var sumaValor = 0, sumaNecesario = 0, sumaDesperdicio = 0;
      pasos.forEach(function(p){
        tiempoTotal += p.total;
        if(p.categoria === 'valor') sumaValor += p.total;
        else if(p.categoria === 'necesario') sumaNecesario += p.total;
        else sumaDesperdicio += p.total;
      });
      if(tiempoTotal <= 0) tiempoTotal = 1;

      var elFrecuencia = document.getElementById('vsmFrecuencia');
var frecuenciaMensual = elFrecuencia ? (numPositivo(elFrecuencia.value, 1)) : 1;

var pctValor = Math.round((sumaValor / tiempoTotal) * 100);
      var pctNecesario = Math.round((sumaNecesario / tiempoTotal) * 100);
      var pctDesperdicio = Math.round((sumaDesperdicio / tiempoTotal) * 100);

      var html = '';
      html += '<div class="vsm-timeline">' + pasos.map(function(p){ return '<div class="vsm-step ' + p.categoria + '">' + p.nombre + '<span class="vsm-step-time">' + Math.round(p.total) + ' min</span></div>'; }).join('') + '</div>';
html += '<div class="vsm-legend"><span><i style="background:#22c55e"></i>Valor Agregado</span><span><i style="background:#f0a500"></i>Necesario (NNVA)</span><span><i style="background:#dc2626"></i>Desperdicio (NVA)</span></div>';

html += '<div class="vsm-resumen">';
html += '<div><div class="num">' + Math.round(tiempoTotal) + ' min</div><div class="lbl">Tiempo total del proceso</div></div>';
html += '<div class="valor"><div class="num" style="color:#16a34a">' + pctValor + '%</div><div class="lbl">Valor agregado (' + Math.round(sumaValor) + ' min)</div></div>';
html += '<div class="necesario"><div class="num" style="color:#d97706">' + pctNecesario + '%</div><div class="lbl">Necesario NNVA (' + Math.round(sumaNecesario) + ' min)</div></div>';
html += '<div class="desperdicio"><div class="num" style="color:#dc2626">' + pctDesperdicio + '%</div><div class="lbl">Desperdicio (' + Math.round(sumaDesperdicio) + ' min)</div></div>';
html += '</div>';

var elHorizonte = document.getElementById('vsmHorizonte');
var horizonte = elHorizonte ? elHorizonte.value : 'mes';
var factorPorHorizonte = {dia: 1/30, semana: 7/30, mes: 1, anio: 12};
var etiquetaHorizonte = {dia: 'diario', semana: 'semanal', mes: 'mensual', anio: 'anual'};
var factor = factorPorHorizonte[horizonte] !== undefined ? factorPorHorizonte[horizonte] : 1;
var vecesProyectadas = frecuenciaMensual * factor;
var tiempoTotalProyectado = tiempoTotal * vecesProyectadas;
var desperdicioProyectado = sumaDesperdicio * vecesProyectadas;
var mostrarEnHoras = (horizonte === 'anio');
var tiempoTotalMostrado = mostrarEnHoras ? (tiempoTotalProyectado / 60) : tiempoTotalProyectado;
var desperdicioMostrado = mostrarEnHoras ? (desperdicioProyectado / 60) : desperdicioProyectado;
var unidadMostrada = mostrarEnHoras ? 'h' : 'min';

html += '<div class="vsm-pareto"><h4 style="margin-bottom:10px;color:var(--azul)">Proyeccion ' + etiquetaHorizonte[horizonte] + ' (' + frecuenciaMensual + ' veces/mes)</h4>';
html += '<div class="vsm-resumen">';
html += '<div><div class="num">' + Math.round(tiempoTotalMostrado) + ' ' + unidadMostrada + '</div><div class="lbl">Tiempo total ' + etiquetaHorizonte[horizonte] + '</div></div>';
html += '<div class="desperdicio"><div class="num" style="color:#dc2626">' + Math.round(desperdicioMostrado) + ' ' + unidadMostrada + '</div><div class="lbl">Desperdicio ' + etiquetaHorizonte[horizonte] + '</div></div>';
html += '</div></div>';
html += '</div></div>';

function listaPasos(cat){
        var items = pasos.filter(function(p){ return p.categoria === cat; });
        if(items.length === 0) return '<div class="vsm-item">Sin pasos en esta categoria.</div>';
        return items.map(function(p){
          return '<div class="vsm-item">' + p.nombre + ' — ' + Math.round(p.total) + ' min</div>';
        }).join('');
      }

      html += '<div class="vsm-cat valor"><h4>Valor agregado (' + pctValor + '%)</h4>' + listaPasos('valor') + '</div>';
      html += '<div class="vsm-cat necesario"><h4>Necesario sin valor agregado (' + pctNecesario + '%)</h4>' + listaPasos('necesario') + '</div>';
      html += '<div class="vsm-cat desperdicio"><h4>Desperdicio (' + pctDesperdicio + '%)</h4>' + listaPasos('desperdicio') + '</div>';

      var desperdicios = pasos.filter(function(p){ return p.categoria === 'desperdicio'; }).sort(function(a,b){ return b.total - a.total; });
      var sumaDesperdicioOrdenado = 0;
      var totalDesperdicioPareto = desperdicios.reduce(function(acc,p){ return acc + p.total; }, 0) || 1;

      html += '<div class="vsm-pareto"><h4 style="margin-bottom:10px;color:var(--azul)">Analisis de Pareto de desperdicios</h4>';
      if(desperdicios.length === 0){
        html += '<p>No se identificaron pasos clasificados como desperdicio puro.</p>';
      } else {
        html += '<table><tr><th>Paso</th><th>Tiempo (min)</th><th>% del desperdicio</th><th>Acumulado</th><th>Prioridad</th></tr>';
        desperdicios.forEach(function(p){
          sumaDesperdicioOrdenado += p.total;
          var pct = Math.round((p.total / totalDesperdicioPareto) * 100);
          var acumulado = Math.round((sumaDesperdicioOrdenado / totalDesperdicioPareto) * 100);
          var prioridad = acumulado <= 80 ? 'Critico (80/20)' : 'Secundario';
          html += '<tr><td>' + p.nombre + '</td><td>' + Math.round(p.total) + '</td><td>' + pct + '%</td><td>' + acumulado + '%</td><td>' + prioridad + '</td></tr>';
        });
        html += '</table>';
      }
      html += '</div>';

      document.getElementById('resultadoVSM').innerHTML = html;
    }


function heatmapCellsHtml(riesgos){
var probScores={'Baja':1,'Media':2,'Alta':3};
var impactScores={'Bajo':1,'Medio':2,'Alto':3};
var mapa = {};
riesgos.forEach(function(r){
var key = impactScores[r.impacto] + '_' + probScores[r.probabilidad];
if(!mapa[key]) mapa[key] = [];
mapa[key].push(r.nombre);
});
var filas = [{score:3,label:'Alto'},{score:2,label:'Medio'},{score:1,label:'Bajo'}];
var columnas = [1,2,3];
var html = '';
filas.forEach(function(fila){
html += '<div class="heatmap-row"><div class="heatmap-rowlabel">' + fila.label + '</div>';
columnas.forEach(function(colScore){
var key = fila.score + '_' + colScore;
var total = fila.score * colScore;
var nivel = total >= 6 ? 'alto' : (total >= 3 ? 'medio' : 'bajo');
var items = mapa[key] || [];
var chips = items.map(function(n){ return '<span class="heatmap-chip">' + n + '</span>'; }).join('');
html += '<div class="heatmap-cell ' + nivel + '">' + chips + '</div>';
});
html += '</div>';
});
return html;
}
function riskHeatmapHtml(riesgos){
var html = '<div class="risk-heatmap"><h4>Mapa de Calor de Riesgos (Probabilidad x Impacto)</h4>';
html += '<div class="heatmap-container"><div class="heatmap-yaxis">Impacto</div><div class="heatmap-main">';
html += heatmapCellsHtml(riesgos);
html += '<div class="heatmap-collabels"><div class="heatmap-collabel"></div><div class="heatmap-collabel">Baja</div><div class="heatmap-collabel">Media</div><div class="heatmap-collabel">Alta</div></div>';
html += '<div class="heatmap-xaxis">Probabilidad</div>';
html += '</div></div></div>';
return html;
}
function riskTaxonomiaHtml(riesgos){
var counts = {Demora:0, Calidad:0, Ejecucion:0};
riesgos.forEach(function(r){
var sub = r.tipo.split(' - ')[1] || 'Ejecucion';
if(counts[sub] === undefined) counts[sub] = 0;
counts[sub]++;
});
var colores = {Demora:'#f0a500', Calidad:'#dc2626', Ejecucion:'#2563a8'};
var etiquetas = {Demora:'Demora / cuello de botella', Calidad:'Calidad / retrabajo', Ejecucion:'Ejecucion manual estandar'};
var html = '<div class="riskguard-taxonomia"><h4>Taxonomia de Riesgos Operativos</h4>';
Object.keys(counts).forEach(function(k){
html += '<div class="tax-chip"><span class="tax-dot" style="background:' + (colores[k]||'#999') + '"></span><b>' + counts[k] + '</b> ' + (etiquetas[k]||k) + '</div>';
});
html += '</div>';
return html;
}
function analizarRiesgos(){
var filas = document.querySelectorAll('#pasosBody tr');
if(filas.length === 0){
document.getElementById('resultadoRiskGuard').innerHTML = '<p style="color:#c0392b">Agrega al menos un paso en el Analizador de Cuellos de Botella para identificar riesgos.</p>';
return;
}
var pasos = [];
filas.forEach(function(fila){
var nombre = fila.querySelector('.p-nombre').value || 'Paso sin nombre';
var ciclo = numPositivo(fila.querySelector('.p-ciclo').value, 0);
var espera = numPositivo(fila.querySelector('.p-espera').value, 0);
var retrabajo = numPorcentaje(fila.querySelector('.p-retrabajo').value);
var total = ciclo + espera;
pasos.push({nombre:nombre, ciclo:ciclo, espera:espera, retrabajo:retrabajo, total:total});
});

var tiempoTotal = 0;
pasos.forEach(function(p){ tiempoTotal += p.total; });
if(tiempoTotal <= 0) tiempoTotal = 1;

var riesgos = pasos.map(function(p){
var impactoPct = Math.round((p.total / tiempoTotal) * 100);
var impacto = impactoPct >= 30 ? 'Alto' : (impactoPct >= 15 ? 'Medio' : 'Bajo');
var probabilidad = retrabajoNivel(p.retrabajo);
var tipo, descripcion;
if(p.espera > p.ciclo * 1.5){
tipo = 'Operativo - Demora';
descripcion = 'Cuello de botella por espera prolongada; riesgo de incumplimiento de tiempos de respuesta.';
} else if(p.retrabajo >= 15){
tipo = 'Operativo - Calidad';
descripcion = 'Porcentaje de retrabajo elevado; riesgo de errores y reprocesos operativos.';
} else {
tipo = 'Operativo - Ejecucion';
descripcion = 'Riesgo estandar asociado a la ejecucion manual del paso.';
}
var probScore = probabilidad === 'Alta' ? 3 : (probabilidad === 'Media' ? 2 : 1);
var impactScore = impacto === 'Alto' ? 3 : (impacto === 'Medio' ? 2 : 1);
var score = probScore * impactScore;
var nivel = score >= 6 ? 'Alto' : (score >= 3 ? 'Medio' : 'Bajo');
var control = nivel === 'Alto' ? 'Control preventivo obligatorio con doble validacion' : (nivel === 'Medio' ? 'Control detectivo periodico' : 'Monitoreo estandar');
return {nombre:p.nombre, tipo:tipo, descripcion:descripcion, probabilidad:probabilidad, impacto:impacto, nivel:nivel, control:control};
});

function retrabajoNivel(r){
if(r >= 15) return 'Alta';
if(r >= 5) return 'Media';
return 'Baja';
}

var totalAlto = riesgos.filter(function(r){ return r.nivel === 'Alto'; }).length;
var totalMedio = riesgos.filter(function(r){ return r.nivel === 'Medio'; }).length;
var totalBajo = riesgos.filter(function(r){ return r.nivel === 'Bajo'; }).length;

var html = '';
html += '<div class="riskguard-resumen">';
html += '<div><div class="num" style="color:#dc2626">' + totalAlto + '</div><div class="lbl">Riesgos altos</div></div>';
html += '<div><div class="num" style="color:#d97706">' + totalMedio + '</div><div class="lbl">Riesgos medios</div></div>';
html += '<div><div class="num" style="color:#16a34a">' + totalBajo + '</div><div class="lbl">Riesgos bajos</div></div>';
html += '</div>';

html += riskTaxonomiaHtml(riesgos);
html += riskHeatmapHtml(riesgos);
html += '<div class="riskguard-table"><table><tr><th>Paso</th><th>Riesgo identificado</th><th>Tipo</th><th>Probabilidad</th><th>Impacto</th><th>Nivel</th><th>Control sugerido</th></tr>';
riesgos.forEach(function(r){
var badgeClass = r.nivel === 'Alto' ? 'alto' : (r.nivel === 'Medio' ? 'medio' : 'bajo');
html += '<tr><td>' + r.nombre + '</td><td>' + r.descripcion + '</td><td>' + r.tipo + '</td><td>' + r.probabilidad + '</td><td>' + r.impacto + '</td><td><span class="risk-badge ' + badgeClass + '">' + r.nivel + '</span></td><td>' + r.control + '</td></tr>';
});
html += '</table></div>';

document.getElementById('resultadoRiskGuard').innerHTML = html;
}

function guardarPasosLocal(){
var filas = document.querySelectorAll('#pasosBody tr');
var datos = [];
filas.forEach(function(fila){
datos.push({
nombre: fila.querySelector('.p-nombre').value,
ciclo: fila.querySelector('.p-ciclo').value,
espera: fila.querySelector('.p-espera').value,
retrabajo: fila.querySelector('.p-retrabajo').value
});
});
try{ localStorage.setItem('pasosProceso', JSON.stringify(datos)); }catch(e){}
}
function cargarPasosLocal(){
try{
var datos = JSON.parse(localStorage.getItem('pasosProceso'));
if(datos && datos.length > 0){
document.getElementById('pasosBody').innerHTML = '';
datos.forEach(function(p){
agregarPaso(p.nombre, p.ciclo, p.espera, p.retrabajo);
});
return true;
}
}catch(e){}
return false;
}
function actualizarTodo(){
guardarPasosLocal();
analizarProceso();
simularOptimizacion();
calcularKPIs();
generarSIPOC();
generarSOP();
analizarBrechas();
generarVSM();
analizarRiesgos();
}
function inicializarModulo(){
mermaid.initialize({startOnLoad:false, theme:'default', securityLevel:'loose'});
if(!cargarDiagramaLocal()){ document.getElementById('mermaidInput').value = ejemplos.credito; }
renderDiagram();
document.getElementById('mermaidInput').addEventListener('input', guardarDiagramaLocal);
if(!cargarPasosLocal()){ cargarEjemploProceso('credito', false); }
document.getElementById('pasosBody').addEventListener('input', actualizarTodo);
analizarProceso();
simularOptimizacion();
calcularKPIs();
generarSIPOC();
generarSOP();
analizarBrechas();
generarVSM();
analizarRiesgos();
}
window.addEventListener('load', inicializarModulo);
var evaluacionCriterios = [
{grupo:'complejidad', clave:'tiempoImplementacion', label:'Tiempo de Implementacion'},
{grupo:'complejidad', clave:'costoFinanciero', label:'Costo Financiero'},
{grupo:'complejidad', clave:'cambiosEstructurales', label:'Cambios Estructurales'},
{grupo:'impacto', clave:'ingresos', label:'Ingresos / Ventas / Ahorros'},
{grupo:'impacto', clave:'controlProceso', label:'Control del Proceso'},
{grupo:'impacto', clave:'reduccionCarga', label:'Reduccion de Carga de Trabajo'}
];
var evaluacionTemp = {};
var evaluacionIdActual = null;
function abrirEvaluacion(id){
var lista = cargarIniciativasLocal();
var item = null;
lista.forEach(function(it){ if(it.id === id){ item = it; } });
if(!item) return;
evaluacionIdActual = id;
evaluacionTemp = {};
evaluacionCriterios.forEach(function(c){
evaluacionTemp[c.clave] = (item.evaluacion && item.evaluacion[c.clave]) ? item.evaluacion[c.clave] : 1;
});
renderModalEvaluacion(item.iniciativa);
document.getElementById('modalEvaluacionOverlay').classList.add('activo');
}
function cerrarEvaluacion(){
document.getElementById('modalEvaluacionOverlay').classList.remove('activo');
evaluacionIdActual = null;
}
function seleccionarCriterioEval(clave, valor){
evaluacionTemp[clave] = valor;
var lista = cargarIniciativasLocal();
var nombre = 'la iniciativa';
lista.forEach(function(it){ if(it.id === evaluacionIdActual){ nombre = it.iniciativa; } });
renderModalEvaluacion(nombre);
}
function promedioGrupoEval(grupo){
var claves = evaluacionCriterios.filter(function(c){ return c.grupo === grupo; }).map(function(c){ return c.clave; });
var suma = 0;
claves.forEach(function(k){ suma += evaluacionTemp[k] || 1; });
return suma / claves.length;
}
function renderModalEvaluacion(nombreIniciativa){
var complejidad = promedioGrupoEval('complejidad');
var impacto = promedioGrupoEval('impacto');
var html = '<h3>Evaluar iniciativa</h3>';
html += '<p class="modal-sub">' + nombreIniciativa + '</p>';
html += '<div class="eval-scores"><div><div class="num">' + complejidad.toFixed(1) + '</div><div class="lbl">Complejidad</div></div><div><div class="num">' + impacto.toFixed(1) + '</div><div class="lbl">Impacto de Negocio</div></div></div>';
['complejidad','impacto'].forEach(function(grupo){
html += '<div class="eval-grupo"><h4>' + (grupo === 'complejidad' ? 'Complejidad' : 'Impacto de Negocio') + '</h4>';
evaluacionCriterios.filter(function(c){ return c.grupo === grupo; }).forEach(function(c){
html += '<div class="eval-criterio"><label>' + c.label + '</label><div class="eval-btns">';
[[1,'Bajo'],[5,'Medio'],[9,'Alto']].forEach(function(par){
var sel = evaluacionTemp[c.clave] === par[0] ? ' selected' : '';
html += '<button class="eval-btn' + sel + '" onclick="seleccionarCriterioEval(\'' + c.clave + '\',' + par[0] + ')">' + par[1] + ' (' + par[0] + ')</button>';
});
html += '</div></div>';
});
html += '</div>';
});
html += '<div class="modal-buttons"><button class="btn-cancelar" onclick="cerrarEvaluacion()">Cancelar</button><button class="btn-guardar" onclick="guardarEvaluacion()">Guardar Evaluacion</button></div>';
document.getElementById('modalEvaluacionBox').innerHTML = html;
}
function guardarEvaluacion(){
if(evaluacionIdActual === null) return;
var complejidad = promedioGrupoEval('complejidad');
var impacto = promedioGrupoEval('impacto');
var tipoNuevo;
if(impacto >= 5 && complejidad <= 5){ tipoNuevo = 'Victorias rapidas'; }
else if(impacto >= 5 && complejidad > 5){ tipoNuevo = 'Proyectos estrategicos'; }
else if(impacto < 5 && complejidad <= 5){ tipoNuevo = 'Mejoras menores'; }
else { tipoNuevo = 'Reevaluar'; }
var lista = cargarIniciativasLocal();
lista.forEach(function(it){
if(it.id === evaluacionIdActual){
it.evaluacion = {
tiempoImplementacion: evaluacionTemp.tiempoImplementacion,
costoFinanciero: evaluacionTemp.costoFinanciero,
cambiosEstructurales: evaluacionTemp.cambiosEstructurales,
ingresos: evaluacionTemp.ingresos,
controlProceso: evaluacionTemp.controlProceso,
reduccionCarga: evaluacionTemp.reduccionCarga,
complejidad: complejidad,
impacto: impacto
};
it.tipo = tipoNuevo;
}
});
guardarIniciativasLocal(lista);
cerrarEvaluacion();
renderIniciativas();
}

