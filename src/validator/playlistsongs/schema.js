const Joi = require('joi')

const PlaylistsongPayloadSchema = Joi.object({
  playlistId: Joi.string().required(),
  songId: Joi.string().required()
})

module.exports = { PlaylistsongPayloadSchema }
