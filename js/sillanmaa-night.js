document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  const now = new Date();
  const hour = now.getHours();

  // Noční režim: 20:00–5:59
  const isNight = hour >= 20 || hour < 6;

  // Ruční test:
  // ?night=1 = vynutí noc
  // ?day=1   = vynutí den
  const params = new URLSearchParams(window.location.search);
  const forceNight = params.get("night") === "1";
  const forceDay = params.get("day") === "1";

  if ((isNight || forceNight) && !forceDay) {
    body.classList.add("is-night");
  } else {
    return;
  }

  const auroras = document.querySelectorAll(".aurora");
  if (!auroras.length) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reduceMotion) {
    body.classList.add("aurora-static");
    return;
  }

  const wait = (ms) =>
    new Promise((resolve) => window.setTimeout(resolve, ms));

  const randomBetween = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  async function auroraCycle() {
    // První změna oblohy začne brzo po příchodu.
    await wait(randomBetween(3000, 8000));

    while (true) {
      // Záře se začne pomalu objevovat.
      body.classList.add("aurora-visible");
      await wait(randomBetween(35000, 45000));

      // Vrchol záře.
      body.classList.add("aurora-peak");

      // Tuli bude vidět přesně 2 sekundy.
      body.classList.add("tuli-visible");
      await wait(4000);
      body.classList.remove("tuli-visible");

      // Hned potom začne záře blednout.
      body.classList.remove("aurora-peak");
      body.classList.remove("aurora-visible");

      await wait(randomBetween(30000, 45000));

      // Delší chvíle klidné tmavé oblohy.
      await wait(randomBetween(60000, 180000));
    }
  }

  auroraCycle();
});
