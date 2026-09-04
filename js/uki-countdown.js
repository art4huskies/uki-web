(() => {
  const root = document.getElementById('uki-countdown');
  if (!root) return;
  const launch = new Date('2026-09-23T08:00:00+02:00').getTime();
  const day = 24 * 60 * 60 * 1000;
  const message = document.getElementById('countdown-message');
  const grid = document.getElementById('countdown-grid');
  const go = document.getElementById('countdown-go');
  const date = root.querySelector('.countdown-date');
  const els = {days:document.getElementById('cd-days'),hours:document.getElementById('cd-hours'),minutes:document.getElementById('cd-minutes'),seconds:document.getElementById('cd-seconds')};
  function tick(){
    const diff=launch-Date.now();
    if(diff<=0){message.textContent='3 · 2 · 1 · MUSH GO!';grid.hidden=true;date.hidden=true;go.classList.add('is-live');return;}
    if(diff<=5*day){message.textContent='Uki zapřahá…';}
    else{message.innerHTML='Uki už chystá <a href="manmat.html" class="countdown-manmat-link">postroje</a>…';}
    els.days.textContent=Math.floor(diff/day);els.hours.textContent=Math.floor((diff%day)/3600000);els.minutes.textContent=Math.floor((diff%3600000)/60000);els.seconds.textContent=Math.floor((diff%60000)/1000);
  }
  tick();setInterval(tick,1000);
})();
