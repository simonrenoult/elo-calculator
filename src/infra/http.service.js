const joi = require('@hapi/joi');
const Player = require('../domain/player');
const Game = require('../domain/game');
const { gameCreationSchema } = require('./api.schema')
const redis = require('./redis')

module.exports = { createGame, showLadder, logRequest }

function logRequest (req, res, next) {
  console.log(req.method, req.url, JSON.stringify(req.headers), JSON.stringify(req.body))
  next()
}

async function showLadder(req, res) {
  const rawEloPerPlayer = await redis.get('eloPerPlayer')

  const eloPerPlayer = JSON.parse(rawEloPerPlayer) || {}
  const ladder = Object.keys(eloPerPlayer)
    .map(toPlayer(eloPerPlayer))
    .sort(highestEloFirst)

  res.status(200).send(ladder)
}

async function createGame(req, res) {
  let gameCreationCommand
  try {
    gameCreationCommand = joi.attempt(req.body, gameCreationSchema)
  } catch (e) {
    res.status(400).send(e.message)
    return
  }

  const rawEloPerPlayer = await redis.get('eloPerPlayer')
  const eloPerPlayer = JSON.parse(rawEloPerPlayer) || {}

  const rawGames = await redis.get('games')
  const games = JSON.parse(rawGames) || []

  const itemThatWon = gameCreationCommand.find(hasWon)
  const players = gameCreationCommand.map((item) => toPlayer(eloPerPlayer)(item.name))
  const game = new Game(players)

  const playerWhoWon = players.find(nameMatches(itemThatWon))
  game.finish(playerWhoWon)

  games.push(game)
  redis.set('games', JSON.stringify(games))

  game.players.forEach((player) => eloPerPlayer[player.name] = player.elo)
  redis.set('eloPerPlayer', JSON.stringify(eloPerPlayer))

  res.status(204).send()
}


const toPlayer = (eloPerPlayer) => (playerName) => new Player(playerName, eloPerPlayer[playerName]);
const highestEloFirst = (a, b) => b.elo - a.elo;
const hasWon = (player) => player.won === true;
const nameMatches = (itemThatWon) => (player) => player.name === itemThatWon.name;
