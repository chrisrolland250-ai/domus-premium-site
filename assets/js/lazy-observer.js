(function(){
if (!('IntersectionObserver'in window)) return;
const io = new IntersectionObserver((entries, obs)=>{
entries.forEach(e=>{
if(e.isIntersecting){
const el = e.target;
const dataSrc = el.getAttribute('data-src');
const dataSrcset = el.getAttribute('data-srcset');
if(dataSrc){ el.setAttribute('src', dataSrc); el.removeAttribute('data-src'); }
if(dataSrcset){ el.setAttribute('srcset', dataSrcset); el.removeAttribute('data-srcset'); }
obs.unobserve(el);
}
});
},{rootMargin:'250px 0px'});
document.querySelectorAll('img[data-src], source[data-srcset], iframe[data-src]').forEach(el=>io.observe(el));
})();