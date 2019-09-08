const loadginElement = document.getElementById('loading');
const audioElement = document.getElementById('audio');

function createElements() {
  //IBM
  const ibmElement = document.getElementById('ibm');
  ibmElement.setAttribute('src', 'ibm.wav');

  //Azure
  const azureElement = document.getElementById('azure');
  azureElement.setAttribute('src', 'azure.wav');

  audioElement.setAttribute('class', 'enable');
  loadginElement.setAttribute('class', 'disable');
}

(() => {
  const element = document.getElementById('bt-submit'); 

  element.addEventListener('click', () => {
    const inputText = document.getElementById('text');

    if (inputText.value) {
      loadginElement.setAttribute('class', 'enable');

      if (audioElement.src !== "" ) {
        audioElement.setAttribute('class', 'disable');
      }
      const text = String(inputText.value);
      axios({
        method: 'POST',
        url: 'synthesize',
        data: { text }
      }).then(data => createElements())
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