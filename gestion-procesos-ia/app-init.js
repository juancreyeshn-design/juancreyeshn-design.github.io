// app-init.js - parte de gestion-procesos-ia (modularizado desde script.js)
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
