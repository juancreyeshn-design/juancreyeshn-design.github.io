// vsm-gap-riskguard.js - parte de gestion-procesos-ia (modularizado desde script.js)
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

