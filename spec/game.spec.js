const { describe, it } = require('mocha');
const { expect } = require('chai');
const Player = require('../src/domain/player');
const Game = require('../src/domain/game');

describe('Game', () => {
  it('sets the appropriate value when a player has won', () => {
    // Given
    const tom = new Player('tom');
    const bob = new Player('bob');

    // When
    const game = new Game([tom, bob]);
    game.finish(tom);

    // Then
    expect(tom.elo).to.equal(1225);
  });
});
