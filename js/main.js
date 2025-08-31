document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('contactForm');
  const msg = document.getElementById('formMsg');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // 🔴 bloque l’ouverture de la nouvelle page
    msg.textContent = "Envoi en cours…";
    msg.style.color = "#bcd0ea";

    try {
      const res = await fetch(form.action, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(form)
      });

      if (res.ok) {
        msg.textContent = "✅ Merci ! Votre message a bien été envoyé.";
        msg.style.color = "#8be28f";
        form.reset();
      } else {
        msg.textContent = "❌ Une erreur est survenue.";
        msg.style.color = "#ffb4b4";
      }
    } catch (error) {
      msg.textContent = "⚠️ Impossible d’envoyer le message. Vérifiez votre connexion.";
      msg.style.color = "#ffb4b4";
    }
  });
});
