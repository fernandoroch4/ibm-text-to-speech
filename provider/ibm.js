const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');
const config = require('../config');
const path = require('path');
const fs = require('fs');

const textToSpeech = new TextToSpeechV1({
  iam_apikey: config.apiKey,
  url: config.url
});

module.exports = text => {
  return new Promise((resolve, reject) => {
    const synthesizeParams = {
      text: text,
      accept: 'audio/wav',
      voice: config.voice
    };

    textToSpeech.synthesize(synthesizeParams)
      .then(audio => {
        let stream = audio.pipe(fs.createWriteStream(path.join(path.dirname(__dirname), '/public/ibm.wav')));
        stream.on('finish', () => resolve());
      })
      .catch(err => {
        console.error('error:', err);
        reject(err);
      });
  });
};