const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions/InvariantError')

class PlaylistsongsService {
  constructor () {
    this._pool = new Pool()
  }

  async addPlaylistsong (playlistId, songId) {
    const id = `playlistsong-${nanoid(16)}`
    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId]
    }
    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new InvariantError('Playlistsong failed to add.')
    }
    return result.rows[0].id
  }

  async deletePlaylistsong (playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
      values: [playlistId, songId]
    }
    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new InvariantError('Playlistsong failed to delete.')
    }
  }

  async verifyPlaylistsong (playlistId, songId) {
    const query = {
      text: 'SELECT * FROM playlistsongs WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, songId]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new InvariantError('Playlistsong failed to verify.')
    }
  }
}

module.exports = PlaylistsongsService
