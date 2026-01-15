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

//////////// PLAYERS ENDPOINTS START

// GET Players for single session

app.get('/players/:sessionId', async (req, res) => {
  const sessionId = req.params.sessionId;

  try {
    const fileContent = await fs.readFile('./data/' + sessionId + '/players.json');

    const playersData = JSON.parse(fileContent);

    res.status(200).json({ players: playersData });
  } catch (error) {
    console.log('Beim Fetchen der Players lief was schief - sei nicht traurig');
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

//////////// PLAYERS ENDPOINTS END

//////////// GAMES ENDPOINTS START

app.get('/games/:sessionId', async (req, res) => {
  const sessionId = req.params.sessionId;

  try {
    const fileContent = await fs.readFile('./data/' + sessionId + '/games.json');

    const gamesData = JSON.parse(fileContent);

    res.status(200).json({ games: gamesData });
  } catch (error) {
    console.log('Beim Fetchen der Games lief was schief - manchmal ist es so');
    console.error(error);
    res.status(200).json({ games: [] });
  }
});

// POST Game for single session

app.post('/game', async (req, res) => {
  const game = { title: req.body.game, results: null };
  const sessionId = req.body.sessionId;
  console.log('POST received the following new game title: ');
  console.log(game);

  const gamesFileContent = await fs.readFile('./data/' + sessionId + '/games.json');
  const gamesData = JSON.parse(gamesFileContent);

  let updatedGames = gamesData;

  if (!gamesData.some((g) => g === game)) {
    updatedGames = [...gamesData, game];
  }
  await fs.writeFile('./data/' + sessionId + '/games.json', JSON.stringify(updatedGames));

  res.status(200).json({ games: updatedGames });
});

// DELETE Player for single session

app.delete('/delete-game', async (req, res) => {
  const game = { title: req.body.game, results: null };
  const sessionId = req.body.sessionId;
  console.log('DELETE called for game: ' + req.body.game + 'in session: ' + sessionId);

  const gamesFileContent = await fs.readFile('./data/' + sessionId + '/games.json');
  const gamesData = JSON.parse(gamesFileContent);

  const gameIndex = gamesData.findIndex((g) => g.title === game.title);
  let updatedGames = gamesData;

  if (gameIndex >= 0) {
    updatedGames.splice(gameIndex, 1);
  }

  await fs.writeFile('./data/' + sessionId + '/games.json', JSON.stringify(updatedGames));

  res.status(200).json({ games: updatedGames });
});

//////////// GAMES ENDPOINTS END

//////////// GAME-RESULTS ENDPOINTS START

// POST Results for a single game in a single session

app.post('/results', async (req, res) => {
  const game = { title: req.body.title, results: req.body.results };
  const sessionId = req.body.sessionId;
  console.log('POST /results received the following new game title and results for it: ');
  console.log(game);

  const gamesFileContent = await fs.readFile('./data/' + sessionId + '/games.json');
  const gamesData = JSON.parse(gamesFileContent);

  let updatedGames = gamesData;
  const existingGameIndex = gamesData.findIndex((g) => g.title === game.title);

  if (existingGameIndex >= 0) {
    updatedGames[existingGameIndex] = game;
  }

  await fs.writeFile('./data/' + sessionId + '/games.json', JSON.stringify(updatedGames));

  res.status(200).json({ games: updatedGames });
});

//////////// GAME-RESULTS ENDPOINTS END

// 404
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  res.status(404).json({ message: '404 - Not Found' });
});

app.listen(3000);
