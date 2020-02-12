const K = 50;
const DEFAULT_ELO = 1200;

module.exports = { computeElo, DEFAULT_ELO };

function computeElo(playerElo, playerHasWon, opponentsElo) {
  const probabilityToWin = computeProbabilityToWinAgainstMany(playerElo, opponentsElo);
  return playerElo + K * ((playerHasWon ? 1 : 0) - probabilityToWin);
}

function computeProbabilityToWinAgainstMany(playerElo, opponentsElo) {
  const sumOfProbabilities = opponentsElo
    .map((opponentElo) => computeProbabilityToWinAgainstOne(playerElo, opponentElo))
    .reduce((prev, cur) => prev + cur);

  return sumOfProbabilities / opponentsElo.length;
}

function computeProbabilityToWinAgainstOne(playerElo, opponentElo) {
  const eloDifference = opponentElo - playerElo;
  return (1.0 / (1.0 + 10 ** (eloDifference / 400)));
}
