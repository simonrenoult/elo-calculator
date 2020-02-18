const express = require('express')
const joi = require('@hapi/joi')
const Player = require('./player')
const Game = require('./game')
const app = express()

app.use(express.json())

// repositories

const eloPerPlayerRepository = {}
const gameRepository = []

// schemas

const playerNameSchema = joi.string()
const playerWonSchema = joi.boolean()
const gameCreationSchema = joi.array()
  .items({ name: playerNameSchema, won: playerWonSchema })
  .has({ name: playerNameSchema, won: playerWonSchema.valid(true) })

// routes

app.post('/games', (req, res) => {
  let gameCreationCommand
  try {
    gameCreationCommand = joi.attempt(req.body, gameCreationSchema)
  } catch (e) {
    res.status(400).send(e.message)
    return
  }

  createGame(gameCreationCommand)

  res.status(204).send()
})

app.get('/ladder', (req, res) => {
  const ladder = Object.keys(eloPerPlayerRepository)
    .map(toPlayer)
    .sort(highestEloFirst)

  res.status(200).send(ladder)
})

// usecases


function createGame (command) {
  const itemThatWon = command.find(hasWon)
  const players = command.map(item => toPlayer(item.name))
  const game = new Game(players)

  const playerWhoWon = players.find(nameMatches(itemThatWon))
  game.finish(playerWhoWon)

  gameRepository.push(game)
  game.players.forEach(player => eloPerPlayerRepository[player.name] = player.elo)
}

// utils

const toPlayer = (playerName) => new Player(playerName, eloPerPlayerRepository[playerName])
const highestEloFirst = (a, b) => b.elo - a.elo
const hasWon = (player) => player.won === true
const nameMatches = (itemThatWon) => (player) => player.name === itemThatWon.name

module.exports = app
