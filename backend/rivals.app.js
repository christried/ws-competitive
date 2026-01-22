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
    const fileContent = await fs.readFile('./data/rivals/' + sessionId + '/players.json');

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

  const playersFileContent = await fs.readFile('./data/rivals/' + sessionId + '/players.json');
  const playersData = JSON.parse(playersFileContent);

  let updatedPlayers = playersData;

  if (!playersData.some((p) => p === player)) {
    updatedPlayers = [...playersData, player];
  }
  await fs.writeFile(
    './data/rivals/' + sessionId + '/players.json',
    JSON.stringify(updatedPlayers),
  );

  res.status(200).json({ players: updatedPlayers });
});

// DELETE Player for single session

app.delete('/delete-player', async (req, res) => {
  const player = req.body.player;
  const sessionId = req.body.sessionId;
  console.log('DELETE called for player: ' + player + 'in session: ' + sessionId);

  const playersFileContent = await fs.readFile('./data/rivals/' + sessionId + '/players.json');
  const playersData = JSON.parse(playersFileContent);

  const playerIndex = playersData.findIndex((p) => p === player);
  let updatedPlayers = playersData;

  if (playerIndex >= 0) {
    updatedPlayers.splice(playerIndex, 1);
  }

  await fs.writeFile(
    './data/rivals/' + sessionId + '/players.json',
    JSON.stringify(updatedPlayers),
  );

  res.status(200).json({ players: updatedPlayers });
});

// PUT lock status for single session

app.put('/lock', async (req, res) => {
  const sessionId = req.body.sessionId;
  console.log('PUT for lock status called');

  const lockFileContent = await fs.readFile('./data/rivals/' + sessionId + '/islocked.json');
  const isLocked = JSON.parse(lockFileContent);

  await fs.writeFile('./data/rivals/' + sessionId + '/islocked.json', JSON.stringify(!isLocked));

  res.status(200).json({ isLocked: !isLocked });
});

// GET lock for single session

app.get('/lock-status/:sessionId', async (req, res) => {
  const sessionId = req.params.sessionId;

  try {
    const fileContent = await fs.readFile('./data/rivals/' + sessionId + '/islocked.json');

    const isLocked = JSON.parse(fileContent);

    res.status(200).json({ isLocked: isLocked });
  } catch (error) {
    console.log('Beim Fetchen des Lock Status lief was schief - irgendwann klappts schon');
    console.error(error);
    res.status(200).json({ isLocked: false });
  }
});

//////////// PLAYERS ENDPOINTS END

//////////// GAMES ENDPOINTS START

