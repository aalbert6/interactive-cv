const cardEl = document.getElementById('info-card');
let currentLang = 'es';

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

export async function openCard(cardId) {
  const url = `/cards/${currentLang}/${cardId}.html`;
  console.log('Loading card:', url);

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Card not found: ${url}`);

    cardEl.innerHTML = await res.text();
    cardEl.hidden = false;

    // Botón cerrar
    const closeBtn = cardEl.querySelector('.close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeCard);
    }

    // Botones externos (LinkedIn / GitHub / etc.)
    const linkButtons = cardEl.querySelectorAll('.contact-link-btn');
    linkButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetUrl = btn.dataset.url;
        if (targetUrl) {
          window.open(targetUrl, '_blank', 'noopener,noreferrer');
        }
      });
    });

    // Formulario de contacto (solo existe en phone.html)
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
  } catch (e) {
    console.error(e);
    cardEl.innerHTML = `<p>Error cargando tarjeta</p>`;
    cardEl.hidden = false;
  }
}

function closeCard() {
  cardEl.hidden = true;
  cardEl.innerHTML = '';
}