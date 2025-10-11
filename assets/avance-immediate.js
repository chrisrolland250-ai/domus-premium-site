
(function(){
  // Simulateur 50 %
  var m = document.getElementById('montant');
  function fmt(x){ return Number(x).toFixed(2).replace('.', ',') + ' €'; }
  function update(){
    var t = parseFloat(m.value || 0), c = t/2, r = t - c;
    document.getElementById('total').textContent = fmt(t);
    document.getElementById('credit').textContent = '- ' + fmt(c);
    document.getElementById('reste').textContent = fmt(r);
  }
  if(m){ m.addEventListener('input', update); update(); }

  // Formulaire -> essaie l'API; sinon fallback email
  var form = document.getElementById('leadForm'), feedback = document.getElementById('feedback');
  if(form){
    form.addEventListener('submit', async function(e){
      e.preventDefault();
      var data = Object.fromEntries(new FormData(form).entries());
      try{
        var res = await fetch('/api/leads', {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify(data)
        });
        if(res.ok){ feedback.style.display='block'; form.reset(); return; }
      }catch(err){}
      var body = encodeURIComponent(
        'Nom: '+(data.nom||'')+'\nEmail: '+(data.email||'')+'\nTéléphone: '+(data.tel||'')+'\nMessage: '+(data.message||'')
      );
      window. + body;
    });
  }

  // Année footer
  var y = document.getElementById('year'); if(y){ y.textContent = new Date().getFullYear(); }
})();

// EmailJS submit for Avance Immédiate
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('immediateForm');
  if (!form) return;
  const msg = document.getElementById('formMsgAI') || document.getElementById('formMsg');

  // Load EmailJS if available via global emailjs and optionally init with public key from data attribute
  try {
    if (typeof emailjs !== "undefined") {
      const pub = form.getAttribute('data-emailjs-public');
      if (pub && emailjs && emailjs.init) { try { emailjs.init(pub); } catch(e) {} }
    }
  } catch (_) {}

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (msg) { msg.textContent = "Envoi en cours…"; msg.style.color = "#bcd0ea"; }

    // honeypot (if exists)
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
      Nom:        val(["Nom","nom","name"]),
      email:      val(["email","Email"]),
      Message:    val(["Message","message"]),
      Telephone:  val(["telephone","Téléphone","tel","phone"]) || "",
      Consentement: form.querySelector('[name="Consentement"]')?.checked ? "oui" : "non",
      source:     "Avance immédiate",
      subject:    val(["_subject"]) || "Demande — Avance immédiate (Domus Premium)",
      site:       window.location.hostname
    };

    try {
      await emailjs.send("service_4358zpr", "template_5mfkcwg", payload);
      window.location.href = "merci.html";
    } catch (err) {
      if (msg) { msg.textContent = "❌ Impossible d’envoyer le message (EmailJS). Vérifiez la configuration."; msg.style.color = "#ffb4b4"; }
      console.error("EmailJS error (Avance Immédiate):", err);
    }
  });
});
