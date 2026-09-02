document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  const now = new Date();
  const hour = now.getHours();

  // Ruční test:
  // ?night=1 = vynutí noc
  // ?day=1   = vynutí den
  const params = new URLSearchParams(window.location.search);
  const forceNight = params.get("night") === "1";
  const forceDay = params.get("day") === "1";

  // Noční režim: 20:00–5:59, nebo ručně přes ?night=1
  const isNight = forceNight || hour >= 20 || hour < 6;

  if (isNight && !forceDay) {
    body.classList.add("is-night");
  } else {
    return;
  }

  const auroras = document.querySelectorAll(".aurora");
  if (!auroras.length) return;

    const wait = (ms) =>
    new Promise((resolve) => window.setTimeout(resolve, ms));

  const randomBetween = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  async function auroraCycle() {
    await wait(randomBetween(3000, 8000));

    while (true) {
      body.classList.add("aurora-visible");
      await wait(randomBetween(35000, 45000));

      body.classList.add("aurora-peak");

      body.classList.add("tuli-visible");
      await wait(4000);
      body.classList.remove("tuli-visible");

      body.classList.remove("aurora-peak");
      body.classList.remove("aurora-visible");

      await wait(randomBetween(30000, 45000));
      await wait(randomBetween(60000, 180000));
    }
  }

  auroraCycle();
});
