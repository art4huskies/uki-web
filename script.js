(() => {
  document.querySelectorAll("[data-audio-demo]").forEach(box => {
    const btn = box.querySelector(".play");
    const state = box.querySelector("[data-state]");
    const bar = box.querySelector(".progress span");
    if(!btn) return;
    let playing = false;
    btn.addEventListener("click", () => {
      playing = !playing;
      btn.textContent = playing ? "Ⅱ" : "▶";
      btn.setAttribute("aria-pressed", String(playing));
      if(state) state.textContent = playing
        ? "Zde bude hrát skutečná píseň."
        : "Přehrávání pozastaveno.";
      if(bar) bar.style.width = playing ? "42%" : "0%";
    });
  });
})();
