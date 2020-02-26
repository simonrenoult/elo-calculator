const joi = require('@hapi/joi');
const Player = require('../domain/player');
const Game = require('../domain/game');
const { gameCreationSchema } = require('./api.schema')
const { getEloPerPlayer, addGame, updatePlayerElo } = require('./redis')

module.exports = { createGame, showLadder, logRequest }

function logRequest (req, res, next) {
  console.log(req.method, req.url, JSON.stringify(req.headers), JSON.stringify(req.body))
  next()
}

async function showLadder(req, res) {
  const eloPerPlayer = await getEloPerPlayer()
  const ladder = Object.keys(eloPerPlayer)
    .map((playerName) => new Player(playerName, eloPerPlayer[playerName]))
    .sort((a, b) => b.elo - a.elo)

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

  const eloPerPlayer = await getEloPerPlayer()

  const itemThatWon = gameCreationCommand.find((player) => player.won === true)
  const players = gameCreationCommand.map((item) => new Player(item.name, eloPerPlayer[item.name]))
  const game = new Game(players)
  const winningPlayer = players.find((player) => player.name === itemThatWon.name)
  game.finish(winningPlayer)

  await addGame(game)
  await updatePlayerElo(game)

  res.status(204).send()
}







