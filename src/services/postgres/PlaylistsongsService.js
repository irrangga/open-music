const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions/InvariantError')
const { mapDBToModel } = require('../../utils')

class PlaylistsongsService {
  constructor (cacheService) {
    this._pool = new Pool()
    this._cacheService = cacheService
  }

  async addPlaylistsong (playlistId, songId) {
    const id = `playlistsong-${nanoid(16)}`
    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId]
    }
    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('Song failed to add to playlist.')
    }
    await this._cacheService.delete(`playlists:${playlistId}`)
    return result.rows[0].id
  }

  async getPlaylistsong (playlistId) {
    try {
      const result = await this._cacheService.get(`playlists:${playlistId}`)
      return JSON.parse(result)
    } catch (error) {
      const query = {
        text: 'SELECT songs.id, songs.title, songs.performer FROM songs INNER JOIN playlistsongs ON songs.id = playlistsongs.song_id WHERE playlist_id = $1 ',
        values: [playlistId]
      }
      const result = await this._pool.query(query)
      const mappedResult = result.rows.map(mapDBToModel)

      await this._cacheService.set(`songs:${playlistId}`, JSON.stringify(mappedResult))

      return mappedResult
    }
  }

  async deletePlaylistsong (playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId]
    }
    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('Playlistsong failed to delete.')
    }

    await this._cacheService.delete(`playlists:${playlistId}`)
  }

  async verifyPlaylistsong (playlistId, songId) {
    const query = {
      text: 'SELECT * FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2',
      values: [playlistId, songId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('Playlistsong failed to verify.')
    }
  }
}

module.exports = PlaylistsongsService
