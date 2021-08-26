const ClientError = require('../../exceptions/ClientError')

class SongsHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this.addSongHandler = this.addSongHandler.bind(this)
    this.getSongsHandler = this.getSongsHandler.bind(this)
  }

  async addSongHandler (request, h) {
    try {
      this._validator.validateSongPayload(request.payload)
      const { id, title, year, performer, genre, duration, insertedAt, updatedAt } = request.payload

      const songId = await this._service.addSong({ id, title, year, performer, genre, duration, insertedAt, updatedAt })

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
}

module.exports = SongsHandler
