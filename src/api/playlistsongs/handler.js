const ClientError = require('../../exceptions/ClientError')

class PlaylistsongsHandler {
  constructor (playlistsongsService, playlistsService, validator) {
    this._playlistsongsService = playlistsongsService
    this._playlistsService = playlistsService
    this._validator = validator

    this.addPlaylistsongHandler = this.addPlaylistsongHandler.bind(this)
    this.deletePlaylistsongHandler = this.deletePlaylistsongHandler.bind(this)
  }

  async addPlaylistsongHandler (request, h) {
    try {
      this._validator.validatePlaylistsongPayload(request.payload)
      const { id: credentialId } = request.auth.credentials
      const { playlistId, songId } = request.payload

      await this._playlistsService.verifyPlaylistsongAccess(playlistId, credentialId)
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
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Sorry, there is a failure on our server.'
      })
      response.code(500)
      console.error(error)
      return response
    }
  }

  async deletePlaylistsongHandler (request, h) {
    try {
      this._validator.validatePlaylistsongPayload(request.payload)
      const { id: credentialId } = request.auth.credentials
      const { playlistId, songId } = request.payload

      await this._playlistsService.verifyPlaylistsongAccess(playlistId, credentialId)
      await this._playlistsongsService.deletePlaylistsong(playlistId, songId)

      return {
        status: 'success',
        message: 'Playlistsong successfully deleted.'
      }
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Sorry, there is a failure on our server.'
      })
      response.code(500)
      console.error(error)
      return response
    }
  }
}

module.exports = PlaylistsongsHandler
