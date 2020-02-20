import Game from '../aggregates/Game';

export default interface GameRepository {

  add(game: Game): Promise<void>;
  list(): Promise<Game[]>;
}

