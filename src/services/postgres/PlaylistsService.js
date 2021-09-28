const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const AuthorizationError = require('../../exceptions/AuthorizationError')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
const { mapDBToModel } = require('../../utils')

class PlaylistsService {
  constructor (collaborationService, cacheService) {
    this._pool = new Pool()
    this._collaborationService = collaborationService
    this._cacheService = cacheService
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

    await this._cacheService.delete(`playlists:${owner}`)
    return result.rows[0].id
  }

  async getPlaylists (owner) {
    try {
      const result = await this._cacheService.get(`playlists:${owner}`)
      return JSON.parse(result)
    } catch (error) {
      const query = {
        text: `SELECT playlists.id, playlists.name, users.username FROM playlists 
        LEFT JOIN users ON playlists.owner = users.id 
        LEFT JOIN collaborations ON playlists.id = collaborations.playlist_id
        WHERE owner = $1 OR collaborations.user_id = $1`,
        values: [owner]
      }

      const result = await this._pool.query(query)
      const mappedResult = result.rows.map(mapDBToModel)

      await this._cacheService.set(`playlists:${owner}`, JSON.stringify(mappedResult))
      return mappedResult
    }
  }

  async deletePlaylistById (id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Playlist is failed to delete.')
    }

    const { owner } = result.rows[0]
    await this._cacheService.delete(`playlists:${owner}`)
  }

  async verifyPlaylistOwner (id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id]
    }
    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError('Playlist not found.')
    }
    const playlist = result.rows[0]
    if (playlist.owner !== owner) {
      throw new AuthorizationError('You are not authorized to access this resource.')
    }
  }

  async verifyPlaylistAccess (playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId)
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      try {
        await this._collaborationService.verifyCollaborator(playlistId, userId)
      } catch {
        throw error
      }
    }
  }
}

module.exports = PlaylistsService
