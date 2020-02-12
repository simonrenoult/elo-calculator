
module.exports = class Game {
  constructor(players) {
    this.checkPlayersNameAreUnique(players);
    this.players = players;
  }

  finish(winner) {
    this.players.forEach((player) => {
      if (this.hasWon(winner, player)) {
        player.wins(this.getOpponents(player));
      } else {
        player.looses(this.getOpponents(player));
      }
    });
  }

  hasWon(winner, player) {
    return winner.name === player.name;
  }

  getOpponents(player) {
    return this.players.filter((p) => p.name !== player.name);
  }

  checkPlayersNameAreUnique(players) {
    const playerNames = players.map((p) => p.name);
    const playersContainDuplicateNames = (new Set(playerNames)).size !== players.length;
    if (playersContainDuplicateNames) {
      throw new Error(`Names must be unique. Names provided: ${playerNames}`);
    }
  }
};
