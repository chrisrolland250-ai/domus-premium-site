(function(){
  if ('loading' in HTMLImageElement.prototype) return;
  var images=[].slice.call(document.querySelectorAll('img[loading="lazy"]'));
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          var img=entry.target; io.unobserve(img);
          if(img.dataset && img.dataset.src){ img.src=img.dataset.src; }
        }
      });
    },{rootMargin:'200px'});
    images.forEach(function(img){
      if(!img.dataset.src && img.src){ img.dataset.src=img.src; img.src=''; }
      io.observe(img);
    });
  } else { images.forEach(function(img){ if(img.dataset && img.dataset.src){ img.src=img.dataset.src; } }); }
})();