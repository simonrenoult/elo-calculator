import { DomainEventEmitter } from '../domain/DomainEventEmitter';
import Ladder from '../domain/aggregates/Ladder';
import Game from '../domain/aggregates/Game';
import { GameEvents } from '../domain/events/GameEvents';

export default class Application {

  constructor(private readonly domainEventEmitter: DomainEventEmitter) {
    domainEventEmitter.on(GameEvents.GameCreated, (data) => {
      Ladder.computeNewElo(data.game, new RedisLadderRepository());
    });
  }
}
