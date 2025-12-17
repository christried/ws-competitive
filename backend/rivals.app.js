import fs from 'node:fs/promises';

import bodyParser from 'body-parser';
import express from 'express';

const app = express();

app.use(express.static('images'));
app.use(bodyParser.json());

// CORS

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // allow all domains
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  next();
});

// GET Players for single session

app.get('/players/:sessionId', async (req, res) => {
  const sessionId = req.params.sessionId;

  try {
    const fileContent = await fs.readFile('./data/' + sessionId + '/players.json');

    const playersData = JSON.parse(fileContent);

    res.status(200).json({ players: playersData });
  } catch (error) {
    console.log("Beim Fetchen lief was schief - vermutlich gibt's den Path so nicht");
    console.error(error);
    res.status(200).json({ players: [] });
  }
});

// POST Player for single session

app.post('/player', async (req, res) => {
  const player = req.body.player;
  const sessionId = req.body.sessionId;
  console.log('POST received the following new player: ');
  console.log(player);

  const playersFileContent = await fs.readFile('./data/' + sessionId + '/players.json');
  const playersData = JSON.parse(playersFileContent);

  let updatedPlayers = playersData;

  if (!playersData.some((p) => p === player)) {
    updatedPlayers = [...playersData, player];
  }
  await fs.writeFile('./data/' + sessionId + '/players.json', JSON.stringify(updatedPlayers));

  res.status(200).json({ players: updatedPlayers });
});

// DELETE Player for single session

app.delete('/delete-player', async (req, res) => {
  const player = req.body.player;
  const sessionId = req.body.sessionId;
  console.log('DELETE called for player: ' + player + 'in session: ' + sessionId);

  const playersFileContent = await fs.readFile('./data/' + sessionId + '/players.json');
  const playersData = JSON.parse(playersFileContent);

  const playerIndex = playersData.findIndex((p) => p === player);
  let updatedPlayers = playersData;

  if (playerIndex >= 0) {
    updatedPlayers.splice(playerIndex, 1);
  }

  await fs.writeFile('./data/' + sessionId + '/players.json', JSON.stringify(updatedPlayers));

  res.status(200).json({ players: updatedPlayers });
});

// 404
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  res.status(404).json({ message: '404 - Not Found' });
});

app.listen(3000);
