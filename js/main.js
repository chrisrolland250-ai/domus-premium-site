// Footer year
document.addEventListener("DOMContentLoaded", () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

// Formspree AJAX submit
(() => {
  const form = document.getElementById('contactForm');
  const msg = document.getElementById('formMsg');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (msg) { msg.textContent = "Envoi en cours…"; msg.style.color = "#bcd0ea"; }

    try {
      const res = await fetch(form.action, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(form)
      });
      if (res.ok) {
        if (msg) { msg.textContent = "Merci ! Votre message a bien été envoyé."; msg.style.color = "#8be28f"; }
        form.reset();
      } else {
        let err = "Une erreur est survenue.";
        try { const out = await res.json(); if (out.errors) err = out.errors.map(e => e.message).join(", "); } catch {}
        if (msg) { msg.textContent = "Échec de l’envoi : " + err; msg.style.color = "#ffb4b4"; }
      }
    } catch {
      if (msg) { msg.textContent = "Impossible d’envoyer le message. Vérifiez votre connexion."; msg.style.color = "#ffb4b4"; }
    }
  });
})();

// Menu burger (responsive)
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("primary-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    nav.classList.toggle("is-open", !isOpen);
  });

  // Fermer au clic d’un lien
  nav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    });
  });
});


function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const formMsg = document.getElementById('formMsg');
  formMsg.textContent = "⏳ Envoi en cours...";
  formMsg.style.color = "#c8a046"; // doré

  fetch(form.action, {
    method: form.method,
    body: new FormData(form),
    headers: { 'Accept': 'application/json' }
  }).then(response => {
    if (response.ok) {
      formMsg.textContent = "✅ Merci, votre message a bien été envoyé !";
      formMsg.style.color = "green";
      form.reset();
    } else {
      response.json().then(data => {
        formMsg.textContent = "❌ Une erreur est survenue. Merci de réessayer.";
        formMsg.style.color = "red";
      });
    }
  }).catch(error => {
    formMsg.textContent = "❌ Impossible d’envoyer le message (connexion).";
    formMsg.style.color = "red";
  });
  return false;
}
