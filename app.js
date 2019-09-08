const express = require('express');
const cors = require('cors');
const config = require('./config');
const synthesize = require('./provider');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/synthesize', async (req, res) => {
  try {
    const text = req.body.text;

    if (text === undefined) res.sendStatus(400);

    await synthesize.ibm(text);
    await synthesize.azure(text);
    res.sendStatus(200);    
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.listen(config.port, () => console.info(`Listenning on port ${config.port}`));