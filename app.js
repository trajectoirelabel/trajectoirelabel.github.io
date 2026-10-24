(() => {
  const releaseUrl = 'https://trajectoiremusic.bandcamp.com/album/love-without-interest-ep';
  const captions = {
    fr: "A l'occasion de la sortie de son EP 'love without interest' sorti le 9 Octobre sur Trajectoire, on a discute avec stuckinwaveforms de ses influences et de son approche a la production",
    en: "At the occasion of his EP 'love without interest' release October 9th on Trajectoire, we chatted with Paris-based producer stuckinwaveforms about his influences and his approach to producing"
  };
  const labels = {
    fr: {
      interview: 'Entretien', listen: 'À écouter', tracks: 'Les morceaux de la conversation',
      play: 'Écouter', select: 'Sélectionner', top: 'Trajectoire, haut de page',
      cover: 'Pochette de love without interest, stuckinwaveforms', language: 'Langue',
      switched: 'Version française', title: 'stuckinwaveforms — Entretien · Trajectoire'
    },
    en: {
      interview: 'Interview', listen: 'Listening notes', tracks: 'The tracks from the conversation',
      play: 'Play', select: 'Select', top: 'Trajectoire, back to top',
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

  function makeListening(root, tracks) {
    const heading = document.createElement('div');
    heading.className = 'listen-head';
    const headingTitle = document.createElement('h3');
    const headingDetail = document.createElement('span');
    heading.append(headingTitle, headingDetail);
    const viewport = document.createElement('div');
    viewport.className = 'player';
    const metadata = document.createElement('div');
    metadata.className = 'now-playing';
    const current = document.createElement('div');
    current.setAttribute('aria-live', 'polite');
    const title = document.createElement('p');
    title.className = 'track-title';
    const detail = document.createElement('p');
    detail.className = 'track-detail';
    current.append(title, detail);
    const external = document.createElement('a');
    external.className = 'external';
    external.target = '_blank';
    external.rel = 'noopener';
    metadata.append(current, external);
    const choices = document.createElement('div');
    choices.className = tracks.length === 4 ? 'tracks four' : 'tracks';
    root.replaceChildren(heading, viewport, metadata, choices);
    let selected = 0;

    function select(index) {
      selected = index;
      const track = tracks[index];
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'play';
      button.setAttribute('aria-label', `${labels[language].play} ${track.artist} — ${track.title}`);
      const artwork = document.createElement('img');
      artwork.className = 'artwork';
      artwork.src = `assets/art-${track.art}.jpg`;
      artwork.alt = '';
      artwork.loading = 'lazy';
      const icon = document.createElement('span');
      icon.className = 'play-label';
      icon.textContent = '▶';
      icon.setAttribute('aria-hidden', 'true');
      button.append(artwork, icon);
      viewport.replaceChildren(button);
      title.textContent = `${track.artist} — ${track.title}`;
      detail.textContent = track.detail;
      external.href = track.url || `https://www.youtube.com/watch?v=${track.id}`;
      external.textContent = `${track.bandcamp ? 'Bandcamp' : 'YouTube'} ↗`;
      choices.querySelectorAll('button').forEach((choice, i) => choice.setAttribute('aria-pressed', String(i === index)));

      button.addEventListener('click', () => {
        players.forEach(player => { if (player.root !== root) player.stop(); });
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
        iframe.focus();
      });
    }

    tracks.forEach((track, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'track-choice';
      const artwork = document.createElement('img');
      artwork.src = `assets/art-${track.art}.jpg`;
      artwork.alt = '';
      artwork.loading = 'lazy';
      const artist = document.createElement('span');
      artist.className = 'artist';
      artist.textContent = track.artist;
      const name = document.createElement('span');
      name.textContent = track.title;
      button.append(artwork, artist, name);
      button.addEventListener('click', () => select(index));
      choices.append(button);
    });

    const controller = {
      root,
      stop() { if (viewport.querySelector('iframe')) select(selected); },
      translate() {
        headingTitle.textContent = labels[language].listen;
        headingDetail.textContent = labels[language].tracks;
        choices.querySelectorAll('button').forEach((button, index) => {
          const track = tracks[index];
          button.setAttribute('aria-label', `${labels[language].select} ${track.artist} — ${track.title}`);
        });
        const play = viewport.querySelector('.play');
        const track = tracks[selected];
        if (play) play.setAttribute('aria-label', `${labels[language].play} ${track.artist} — ${track.title}`);
        detail.textContent = language === 'fr' ? track.detail.replace('Self-released', 'Auto-édité') : track.detail;
      }
    };
    select(0);
    players.push(controller);
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
    document.getElementById('footer-caption').textContent = `TRJ exchange — ${labels[language].interview.toLowerCase()}`;
    document.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
    window.interviewData[language].forEach((entry, index) => {
      const section = document.getElementById(`question-${index + 1}`);
      section.querySelector('h2').textContent = entry.question;
      const answer = section.querySelector('.answer');
      answer.replaceChildren(...entry.paragraphs.map(text => {
        const paragraph = document.createElement('p');
        paragraph.textContent = text;
        return paragraph;
      }));
      const quote = section.querySelector('blockquote');
      if (quote) {
        const text = window.interviewData.quotes[index][language];
        quote.textContent = language === 'fr' ? `« ${text} »` : `“${text}”`;
      }
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

  makeListening(document.getElementById('listening1'), window.tracks1);
  makeListening(document.getElementById('listening2'), window.tracks2);
  document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.language)));
  document.querySelectorAll('[data-release-link]').forEach(link => { link.href = releaseUrl; });
  setLanguage(language, false);
})();
