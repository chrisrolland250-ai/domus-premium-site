document.getElementById('year').textContent = new Date().getFullYear();
// Soumission AJAX via Formspree
(() => {
  const form = document.getElementById('contactForm');
  const msg = document.getElementById('formMsg');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = "Envoi en cours…";
    msg.style.color = "#bcd0ea";

    const res = await fetch(form.action, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    });

    if (res.ok) {
      msg.textContent = "Merci ! Votre message a bien été envoyé.";
      msg.style.color = "#8be28f";
      form.reset();
    } else {
      let err = "Une erreur est survenue.";
      try {
        const out = await res.json();
        if (out.errors) err = out.errors.map(e => e.message).join(', ');
      } catch {}
      msg.textContent = "Échec de l’envoi : " + err;
      msg.style.color = "#ffb4b4";
    }
  });
})();
