/* GPT Widget - Preparador Impuestos Certificado */
(function(){
  const GPT_URL = 'https://chatgpt.com/g/g-6a204e5be9d88191980c3ac06d12993d-preparador-impuestos-certificado';

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    #gpt-fab {
      position: fixed;
      bottom: 24px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 10px;
      font-family: 'Nunito', sans-serif;
    }
    #gpt-fab-tooltip {
      background: #1a1a2e;
      color: #fff;
      padding: 8px 14px;
      border-radius: 20px;
      font-size: 13px;
      white-space: nowrap;
      box-shadow: 0 4px 15px rgba(0,0,0,.3);
      opacity: 0;
      transform: translateX(10px);
      transition: opacity .25s, transform .25s;
      pointer-events: none;
    }
    #gpt-fab-btn {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #10a37f, #0d8a6c);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 18px rgba(16,163,127,.55);
      transition: transform .2s, box-shadow .2s;
    }
    #gpt-fab-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 24px rgba(16,163,127,.7);
    }
    #gpt-fab-btn:hover + #gpt-fab-tooltip,
    #gpt-fab:hover #gpt-fab-tooltip {
      opacity: 1;
      transform: translateX(0);
    }
    #gpt-fab-btn svg { width: 28px; height: 28px; }
    @media (max-width: 480px) {
      #gpt-fab { bottom: 16px; right: 14px; }
      #gpt-fab-btn { width: 50px; height: 50px; }
    }
  `;
  document.head.appendChild(style);

  // Build FAB
  const fab = document.createElement('div');
  fab.id = 'gpt-fab';
  fab.innerHTML = `
    <div id="gpt-fab-tooltip">Consulta al Asistente de Impuestos</div>
    <button id="gpt-fab-btn" title="Abrir Asistente de Impuestos" onclick="window.open('https://chatgpt.com/g/g-6a204e5be9d88191980c3ac06d12993d-preparador-impuestos-certificado','_blank')">
      <svg viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M37.532 16.87a9.963 9.963 0 00-.856-8.184 10.078 10.078 0 00-10.855-4.835 9.964 9.964 0 00-7.505-3.337 10.079 10.079 0 00-9.612 6.977 9.967 9.967 0 00-6.664 4.834 10.08 10.08 0 001.24 11.817 9.965 9.965 0 00.856 8.185 10.079 10.079 0 0010.855 4.835 9.965 9.965 0 007.504 3.336 10.08 10.08 0 009.617-6.981 9.967 9.967 0 006.663-4.834 10.079 10.079 0 00-1.243-11.813zM22.498 37.886a7.474 7.474 0 01-4.799-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 00.655-1.134V19.054l3.366 1.944a.12.12 0 01.066.092v9.299a7.505 7.505 0 01-7.49 7.496zM6.392 31.006a7.471 7.471 0 01-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 001.308 0l9.724-5.614v3.888a.12.12 0 01-.048.103l-8.051 4.649a7.504 7.504 0 01-10.24-2.744zM4.297 13.62A7.469 7.469 0 018.2 10.333c0 .068-.004.19-.004.274v9.201a1.294 1.294 0 00.654 1.132l9.723 5.614-3.366 1.944a.12.12 0 01-.114.012L7.044 23.86a7.504 7.504 0 01-2.747-10.24zm27.658 6.437l-9.724-5.615 3.367-1.943a.121.121 0 01.114-.012l8.048 4.648a7.498 7.498 0 01-1.158 13.528v-9.476a1.293 1.293 0 00-.647-1.13zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 00-1.308 0l-9.723 5.614v-3.888a.12.12 0 01.048-.103l8.05-4.645a7.497 7.497 0 0111.135 7.763zm-21.063 6.929l-3.367-1.944a.12.12 0 01-.065-.092v-9.299a7.497 7.497 0 0112.293-5.756 6.94 6.94 0 00-.236.134l-7.965 4.6a1.294 1.294 0 00-.654 1.132l-.006 11.225zm1.829-3.943l4.33-2.501 4.332 2.498v4.999l-4.331 2.5-4.331-2.5V18z" fill="white"/>
      </svg>
    </button>
  `;
  document.body.appendChild(fab);
})();
