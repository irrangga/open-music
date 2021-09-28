const NotFoundError = require('../../exceptions/NotFoundError')

class PlaylistsongsHandler {
  constructor (playlistsongsService, playlistsService, validator) {
    this._playlistsongsService = playlistsongsService
    this._playlistsService = playlistsService
    this._validator = validator

    this.addPlaylistsongHandler = this.addPlaylistsongHandler.bind(this)
    this.getPlaylistsongHandler = this.getPlaylistsongHandler.bind(this)
    this.deletePlaylistsongHandler = this.deletePlaylistsongHandler.bind(this)
  }

  async addPlaylistsongHandler (request, h) {
    const { id: credentialId } = request.auth.credentials
    const { playlistId, any } = request.params
    if (any !== 'songs') {
      throw new NotFoundError('Resource not found')
    }

    this._validator.validatePlaylistsongPayload(request.payload)
    const { songId } = request.payload

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId)
    const playlistsongId = await this._playlistsongsService.addPlaylistsong(playlistId, songId)

    const response = h.response({
      status: 'success',
      message: 'Song successfully added to playlists.',
      data: {
        playlistsongId
      }
    })
    response.code(201)
    return response
  }

  async getPlaylistsongHandler (request, h) {
    const { id: credentialId } = request.auth.credentials
    const { playlistId, any } = request.params
    if (any !== 'songs') {
      throw new NotFoundError('Resource not found')
    }

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId)
    const songs = await this._playlistsongsService.getPlaylistsong(playlistId)

    return {
      status: 'success',
      data: {
        songs
      }
    }
  }

  async deletePlaylistsongHandler (request, h) {
    const { id: credentialId } = request.auth.credentials
    const { playlistId, any } = request.params
    if (any !== 'songs') {
      throw new NotFoundError('Resource not found')
    }

    this._validator.validatePlaylistsongPayload(request.payload)
    const { songId } = request.payload

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId)
    await this._playlistsongsService.deletePlaylistsong(playlistId, songId)

    return {
      status: 'success',
      message: 'Playlistsong successfully deleted.'
    }
  }
}

module.exports = PlaylistsongsHandler
