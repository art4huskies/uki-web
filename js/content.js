(async function () {
  try {
    const response = await fetch('content/site.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Obsah se nepodařilo načíst.');
    const data = await response.json();

    const annotation = document.querySelector('[data-cms="anotace"]');
    if (annotation && data.anotace) annotation.innerHTML = data.anotace;

    const note = document.querySelector('[data-cms="ukazka_popisek"]');
    if (note && data.ukazka_popisek) note.textContent = data.ukazka_popisek;

    const link = document.querySelector('[data-cms="ukazka_pdf"]');
    const empty = document.querySelector('[data-cms-empty="ukazka_pdf"]');
    if (link && data.ukazka_pdf) {
      link.href = data.ukazka_pdf;
      link.hidden = false;
      if (empty) empty.hidden = true;
    } else if (empty) {
      empty.hidden = false;
    }
  } catch (err) {
    console.warn(err);
  }
})();
