// simulador-kpi.js - parte de gestion-procesos-ia (modularizado desde script.js)
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
