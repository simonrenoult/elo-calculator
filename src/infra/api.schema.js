const joi = require('@hapi/joi');

const playerNameSchema = joi.string();
const playerWonSchema = joi.boolean();
const gameCreationSchema = joi.array()
  .items({ name: playerNameSchema, won: playerWonSchema })
  .has({ name: playerNameSchema, won: playerWonSchema.valid(true) })
  .min(2)
  .required();

module.exports = { gameCreationSchema }
