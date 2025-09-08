document.addEventListener("DOMContentLoaded", () => {
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();
});
document.addEventListener("DOMContentLoaded", () => {
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("primary-nav");
if (!toggle || !nav) return;
toggle.addEventListener("click", () => {
const isOpen = toggle.getAttribute("aria-expanded") === "true";
toggle.setAttribute("aria-expanded", String(!isOpen));
nav.classList.toggle("is-open", !isOpen);
});
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
document.addEventListener("DOMContentLoaded", () => {
const form = document.getElementById('contactForm');
const msg = document.getElementById('formMsg');
if (!form) return;
form.addEventListener('submit', async (e) => {
e.preventDefault();
if (msg) { msg.textContent = "Envoi en cours…"; msg.style.color = "#bcd0ea"; }
const honey = form.querySelector('input[name="company"]');
if (honey && honey.value.trim() !== "") {
if (msg) { msg.textContent = "Envoi bloqué (anti-spam)."; msg.style.color = "#ffb4b4"; }
return false;
}
const getVal = (name) => {
const el = form.querySelector(`[name="${name}"]`);
return el ? (el.type === "checkbox" ? (el.checked ? "on" : "off") : el.value.trim()) : "";
};
const payload = {
from_name: getVal("Nom") || getVal("name") || "Visiteur",
reply_to: getVal("email"),
message: getVal("Message") || getVal("message"),
phone: getVal("Téléphone") || getVal("telephone") || getVal("phone") || "",
consent: getVal("Consentement"),
subject: "Nouveau message – Domus Premium",
site: window.location.hostname
};
try {
await emailjs.send("service_4358zpr", "template_5mfkcwg", payload);
window.location.href = "merci.html";
} catch (err) {
if (msg) { msg.textContent = "❌ Impossible d’envoyer le message. Vérifiez votre configuration EmailJS."; msg.style.color = "#ffb4b4"; }
console.error("EmailJS error:", err);
}
});
});