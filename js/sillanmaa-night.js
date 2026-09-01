document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  const now = new Date();
  const hour = now.getHours();

  // Noční režim: 20:00–5:59
  const isNight = hour >= 20 || hour < 6;

  // Pro testování můžeš otevřít sillanmaa.html?night=1
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

  // Respektuje nastavení "omezit pohyb" v systému.
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
    // První záře se neobjeví okamžitě.
    await wait(randomBetween(30000, 60000));

    while (true) {
      // Pomalu se objeví.
      body.classList.add("aurora-visible");
      await wait(randomBetween(30000, 60000));

      // Chvíli zůstane nejsilnější.
      body.classList.add("aurora-peak");
      await wait(randomBetween(20000, 40000));

      body.classList.remove("aurora-peak");

      // Pomalu zmizí.
      body.classList.remove("aurora-visible");
      await wait(randomBetween(30000, 60000));

      // Pak je několik minut zase jen noc.
      await wait(randomBetween(120000, 300000));
    }
  }

  auroraCycle();
});
