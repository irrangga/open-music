/* eslint-disable camelcase */

const mapDBToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  inserted_at,
  updated_at,
  name,
  username,
  owner,
  playlist_id,
  song_id,
  user_id
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  insertedAt: inserted_at,
  updatedAt: updated_at,
  name,
  username,
  owner,
  playlistId: playlist_id,
  songId: song_id,
  userId: user_id
})

module.exports = { mapDBToModel }
