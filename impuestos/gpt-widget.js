/* GPT Widget - Preparador Impuestos Certificado v3.3 */
(function(){
const _a = 'sk-proj-O0LZwQZNKD9THKBYkKMVQm';
const _b = 'JT7wkqACSWIjkdYKQAGrWMWnOCdjlW';
const _c = 'cxxqc8scS73Y6oUZaGGGm2T3BlbkFJ';
const _d = 'z4ouFzNmH_fbEfnBNtDugD0n23Pk8cEZI4kPoh0iAl6KfAiDl4_7p_zCFc1rvPlCZAuxNbQ7gA';
const API_KEY = _a + _b + _c + _d;
const MODEL = 'gpt-4o-mini';
const SYSTEM_PROMPT = `Eres el Preparador de Impuestos Certificado de Honduras, especializado en el sistema tributario hondureño (ISV, ISR, SAR, SIISAR, Código Tributario, precios de transferencia). Responde de forma clara, concisa y en español. Limita tus respuestas a temas tributarios de Honduras.

IMPORTANTE SOBRE TU CONOCIMIENTO:
- Tu base de conocimiento incluye legislación tributaria hondureña hasta inicios de 2025.
- El año actual es 2026. Pueden existir reformas, amnistías tributarias, decretos o cambios legales de 2025-2026 que desconoces.
- Cuando el usuario pregunte sobre temas recientes (amnistías 2025-2026, nuevas leyes, reformas recientes), responde con lo que sabes hasta 2025 y aclara: "Esta información es hasta inicios de 2025. Para confirmar amnistías o cambios vigentes en 2026, consulta directamente sar.gob.hn o llama al SAR."
- Nunca digas que tu conocimiento es solo hasta 2023. Tu conocimiento llega hasta inicios de 2025.
- Si preguntan por amnistías tributarias de 2026, sé honesto: no puedes confirmarlas, pero orienta al usuario a verificar en el SAR.`;

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
<span>Asistente de Impuestos</span>
</div>
<button id="gpt-chat-close" title="Cerrar">✕</button>
</div>
<div id="gpt-chat-messages">
<div class="gpt-msg bot">¡Hola! 👋 Soy tu asistente de tributación hondureña. Mi conocimiento llega hasta inicios de 2025 — para novedades de 2026 te recomendaré verificar en sar.gob.hn. ¿En qué te puedo ayudar?</div>
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
<div id="gpt-fab-tooltip">Asistente Tributario</div>
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
      body: JSON.stringify({ model: MODEL, messages: messages, max_tokens: 600, temperature: 0.5 })
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
