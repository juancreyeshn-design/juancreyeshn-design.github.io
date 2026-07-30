// cuellos-botella.js - parte de gestion-procesos-ia (modularizado desde script.js)
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
