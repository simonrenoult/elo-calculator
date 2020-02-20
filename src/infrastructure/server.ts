import express = require('express');
import redis from './redis';
import Game from '../domain/aggregates/Game';
import GameRepository from '../domain/repositories/GameRepository';
import { DomainEventEmitter } from '../domain/DomainEventEmitter';
import Joi from '@hapi/joi'
const EventEmitter = require('events');
import EventEmitter = NodeJS.EventEmitter;

const app = express();

class RedisGameRepository implements GameRepository {
  constructor(private readonly redis: any) {
  }

  add(game: Game): Promise<void> {
    return undefined;
  }
}

class InMemoryDomainEventEmitter implements DomainEventEmitter {
  constructor(private readonly eventEmitter: EventEmitter) {
  }

  emit(eventName: string, data: any) {
    this.eventEmitter.emit(eventName, data);
  }

  on(eventName: string, fn: (arg: any) => void): void {
    this.eventEmitter.on(eventName, fn);
  }
}

const playerNameSchema = Joi.string();
const playerWonSchema = Joi.boolean();
const gameCreationSchema = Joi.array()
  .items({ name: playerNameSchema, won: playerWonSchema })
  .has({ name: playerNameSchema, won: playerWonSchema.valid(true) })
  .min(2)
  .required();

app.post('/games', async (req, res) => {
  let command;
  try {
    command = Joi.attempt(req.body, gameCreationSchema);
  } catch (e) {
    res.status(400).send(e.message);
    return;
  }

  await Game.create(
    command,
    new RedisGameRepository(redis),
    new InMemoryDomainEventEmitter(new EventEmitter())
  );
});

app.get('/games', async (req, res) => {
  const rawGames = await redis.get('games');
  const games = JSON.parse(rawGames) || [];
  res.status(200).send(games);
});

app.get('/ladder', async (req, res) => {
  const rawLadder = await redis.get('ladder');
  const ladder = JSON.parse(rawLadder) || [];
  const highestEloFirst = (a, b) => b.elo - a.elo;
  const sortedLadder = ladder.sort(highestEloFirst);
  res.status(200).send(sortedLadder);
});

module.exports = app;
