const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const AuthorizationError = require('../../exceptions/AuthorizationError')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
const { mapDBToModel } = require('../../utils')

class SongsService {
  constructor () {
    this._pool = new Pool()
  }

  async addPlaylist ({ name, owner }) {
    const id = `playlist-${nanoid(16)}`

    const query = {
      text: 'INSERT INTO playlists VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, owner]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist is failed to add.')
    }

    return result.rows[0].id
  }

  async getPlaylists (owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE owner = $1',
      values: [owner]
    }
    const result = await this._pool.query(query)
    return result.rows.map(mapDBToModel)
  }

  async verifyPlaylistOwner (id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id]
    }
    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('Playlist not found.')
    }
    const note = result.rows[0]
    if (note.owner !== owner) {
      throw new AuthorizationError('You are not authorized to access this resource.')
    }
  }
}

module.exports = SongsService
