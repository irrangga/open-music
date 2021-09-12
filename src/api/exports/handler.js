class ExportsHandler {
  constructor (service, validator, playlistsService) {
    this._service = service
    this._validator = validator
    this._playlistsService = playlistsService

    this.addExportPlaylistsHandler = this.addExportPlaylistsHandler.bind(this)
  }

  async addExportPlaylistsHandler (request, h) {
    this._validator.validateExportPlaylistPayload(request.payload)
    const { id: userId } = request.auth.credentials
    const { playlistId } = request.params

    await this._playlistsService.verifyPlaylistAccess(playlistId, userId)

    const message = {
      playlistId,
      userId: request.auth.credentials.id,
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
