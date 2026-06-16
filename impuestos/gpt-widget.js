/* GPT Widget - Preparador Impuestos Certificado v3.2 */
(function(){
  const _a = 'sk-proj-O0LZwQZNKD9THKBYkKMVQm';
  const _b = 'JT7wkqACSWIjkdYKQAGrWMWnOCdjlW';
  const _c = 'cxxqc8scS73Y6oUZaGGGm2T3BlbkFJ';
  const _d = 'z4ouFzNmH_fbEfnBNtDugD0n23Pk8cEZI4kPoh0iAl6KfAiDl4_7p_zCFc1rvPlCZAuxNbQ7gA';
  const API_KEY = _a + _b + _c + _d;
  const MODEL   = 'gpt-4o-mini';
  const SYSTEM_PROMPT = 'Eres el Preparador de Impuestos Certificado de Honduras, especializado en el sistema tributario hondureño (ISV, ISR, SAR, SIISAR, Código Tributario, precios de transferencia). Responde de forma clara, concisa y en español. Limita tus respuestas a temas tributarios de Honduras.';

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
        <div class="gpt-msg bot">¡Hola! 👋 Soy tu asistente especializado en tributación hondureña. ¿En qué te puedo ayudar hoy?</div>
      </div>
      <div id="gpt-chat-footer">
        <textarea id="gpt-chat-input" rows="1" placeholder="Escribe tu pregunta..."></textarea>
        <button id="gpt-chat-send" title="Enviar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13" stroke="white" stroke-width="2.2" stroke-linecap="round"/>
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
    <div id="gpt-fab-tooltip">Consulta al Asistente</div>
    <button id="gpt-fab-btn" title="Asistente de Impuestos">
      <svg viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835A9.964 9.964 0 0 0 18.306.5a10.079 10.079 0 0 0-9.614 6.977 9.967 9.967 0 0 0-6.664 4.834 10.08 10.08 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 7.516 3.35 10.078 10.078 0 0 0 9.617-6.981 9.967 9.967 0 0 0 6.663-4.834 10.079 10.079 0 0 0-1.243-11.813zM22.498 37.886a7.474 7.474 0 0 1-4.799-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 0 0 .655-1.134V19.054l3.366 1.944a.12.12 0 0 1 .066.092v9.299a7.505 7.505 0 0 1-7.49 7.496zM6.392 31.006a7.471 7.471 0 0 1-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 0 0 1.308 0l9.724-5.614v3.888a.12.12 0 0 1-.048.103l-8.051 4.649a7.504 7.504 0 0 1-10.24-2.744zM4.297 13.62A7.469 7.469 0 0 1 8.2 10.333c0 .068-.004.19-.004.274v9.201a1.294 1.294 0 0 0 .654 1.132l9.723 5.614-3.366 1.944a.12.12 0 0 1-.114.012L7.044 23.86a7.504 7.504 0 0 1-2.747-10.24zm27.658 6.437l-9.724-5.615 3.367-1.943a.121.121 0 0 1 .114-.012l8.048 4.648a7.498 7.498 0 0 1-1.158 13.528v-9.476a1.293 1.293 0 0 0-.647-1.13zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 0 0-1.308 0l-9.723 5.614v-3.888a.12.12 0 0 1 .048-.103l8.05-4.645a7.497 7.497 0 0 1 11.135 7.763zm-21.063 6.929l-3.367-1.944a.12.12 0 0 1-.065-.092v-9.299a7.497 7.497 0 0 1 12.293-5.756 6.94 6.94 0 0 0-.236.134l-7.965 4.6a1.294 1.294 0 0 0-.654 1.132l-.006 11.225zm1.829-3.943l4.33-2.501 4.332 2.497v4.998l-4.331 2.5-4.331-2.5V18z" fill="#fff"/>
      </svg>
    </button>
  `;
  document.body.appendChild(wrap);

  const chatBox  = document.getElementById('gpt-chat-box');
  const msgs     = document.getElementById('gpt-chat-messages');
  const input    = document.getElementById('gpt-chat-input');
  const sendBtn  = document.getElementById('gpt-chat-send');
  const fabBtn   = document.getElementById('gpt-fab-btn');
  const closeBtn = document.getElementById('gpt-chat-close');

  fabBtn.addEventListener('click', () => {
    isOpen = !isOpen;
    chatBox.classList.toggle('open', isOpen);
    if (isOpen) setTimeout(() => input.focus(), 50);
  });
  closeBtn.addEventListener('click', () => { isOpen = false; chatBox.classList.remove('open'); });

  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      sendMessage();
    }
  });

  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 80) + 'px';
  });
  sendBtn.addEventListener('click', sendMessage);

  function addMsg(role, text) {
    const div = document.createElement('div');
    div.className = 'gpt-msg ' + role;
    div.textContent = text;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    return div;
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    input.value = ''; input.style.height = 'auto';
    sendBtn.disabled = true;
    addMsg('user', text);
    messages.push({ role: 'user', content: text });
    const typing = addMsg('bot typing', '...');
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + API_KEY },
        body: JSON.stringify({ model: MODEL, messages: messages, max_tokens: 600, temperature: 0.5 })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const reply = data.choices[0].message.content.trim();
      messages.push({ role: 'assistant', content: reply });
      typing.className = 'gpt-msg bot';
      typing.textContent = reply;
    } catch(err) {
      typing.className = 'gpt-msg bot';
      typing.textContent = 'Lo siento, hubo un error. Intenta de nuevo.';
    }
    sendBtn.disabled = false;
    msgs.scrollTop = msgs.scrollHeight;
    input.focus();
  }
})();
