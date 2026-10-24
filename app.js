(() => {
  const releaseUrl = 'https://trajectoiremusic.bandcamp.com/album/love-without-interest-ep';
  const captions = {
    fr: "A l'occasion de la sortie de son EP 'love without interest' sorti le 9 Octobre sur Trajectoire, on a discute avec stuckinwaveforms de ses influences et de son approche a la production",
    en: "At the occasion of his EP 'love without interest' release October 9th on Trajectoire, we chatted with Paris-based producer stuckinwaveforms about his influences and his approach to producing"
  };
  const labels = {
    fr: {
      interview: 'Entretien',
      play: 'Écouter', top: 'Trajectoire, haut de page',
      cover: 'Pochette de love without interest, stuckinwaveforms', language: 'Langue',
      switched: 'Version française', title: 'stuckinwaveforms — Entretien · Trajectoire'
    },
    en: {
      interview: 'Interview',
      play: 'Play', top: 'Trajectoire, back to top',
      cover: 'love without interest cover artwork, stuckinwaveforms', language: 'Language',
      switched: 'English version', title: 'stuckinwaveforms — Interview · Trajectoire'
    }
  };
  const validLanguage = value => value === 'fr' || value === 'en';
  let storedLanguage;
  try { storedLanguage = localStorage.getItem('trajectoire-language'); } catch (_) { /* Storage is optional. */ }
  const queryLanguage = new URL(location.href).searchParams.get('lang');
  let language = validLanguage(queryLanguage) ? queryLanguage : validLanguage(storedLanguage) ? storedLanguage : 'fr';
  const players = [];

  function makeRecording(root, track) {
    const row = document.createElement('div');
    row.className = 'recording-row';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'recording-play';
    button.setAttribute('aria-expanded', 'false');
    const artwork = document.createElement('img');
    artwork.src = `assets/art-${track.art}.jpg`;
    artwork.alt = '';
    artwork.loading = 'lazy';
    artwork.width = 52;
    artwork.height = 52;
    const text = document.createElement('span');
    text.className = 'recording-text';
    const artist = document.createElement('span');
    artist.className = 'recording-artist';
    artist.textContent = track.artist;
    const title = document.createElement('span');
    title.className = 'recording-title';
    title.textContent = track.title;
    text.append(artist, title);
    const icon = document.createElement('span');
    icon.className = 'recording-icon';
    icon.textContent = '▶';
    icon.setAttribute('aria-hidden', 'true');
    button.append(artwork, text, icon);
    const external = document.createElement('a');
    external.className = 'external';
    external.target = '_blank';
    external.rel = 'noopener';
    external.href = track.url || `https://www.youtube.com/watch?v=${track.id}`;
    external.textContent = `${track.bandcamp ? 'Bandcamp' : 'YouTube'} ↗`;
    row.append(button, external);
    const viewport = document.createElement('div');
    viewport.className = 'player';
    viewport.id = `player-${track.art}`;
    viewport.hidden = true;
    button.setAttribute('aria-controls', viewport.id);
    root.append(row, viewport);

    function stop() {
      viewport.replaceChildren();
      viewport.hidden = true;
      button.setAttribute('aria-expanded', 'false');
      icon.textContent = '▶';
    }
    button.addEventListener('click', () => {
      if (!viewport.hidden) { stop(); return; }
      players.forEach(player => player.stop());
      const iframe = document.createElement('iframe');
      iframe.src = track.bandcamp
        ? `https://bandcamp.com/EmbeddedPlayer/track=${track.bandcamp}/size=small/bgcol=f2efe6/linkcol=655176/artwork=none/transparent=true/`
        : `https://www.youtube-nocookie.com/embed/${track.id}?autoplay=1&playsinline=1&rel=0`;
      if (track.bandcamp) iframe.className = 'bandcamp';
      iframe.title = `${track.artist} — ${track.title}`;
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      viewport.replaceChildren(iframe);
      viewport.hidden = false;
      button.setAttribute('aria-expanded', 'true');
      icon.textContent = '−';
    });
    players.push({
      stop,
      translate() {
        button.setAttribute('aria-label', `${labels[language].play} ${track.artist} — ${track.title}`);
      }
    });
  }

  function setLanguage(next, announce = true) {
    if (!validLanguage(next)) return;
    language = next;
    document.documentElement.lang = language;
    document.title = labels[language].title;
    document.querySelector('meta[name="description"]').content = captions[language];
    document.getElementById('intro').textContent = captions[language];
    document.getElementById('interview-link').textContent = labels[language].interview;
    document.getElementById('brand-home').setAttribute('aria-label', labels[language].top);
    document.getElementById('cover').alt = labels[language].cover;
    document.getElementById('language-switch').setAttribute('aria-label', labels[language].language);
    document.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
    window.interviewData[language].forEach((entry, index) => {
      const section = document.getElementById(`question-${index + 1}`);
      section.querySelector('h2').textContent = entry.question;
      const answer = section.querySelector('.answer');
      answer.querySelectorAll(':scope > p').forEach((paragraph, paragraphIndex) => {
        paragraph.textContent = entry.paragraphs[paragraphIndex];
      });
    });
    players.forEach(player => player.translate());
    try { localStorage.setItem('trajectoire-language', language); } catch (_) { /* Storage is optional. */ }
    // Keep a shareable language URL without changing the reading position.
    try {
      const url = new URL(location.href);
      url.searchParams.set('lang', language);
      history.replaceState(null, '', url);
    } catch (_) { /* Local file previews may restrict history updates. */ }
    if (announce) document.getElementById('language-status').textContent = labels[language].switched;
  }

  const recordings = [...window.tracks1, ...window.tracks2];
  document.querySelectorAll('[data-recordings]').forEach(group => {
    group.dataset.recordings.split(',').forEach(index => makeRecording(group, recordings[Number(index)]));
  });
  document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.language)));
  document.querySelectorAll('[data-release-link]').forEach(link => { link.href = releaseUrl; });
  setLanguage(language, false);
})();
