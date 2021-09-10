const ClientError = require('../../exceptions/ClientError')

class CollaborationsHandler {
  constructor (collaborationsService, playlistsService, validator) {
    this._collaborationsService = collaborationsService
    this._playlistsService = playlistsService
    this._validator = validator

    this.addCollaborationHandler = this.addCollaborationHandler.bind(this)
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this)
  }

  async addCollaborationHandler (request, h) {
    try {
      this._validator.validateCollaborationPayload(request.payload)
      const { id: credentialId } = request.auth.credentials
      const { playlistId, userId } = request.payload

      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId)
      const collaborationId = await this._collaborationsService.addCollaboration(playlistId, userId)

      const response = h.response({
        status: 'success',
        message: 'Collaboration successfully added.',
        data: {
          collaborationId
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

  async deleteCollaborationHandler (request, h) {
    try {
      this._validator.validateCollaborationPayload(request.payload)
      const { id: credentialId } = request.auth.credentials
      const { playlistId, userId } = request.payload

      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId)
      await this._collaborationsService.deleteCollaboration(playlistId, userId)

      return {
        status: 'success',
        message: 'Collaboration successfully deleted.'
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

module.exports = CollaborationsHandler