app.get('/games/:sessionId', async (req, res) => {
  const sessionId = req.params.sessionId;

  try {
    const fileContent = await fs.readFile('./data/rivals/' + sessionId + '/games.json');

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

  const gamesFileContent = await fs.readFile('./data/rivals/' + sessionId + '/games.json');
  const gamesData = JSON.parse(gamesFileContent);

  let updatedGames = gamesData;

  if (!gamesData.some((g) => g === game)) {
    updatedGames = [...gamesData, game];
  }
  await fs.writeFile('./data/rivals/' + sessionId + '/games.json', JSON.stringify(updatedGames));

  res.status(200).json({ games: updatedGames });
});

// DELETE Game for single session

app.delete('/delete-game', async (req, res) => {
  const game = { title: req.body.game, results: null };
  const sessionId = req.body.sessionId;
  console.log('DELETE called for game: ' + req.body.game + 'in session: ' + sessionId);

  const gamesFileContent = await fs.readFile('./data/rivals/' + sessionId + '/games.json');
  const gamesData = JSON.parse(gamesFileContent);

  const gameIndex = gamesData.findIndex((g) => g.title === game.title);
  let updatedGames = gamesData;

  if (gameIndex >= 0) {
    updatedGames.splice(gameIndex, 1);
  }

  await fs.writeFile('./data/rivals/' + sessionId + '/games.json', JSON.stringify(updatedGames));

  res.status(200).json({ games: updatedGames });
});

//////////// GAME-RESULTS ENDPOINTS START

// POST Results for a single game in a single session

app.post('/results', async (req, res) => {
  const game = { title: req.body.title, results: req.body.results };
  const sessionId = req.body.sessionId;
  console.log('POST /results received the following new game title and results for it: ');
  console.log(game);

  const gamesFileContent = await fs.readFile('./data/rivals/' + sessionId + '/games.json');
  const gamesData = JSON.parse(gamesFileContent);

  let updatedGames = gamesData;
  const existingGameIndex = gamesData.findIndex((g) => g.title === game.title);

  if (existingGameIndex >= 0) {
    updatedGames[existingGameIndex] = game;
  }

  await fs.writeFile('./data/rivals/' + sessionId + '/games.json', JSON.stringify(updatedGames));

  res.status(200).json({ games: updatedGames });
});

//////////// GAME-RESULTS ENDPOINTS END

//////////// SCORES ENDPOINTS START

// GET Players for single session

app.get('/scores/:sessionId', async (req, res) => {
  const sessionId = req.params.sessionId;

  try {
    const gamesFileContent = await fs.readFile('./data/rivals/' + sessionId + '/games.json');
    const gamesData = JSON.parse(gamesFileContent);

    // get player names to prevent calculating scores for players that have been deleted
    const playersFileContent = await fs.readFile('./data/rivals/' + sessionId + '/players.json');
    const playerNames = JSON.parse(playersFileContent);

    const playersData = playerNames.map((name) => ({ name: name, score: 0, place: 0 }));

    gamesData.forEach((game) => {
      if (game.results) {
        const participants = Object.keys(game.results);
        const playerCount = participants.length;

        participants.forEach((participantName) => {
          // Only adding score if player still exists in the session
          const player = playersData.find((p) => p.name === participantName);

          if (player) {
            const rank = game.results[participantName];
            player.score += playerCount - rank;
          }
        });
      }
    });

    // Assign placements
    playersData.sort((a, b) => b.score - a.score);
    // attempt to implement "1224" rankings rather than just index+1
    let currentPlace = 1;
    for (let i = 0; i < playersData.length; i++) {
      if (i > 0 && playersData[i].score < playersData[i - 1].score) {
        currentPlace = i + 1;
      }
      playersData[i].place = currentPlace;
    }

    // sending playersData including score & place keys
    res.status(200).json({ players: playersData });
  } catch (error) {
    console.log('Beim Fetchen der Players lief was schief - sei nicht traurig');
    console.error(error);
    res.status(200).json({ players: [] });
  }
});

//////////// SCORES ENDPOINTS END

//////////// SESSION ENDPOINTS START

// Session Validation GET

app.get('/session-exists/:sessionId', async (req, res) => {
  const sessionId = req.params.sessionId;

  try {
    await fs.access('./data/rivals/' + sessionId);
    res.status(200).json({ exists: true });
  } catch (error) {
    res.status(200).json({ exists: false });
  }
});

// GET All Session names

app.get('/sessions', async (req, res) => {
  try {
    const entries = await fs.readdir('./data/rivals', { withFileTypes: true });

    const directories = entries.filter((entry) => entry.isDirectory());
    const sessionNames = directories.map((entry) => entry.name);

    res.status(200).json({ sessions: sessionNames });
  } catch (error) {
    console.error('Error getting all sessions:', error);
    res.status(200).json({ sessions: [] });
  }
});

// POST New Session

app.post('/new-session', async (req, res) => {
  const selectedApp = req.body.selectedApp;
  const sessionId = req.body.sessionId;
  console.log('POST /new-session received the following new sessionID: ');
  console.log(sessionId);

  const basePath = './data/' + selectedApp + '/';
  const sessionPath = basePath + sessionId;

  try {
    // If dir already exists, just return all sessions
    try {
      await fs.access(sessionPath);

      const entries = await fs.readdir(basePath, { withFileTypes: true });
      const directories = entries.filter((entry) => entry.isDirectory());
      const sessionNames = directories.map((entry) => entry.name);

      return res.status(200).json({ sessions: sessionNames });
    } catch {}

    // create session folder and files
    await fs.mkdir(sessionPath, { recursive: true });
    await fs.writeFile(sessionPath + '/players.json', JSON.stringify([]));
    await fs.writeFile(sessionPath + '/games.json', JSON.stringify([]));
    await fs.writeFile(sessionPath + '/islocked.json', JSON.stringify(false));

    const entries = await fs.readdir(basePath, { withFileTypes: true });
    const directories = entries.filter((entry) => entry.isDirectory());
    const sessionNames = directories.map((entry) => entry.name);

    res.status(201).json({ sessions: sessionNames });
  } catch (error) {
    console.error('Error creating a new session:', error);
    res.status(500).json({ message: 'Failed to create session' });
  }
});

//////////// SESSION ENDPOINTS END

// 404
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  res.status(404).json({ message: '404 - Not Found' });
});

app.listen(3000);
