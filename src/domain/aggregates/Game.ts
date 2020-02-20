import { Elo, Name, NO_ELO, Status } from '../value-objects/ValueObjects';
import Player from '../entities/Player';
import GameRepository from '../repositories/GameRepository';
import { DomainEventEmitter } from '../DomainEventEmitter';

export interface CreateGameCommandItem {
  name: Name,
  elo: Elo | NO_ELO,
  status: Status
}

export interface CreateGameCommand {
  items: CreateGameCommandItem[]
}

export default class Game {

  // La classe Game est l'aggregate root
  // Elle préserve la cohérence de la grappe d'entities
  // L'aggregate root est l'unique point d'entrée pour manipuler les entities
  public static async create(
    command: CreateGameCommand,
    gameRepository: GameRepository,
    domainEventEmitter: DomainEventEmitter
  ): Promise<void> {
    const players = command.items.map(item => {
      return new Player(item.name, item.elo)
    });

    const winner: Player = players
      .filter(player => {
        const itemThatWon = command.items.filter(item => item.status === Status.WON).pop();
        return player.name === itemThatWon.name;
      })
      .pop();

    const game = new Game(players, winner);

    await gameRepository.add(game);
    domainEventEmitter.emit('GameCreated');
  }

  constructor(
    readonly players: Player[],
    readonly winner: Player
  ) {
  }
}
