const rp = require('request-promise');
const fs = require('fs');
const xmlbuilder = require('xmlbuilder');
const config = require('../config');
const path = require('path');

function getAccessToken(subscriptionKey) {
  let options = {
    method: 'POST',
    uri: config.TOKENURL,
    headers: {
      'Ocp-Apim-Subscription-Key': subscriptionKey
    }
  }
  return rp(options);
}

function textToSpeech(accessToken, text) {
  // Create the SSML request.
  let xml_body = xmlbuilder.create('speak')
    .att('version', '1.0')
    .att('xml:lang', 'pt-BR')
    .ele('voice')
    .att('xml:lang', 'pt-BR')
    .att('name', 'Microsoft Server Speech Text to Speech Voice (pt-BR, HeloisaRUS)')
    .txt(text)
    .end();
  // Convert the XML into a string to send in the TTS request.
  let body = xml_body.toString();

  let options = {
    method: 'POST',
    baseUrl: config.BASEURL,
    url: 'cognitiveservices/v1',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'cache-control': 'no-cache',
      'User-Agent': 'YOUR_RESOURCE_NAME',
      'X-Microsoft-OutputFormat': 'riff-24khz-16bit-mono-pcm',
      'Content-Type': 'application/ssml+xml'
    },
    body: body
  }

  let request = rp(options)
    .on('response', (response) => {
      if (response.statusCode === 200) {
        request.pipe(fs.createWriteStream(path.join(path.dirname(__dirname), '/public/azure.wav')));
      }
    });
  return request;
}

// Use async and await to get the token before attempting
// to convert text to speech.
module.exports = text => {
  return new Promise(async (resolve, reject) => {
    const subscriptionKey = config.SPEECH_SERVICE_KEY;
    if (!subscriptionKey) {
      throw new Error('Environment variable for your subscription key is not set.')
    };
  
    try {
      const accessToken = await getAccessToken(subscriptionKey);
      resolve(await textToSpeech(accessToken, text));
    } catch (err) {
      console.error('error:', err);
      reject(err);
    }
  });
}