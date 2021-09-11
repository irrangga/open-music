class PlaylistsHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    this.addPlaylistHandler = this.addPlaylistHandler.bind(this)
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this)
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this)
  }

  async addPlaylistHandler (request, h) {
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
  }

  async getPlaylistsHandler (request, h) {
    const { id: credentialId } = request.auth.credentials
    const playlists = await this._service.getPlaylists(credentialId)

    return {
      status: 'success',
      data: {
        playlists
      }
    }
  }

  async deletePlaylistByIdHandler (request, h) {
    const { playlistId } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._service.verifyPlaylistOwner(playlistId, credentialId)
    await this._service.deletePlaylistById(playlistId)
    return {
      status: 'success',
      message: 'Playlist is successfully deleted.'
    }
  }
}

module.exports = PlaylistsHandler
