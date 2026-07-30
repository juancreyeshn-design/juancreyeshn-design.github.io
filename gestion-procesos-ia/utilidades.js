// utilidades.js - parte de gestion-procesos-ia (modularizado desde script.js)
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

function listaDesdeTexto(id){
var texto = document.getElementById(id).value;
return texto.split(String.fromCharCode(10)).map(function(s){return s.trim();}).filter(function(s){return s.length>0;});
}

