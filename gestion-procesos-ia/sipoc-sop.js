// sipoc-sop.js - parte de gestion-procesos-ia (modularizado desde script.js)
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


