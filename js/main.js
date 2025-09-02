
document.addEventListener('DOMContentLoaded',()=>{
  const y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear();
  const form=document.getElementById('contactForm'); const msg=document.getElementById('formMsg');
  if(!form) return;
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    if(msg){ msg.textContent='Envoi en cours…'; msg.style.color='#bcd0ea'; }
    try{
      const res=await fetch(form.action,{method:'POST',headers:{'Accept':'application/json'},body:new FormData(form)});
      if(res.ok){ if(msg){ msg.textContent='Merci ! Votre message a bien été envoyé.'; msg.style.color='#8be28f'; } form.reset(); }
      else{ if(msg){ msg.textContent='Échec de l’envoi. Réessayez.'; msg.style.color='#ffb4b4'; } }
    }catch(err){ if(msg){ msg.textContent='Impossible d’envoyer (réseau)'; msg.style.color='#ffb4b4'; } }
  });
});
