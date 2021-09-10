const ClientError = require('../../exceptions/ClientError')
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
    try {
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

  async getPlaylistsongHandler (request, h) {
    try {
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
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }
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
