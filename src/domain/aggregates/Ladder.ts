import GameRepository from '../repositories/GameRepository';
import Player from '../entities/Player';
import Game from './Game';
import { Name } from '../value-objects/ValueObjects';

interface LadderRepository {
  get(): Promise<Ladder>;
  setEloOf(players: Player[]): Promise<void>;
}

export default class Ladder {

  public static async get(ladderRepository: LadderRepository): Promise<Ladder> {
    return await ladderRepository.get();
  }

  static async computeNewElo(game: Game, ladderRepository: LadderRepository) {
    const playersWithNewElo = game.players.map((player, _, players) => {
      const opponents = Ladder.getOpponents(players, player);
      if (player.name === game.winner.name) {
        player.wins(opponents);
      } else {
        player.looses(opponents);
      }
      return player;
    })

    await ladderRepository.setEloOf(playersWithNewElo)
  }

  private static getOpponents(players: Player[], player: Player) {
    return players.filter(p => p.name !== player.name)
  }

  constructor(public readonly players: Map<Name, Player>) {
  }
}
