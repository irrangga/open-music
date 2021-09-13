class ExportsHandler {
  constructor (service, playlistsService, validator) {
    this._service = service
    this._playlistsService = playlistsService
    this._validator = validator

    this.addExportPlaylistsHandler = this.addExportPlaylistsHandler.bind(this)
  }

  async addExportPlaylistsHandler (request, h) {
    this._validator.validateExportPlaylistPayload(request.payload)
    const { id: credentialId } = request.auth.credentials
    const { playlistId } = request.params

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId)

    const message = {
      playlistId,
      targetEmail: request.payload.targetEmail
    }

    await this._service.sendMessage('export:playlists', JSON.stringify(message))

    const response = h.response({
      status: 'success',
      message: 'Your request is in queue.'
    })
    response.code(201)
    return response
  }
}

module.exports = ExportsHandler
