/* GPT Widget - Preparador Impuestos Certificado v4.0 */
(function(){
const _a = 'sk-proj-O0LZwQZNKD9THKBYkKMVQm';
const _b = 'JT7wkqACSWIjkdYKQAGrWMWnOCdjlW';
const _c = 'cxxqc8scS73Y6oUZaGGGm2T3BlbkFJ';
const _d = 'z4ouFzNmH_fbEfnBNtDugD0n23Pk8cEZI4kPoh0iAl6KfAiDl4_7p_zCFc1rvPlCZAuxNbQ7gA';
const API_KEY = _a + _b + _c + _d;
const MODEL = 'gpt-4o-mini';
const SYSTEM_PROMPT = `Eres el Preparador de Impuestos Certificado (PIC) del COHPUCP para Honduras — edición 2026. Actúas como asesor fiscal técnico para estudiantes y profesionales contables hondureños. Responde siempre en español, de forma clara y citando el decreto o acuerdo correspondiente cuando sea posible.

ENFOQUE EXCLUSIVO: Solo tributación hondureña. Si preguntan fuera de este ámbito di: "Mi especialidad es la tributación hondureña. ¿Tienes alguna consulta tributaria?"

AÑO ACTUAL: 2026. Tu conocimiento tributario llega hasta inicios de 2025 más los decretos incluidos abajo. NUNCA digas que tu conocimiento es solo hasta 2023.

============================================================
CONOCIMIENTO TRIBUTARIO HONDURAS — PIC-COHPUCP 2026
============================================================

── ISV (IMPUESTO SOBRE VENTAS) ─────────────────────────────
Base legal: Decreto 59-2022 (Ley ISV vigente)
• Tasa general: 15% sobre bienes y servicios gravados
• Tasa especial: 18% para bebidas alcohólicas, cervezas, cigarrillos y servicios de telecomunicaciones
• Exonerados: alimentos básicos (tortillas, frijoles, arroz, sal, azúcar, leche, huevos), medicamentos, servicios médicos, educación, exportaciones, zonas libres
• Hecho generador: venta de bienes muebles, importación de bienes, prestación de servicios
• Débito fiscal: ISV cobrado en ventas
• Crédito fiscal: ISV pagado en compras relacionadas al giro del negocio
• Declaración y pago: mensual, dentro de los primeros 10 días hábiles del mes siguiente
• Régimen de facturación: Acuerdo 481-2017 y 817-2018 (CAI obligatorio para facturas)

── ISR PERSONAS NATURALES ───────────────────────────────────
Base legal: Acuerdo 022-2021 y 020-2022; Decreto 51-2003
• Escala progresiva anual 2024-2026:
  - Hasta L. 187,064: EXENTO (0%)
  - De L. 187,064.01 a L. 282,230.10: 15%
  - De L. 282,230.11 a L. 524,060.34: 20%
  - Más de L. 524,060.34: 25%
• Renta bruta: todos los ingresos gravados
• Renta neta: renta bruta menos deducciones permitidas
• Deducciones permitidas: aportación solidaria (5% sobre exceso de L.750,000), gastos médicos, donaciones, intereses hipotecarios, hasta L. 40,000 en otros gastos
• Anticipo mensual ISR: 1/12 del ISR estimado del año anterior
• Declaración anual: antes del 30 de abril del año siguiente

── ISR PERSONAS JURÍDICAS ───────────────────────────────────
Base legal: Mismo marco ISR; Decreto 51-2003
• Tasa general: 25% sobre renta neta gravable
• Aportación solidaria: 5% sobre utilidades netas que excedan L. 1,000,000
• Anticipo mensual: pago a cuenta mensual
• Retención en la fuente: mecanismo de recaudación anticipada

── RETENCIONES ISR ──────────────────────────────────────────
Base legal: Acuerdo DEI-217-2010; 215-2010; 155-2011; 462 y 464
• Retención a asalariados: empleador retiene según escala mensual
• Retención a proveedores de servicios: 12.5% sobre honorarios profesionales
• Retención a no residentes: 25% (renta de fuente hondureña)
• Decreto 17-2010 Art.8: retención del 10% por arrendamiento de inmuebles a empresas
• Decreto 5-2001 y 68-2010: regulan casos especiales de retención
• Presentación: declaración mensual de retenciones

── CÓDIGO TRIBUTARIO ────────────────────────────────────────
Base legal: Decreto 180-2020 (Código Tributario vigente); reformado por Decreto 117-2021 Art.113
• Prescripción: 5 años para obligaciones tributarias generales; 10 años si no se presentó declaración
• Intereses moratorios: tasa fijada por BCH más 5 puntos porcentuales
• Multas por no declarar a tiempo: 1% del impuesto por mes, hasta 20%
• Recurso de reposición: ante la misma autoridad que dictó el acto
• Recurso de apelación: ante el Tribunal Superior Administrativo
• Procedimiento administrativo tributario: Ley de Procedimiento Administrativo

── PRECIOS DE TRANSFERENCIA ─────────────────────────────────
Base legal: Decreto 232-2011; Reglamento PT; Acuerdo DEI-SG-004-2016; Guías OCDE 2022
• Aplica a: transacciones entre partes relacionadas (vinculadas)
• Principio rector: precio de libre competencia (arm's length)
• Métodos aceptados: Precio Comparable No Controlado, Precio de Reventa, Costo Adicionado, Partición de Utilidades, Margen Neto Transaccional
• Documentación requerida: estudio de precios de transferencia anual
• Umbral: transacciones superiores a L. 5,000,000 con partes vinculadas
• Declaración informativa: formulario SAR anual

── GANANCIA DE CAPITAL ──────────────────────────────────────
Base legal: Decreto 278-2013; Acuerdo 01-2011; Decreto 17-2010 Art.8
• Tasa: 10% sobre ganancia neta de capital (venta de inmuebles, acciones, etc.)
• Ganancia neta = precio de venta - costo de adquisición actualizado
• Retención en compraventa de inmuebles: 1.5% sobre valor de escritura

── RENTA CÉDULAR / ALQUILER ─────────────────────────────────
Base legal: Acuerdos SAR 236-240-2024
• Rentas de alquiler de inmuebles: tributan de forma cedular
• Tasa cédular: 10% sobre renta neta de alquiler
• Gastos deducibles: depreciación, mantenimiento, seguros, intereses hipotecarios

── RÉGIMEN DE FACTURACIÓN ───────────────────────────────────
Base legal: Acuerdo 481-2017; Acuerdo 817-2018
• CAI (Código de Autorización de Impresión): obligatorio para todas las facturas
• Factura electrónica: en implementación progresiva por el SAR
• Tiquetes de caja registradora: permitidos para ventas al detalle
• Nota de crédito/débito: para ajustes a facturas emitidas

── SECTOR SOCIAL / EXONERACIONES ────────────────────────────
Base legal: Decretos 92-2015; 131-2018; 53-2015; 46-2016
• Entidades sin fines de lucro reconocidas: exentas de ISR
• Iglesias, fundaciones, asociaciones: exentas bajo requisitos SAR
• Cooperativas: régimen especial de tributación

── REFORMAS TRIBUTARIAS RECIENTES ───────────────────────────
• Decreto 4-2025: reformas tributarias vigentes desde 2025 (verificar en lagaceta.gob.hn para detalle)
• Gaceta 37069 (febrero 2026): publicaciones tributarias recientes
• Para amnistías o moratorias 2025-2026: verificar en sar.gob.hn o lagaceta.gob.hn
• Si el usuario menciona amnistía tributaria 2026: indica que el SAR ha implementado programas de facilidades de pago en el pasado y recomienda verificar la vigencia actual en sar.gob.hn

── SAR Y SIISAR ─────────────────────────────────────────────
• SAR: Servicio de Administración de Rentas (reemplazó al DEI)
• SIISAR: sistema de información integrado del SAR
• Oficina virtual: https://oficinavirtual.sar.gob.hn
• RTN (Registro Tributario Nacional): obligatorio para toda persona natural o jurídica que realice actividades económicas
• Presentación de declaraciones: en línea por SIISAR o en ventanilla

── REFERENCIAS OFICIALES ────────────────────────────────────
• SAR: https://www.sar.gob.hn
• Oficina Virtual SIISAR: https://oficinavirtual.sar.gob.hn
• Gaceta Oficial: https://www.lagaceta.gob.hn
• Facturación/CAI: https://www.sar.gob.hn/facturacion
• YouTube SAR Honduras: https://www.youtube.com/@SARHonduras

============================================================
COMPORTAMIENTO AL RESPONDER:
- Cita siempre: Decreto/Acuerdo + número + año + artículo cuando sea posible
- Indica si aplica a persona natural, jurídica o ambas
- Da ejemplos numéricos paso a paso cuando el usuario pregunte cómo calcular
- Para reformas 2025-2026 que no estén arriba: remite al SAR o La Gaceta
- Sé conciso pero completo; máximo 400 palabras por respuesta
============================================================`;

let messages = [{ role: 'system', content: SYSTEM_PROMPT }];
let isOpen = false;

const css = `
#gpt-fab-wrap {
position: fixed; bottom: 24px; right: 20px;
z-index: 99999; font-family: 'Nunito', sans-serif;
display: flex; flex-direction: column; align-items: flex-end; gap: 10px;
}
#gpt-chat-box {
width: 340px; height: 480px;
background: #1e1e2e; border-radius: 16px;
box-shadow: 0 8px 40px rgba(0,0,0,.55);
display: none; flex-direction: column; overflow: hidden;
border: 1px solid #2e2e4e;
}
#gpt-chat-box.open { display: flex; }
#gpt-chat-header {
background: #10a37f; padding: 12px 16px;
display: flex; align-items: center; justify-content: space-between;
flex-shrink: 0;
}
#gpt-chat-header-left { display: flex; align-items: center; gap: 8px; }
#gpt-chat-header-left span { color:#fff; font-size:14px; font-weight:700; }
#gpt-chat-close {
background: none; border: none; color: #fff;
font-size: 20px; cursor: pointer; line-height:1; padding:0;
}
#gpt-chat-messages {
flex: 1; overflow-y: auto; padding: 14px 12px;
display: flex; flex-direction: column; gap: 10px;
}
#gpt-chat-messages::-webkit-scrollbar { width: 4px; }
#gpt-chat-messages::-webkit-scrollbar-thumb { background:#444; border-radius:4px; }
.gpt-msg {
max-width: 88%; padding: 9px 13px; border-radius: 14px;
font-size: 13px; line-height: 1.55; word-wrap: break-word;
}
.gpt-msg.bot {
background: #2a2a3e; color: #e0e0f0; align-self: flex-start;
border-bottom-left-radius: 4px;
}
.gpt-msg.user {
background: #10a37f; color: #fff; align-self: flex-end;
border-bottom-right-radius: 4px;
}
.gpt-msg.typing { color: #888; font-style: italic; }
#gpt-chat-footer {
padding: 10px 12px; background: #16162a;
display: flex; gap: 8px; flex-shrink: 0;
border-top: 1px solid #2e2e4e;
}
#gpt-chat-input {
flex: 1; background: #2a2a3e; border: 1px solid #3e3e5e;
border-radius: 10px; padding: 9px 12px; color: #e0e0f0;
font-size: 13px; outline: none; resize: none;
font-family: 'Nunito', sans-serif; max-height: 80px;
}
#gpt-chat-input::placeholder { color: #666; }
#gpt-chat-send {
width: 38px; height: 38px; border-radius: 10px;
background: #10a37f; border: none; cursor: pointer;
display: flex; align-items: center; justify-content: center;
flex-shrink: 0; transition: background .2s;
}
#gpt-chat-send:hover { background: #0d8c6d; }
#gpt-chat-send:disabled { background: #444; cursor: not-allowed; }
#gpt-fab-btn {
width: 56px; height: 56px; border-radius: 50%;
background: linear-gradient(135deg, #10a37f, #0d8c6d);
border: none; cursor: pointer;
display: flex; align-items: center; justify-content: center;
box-shadow: 0 4px 20px rgba(16,163,127,.5);
transition: transform .2s, box-shadow .2s;
}
#gpt-fab-btn:hover { transform: scale(1.08); box-shadow: 0 6px 28px rgba(16,163,127,.7); }
#gpt-fab-btn svg { width: 28px; height: 28px; }
#gpt-fab-tooltip {
background: #1a1a2e; color: #fff; padding: 7px 13px;
border-radius: 20px; font-size: 12px; font-weight: 600;
white-space: nowrap; box-shadow: 0 4px 15px rgba(0,0,0,.3);
opacity: 0; transform: translateX(10px);
transition: opacity .25s, transform .25s; pointer-events: none;
}
#gpt-fab-wrap:hover #gpt-fab-tooltip { opacity: 1; transform: translateX(0); }
@media (max-width: 420px) {
#gpt-chat-box { width: calc(100vw - 24px); height: 60vh; }
#gpt-fab-wrap { bottom: 16px; right: 12px; }
}
`;
const styleEl = document.createElement('style');
styleEl.textContent = css;
document.head.appendChild(styleEl);

const wrap = document.createElement('div');
wrap.id = 'gpt-fab-wrap';
wrap.innerHTML = `
<div id="gpt-chat-box">
<div id="gpt-chat-header">
<div id="gpt-chat-header-left">
<svg width="20" height="20" viewBox="0 0 41 41" fill="none">
<path d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835A9.964 9.964 0 0 0 18.306.5a10.079 10.079 0 0 0-9.614 6.977 9.967 9.967 0 0 0-6.664 4.834 10.08 10.08 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 7.516 3.35 10.078 10.078 0 0 0 9.617-6.981 9.967 9.967 0 0 0 6.663-4.834 10.079 10.079 0 0 0-1.243-11.813z" fill="#fff"/>
</svg>
<span>Asistente PIC-COHPUCP</span>
</div>
<button id="gpt-chat-close" title="Cerrar">✕</button>
</div>
<div id="gpt-chat-messages">
<div class="gpt-msg bot">¡Hola! 👋 Soy tu asistente del programa PIC-COHPUCP, especializado en tributación hondureña (ISV, ISR, Código Tributario, Precios de Transferencia y más). ¿En qué te puedo ayudar?</div>
</div>
<div id="gpt-chat-footer">
<textarea id="gpt-chat-input" placeholder="Pregunta sobre impuestos en Honduras..." rows="1"></textarea>
<button id="gpt-chat-send" title="Enviar">
<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
<line x1="22" y1="2" x2="11" y2="13"></line>
<polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
</svg>
</button>
</div>
</div>
<div style="display:flex;align-items:center;gap:8px;">
<div id="gpt-fab-tooltip">Asistente PIC-COHPUCP</div>
<button id="gpt-fab-btn" title="Abrir asistente de impuestos">
<svg viewBox="0 0 41 41" fill="none">
<path d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835A9.964 9.964 0 0 0 18.306.5a10.079 10.079 0 0 0-9.614 6.977 9.967 9.967 0 0 0-6.664 4.834 10.08 10.08 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 7.516 3.35 10.078 10.078 0 0 0 9.617-6.981 9.967 9.967 0 0 0 6.663-4.834 10.079 10.079 0 0 0-1.243-11.813z" fill="#fff"/>
</svg>
</button>
</div>
`;
document.body.appendChild(wrap);

const chatBox = document.getElementById('gpt-chat-box');
const fabBtn = document.getElementById('gpt-fab-btn');
const closeBtn = document.getElementById('gpt-chat-close');
const input = document.getElementById('gpt-chat-input');
const sendBtn = document.getElementById('gpt-chat-send');
const msgContainer = document.getElementById('gpt-chat-messages');

fabBtn.addEventListener('click', function() {
  isOpen = !isOpen;
  chatBox.classList.toggle('open', isOpen);
  if (isOpen) input.focus();
});

closeBtn.addEventListener('click', function() {
  isOpen = false;
  chatBox.classList.remove('open');
});

function scrollToBottom() {
  msgContainer.scrollTop = msgContainer.scrollHeight;
}

function addMessage(text, role) {
  const div = document.createElement('div');
  div.className = 'gpt-msg ' + role;
  div.textContent = text;
  msgContainer.appendChild(div);
  scrollToBottom();
  return div;
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  input.style.height = 'auto';
  sendBtn.disabled = true;
  addMessage(text, 'user');
  messages.push({ role: 'user', content: text });
  const typingDiv = addMessage('Escribiendo...', 'bot typing');
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + API_KEY },
      body: JSON.stringify({ model: MODEL, messages: messages, max_tokens: 700, temperature: 0.3 })
    });
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || 'Lo siento, no pude procesar tu consulta. Intenta de nuevo.';
    typingDiv.classList.remove('typing');
    typingDiv.textContent = reply;
    messages.push({ role: 'assistant', content: reply });
  } catch(e) {
    typingDiv.classList.remove('typing');
    typingDiv.textContent = 'Error de conexión. Verifica tu internet e intenta de nuevo.';
  }
  sendBtn.disabled = false;
  scrollToBottom();
}

sendBtn.addEventListener('click', sendMessage);

input.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    e.stopPropagation();
    sendMessage();
  }
});

input.addEventListener('input', function() {
  this.style.height = 'auto';
  this.style.height = Math.min(this.scrollHeight, 80) + 'px';
});
})();
