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

    const gallery = document.querySelector('[data-cms-gallery]');
    const galleryEmpty = document.querySelector('[data-cms-empty="ilustrace"]');
    if (gallery && Array.isArray(data.ilustrace) && data.ilustrace.length) {
      gallery.innerHTML = '';
      data.ilustrace.forEach((item, index) => {
        if (!item || !item.obrazek) return;
        const figure = document.createElement('figure');
        figure.className = 'gallery-item';

        const img = document.createElement('img');
        img.src = item.obrazek;
        img.alt = item.nazev || `Ilustrace ${index + 1} z knihy Uki`;
        img.loading = 'lazy';
        figure.appendChild(img);

        if (item.nazev || item.popisek) {
          const caption = document.createElement('figcaption');
          if (item.nazev) {
            const strong = document.createElement('strong');
            strong.textContent = item.nazev;
            caption.appendChild(strong);
          }
          if (item.popisek) {
            const span = document.createElement('span');
            span.textContent = item.popisek;
            caption.appendChild(span);
          }
          figure.appendChild(caption);
        }
        gallery.appendChild(figure);
      });
      if (gallery.children.length && galleryEmpty) galleryEmpty.hidden = true;
    }

    const audio = document.querySelector('[data-cms="audio_ukazka"]');
    const audioWrap = document.querySelector('[data-cms-audio-wrap]');
    const audioEmpty = document.querySelector('[data-cms-empty="audio_ukazka"]');
    const audioTitle = document.querySelector('[data-cms="audio_nazev"]');
    const audioDescription = document.querySelector('[data-cms="audio_popisek"]');
    if (audioTitle && data.audio_nazev) audioTitle.textContent = data.audio_nazev;
    if (audioDescription && data.audio_popisek) audioDescription.textContent = data.audio_popisek;
    if (audio && data.audio_ukazka) {
      audio.src = data.audio_ukazka;
      if (audioWrap) audioWrap.hidden = false;
      if (audioEmpty) audioEmpty.hidden = true;
    }

    const youtubeWrap = document.querySelector('[data-cms-youtube-wrap]');
    const youtubeFrame = document.querySelector('[data-cms="youtube_url"]');
    const youtubeTitle = document.querySelector('[data-cms="youtube_nazev"]');
    const youtubeEmpty = document.querySelector('[data-cms-empty="youtube_url"]');
    if (youtubeTitle && data.youtube_nazev) youtubeTitle.textContent = data.youtube_nazev;
    const videoId = getYouTubeId(data.youtube_url || '');
    if (youtubeWrap && youtubeFrame && videoId) {
      youtubeFrame.src = `https://www.youtube-nocookie.com/embed/${videoId}`;
      youtubeWrap.hidden = false;
      if (youtubeEmpty) youtubeEmpty.hidden = true;
    }
  } catch (err) {
    console.warn(err);
  }

  function getYouTubeId(url) {
    if (!url) return '';
    try {
      const u = new URL(url);
      if (u.hostname === 'youtu.be') return u.pathname.slice(1).split('/')[0];
      if (u.hostname.includes('youtube.com')) {
        if (u.pathname.startsWith('/shorts/')) return u.pathname.split('/')[2] || '';
        if (u.pathname.startsWith('/embed/')) return u.pathname.split('/')[2] || '';
        return u.searchParams.get('v') || '';
      }
    } catch (_) {}
    return '';
  }
})();
