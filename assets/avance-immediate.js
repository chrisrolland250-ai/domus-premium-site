// Dedicated EmailJS handler for Avance Immédiate (separate template)
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const msg = document.getElementById('formMsgAI') || document.getElementById('formMsg');

  // Init EmailJS with public key from the form
  try {
    if (window.emailjs && emailjs.init) {
      const pub = form.getAttribute('data-emailjs-public');
      if (pub) emailjs.init(pub);
    }
  } catch (e) { console.warn('EmailJS init error:', e); }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (msg) { msg.textContent = "Envoi en cours…"; msg.style.color = "#bcd0ea"; }

    // honeypot
    const honey = form.querySelector('input[name="company"]');
    if (honey && honey.value.trim() !== "") {
      if (msg) { msg.textContent = "Envoi bloqué (anti-spam)."; msg.style.color = "#ffb4b4"; }
      return false;
    }

    function val(names) {
      for (const n of names) {
        const el = form.querySelector(`[name="${n}"]`);
        if (el && el.value != null) return el.value;
      }
      return "";
    }

    const payload = {
      Nom:         val(["Nom","nom","name"]),
      email:       val(["email","Email"]),
      Message:     val(["Message","message"]),
      Telephone:   val(["telephone","Téléphone","tel","phone"]) || "",
      Consentement:form.querySelector('[name="Consentement"]')?.checked ? "oui" : "non",
      source:      val(["source"]) || "Avance immédiate",
      subject:     val(["_subject"]) || "Demande — Avance immédiate (Domus Premium)",
      site:        window.location.hostname
    };

    try {
      await emailjs.send("service_4358zpr", "template_avance_immediate", payload);
      window.location.href = "merci.html";
    } catch (err) {
      if (msg) { msg.textContent = "❌ Impossible d’envoyer le message (EmailJS)."; msg.style.color = "#ffb4b4"; }
      console.error("EmailJS error (Avance Immédiate):", err);
    }
  });
});
