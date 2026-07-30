# Gestión de Procesos y Optimización Operativa con IA

Módulo interactivo para modelar, analizar y mejorar procesos de negocio directamente en el navegador, sin necesidad de instalar software adicional. Combina notación BPMN, metodología Lean y apoyo de inteligencia artificial para convertir el conocimiento operativo de un equipo en procesos documentados, medibles y auditables.

## Agnostico de industria y de tipo de proceso

Las herramientas de este modulo no estan limitadas a un sector en particular: funcionan sobre conceptos genericos de proceso (pasos, tiempo de ciclo, tiempo de espera, porcentaje de retrabajo) que aplican por igual a manufactura, servicios, salud, banca, atencion al cliente o cualquier otro proceso de negocio. El Analizador de Cuellos de Botella incluye ejemplos precargados de tres industrias (aprobacion de credito, produccion en manufactura y atencion al cliente) seleccionables desde un menu desplegable; son solo ilustrativos y cualquier proceso propio puede reemplazarlos.

## Archivos

`index.html`: aplicación principal con las herramientas de gestión de procesos.

`planificador-proyecto.html`: cuestionario de descubrimiento para recomendar metodología, equipo y tecnología de un proyecto de mejora.

## Cómo se conectan las herramientas

El punto de partida es el Analizador de Cuellos de Botella, donde se definen los pasos del proceso con su tiempo de ciclo, tiempo de espera y porcentaje de retrabajo. A partir de esos pasos se alimentan automáticamente el resto de los módulos: SIPOC, VSM, SOP, KPI, simulador de optimización, brechas AS-IS vs TO-BE y RiskGuard AI.

## Herramientas incluidas

Caracterizador de Procesos, SIPOC. Genera la ficha de proveedores, entradas, proceso, salidas y clientes.

Analizador de Cuellos de Botella con IA. Aplica reglas heurísticas para detectar pasos críticos.

Diagramador de Procesos BPMN. Crea flujogramas en notación BPMN usando Mermaid.js, con exportación a PNG y BPMN 2.0 en XML.

Mapeo de Flujo de Valor, VSM. Clasifica actividades en Valor Agregado, Necesario sin Valor Agregado y Desperdicio, con análisis de Pareto.

Generador de Procedimientos, SOP. Redacta un procedimiento estándar de operación a partir de los pasos definidos.

Simulador de Optimización de Procesos. Proyecta el impacto de reducir esperas, retrabajo y automatizar pasos críticos.

Panel de Indicadores KPI de Procesos. Calcula lead time, porcentaje de valor agregado, throughput, costo por unidad y cumplimiento de meta.

Analizador de Brechas AS-IS vs TO-BE. Compara el estado actual con la meta deseada y prioriza iniciativas en una matriz de impacto vs. complejidad.

Identificador de Riesgos y Controles, RiskGuard AI. Id
entifica riesgos operativos por paso y sugiere controles de mitigación.

Planificador de Proyecto de Mejora. Recomienda metodología, Scrum o Cascada, y recursos para ejecutar las iniciativas priorizadas.

## Tecnología

Construido con HTML, CSS y JavaScript nativo, sin frameworks ni build tools. Usa Mermaid.js, vía CDN, para el renderizado de diagramas BPMN.

## Uso

Abre index.html en cualquier navegador moderno, o visita la versión publicada en GitHub Pages. No requiere instalación ni configuración previa.
