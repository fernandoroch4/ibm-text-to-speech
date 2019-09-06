(() => {
  const element = document.getElementById('bt-submit');
  const audioElement = document.getElementById('audio');
  const loadTimeElement = document.getElementById('load-time');
  const loadginElement = document.getElementById('loading');

  element.addEventListener('click', () => {
    const inputText = document.getElementById('text');

    if (inputText.value) {
      loadginElement.setAttribute('class', 'enable');
      const startTime = Date.now();

      if (audioElement.src !== "" ) {
        audioElement.setAttribute('class', 'disable');
        loadTimeElement.setAttribute('class', 'disable');
        loadTimeElement.innerHTML = '';
      }
      const text = String(inputText.value);
      axios({
        method: 'POST',
        url: 'synthesize',
        data: { text }
      }).then(data => {
        audioElement.setAttribute('src', 'text.wav');
        audioElement.setAttribute('class', 'enable');
        const endTime = Date.now();
        const loadText = 'Load in: ' + (endTime - startTime) / 1000 + ' seconds';
        const loadTime = document.createTextNode(loadText);
        loadTimeElement.appendChild(loadTime);
        loadTimeElement.setAttribute('class', 'enable');
        loadginElement.setAttribute('class', 'disable');
      })
        .catch(err => {
          console.error(err);
          alert('Ops, something wrong...');
          loadginElement.setAttribute('class', 'enable');
        });
    } else {
      alert('Please, type a text inside textarea to synthesize.');
    }
  });
})();