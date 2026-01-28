import fs from 'node:fs/promises';

import bodyParser from 'body-parser';
import express from 'express';

const app = express();

app.use(express.static('images'));
app.use(bodyParser.json());

// CORS - update this line (around line 15)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Added POST
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  next();
});

//////////// PLAYERS ENDPOINTS START

// GET Players for single session

app.get('/players/:sessionId', async (req, res) => {
  const sessionId = req.params.sessionId;

  try {
    const fileContent = await fs.readFile('./data/versus/' + sessionId + '/players.json');

    const playersData = JSON.parse(fileContent);

    res.status(200).json({ players: playersData });
  } catch (error) {
    console.log('Beim Fetchen der Players lief was schief - sei nicht traurig');
    console.error(error);
    res.status(200).json({ players: [] });
  }
});

// POST Player for single session into a single team
app.post('/player', async (req, res) => {
  const playerName = req.body.player;
  const team = req.body.team; // 1 or 2
  const sessionId = req.body.sessionId;
  console.log(`POST /player: Adding "${playerName}" to team ${team} in session ${sessionId}`);

  try {
    const playersFileContent = await fs.readFile('./data/versus/' + sessionId + '/players.json');
    const playersData = JSON.parse(playersFileContent);

    // Check if player already exists
    if (!playersData.some((p) => p.name === playerName)) {
      playersData.push({ name: playerName, team: team });
    }

    await fs.writeFile('./data/versus/' + sessionId + '/players.json', JSON.stringify(playersData));

    res.status(200).json({ players: playersData });
  } catch (error) {
    console.error('Error adding player:', error);
    res.status(500).json({ error: 'Failed to add player' });
  }
});

// DELETE Player for single session out of a single team
app.delete('/delete-player', async (req, res) => {
  const playerName = req.body.player;
  const sessionId = req.body.sessionId;
  console.log(`DELETE /delete-player: Removing "${playerName}" from session ${sessionId}`);

  try {
    const playersFileContent = await fs.readFile('./data/versus/' + sessionId + '/players.json');
    const playersData = JSON.parse(playersFileContent);

    // Find and remove the player by name
    const playerIndex = playersData.findIndex((p) => p.name === playerName);
    if (playerIndex >= 0) {
      playersData.splice(playerIndex, 1);
    }

    await fs.writeFile('./data/versus/' + sessionId + '/players.json', JSON.stringify(playersData));

    res.status(200).json({ players: playersData });
  } catch (error) {
    console.error('Error removing player:', error);
    res.status(500).json({ error: 'Failed to remove player' });
  }
});

// PUT lock status for single session

// app.put('/lock', async (req, res) => {
//   const sessionId = req.body.sessionId;
//   console.log('PUT for lock status called');

//   const lockFileContent = await fs.readFile('./data/versus/' + sessionId + '/islocked.json');
//   const isLocked = JSON.parse(lockFileContent);

//   await fs.writeFile('./data/versus/' + sessionId + '/islocked.json', JSON.stringify(!isLocked));

//   res.status(200).json({ isLocked: !isLocked });
// });

// GET lock for single session

