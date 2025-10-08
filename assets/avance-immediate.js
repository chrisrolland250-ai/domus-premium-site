
(function(){
  // Simulateur 50%
  var m = document.getElementById('montant');
  function fmt(x){ return Number(x).toFixed(2).replace('.', ',') + ' €'; }
  function update(){
    var t = parseFloat(m.value || 0), c = t/2, r = t - c;
    document.getElementById('total').textContent = fmt(t);
    document.getElementById('credit').textContent = '- ' + fmt(c);
    document.getElementById('reste').textContent = fmt(r);
  }
  if(m){ m.addEventListener('input', update); update(); }

  // Formulaire -> fallback versatile
  var form = document.getElementById('leadForm');
  var feedback = document.getElementById('feedback');
  if(form){
    form.addEventListener('submit', async function(e){
      e.preventDefault();
      var data = Object.fromEntries(new FormData(form).entries());
      try{
        // 1) Essaye l'API locale (si tu as un backend)
        var res = await fetch('/api/leads', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify(data)
        });
        if(res.ok){
          feedback.style.display='block'; form.reset(); return;
        }
      }catch(err){/* ignore and fallback */}

      // 2) Fallback mailto
      var body = encodeURIComponent(
        'Nom: ' + (data.nom||'') + '\n' +
        'Email: ' + (data.email||'') + '\n' +
        'Téléphone: ' + (data.tel||'') + '\n' +
        'Message: ' + (data.message||'')
      );
      window.location.href = 'mailto:domuspremium35@gmail.com?subject=Activation AICI&body=' + body;
    });
  }
})();
