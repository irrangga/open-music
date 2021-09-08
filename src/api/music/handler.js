const ClientError = require('../../exceptions/ClientError')

class SongsHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this.addSongHandler = this.addSongHandler.bind(this)
    this.getSongsHandler = this.getSongsHandler.bind(this)
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this)
    this.editSongByIdHandler = this.editSongByIdHandler.bind(this)
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this)
  }

  async addSongHandler (request, h) {
    try {
      this._validator.validateSongPayload(request.payload)
      const { id, title, year, performer, genre, duration } = request.payload

      const songId = await this._service.addSong({ id, title, year, performer, genre, duration })

      const response = h.response({
        status: 'success',
        message: 'Song is successfully added.',
        data: {
          songId
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

  async getSongsHandler () {
    const songs = await this._service.getSongs()
    return {
      status: 'success',
      data: {
        songs
      }
    }
  }

  async getSongByIdHandler (request, h) {
    try {
      const { songId } = request.params
      const song = await this._service.getSongById(songId)

      return {
        status: 'success',
        data: {
          song
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

  async editSongByIdHandler (request, h) {
    try {
      this._validator.validateSongPayload(request.payload)
      const { songId } = request.params

      await this._service.editSongById(songId, request.payload)

      return {
        status: 'success',
        message: 'Song is sucessfully updated.'
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

  async deleteSongByIdHandler (request, h) {
    try {
      const { songId } = request.params
      await this._service.deleteSongById(songId)
      return {
        status: 'success',
        message: 'Song is successfully deleted.'
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

module.exports = SongsHandler
