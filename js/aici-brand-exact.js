(function(){
  const montant = document.getElementById('montant');
  const eligible = document.getElementById('eligible');
  const out = document.getElementById('a-payer');
  const note = document.getElementById('note-sim');
  function euro(v){ if (isNaN(v)) return '— €'; return new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(v); }
  function calc(){
    const m = parseFloat((montant.value || '0').replace(',', '.'));
    if (!eligible.checked){ out.textContent = euro(m); note.textContent = 'Non éligible à l’Avance Immédiate : vous payez le montant total aujourd’hui.'; return; }
    const paye = Math.max(0, Math.round((m * 0.5) * 100) / 100);
    out.textContent = euro(paye);
    note.textContent = 'Éligible AICI : avance immédiate de 50 % appliquée aujourd’hui (sous réserve de plafonds et de la validation URSSAF).';
  }
  ['input','change','keyup'].forEach(evt => { montant.addEventListener(evt, calc); eligible.addEventListener(evt, calc); });
  calc();
})();
(function(){
  document.addEventListener('click',function(e){
    const a=e.target.closest('a[href^="#"]');if(!a)return;
    const id=a.getAttribute('href').slice(1);const el=document.getElementById(id);
    if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth',block:'start'});}
  });
})();