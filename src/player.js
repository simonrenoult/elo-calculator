const { computeElo, DEFAULT_ELO } = require('./elo.service');


module.exports = class Player {
  constructor(name, elo) {
    if (!name) {
      throw new Error('A name must be provided');
    }

    this.name = name;
    this.elo = elo || DEFAULT_ELO;
  }

  wins(opponents) {
    this.elo = computeElo(this.elo, true, eloOnly(opponents));
  }

  looses(opponents) {
    this.elo = computeElo(this.elo, false, eloOnly(opponents));
  }
};

function eloOnly(players) {
  return players.map((opponent) => opponent.elo);
}