app.get('/lock-status/:sessionId', async (req, res) => {
  const sessionId = req.params.sessionId;

  try {
    const fileContent = await fs.readFile('./data/versus/' + sessionId + '/islocked.json');

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
    const fileContent = await fs.readFile('./data/versus/' + sessionId + '/games.json');

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
  const gameTitle = req.body.game;
  const sessionId = req.body.sessionId;
  console.log(`POST /game: Adding game "${gameTitle}" to session ${sessionId}`);

  try {
    const gamesFileContent = await fs.readFile('./data/versus/' + sessionId + '/games.json');
    const gamesData = JSON.parse(gamesFileContent);

    // Check if game with same title already exists
    if (!gamesData.some((g) => g.title === gameTitle)) {
      gamesData.push({ title: gameTitle }); // No winner yet
    }

    await fs.writeFile('./data/versus/' + sessionId + '/games.json', JSON.stringify(gamesData));

    res.status(200).json({ games: gamesData });
  } catch (error) {
    console.error('Error adding game:', error);
    res.status(500).json({ error: 'Failed to add game' });
  }
});

// DELETE Game for single session
app.delete('/delete-game', async (req, res) => {
  const gameTitle = req.body.game;
  const sessionId = req.body.sessionId;
  console.log(`DELETE /delete-game: Removing game "${gameTitle}" from session ${sessionId}`);

  try {
    const gamesFileContent = await fs.readFile('./data/versus/' + sessionId + '/games.json');
    const gamesData = JSON.parse(gamesFileContent);

    const gameIndex = gamesData.findIndex((g) => g.title === gameTitle);
    if (gameIndex >= 0) {
      gamesData.splice(gameIndex, 1);
    }

    await fs.writeFile('./data/versus/' + sessionId + '/games.json', JSON.stringify(gamesData));

    res.status(200).json({ games: gamesData });
  } catch (error) {
    console.error('Error removing game:', error);
    res.status(500).json({ error: 'Failed to remove game' });
  }
});

//////////// GAME-RESULTS ENDPOINTS START

// POST Results for a single game in a single session

// app.post('/results', async (req, res) => {
//   const game = { title: req.body.title, results: req.body.results };
//   const sessionId = req.body.sessionId;
//   console.log('POST /results received the following new game title and results for it: ');
//   console.log(game);

//   const gamesFileContent = await fs.readFile('./data/versus/' + sessionId + '/games.json');
//   const gamesData = JSON.parse(gamesFileContent);

//   let updatedGames = gamesData;
//   const existingGameIndex = gamesData.findIndex((g) => g.title === game.title);

//   if (existingGameIndex >= 0) {
//     updatedGames[existingGameIndex] = game;
//   }

//   await fs.writeFile('./data/versus/' + sessionId + '/games.json', JSON.stringify(updatedGames));

//   res.status(200).json({ games: updatedGames });
// });

// POST Results - Set winner for a single game
app.post('/results', async (req, res) => {
  const gameTitle = req.body.title;
  const winner = req.body.winner; // 1 or 2
  const sessionId = req.body.sessionId;
  console.log(`POST /results: Setting winner of "${gameTitle}" to Team ${winner}`);

  try {
    const gamesFileContent = await fs.readFile('./data/versus/' + sessionId + '/games.json');
    const gamesData = JSON.parse(gamesFileContent);

    // Find the game and update its winner
    const gameIndex = gamesData.findIndex((g) => g.title === gameTitle);
    if (gameIndex >= 0) {
      gamesData[gameIndex].winner = winner;
    }

    await fs.writeFile('./data/versus/' + sessionId + '/games.json', JSON.stringify(gamesData));

    res.status(200).json({ games: gamesData });
  } catch (error) {
    console.error('Error setting game winner:', error);
    res.status(500).json({ error: 'Failed to set game winner' });
  }
});

//////////// GAME-RESULTS ENDPOINTS END

//////////// SESSION ENDPOINTS START

// Session Validation GET

app.get('/session-exists/:sessionId', async (req, res) => {
  const sessionId = req.params.sessionId;

  try {
    await fs.access('./data/versus/' + sessionId);
    res.status(200).json({ exists: true });
  } catch (error) {
    res.status(200).json({ exists: false });
  }
});

// GET All Session names

app.get('/sessions', async (req, res) => {
  try {
    const entries = await fs.readdir('./data/versus', { withFileTypes: true });

    const directories = entries.filter((entry) => entry.isDirectory());
    const sessionNames = directories.map((entry) => entry.name);

    res.status(200).json({ sessions: sessionNames });
  } catch (error) {
    console.error('Error getting all sessions:', error);
    res.status(200).json({ sessions: [] });
  }
});

// POST New Session

// app.post('/new-session', async (req, res) => {
//   const selectedApp = req.body.selectedApp;
//   const sessionId = req.body.sessionId;
//   console.log('POST /new-session received the following new sessionID: ');
//   console.log(sessionId);

//   const basePath = './data/' + selectedApp + '/';
//   const sessionPath = basePath + sessionId;

//   try {
//     // If dir already exists, just return all sessions
//     try {
//       await fs.access(sessionPath);

//       const entries = await fs.readdir(basePath, { withFileTypes: true });
//       const directories = entries.filter((entry) => entry.isDirectory());
//       const sessionNames = directories.map((entry) => entry.name);

//       return res.status(200).json({ sessions: sessionNames });
//     } catch {}

//     // create session folder and files
//     await fs.mkdir(sessionPath, { recursive: true });
//     await fs.writeFile(sessionPath + '/players.json', JSON.stringify([]));
//     await fs.writeFile(sessionPath + '/games.json', JSON.stringify([]));
//     await fs.writeFile(sessionPath + '/islocked.json', JSON.stringify(false));

//     const entries = await fs.readdir(basePath, { withFileTypes: true });
//     const directories = entries.filter((entry) => entry.isDirectory());
//     const sessionNames = directories.map((entry) => entry.name);

//     res.status(201).json({ sessions: sessionNames });
//   } catch (error) {
//     console.error('Error creating a new session:', error);
//     res.status(500).json({ message: 'Failed to create session' });
//   }
// });

// DELETE single session

app.delete('/delete-session', async (req, res) => {
  const sessionId = req.body.sessionId;
  const selectedApp = req.body.selectedApp;
  console.log('DELETE called for session: ' + sessionId);

  const basePath = './data/' + selectedApp + '/';
  const sessionPath = basePath + sessionId;

  try {
    // checks if session exists
    await fs.access(sessionPath);

    await fs.rm(sessionPath, { recursive: true });

    const entries = await fs.readdir(basePath, { withFileTypes: true });
    const directories = entries.filter((entry) => entry.isDirectory());
    const sessionNames = directories.map((entry) => entry.name);

    res.status(200).json({ sessions: sessionNames });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(404).json({ message: 'Session not found or could not be deleted' });
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

app.listen(3001);
