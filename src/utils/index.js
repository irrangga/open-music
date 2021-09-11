/* eslint-disable camelcase */

const mapDBToModel = ({ inserted_at, updated_at, playlist_id, song_id, user_id, ...args }) => ({
  ...args,
  insertedAt: inserted_at,
  updatedAt: updated_at,
  playlistId: playlist_id,
  songId: song_id,
  userId: user_id
})

module.exports = { mapDBToModel }
