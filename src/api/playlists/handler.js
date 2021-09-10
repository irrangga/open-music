const ClientError = require('../../exceptions/ClientError')

class PlaylistsHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this.addPlaylistHandler = this.addPlaylistHandler.bind(this)
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this)
    // this.getSongByIdHandler = this.getSongByIdHandler.bind(this)
    // this.editSongByIdHandler = this.editSongByIdHandler.bind(this)
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this)
  }

  async addPlaylistHandler (request, h) {
    try {
      this._validator.validatePlaylistPayload(request.payload)
      const { id, name } = request.payload
      const { id: credentialId } = request.auth.credentials

      const playlistId = await this._service.addPlaylist({ id, name, owner: credentialId })

      const response = h.response({
        status: 'success',
        message: 'Playlist is successfully added.',
        data: {
          playlistId
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
      const response = h.response({
        status: 'error',
        message: 'Sorry, there is a failure on our server.'
      })
      response.code(500)
      console.error(error)
      return response
    }
  }

  async getPlaylistsHandler (request, h) {
    try {
      const { id: credentialId } = request.auth.credentials
      const playlists = await this._service.getPlaylists(credentialId)

      return {
        status: 'success',
        data: {
          playlists
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

  // async getSongByIdHandler (request, h) {
  //   try {
  //     const { playlistId } = request.params
  //     const song = await this._service.getSongById(playlistId)

  //     return {
  //       status: 'success',
  //       data: {
  //         song
  //       }
  //     }
  //   } catch (error) {
  //     if (error instanceof ClientError) {
  //       const response = h.response({
  //         status: 'fail',
  //         message: error.message
  //       })
  //       response.code(error.statusCode)
  //       return response
  //     }
  //     const response = h.response({
  //       status: 'error',
  //       message: 'Sorry, there is a failure on our server.'
  //     })
  //     response.code(500)
  //     console.error(error)
  //     return response
  //   }
  // }

  // async editSongByIdHandler (request, h) {
  //   try {
  //     this._validator.validateSongPayload(request.payload)
  //     const { playlistId } = request.params

  //     await this._service.editSongById(playlistId, request.payload)

  //     return {
  //       status: 'success',
  //       message: 'Playlist is sucessfully updated.'
  //     }
  //   } catch (error) {
  //     if (error instanceof ClientError) {
  //       const response = h.response({
  //         status: 'fail',
  //         message: error.message
  //       })
  //       response.code(error.statusCode)
  //       return response
  //     }
  //     const response = h.response({
  //       status: 'error',
  //       message: 'Sorry, there is a failure on our server.'
  //     })
  //     response.code(500)
  //     console.error(error)
  //     return response
  //   }
  // }

  async deletePlaylistByIdHandler (request, h) {
    try {
      const { playlistId } = request.params
      const { id: credentialId } = request.auth.credentials

      await this._service.verifyPlaylistOwner(playlistId, credentialId)
      await this._service.deletePlaylistById(playlistId)
      return {
        status: 'success',
        message: 'Playlist is successfully deleted.'
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
}

module.exports = PlaylistsHandler
