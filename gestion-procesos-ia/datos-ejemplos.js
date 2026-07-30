// datos-ejemplos.js - parte de gestion-procesos-ia (modularizado desde script.js)

var ejemplos = {};
ejemplos.simple = "flowchart LR\nA([Inicio]) --> B[Recibir solicitud]\nB --> C[Revisar documentos]\nC --> D[Registrar en el sistema]\nD --> E([Fin])";
ejemplos.decision = "flowchart TD\nA([Inicio]) --> B[Recibir solicitud de compra]\nB --> C{Monto mayor a limite?}\nC -- Si --> D[Enviar a aprobacion gerencial]\nC -- No --> E[Aprobacion automatica]\nD --> F{Aprobado?}\nF -- Si --> G[Generar orden de compra]\nF -- No --> H[Notificar rechazo]\nE --> G\nG --> I([Fin])\nH --> I";
ejemplos.areas = "flowchart TD\nsubgraph Cliente\nA([Inicio]) --> B[Envia solicitud]\nend\nsubgraph Ventas\nB --> C[Revisa solicitud]\nC --> D{Stock disponible?}\nend\nsubgraph Bodega\nD -- Si --> E[Prepara pedido]\nE --> F[Despacha pedido]\nend\nsubgraph Cliente2[Cliente]\nD -- No --> G[Notifica agotado]\nF --> H([Fin])\nG --> H\nend";
ejemplos.credito = "flowchart TD\nA([Inicio]) --> B[Recepcion de solicitud de credito]\nB --> C[Verificacion de identidad y documentos KYC]\nC --> D[Analisis crediticio y scoring]\nD --> E[Consulta a centrales de riesgo]\nE --> F{Comite aprueba el credito?}\nF -- Si --> G[Formalizacion y firma de contrato]\nF -- No --> H[Notificar rechazo al cliente]\nG --> I[Desembolso de fondos]\nI --> J[Seguimiento post-desembolso]\nJ --> K([Fin])\nH --> K";
ejemplos.manufactura = "flowchart TD\nA([Inicio]) --> B[Recepcion de orden de produccion]\nB --> C[Alistamiento de materiales]\nC --> D[Fabricacion y ensamble]\nD --> E{Cumple control de calidad?}\nE -- Si --> F[Empaque]\nE -- No --> G[Retrabajo del producto]\nG --> D\nF --> H[Almacenamiento en bodega]\nH --> I[Despacho y transporte]\nI --> J([Fin])";
ejemplos.soporte = "flowchart TD\nA([Inicio]) --> B[Recepcion del ticket]\nB --> C[Clasificacion y priorizacion]\nC --> D[Diagnostico del problema]\nD --> E{Requiere escalamiento?}\nE -- Si --> F[Escalamiento a nivel especializado]\nE -- No --> G[Resolucion del problema]\nF --> G\nG --> H[Confirmacion con el cliente]\nH --> I[Cierre y registro del caso]\nI --> J([Fin])";

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
