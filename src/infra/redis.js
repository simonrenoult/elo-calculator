const Redis = require('ioredis');

const DEFAULT_URL = 'redis://127.0.0.1:6379'
const REDIS_URL = process.env.REDIS_RUL || DEFAULT_URL;
const redis = new Redis(REDIS_URL);

redis
  .on('error', (error) => {
    console.error(error);
  })
  .on('connect', () => {
    console.log(`Server is connected to redis at ${REDIS_URL}`);
  });

const ELO_PER_PLAYER = 'eloPerPlayer'
const GAMES = 'games'

async function getEloPerPlayer() {
  const rawEloPerPlayer = await redis.get(ELO_PER_PLAYER)
  return JSON.parse(rawEloPerPlayer) || {}
}

async function getGames() {
  const rawGames = await redis.get(GAMES)
  return JSON.parse(rawGames) || []
}

async function addGame(game) {
  const games = await getGames()
  games.push(game)
  await redis.set(GAMES, JSON.stringify(games))
}

async function updatePlayerElo(game) {
  const eloPerPlayer = await getEloPerPlayer()
  game.players.forEach(player => {
    eloPerPlayer[player.name] = player.elo
  })
  await redis.set(ELO_PER_PLAYER, JSON.stringify(eloPerPlayer))
}

module.exports = { getEloPerPlayer, getGames, addGame, updatePlayerElo };
