/* Declarations */
export let isCardOpen = false;
const cardEl = document.getElementById('info-card');
let currentLang = localStorage.getItem('lang') || 'es';

/* Language Settings Function */
export function setCardLanguage(lang) {
  currentLang = lang;
}

/* From Response Message Function*/
function getFormMessage(type) {
  const messages = {
    es: {
      success: 'Mensaje enviado correctamente ✅',
      error: 'Error al enviar ❌',
      connection: 'Error de conexión ❌'
    },
    ca: {
      success: 'Missatge enviat correctament ✅',
      error: 'Error en l’enviament ❌',
      connection: 'Error de connexió ❌'
    },
    en: {
      success: 'Message sent successfully ✅',
      error: 'Error sending message ❌',
      connection: 'Connection error ❌'
    }
  };

  return messages[currentLang][type];
}

/* Open Card Function */
export async function openCard(cardId) {
  isCardOpen = true;
  currentLang = localStorage.getItem('lang') || currentLang || 'es';
  const url = `/cards/${currentLang}/${cardId}.html`;
  console.log('Loading card:', url);

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Card not found: ${url}`);

    cardEl.innerHTML = await res.text();
    cardEl.hidden = false;

    // Close button
    const closeBtn = cardEl.querySelector('.close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeCard);
    }

    // External buttons (Git, LinkedIn, etc)
    const linkButtons = cardEl.querySelectorAll('.contact-link-btn');
    linkButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetUrl = btn.dataset.url;
        if (targetUrl) {
          window.open(targetUrl, '_blank', 'noopener,noreferrer');
        }
      });
    });

    // Contact form (only in the phone card)
    const form = cardEl.querySelector('#contact-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const status = cardEl.querySelector('#form-status');
        const data = new FormData(form);

        try {
          const formspreeRes = await fetch('https://formspree.io/f/xlgpvpkp', {
            method: 'POST',
            body: data,
            headers: {
              Accept: 'application/json'
            }
          });

          if (formspreeRes.ok) {
            status.textContent = getFormMessage('success');
            form.reset();
          } else {
            status.textContent = getFormMessage('error');
          }
        } catch {
          status.textContent = getFormMessage('connection');
        }
      });
    }
  } catch (e) { // Error handling
    console.error(e);
    cardEl.innerHTML = `<p>Error cargando tarjeta</p>`;
    cardEl.hidden = false;
  }
}

/* Close Card Function */
function closeCard() {
  cardEl.hidden = true;
  cardEl.innerHTML = '';
  isCardOpen = false;
}