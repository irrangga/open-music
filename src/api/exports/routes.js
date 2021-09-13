const routes = (handler) => [
  {
    method: 'POST',
    path: '/exports/playlists/{playlistId}',
    handler: handler.addExportPlaylistsHandler,
    options: {
      auth: 'openmusic_jwt'
    }
  }
]

module.exports = routes
