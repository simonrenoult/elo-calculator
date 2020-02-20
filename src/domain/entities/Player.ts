import { Elo, Name, NO_ELO } from '../value-objects/ValueObjects';
const { computeElo, DEFAULT_ELO } = require('./elo.service');

export default class Player {

  readonly name: Name;
  elo: Elo;

  constructor(name: Name, elo: Elo | NO_ELO) {
    this.name = name;
    this.elo = elo || DEFAULT_ELO;
  }

  wins(opponents) {
    this.elo = computeElo(this.elo, true, eloOnly(opponents));
  }

  looses(opponents) {
    this.elo = computeElo(this.elo, false, eloOnly(opponents));
  }
}

function eloOnly(players) {
  return players.map((opponent) => opponent.elo);
}

