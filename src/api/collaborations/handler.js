class CollaborationsHandler {
  constructor (collaborationsService, playlistsService, validator) {
    this._collaborationsService = collaborationsService
    this._playlistsService = playlistsService
    this._validator = validator

    this.addCollaborationHandler = this.addCollaborationHandler.bind(this)
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this)
  }

  async addCollaborationHandler (request, h) {
    this._validator.validateCollaborationPayload(request.payload)
    const { id: credentialId } = request.auth.credentials
    const { playlistId, userId } = request.payload

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId)
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
  }

  async deleteCollaborationHandler (request, h) {
    this._validator.validateCollaborationPayload(request.payload)
    const { id: credentialId } = request.auth.credentials
    const { playlistId, userId } = request.payload

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId)
    await this._collaborationsService.deleteCollaboration(playlistId, userId)

    return {
      status: 'success',
      message: 'Collaboration successfully deleted.'
    }
  }
}

module.exports = CollaborationsHandler
